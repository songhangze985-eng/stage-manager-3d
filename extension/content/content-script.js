/**
 * Spatial Stage Manager - Content Script (Manifest V3)
 * 注入隔离 Shadow DOM、渲染 3D 空间曲率矩阵、处理真实标签页调度与键盘流交互
 */

(function () {
  // 避免重复注入
  if (window.__SPATIAL_STAGE_INJECTED__) return;
  window.__SPATIAL_STAGE_INJECTED__ = true;

  // Runtime 代理层 (优先真实 Chrome 扩展 API，降级安全备选方案)
  const isExtensionEnv = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
  const runtime = isExtensionEnv ? chrome.runtime : {
    getURL: (p) => {
      // 允许动态加载样式
      return `/extension/${p}`;
    },
    sendMessage: (msg, callback) => {
      if (msg.action === 'GET_TABS_DATA') {
        const mockTabs = [
          { id: 101, title: 'GitHub - songhangze985-eng / stage-manager-3d', url: 'https://github.com/songhangze985-eng/stage-manager-3d', domain: 'github.com', active: true },
          { id: 102, title: 'Bilibili 哔哩哔哩 (゜-゜)つロ 干杯~', url: 'https://www.bilibili.com', domain: 'bilibili.com', active: false },
          { id: 103, title: 'Google 搜索 - Spatial Hyperbolic Matrices', url: 'https://google.com', domain: 'google.com', active: false },
          { id: 104, title: 'V2EX › 创意与 UI/UX 体验分享', url: 'https://v2ex.com', domain: 'v2ex.com', active: false },
          { id: 105, title: 'Figma - 3D Stage Glassmorphism Spec', url: 'https://figma.com', domain: 'figma.com', active: false },
          { id: 106, title: 'Visual Studio Code for the Web', url: 'https://vscode.dev', domain: 'vscode.dev', active: false },
          { id: 107, title: 'YouTube - VisionOS Spatial UI Design', url: 'https://youtube.com', domain: 'youtube.com', active: false },
          { id: 108, title: 'MDN Web Docs - CSS 3D Transforms', url: 'https://developer.mozilla.org', domain: 'mozilla.org', active: false }
        ];
        if (callback) callback({ tabs: mockTabs });
      } else if (msg.action === 'CLOSE_TAB') {
        if (callback) callback({ success: true });
      } else if (msg.action === 'SWITCH_TAB') {
        console.log('[Spatial Stage] Switched to tab:', msg.tabId);
      } else if (msg.action === 'NEW_TAB') {
        console.log('[Spatial Stage] Opened new tab');
      }
    },
    onMessage: {
      addListener: (fn) => {
        window.addEventListener('spatial-stage-toggle', () => fn({ action: 'TOGGLE_STAGE' }));
      }
    }
  };

  // 全局内部状态
  let isOpen = false;
  let tabsData = [];
  let filteredTabs = [];
  let focusedGridPos = { row: 1, col: 0 }; // 默认聚焦中间行左外侧 (激活或主卡片)
  let currentTheme = 'dark';
  let clockTimer = null;

  // 创建宿主节点
  const hostElement = document.createElement('div');
  hostElement.id = 'spatial-stage-extension-root';
  (document.body || document.documentElement).appendChild(hostElement);

  // 挂载 Open Shadow DOM
  const shadowRoot = hostElement.attachShadow({ mode: 'open' });

  // 注入独立隔离样式表
  const linkStyle = document.createElement('link');
  linkStyle.rel = 'stylesheet';
  linkStyle.href = runtime.getURL('content/stage-style.css');
  shadowRoot.appendChild(linkStyle);

  // 构建核心 DOM 骨架
  const wrap = document.createElement('div');
  wrap.className = 'stage-extension-wrap theme-dark';
  wrap.innerHTML = `
    <!-- 沉浸纯色毛玻璃背景与光影 -->
    <div class="stage-backdrop">
      <div class="stage-ambient-light"></div>
      <div class="stage-floor-light"></div>
    </div>

    <!-- 极简顶部系统栏 -->
    <header class="top-system-bar">
      <div class="topbar-left">
        <button class="topbar-esc-btn" id="escBtn" title="退出调度 (Esc)">
          <kbd>ESC</kbd> 退出调度
        </button>
        <div class="topbar-brand">
          <span>SPATIAL STAGE</span>
          <span class="topbar-badge">3D MATRIX</span>
        </div>
      </div>

      <div class="topbar-center">
        <div class="topbar-search-box">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="topbar-search-input" id="tabSearchInput" placeholder="快速筛选标签页 (输入关键词)..." autocomplete="off" />
        </div>
        <div class="topbar-datetime" id="topbarDateTime">--:--:--</div>
      </div>

      <div class="topbar-right">
        <button class="theme-toggle-btn" id="themeToggleBtn" title="切换明暗双模液态主题">
          <span class="theme-toggle-icon" id="themeIcon">🌙</span>
          <span id="themeText">暗夜黑曜</span>
        </button>
        <div class="tab-counter-chip" id="tabCounter">0 TABS</div>
      </div>
    </header>

    <!-- 3D 舞台空间核心视口 (1500px 双曲向心曲率透视) -->
    <main class="stage-3d-viewport" id="stageViewport">
      <div class="stage-world">
        <!-- 左侧展区 (内倾 +20°) -->
        <section class="stage-wing wing-left" id="wingLeft">
          <div class="tier-section tier-top">
            <div class="cards-row" id="row-0-left"></div>
          </div>
          <div class="tier-section tier-mid">
            <div class="cards-row" id="row-1-left"></div>
          </div>
          <div class="tier-section tier-bottom">
            <div class="cards-row" id="row-2-left"></div>
          </div>
        </section>

        <!-- 居中中央通道：纯粹空间留白 -->
        <div class="stage-center-corridor"></div>

        <!-- 右侧展区 (内倾 -20°) -->
        <section class="stage-wing wing-right" id="wingRight">
          <div class="tier-section tier-top">
            <div class="cards-row" id="row-0-right"></div>
          </div>
          <div class="tier-section tier-mid">
            <div class="cards-row" id="row-1-right"></div>
          </div>
          <div class="tier-section tier-bottom">
            <div class="cards-row" id="row-2-right"></div>
          </div>
        </section>
      </div>
    </main>

    <!-- 右下角半斜身贴边触发按钮 -->
    <button class="rounded-square-trigger-btn" id="hotCornerTrigger" title="呼出 3D 舞台调度 (Alt+W)">
      <div class="btn-inner-glass">
        <div class="stage-icon-symbol">
          <div class="wing-dot left-dot"></div>
          <div class="center-bar"></div>
          <div class="wing-dot right-dot"></div>
        </div>
      </div>
      <div class="trigger-tooltip">
        <span class="tooltip-title">3D 舞台调度</span>
        <span class="tooltip-sub">点击或 Alt+W 唤醒</span>
      </div>
    </button>
  `;
  shadowRoot.appendChild(wrap);

  // 获取内部 DOM 元素
  const escBtn = shadowRoot.getElementById('escBtn');
  const hotCornerTrigger = shadowRoot.getElementById('hotCornerTrigger');
  const themeToggleBtn = shadowRoot.getElementById('themeToggleBtn');
  const themeIcon = shadowRoot.getElementById('themeIcon');
  const themeText = shadowRoot.getElementById('themeText');
  const tabSearchInput = shadowRoot.getElementById('tabSearchInput');
  const tabCounter = shadowRoot.getElementById('tabCounter');
  const topbarDateTime = shadowRoot.getElementById('topbarDateTime');
  const backdrop = shadowRoot.querySelector('.stage-backdrop');

  // 时钟更新逻辑
  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    const dateStr = now.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' });
    topbarDateTime.textContent = `${dateStr} ${timeStr}`;
  }
  updateClock();
  clockTimer = setInterval(updateClock, 1000);

  // 主题读取与切换
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['stageTheme'], (res) => {
        if (res && res.stageTheme) {
          setTheme(res.stageTheme);
        }
      });
    } else {
      const saved = localStorage.getItem('spatial_stage_theme');
      if (saved) setTheme(saved);
    }
  } catch (e) {}

  function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
      wrap.classList.remove('theme-dark');
      wrap.classList.add('theme-light');
      themeIcon.textContent = '☀️';
      themeText.textContent = '白昼白璃';
    } else {
      wrap.classList.remove('theme-light');
      wrap.classList.add('theme-dark');
      themeIcon.textContent = '🌙';
      themeText.textContent = '暗夜黑曜';
    }
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ stageTheme: theme });
      } else {
        localStorage.setItem('spatial_stage_theme', theme);
      }
    } catch (e) {}
  }

  themeToggleBtn.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // 打开调度视图
  async function openStage() {
    if (isOpen) return;
    isOpen = true;
    hostElement.classList.add('stage-open');
    tabSearchInput.value = '';
    
    // 向 Service Worker 请求所有真实标签页数据
    await refreshTabs();

    // 默认聚焦至当前活跃标签页位置
    locateActiveTabFocus();
    renderMatrix();
  }

  // 关闭调度视图
  function closeStage() {
    if (!isOpen) return;
    isOpen = false;
    hostElement.classList.remove('stage-open');
  }

  // 切换调度视图
  function toggleStage() {
    if (isOpen) {
      closeStage();
    } else {
      openStage();
    }
  }

  // 请求标签页
  function refreshTabs() {
    return new Promise((resolve) => {
      runtime.sendMessage({ action: 'GET_TABS_DATA' }, (response) => {
        if (response && response.tabs) {
          tabsData = response.tabs;
        } else {
          tabsData = [];
        }
        applyFilter();
        resolve();
      });
    });
  }

  // 过滤检索标签页
  function applyFilter() {
    const q = tabSearchInput.value.trim().toLowerCase();
    if (!q) {
      filteredTabs = [...tabsData];
    } else {
      filteredTabs = tabsData.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.url && t.url.toLowerCase().includes(q)) ||
        (t.domain && t.domain.toLowerCase().includes(q))
      );
    }
    tabCounter.textContent = `${filteredTabs.length} / ${tabsData.length} TABS`;
  }

  // 寻找活跃标签在 3x4 矩阵中的位置
  function locateActiveTabFocus() {
    const activeIdx = filteredTabs.findIndex(t => t.active);
    if (activeIdx >= 0 && activeIdx < 12) {
      focusedGridPos = {
        row: Math.floor(activeIdx / 4),
        col: activeIdx % 4
      };
    } else {
      focusedGridPos = { row: 1, col: 0 };
    }
  }

  // 生成卡片 HTML
  function createCardElement(tab, row, col, depthClass) {
    const card = document.createElement('div');
    card.className = `stage-card ${depthClass} ${tab.active ? 'tab-active-indicator' : ''}`;
    card.dataset.row = row;
    card.dataset.col = col;
    card.dataset.tabId = tab.id;

    const isFocused = (focusedGridPos.row === row && focusedGridPos.col === col);
    if (isFocused) {
      card.classList.add('spatial-focus');
    }

    // 默认图标或提取自 favicon
    const favSrc = tab.favIconUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%230a84ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';

    // 内容缩略图或高雅几何 fallback
    let thumbnailHtml = '';
    if (tab.thumbnail) {
      thumbnailHtml = `<img class="card-thumbnail-img" src="${escapeHtml(tab.thumbnail)}" alt="preview" />`;
    } else {
      const artGradients = [
        'linear-gradient(135deg, rgba(10,132,255,0.4), rgba(191,90,242,0.3))',
        'linear-gradient(135deg, rgba(48,209,88,0.4), rgba(100,210,255,0.3))',
        'linear-gradient(135deg, rgba(255,159,10,0.4), rgba(255,55,95,0.3))',
        'linear-gradient(135deg, rgba(175,82,222,0.4), rgba(10,132,255,0.3))'
      ];
      const grad = artGradients[(tab.id || 0) % artGradients.length];
      thumbnailHtml = `
        <div class="card-fallback-art" style="background:${grad}">
          <div class="fallback-icon">🌐</div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-header">
        <div class="card-header-left">
          <div class="card-traffic-lights">
            <button class="card-close-btn" title="关闭标签页" data-tab-close="${tab.id}"></button>
          </div>
          <img class="card-favicon" src="${escapeHtml(favSrc)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'8\\' fill=\\'%2364d2ff\\'/></svg>'" />
          <span class="card-domain-badge">${escapeHtml(tab.domain || 'localhost')}</span>
        </div>
        <span class="card-depth-badge">${depthClass === 'depth-near' ? 'NEAR Z' : 'FAR Z'}</span>
      </div>
      <div class="card-body">
        ${thumbnailHtml}
        <div class="card-overlay-info">
          <div class="card-title" title="${escapeHtml(tab.title)}">${escapeHtml(tab.title || '新标签页')}</div>
        </div>
      </div>
    `;

    // 点击卡片切换至标签页
    card.addEventListener('click', (e) => {
      // 若点击的是关闭按钮，则不触发卡片切换
      if (e.target.closest('.card-close-btn')) return;
      activateTab(tab.id, card);
    });

    // 绑定关闭按钮事件
    const closeBtn = card.querySelector('.card-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tab.id, card);
      });
    }

    // 鼠标悬停同步聚焦坐标
    card.addEventListener('mouseenter', () => {
      focusedGridPos = { row, col };
      updateSpatialFocusHighlight();
    });

    return card;
  }

  // 空位插槽
  function createEmptySlotElement(row, col, depthClass) {
    const slot = document.createElement('div');
    slot.className = `stage-card empty-slot ${depthClass}`;
    slot.dataset.row = row;
    slot.dataset.col = col;
    slot.innerHTML = `<span>+ 新建标签页</span>`;
    slot.addEventListener('click', () => {
      runtime.sendMessage({ action: 'NEW_TAB' });
      closeStage();
    });
    return slot;
  }

  // 渲染 3x4 矩阵
  function renderMatrix() {
    const rowsLeft = [
      shadowRoot.getElementById('row-0-left'),
      shadowRoot.getElementById('row-1-left'),
      shadowRoot.getElementById('row-2-left')
    ];
    const rowsRight = [
      shadowRoot.getElementById('row-0-right'),
      shadowRoot.getElementById('row-1-right'),
      shadowRoot.getElementById('row-2-right')
    ];

    // 清空现存卡片
    rowsLeft.forEach(r => r.innerHTML = '');
    rowsRight.forEach(r => r.innerHTML = '');

    // 3 行 x 4 列分布：
    // 每行有 4 个位置：col 0 (Left Near), col 1 (Left Far), col 2 (Right Far), col 3 (Right Near)
    // Left Wing (justify-content: flex-end):
    // 视觉上：Col 0 在外侧 (Near, 靠近视口边缘)，Col 1 在内侧 (Far, 靠近中心走廊)
    // Right Wing (justify-content: flex-start):
    // 视觉上：Col 2 在内侧 (Far, 靠近中心走廊)，Col 3 在外侧 (Near, 靠近视口边缘)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const index = r * 4 + c;
        const tab = filteredTabs[index];

        let depthClass = '';
        if (c === 0 || c === 3) {
          depthClass = 'depth-near'; // 靠近观察者
        } else {
          depthClass = 'depth-far';  // 远离观察者
        }

        let element;
        if (tab) {
          element = createCardElement(tab, r, c, depthClass);
        } else {
          element = createEmptySlotElement(r, c, depthClass);
        }

        if (c === 0 || c === 1) {
          rowsLeft[r].appendChild(element);
        } else {
          rowsRight[r].appendChild(element);
        }
      }
    }

    updateSpatialFocusHighlight();
  }

  // 更新聚焦态样式类
  function updateSpatialFocusHighlight() {
    const allCards = shadowRoot.querySelectorAll('.stage-card');
    allCards.forEach(card => {
      const r = parseInt(card.dataset.row, 10);
      const c = parseInt(card.dataset.col, 10);
      if (r === focusedGridPos.row && c === focusedGridPos.col) {
        card.classList.add('spatial-focus');
        card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      } else {
        card.classList.remove('spatial-focus');
      }
    });
  }

  // 激活标签页
  function activateTab(tabId, cardEl) {
    if (!tabId) return;
    if (cardEl) {
      cardEl.classList.add('activating');
    }
    setTimeout(() => {
      runtime.sendMessage({ action: 'SWITCH_TAB', tabId });
      closeStage();
    }, 180);
  }

  // 关闭标签页
  function closeTab(tabId, cardEl) {
    if (!tabId) return;
    cardEl.style.transition = 'all 0.3s var(--ease-spring)';
    cardEl.style.transform = 'scale(0.2) rotate(15deg)';
    cardEl.style.opacity = '0';

    setTimeout(() => {
      runtime.sendMessage({ action: 'CLOSE_TAB', tabId }, async () => {
        await refreshTabs();
        renderMatrix();
      });
    }, 250);
  }

  // 键盘全空间导航
  function handleKeyDown(e) {
    // 全局 Alt+W 唤醒与隐藏
    if (e.altKey && (e.key === 'w' || e.key === 'W' || e.code === 'KeyW')) {
      e.preventDefault();
      e.stopPropagation();
      toggleStage();
      return;
    }

    if (!isOpen) return;

    // 当在搜索框中键入时，允许正常输入，ESC 放弃，Enter 激活
    if (shadowRoot.activeElement === tabSearchInput) {
      if (e.key === 'Escape') {
        tabSearchInput.blur();
        return;
      }
      if (e.key === 'Enter') {
        triggerFocusedTab();
        return;
      }
      if (e.key === 'ArrowDown') {
        tabSearchInput.blur();
        e.preventDefault();
      } else {
        return; // 让输入框处理文本
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeStage();
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusedGridPos.col = (focusedGridPos.col + 1) % 4;
      updateSpatialFocusHighlight();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusedGridPos.col = (focusedGridPos.col - 1 + 4) % 4;
      updateSpatialFocusHighlight();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedGridPos.row = (focusedGridPos.row + 1) % 3;
      updateSpatialFocusHighlight();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedGridPos.row = (focusedGridPos.row - 1 + 3) % 3;
      updateSpatialFocusHighlight();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      triggerFocusedTab();
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      const currentIdx = focusedGridPos.row * 4 + focusedGridPos.col;
      const targetTab = filteredTabs[currentIdx];
      if (targetTab) {
        const targetCard = shadowRoot.querySelector(`.stage-card[data-row="${focusedGridPos.row}"][data-col="${focusedGridPos.col}"]`);
        if (targetCard) {
          closeTab(targetTab.id, targetCard);
        }
      }
      return;
    }

    // 快捷聚焦搜索栏
    if (e.key === '/' || (e.ctrlKey && e.key === 'f') || (e.metaKey && e.key === 'f')) {
      e.preventDefault();
      tabSearchInput.focus();
      tabSearchInput.select();
      return;
    }
  }

  function triggerFocusedTab() {
    const currentIdx = focusedGridPos.row * 4 + focusedGridPos.col;
    const targetTab = filteredTabs[currentIdx];
    if (targetTab) {
      const targetCard = shadowRoot.querySelector(`.stage-card[data-row="${focusedGridPos.row}"][data-col="${focusedGridPos.col}"]`);
      activateTab(targetTab.id, targetCard);
    } else {
      // 空位，新建标签页
      runtime.sendMessage({ action: 'NEW_TAB' });
      closeStage();
    }
  }

  // 绑定事件
  escBtn.addEventListener('click', closeStage);
  hotCornerTrigger.addEventListener('click', toggleStage);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeStage();
    }
  });

  tabSearchInput.addEventListener('input', () => {
    applyFilter();
    focusedGridPos = { row: 0, col: 0 };
    renderMatrix();
  });

  // 监听键盘事件 (全局捕获阶段)
  window.addEventListener('keydown', handleKeyDown, true);

  // 监听来自 Background Service Worker 的指令
  if (runtime.onMessage && runtime.onMessage.addListener) {
    runtime.onMessage.addListener((message) => {
      if (message && message.action === 'TOGGLE_STAGE') {
        toggleStage();
      }
    });
  }

  // 暴露调试句柄 (用于自动化测试与外部控制)
  window.__SPATIAL_STAGE_CONTROLLER__ = {
    open: openStage,
    close: closeStage,
    toggle: toggleStage,
    getShadow: () => shadowRoot,
    setTheme: setTheme
  };

  // HTML 安全转义函数
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
