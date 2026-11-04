/**
 * Spatial Stage Manager - Background Service Worker (Manifest V3)
 * 管理浏览器真实标签页状态、缩略图缓存池及全局快捷指令
 */

// 标签页高清缩略图缓存池 (tabId -> base64 dataUrl)
const thumbnailCache = new Map();

// 自动捕获当前活动标签页的视图
async function captureTab(windowId, tabId) {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
      format: 'jpeg',
      quality: 60
    });
    if (dataUrl && tabId) {
      thumbnailCache.set(tabId, dataUrl);
    }
    return dataUrl;
  } catch (err) {
    // 内部页面 (chrome://) 或受限页面无法截屏时安全忽略
    return null;
  }
}

// 监听标签页激活切换
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await captureTab(activeInfo.windowId, activeInfo.tabId);
});

// 监听标签页加载完毕
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    captureTab(tab.windowId, tabId);
  }
});

// 监听标签页关闭，释放内存
chrome.tabs.onRemoved.addListener((tabId) => {
  thumbnailCache.delete(tabId);
});

// 呼出/隐藏 3D 舞台调度给当前活跃页面
async function triggerStageInActiveTab() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && activeTab.id) {
    try {
      await chrome.tabs.sendMessage(activeTab.id, { action: 'TOGGLE_STAGE' });
    } catch (err) {
      // 若当前页面尚未注入内容脚本（例如新开的受限页），尝试动态注入
      console.warn('Content script not reachable, injecting fallback...', err);
    }
  }
}

// 点击浏览器扩展图标触发
chrome.action.onClicked.addListener(async () => {
  await triggerStageInActiveTab();
});

// 监听全局快捷键命令 (默认 Alt+W)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-stage') {
    await triggerStageInActiveTab();
  }
});

// 与 Content Script 通讯管道
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_TABS_DATA') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const tabsPayload = tabs.map(t => {
        let domain = '';
        try {
          if (t.url) domain = new URL(t.url).hostname;
        } catch (e) {}

        return {
          id: t.id,
          title: t.title || '新标签页',
          url: t.url || '',
          domain: domain || 'localhost',
          favIconUrl: t.favIconUrl || '',
          active: t.active,
          pinned: t.pinned || false,
          audible: t.audible || false,
          thumbnail: thumbnailCache.get(t.id) || null
        };
      });
      sendResponse({ tabs: tabsPayload });
    });
    return true; // 异步响应标志
  }

  if (message.action === 'SWITCH_TAB') {
    if (message.tabId) {
      chrome.tabs.update(message.tabId, { active: true });
    }
    return;
  }

  if (message.action === 'CLOSE_TAB') {
    if (message.tabId) {
      thumbnailCache.delete(message.tabId);
      chrome.tabs.remove(message.tabId);
      sendResponse({ success: true });
    }
    return true;
  }

  if (message.action === 'NEW_TAB') {
    chrome.tabs.create({});
    return;
  }
});
