/**
 * macOS 3D 舞台调度 (Stage Manager 3D) - 交互与动态排布引擎
 */

// 1. 全局应用注册表 (12个高拟真桌面应用，覆盖两侧上/中/下三层从远到近排布)
const APPS = {
  // 左侧上层
  slack: {
    id: 'slack',
    name: '团队通讯',
    icon: '💬',
    category: '远程协作',
    color: '#4A154B',
    renderMini: () => `
      <div style="font-size: 10px; display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="width:6px; height:6px; background:#2eb67d; border-radius:50%;"></span>
          <span style="font-weight:600; color:#fff;">#产品研发群</span>
        </div>
        <div style="background:rgba(255,255,255,0.06); padding:4px 6px; border-radius:4px; font-size:9px; color:#d1d5db;">
          Alex: 新版 3D 舞台调度交互设计已就绪！
        </div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; height:100%; gap:16px;">
        <div style="width:180px; border-right:1px solid rgba(255,255,255,0.1); padding-right:12px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:12px; font-weight:700; color:#9ca3af; text-transform:uppercase;">频道列表</div>
          <div style="background:rgba(255,255,255,0.1); padding:6px 10px; border-radius:6px; font-size:12px; color:#fff;"># 核心架构-研发</div>
          <div style="padding:6px 10px; font-size:12px; color:#9ca3af;"># UI-动效实验</div>
          <div style="padding:6px 10px; font-size:12px; color:#9ca3af;"># 发布公告</div>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; gap:10px;">
              <div style="width:32px; height:32px; border-radius:8px; background:#e01e5a; display:flex; align-items:center; justify-content:center; font-weight:bold;">A</div>
              <div>
                <div style="font-size:13px; font-weight:600; color:#fff;">Alex Chen <span style="font-size:11px; color:#6b7280; font-weight:normal;">10:24 AM</span></div>
                <div style="font-size:13px; color:#d1d5db; margin-top:2px;">舞台调度三维透视效果已经接入完毕，两翼向内倾斜角度体验非常震撼！</div>
              </div>
            </div>
          </div>
          <div style="height:40px; background:rgba(255,255,255,0.08); border-radius:8px; display:flex; align-items:center; padding:0 12px; color:#9ca3af; font-size:13px;">
            发送消息到 # 核心架构-研发...
          </div>
        </div>
      </div>
    `
  },
  safari: {
    id: 'safari',
    name: 'Safari 浏览器',
    icon: '🌐',
    category: '前沿周刊',
    color: '#007aff',
    renderMini: () => `
      <div class="mock-safari">
        <div class="mock-safari-bar">apple.com/stage-manager-3d</div>
        <div class="mock-safari-content">
          <div class="mock-article-thumb"></div>
          <div class="mock-article-lines">
            <div class="mock-line" style="width: 80%;"></div>
            <div class="mock-line" style="width: 60%;"></div>
            <div class="mock-line" style="width: 90%;"></div>
          </div>
        </div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; flex-direction:column; height:100%; gap:16px;">
        <div style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06); padding:6px 12px; border-radius:8px;">
          <span style="color:#6b7280;">􀰑</span>
          <span style="color:#6b7280;">􀰒</span>
          <div style="flex:1; background:rgba(255,255,255,0.08); border-radius:6px; padding:4px 12px; font-size:12px; text-align:center; color:#e5e7eb;">
            🔒 https://developer.apple.com/macos/spatial-computing-web
          </div>
        </div>
        <div style="flex:1; background:rgba(255,255,255,0.02); border-radius:10px; padding:20px; overflow-y:auto;">
          <h1 style="font-size:24px; font-weight:700; color:#fff; margin-bottom:12px;">探索空间三维界面的视觉层叠美学</h1>
          <p style="color:#9ca3af; line-height:1.6; font-size:14px; margin-bottom:16px;">
            在现代桌面操作系统交互中，通过 3D 轴向倾角、透视深度变换与纯色背景切换，用户可以获得超越传统平铺窗口的空间感知力。中央走廊保留虚怀若谷的隐形分界线，两翼界面由远及近自小而大汇聚视线。
          </p>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
            <div style="height:90px; background:linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius:8px;"></div>
            <div style="height:90px; background:linear-gradient(135deg, #4c1d95, #8b5cf6); border-radius:8px;"></div>
            <div style="height:90px; background:linear-gradient(135deg, #064e3b, #10b981); border-radius:8px;"></div>
          </div>
        </div>
      </div>
    `
  },

  // 左侧中层
  notes: {
    id: 'notes',
    name: '灵感备忘录',
    icon: '📝',
    category: '构想备忘',
    color: '#f59e0b',
    renderMini: () => `
      <div style="font-size:9.5px; color:#d1d5db; display:flex; flex-direction:column; gap:4px;">
        <div style="font-weight:700; color:#fbbf24;">✦ 下一代交互灵感清单</div>
        <div style="opacity:0.75;">• 纯色景深环境增强专注</div>
        <div style="opacity:0.75;">• 左右两翼立体向内视界</div>
        <div style="opacity:0.75;">• 远近大小梯级深度对齐</div>
      </div>
    `,
    renderMain: () => `
      <div style="padding:10px 20px;">
        <div style="font-size:12px; color:#f59e0b; font-weight:600; margin-bottom:4px;">2026年11月4日 00:45</div>
        <h2 style="font-size:22px; color:#fff; font-weight:700; margin-bottom:16px;">三维舞台调度（Spatial Stage Manager）设计规范</h2>
        <ul style="color:#d1d5db; line-height:1.8; font-size:14px; padding-left:20px;">
          <li><strong>视觉消隐机制：</strong>触发时桌面动态壁纸完全退去，切换为纯黑哑光影院级背景。</li>
          <li><strong>中央对称虚轴：</strong>屏幕中轴线留白，隐藏分界线，赋予视线纵向深邃延伸感。</li>
          <li><strong>透视梯级缩放：</strong>卡片越深入远端尺寸收敛（75%-82%），越靠近前景越饱满清晰（100%-105%）。</li>
          <li><strong>直观唤出与收起：</strong>鼠标滑入右下角瞬间弹出灵动圆角方块，点击瞬间进入调度；点击任意卡片即可还原并作为主窗口启动。</li>
        </ul>
      </div>
    `
  },
  dashboard: {
    id: 'dashboard',
    name: '数据洞察仪表盘',
    icon: '📊',
    category: '核心监控',
    color: '#0a84ff',
    renderMini: () => `
      <div class="mock-dashboard">
        <div class="mock-stat-row">
          <div class="mock-stat-box">
            <div class="mock-stat-num">98.4%</div>
            <div class="mock-stat-lbl">实时吞吐率</div>
          </div>
          <div class="mock-stat-box">
            <div class="mock-stat-num" style="color:#30d158;">120 FPS</div>
            <div class="mock-stat-lbl">渲染流畅度</div>
          </div>
        </div>
        <svg class="mock-chart-svg" viewBox="0 0 100 30">
          <path d="M0,25 Q15,10 30,18 T60,8 T100,2" fill="none" stroke="#0a84ff" stroke-width="2.5" />
          <path d="M0,25 Q15,10 30,18 T60,8 T100,2 L100,30 L0,30 Z" fill="rgba(10,132,255,0.15)" />
        </svg>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; flex-direction:column; gap:20px; height:100%;">
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px;">
          <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:12px; color:#9ca3af;">日活跃并发任务</div>
            <div style="font-size:26px; font-weight:700; color:#fff; margin-top:6px;">84,290</div>
            <div style="font-size:11px; color:#34d399; margin-top:4px;">↑ +14.2% 比上周</div>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:12px; color:#9ca3af;">GPU 空间着色算力</div>
            <div style="font-size:26px; font-weight:700; color:#60a5fa; margin-top:6px;">1.84 TFLOPS</div>
            <div style="font-size:11px; color:#60a5fa; margin-top:4px;">稳定运行中</div>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:12px; color:#9ca3af;">内存占用比</div>
            <div style="font-size:26px; font-weight:700; color:#f472b6; margin-top:6px;">4.2 / 32 GB</div>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;">极其轻盈</div>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:12px; color:#9ca3af;">动态帧率</div>
            <div style="font-size:26px; font-weight:700; color:#34d399; margin-top:6px;">120 Hz</div>
            <div style="font-size:11px; color:#34d399; margin-top:4px;">全硬件加速启用</div>
          </div>
        </div>
        <div style="flex:1; background:rgba(255,255,255,0.04); border-radius:12px; padding:18px; border:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column;">
          <div style="font-size:14px; font-weight:600; color:#fff; margin-bottom:12px;">实时性能波形走势</div>
          <svg style="width:100%; flex:1;" viewBox="0 0 500 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a84ff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#0a84ff" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <path d="M0,90 Q50,40 100,60 T200,30 T300,50 T400,20 T500,45" fill="none" stroke="#0a84ff" stroke-width="3"/>
            <path d="M0,90 Q50,40 100,60 T200,30 T300,50 T400,20 T500,45 L500,120 L0,120 Z" fill="url(#chartGrad)"/>
          </svg>
        </div>
      </div>
    `
  },

  // 左侧下层
  photos: {
    id: 'photos',
    name: '相册与光影',
    icon: '🌄',
    category: '媒体画廊',
    color: '#ec4899',
    renderMini: () => `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; height:100%;">
        <div style="background:linear-gradient(135deg, #ff7e5f, #feb47b); border-radius:4px;"></div>
        <div style="background:linear-gradient(135deg, #6a11cb, #2575fc); border-radius:4px;"></div>
      </div>
    `,
    renderMain: () => `
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; height:100%; overflow-y:auto;">
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display:flex; align-items:flex-end; padding:12px; color:#fff; font-weight:600;">晨光雪山</div>
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #5ee7df 0%, #b490ca 100%); display:flex; align-items:flex-end; padding:12px; color:#fff; font-weight:600;">极光夜幕</div>
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #c471f5 0%, #fa71cd 100%); display:flex; align-items:flex-end; padding:12px; color:#fff; font-weight:600;">星云漫步</div>
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%); display:flex; align-items:flex-end; padding:12px; color:#fff; font-weight:600;">深海潜影</div>
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #feada6 0%, #f5efef 100%); display:flex; align-items:flex-end; padding:12px; color:#333; font-weight:600;">日光倾城</div>
        <div style="height:160px; border-radius:12px; background:linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); display:flex; align-items:flex-end; padding:12px; color:#333; font-weight:600;">春意盎然</div>
      </div>
    `
  },
  music: {
    id: 'music',
    name: 'Apple Music',
    icon: '🎵',
    category: '高保真音频',
    color: '#fa233b',
    renderMini: () => `
      <div class="mock-music">
        <div class="mock-album-cover">💿</div>
        <div class="mock-music-info">
          <div class="mock-song-title">Midnight Odyssey</div>
          <div class="mock-song-artist">Spatial Audio Studio</div>
          <div class="mock-progress-bar">
            <div class="mock-progress-fill"></div>
          </div>
        </div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; align-items:center; gap:28px; height:100%; padding:20px;">
        <div style="width:200px; height:200px; border-radius:16px; background:linear-gradient(135deg, #ff2d55, #bf5af2); display:flex; justify-content:center; align-items:center; font-size:64px; box-shadow:0 20px 40px rgba(255,45,85,0.4);">
          🎧
        </div>
        <div style="flex:1; display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:12px; color:#ff2d55; font-weight:700; letter-spacing:1px; text-transform:uppercase;">无损空间音频播放中</div>
          <div style="font-size:28px; font-weight:700; color:#fff;">Midnight Odyssey (3D Remaster)</div>
          <div style="font-size:15px; color:#9ca3af;">Hans Zimmer • Apple Music Spatial Master</div>
          <div style="margin-top:16px; display:flex; flex-direction:column; gap:6px;">
            <div style="height:6px; background:rgba(255,255,255,0.15); border-radius:3px; overflow:hidden;">
              <div style="width:58%; height:100%; background:#ff2d55; border-radius:3px;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:#6b7280;">
              <span>02:35</span>
              <span>04:48</span>
            </div>
          </div>
          <div style="display:flex; gap:20px; align-items:center; margin-top:10px;">
            <span style="font-size:20px; cursor:pointer;">􀊊</span>
            <span style="font-size:32px; cursor:pointer; color:#ff2d55;">􀊌</span>
            <span style="font-size:20px; cursor:pointer;">􀊐</span>
          </div>
        </div>
      </div>
    `
  },

  // 右侧上层
  settings: {
    id: 'settings',
    name: '系统设置',
    icon: '⚙️',
    category: '偏好设置',
    color: '#8e8e93',
    renderMini: () => `
      <div style="display:flex; flex-direction:column; gap:5px; font-size:9.5px;">
        <div style="display:flex; justify-content:space-between; color:#fff;">
          <span>台前调度 3D 模式</span>
          <span style="color:#30d158; font-weight:bold;">已开启</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#9ca3af;">
          <span>纯色背景深度</span>
          <span>哑光黑 100%</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#9ca3af;">
          <span>两翼倾角</span>
          <span>26° 向内</span>
        </div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; height:100%; gap:20px;">
        <div style="width:200px; border-right:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:6px; padding-right:12px;">
          <div style="background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:8px; font-weight:600; color:#fff; font-size:13px;">🖥️ 显示与舞台</div>
          <div style="padding:8px 12px; color:#9ca3af; font-size:13px;">🔒 隐私与安全性</div>
          <div style="padding:8px 12px; color:#9ca3af; font-size:13px;">🎨 外观与主题</div>
          <div style="padding:8px 12px; color:#9ca3af; font-size:13px;">⚡️ 快捷手势与触控角</div>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; gap:16px;">
          <h3 style="font-size:18px; font-weight:700; color:#fff;">3D 舞台调度高级特性</h3>
          <div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:13px; font-weight:600; color:#fff;">触发角弹出圆角方形按钮</div>
              <div style="font-size:11px; color:#9ca3af;">鼠标滑入右下角瞬间弹出，提供清晰明确的交互触发点</div>
            </div>
            <div style="width:40px; height:22px; background:#30d158; border-radius:12px; position:relative;">
              <div style="width:18px; height:18px; background:#fff; border-radius:50%; position:absolute; right:2px; top:2px;"></div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:13px; font-weight:600; color:#fff;">远近阶梯缩放排布 (Far-to-Near)</div>
              <div style="font-size:11px; color:#9ca3af;">内侧远端卡片比例约 82%，外侧近端卡片比例 102%，形成真实透视空间</div>
            </div>
            <div style="width:40px; height:22px; background:#30d158; border-radius:12px; position:relative;">
              <div style="width:18px; height:18px; background:#fff; border-radius:50%; position:absolute; right:2px; top:2px;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  terminal: {
    id: 'terminal',
    name: '开发者终端',
    icon: '⚡️',
    category: 'CLI 核心',
    color: '#000000',
    renderMini: () => `
      <div class="mock-terminal">
        <div>$ agy serve --spatial-3d</div>
        <div style="color:#60a5fa;">[OK] 3D Engine initialized</div>
        <div style="color:#fbbf24;">[INFO] Perspective: 1400px</div>
        <div>$ cursor at hot-corner BR</div>
      </div>
    `,
    renderMain: () => `
      <div style="background:#090a0f; border-radius:10px; height:100%; padding:16px; font-family:var(--font-mono); font-size:13px; color:#d1d5db; line-height:1.6; overflow-y:auto;">
        <div style="color:#30d158;">➜  workspace git:(main) agy run stage-manager --render-mode=spatial-gallery</div>
        <div style="color:#9ca3af;">[2026-11-04 00:46:12] Initializing Spatial Stage Manager v2.4...</div>
        <div>✔ Left Wing mounted (3 Tiers x 2 Depths = 6 cards)</div>
        <div>✔ Right Wing mounted (3 Tiers x 2 Depths = 6 cards)</div>
        <div>✔ Central corridor clear (No center cards, invisible axis active)</div>
        <div>✔ Hot Corner detector armed at [Bottom-Right: 110x110px]</div>
        <div style="color:#60a5fa;">🚀 Spatial 3D Stage ready! Hover to bottom-right corner to pop up trigger.</div>
        <div style="color:#30d158; margin-top:8px;">➜  workspace git:(main) <span style="animation:pulseAura 1s infinite;">▌</span></div>
      </div>
    `
  },

  // 右侧中层
  database: {
    id: 'database',
    name: '云端分布式数据库',
    icon: '🗄️',
    category: '数据架构',
    color: '#6366f1',
    renderMini: () => `
      <div style="font-size:9.5px; display:flex; flex-direction:column; gap:4px; color:#e0e7ff;">
        <div style="display:flex; justify-content:space-between;">
          <span>集群节点: 12 Nodes</span>
          <span style="color:#34d399;">● 正常</span>
        </div>
        <div style="background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden;">
          <div style="width:72%; height:100%; background:#6366f1;"></div>
        </div>
        <div style="font-size:8.5px; color:#9ca3af;">QPS: 42,900 req/s</div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; flex-direction:column; gap:16px; height:100%;">
        <div style="font-size:14px; font-weight:600; color:#fff;">分布式集群状态拓扑</div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
          <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px;">
            <div style="color:#34d399; font-size:12px; font-weight:700;">Node-Alpha (Primary)</div>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;">延迟: 1.2ms • 负载: 42%</div>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px;">
            <div style="color:#34d399; font-size:12px; font-weight:700;">Node-Beta (Replica)</div>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;">延迟: 1.8ms • 负载: 38%</div>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px;">
            <div style="color:#34d399; font-size:12px; font-weight:700;">Node-Gamma (Replica)</div>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;">延迟: 2.1ms • 负载: 45%</div>
          </div>
        </div>
      </div>
    `
  },
  code: {
    id: 'code',
    name: 'VS Code 架构研发',
    icon: '💻',
    category: 'IDE 工作区',
    color: '#237804',
    renderMini: () => `
      <div class="mock-code">
        <div><span class="code-line-num">1</span><span class="code-keyword">const</span> stage = <span class="code-fn">createStage</span>();</div>
        <div><span class="code-line-num">2</span>stage.<span class="code-fn">setPerspective</span>(<span class="code-str">'1400px'</span>);</div>
        <div><span class="code-line-num">3</span>stage.<span class="code-fn">applySolidTheme</span>();</div>
      </div>
    `,
    renderMain: () => `
      <div style="display:flex; height:100%; font-family:var(--font-mono); font-size:13px; line-height:1.5;">
        <div style="width:200px; border-right:1px solid rgba(255,255,255,0.08); padding-right:12px; color:#9ca3af;">
          <div style="font-size:11px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">项目目录</div>
          <div style="color:#60a5fa;">📁 src</div>
          <div style="padding-left:14px; color:#d1d5db;">📄 stage3D.js</div>
          <div style="padding-left:14px; color:#d1d5db;">📄 layoutEngine.ts</div>
          <div style="padding-left:14px; color:#d1d5db;">📄 perspectiveMath.css</div>
        </div>
        <div style="flex:1; padding-left:16px; overflow-y:auto; color:#abb2bf;">
          <div><span style="color:#5c6370;">// 3D 舞台调度：左右分翼向内透视矩阵计算</span></div>
          <div><span style="color:#c678dd;">function</span> <span style="color:#61afef;">calculateWingTransform</span>(side, depthTier) {</div>
          <div style="padding-left:16px;"><span style="color:#c678dd;">const</span> angle = side === <span style="color:#98c379;">'left'</span> ? <span style="color:#d19a66;">26</span> : -<span style="color:#d19a66;">26</span>;</div>
          <div style="padding-left:16px;"><span style="color:#c678dd;">const</span> scale = depthTier === <span style="color:#98c379;">'far'</span> ? <span style="color:#d19a66;">0.82</span> : <span style="color:#d19a66;">1.02</span>;</div>
          <div style="padding-left:16px;"><span style="color:#c678dd;">return</span> <span style="color:#98c379;">\`rotateY(\${angle}deg) scale(\${scale})\`</span>;</div>
          <div>}</div>
        </div>
      </div>
    `
  },

  // 右侧下层
  calendar: {
    id: 'calendar',
    name: '日程与会议',
    icon: '📅',
    category: '时间管理',
    color: '#ff3b30',
    renderMini: () => `
      <div style="font-size:9.5px; display:flex; flex-direction:column; gap:4px;">
        <div style="color:#ff3b30; font-weight:700;">周三 • 11月4日</div>
        <div style="background:rgba(255,255,255,0.06); padding:4px 6px; border-radius:4px; font-size:9px; color:#fff;">
          10:00 AM 3D 调度体验评审
        </div>
      </div>
    `,
    renderMain: () => `
      <div style="padding:16px; display:flex; flex-direction:column; gap:16px;">
        <div style="font-size:22px; font-weight:700; color:#fff;">2026年 11月</div>
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:8px; text-align:center; font-size:12px; color:#9ca3af;">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
          <div style="padding:10px; border-radius:8px;">1</div>
          <div style="padding:10px; border-radius:8px;">2</div>
          <div style="padding:10px; border-radius:8px;">3</div>
          <div style="padding:10px; border-radius:8px; background:#ff3b30; color:#fff; font-weight:bold;">4</div>
          <div style="padding:10px; border-radius:8px;">5</div>
          <div style="padding:10px; border-radius:8px;">6</div>
          <div style="padding:10px; border-radius:8px;">7</div>
        </div>
      </div>
    `
  },
  design: {
    id: 'design',
    name: '设计画板 Figma',
    icon: '🎨',
    category: '矢量原型',
    color: '#a855f7',
    renderMini: () => `
      <div class="mock-design">
        <div class="mock-vector-shape"></div>
      </div>
    `,
    renderMain: () => `
      <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#1e1e1e; border-radius:12px; position:relative; overflow:hidden;">
        <div style="position:absolute; top:12px; left:16px; font-size:12px; color:#9ca3af;">Figma • 空间舞台向内倾角视觉组件</div>
        <div style="width:140px; height:140px; border-radius:28px; background:linear-gradient(135deg, #a855f7, #ec4899); box-shadow:0 24px 60px rgba(168,85,247,0.45); transform:rotate(15deg); display:flex; justify-content:center; align-items:center; color:#fff; font-size:36px;">
          ✦
        </div>
      </div>
    `
  }
};

// 2. 状态机管理
const state = {
  isStageMode: false,
  activeAppId: 'dashboard',
  sidebarAppIds: ['code', 'safari', 'music', 'design'],
  soundEnabled: true
};

// 3. Web Audio 合成微小轻音效 (提供 Apple 式清脆触感)
class AudioFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }
  playPop() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
  playSwoosh() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }
}

const sfx = new AudioFX();

// 4. 舞台网格分配规划 (分左右两侧朝向，上下三层，居中隐藏分界线，远近从小到大排布)
// 视觉透视原则：
// - 中央走廊为景深远端 (Far，尺寸小，沿数学曲线深入向心，更靠向中心走廊但不交接)
// - 左右两侧屏幕边缘为前景近端 (Near，尺寸大，沿数学曲线推向前景)
// - 左翼：[近端 104% (大)] ----> [远端 83% (小)] | 72px 空隙中心通道 | [远端 83% (小)] <---- [近端 104% (大)] ：右翼

const STAGE_GRID = {
  // 左侧上/中/下三层：近景在左(外侧/大)，远景在右(内侧/小，更靠中心)
  'row-left-top':   [{ appId: 'safari', depth: 'near', side: 'left', tier: -1 },    { appId: 'slack', depth: 'far', side: 'left', tier: -1 }],
  'row-left-mid':   [{ appId: 'dashboard', depth: 'near', side: 'left', tier: 0 }, { appId: 'notes', depth: 'far', side: 'left', tier: 0 }],
  'row-left-bot':   [{ appId: 'music', depth: 'near', side: 'left', tier: 1 },     { appId: 'photos', depth: 'far', side: 'left', tier: 1 }],

  // 右侧上/中/下三层：远景在左(内侧/小，更靠中心)，近景在右(外侧/大)
  'row-right-top':  [{ appId: 'settings', depth: 'far', side: 'right', tier: -1 },   { appId: 'terminal', depth: 'near', side: 'right', tier: -1 }],
  'row-right-mid':  [{ appId: 'database', depth: 'far', side: 'right', tier: 0 },   { appId: 'code', depth: 'near', side: 'right', tier: 0 }],
  'row-right-bot':  [{ appId: 'calendar', depth: 'far', side: 'right', tier: 1 },   { appId: 'design', depth: 'near', side: 'right', tier: 1 }]
};

// 空间矩阵：供键盘方向键在 3D 舞台调度中无缝导航 (3 行 x 4 列)
const SPATIAL_MATRIX = [
  ['safari', 'slack', 'settings', 'terminal'],
  ['dashboard', 'notes', 'database', 'code'],
  ['music', 'photos', 'calendar', 'design']
];
let keyboardFocus = { row: 1, col: 0 };

function updateSpatialFocus(newRow, newCol) {
  keyboardFocus.row = Math.max(0, Math.min(2, newRow));
  keyboardFocus.col = Math.max(0, Math.min(3, newCol));

  const targetAppId = SPATIAL_MATRIX[keyboardFocus.row][keyboardFocus.col];

  clearSpatialFocus();

  const targetCard = document.querySelector(`.stage-card[data-app-id="${targetAppId}"]`);
  if (targetCard) {
    targetCard.classList.add('spatial-focus');
    sfx.playPop();
  }
}

function clearSpatialFocus() {
  document.querySelectorAll('.stage-card.spatial-focus').forEach(el => {
    el.classList.remove('spatial-focus');
  });
}

/**
 * 数学函数曲线规划向中心的立体效果 (Hyperbolic Inward Spatial Curve Function)
 * 
 * 设归一化空间参数 u ∈ [0, 1]：
 * u = 0.16 为靠近中央走廊（远景内侧，靠中心但不相交）
 * u = 0.86 为靠近屏幕外侧（近景外侧，饱满展开）
 * 
 * 1. 深度曲线: Z(u) = Z_base + deltaZ * ((1 - cos(π * u)) / 2)^0.88 (保证 Z > 0，杜绝点击穿透bug)
 * 2. 缩放曲线: S(u) = S_min + (S_max - S_min) * sin((π / 2) * u) (由小到大)
 * 3. 向心偏转角: θ_y(side, u) = side * [θ_inner * (1 - u)^0.75 + θ_outer * u] (沿数学双曲切线向内)
 * 4. 垂直分层俯仰角: θ_x(tier) = -tierIndex * θ_pitch (球形环抱感)
 */
function calculateSpatialCurveTransform(side, tierIndex, isFar) {
  const s = side === 'left' ? 1 : -1; // 左翼正向偏转，右翼反向偏转
  const u = isFar ? 0.16 : 0.86;

  // 1. 深度曲线 (Z 始终严格为正值，保证永远在 Z=0 容器平面之前，彻底杜绝穿透与无法点击)
  const zBase = 28;
  const deltaZ = 142;
  const curveZ = zBase + deltaZ * Math.pow((1 - Math.cos(Math.PI * u)) / 2, 0.88);

  // 2. 缩放函数 (内侧较小 0.83，外侧较大 1.04)
  const sMin = 0.83;
  const sMax = 1.04;
  const scale = sMin + (sMax - sMin) * Math.sin((Math.PI / 2) * u);

  // 3. 向心切线偏转角 (内侧卡片朝向中心聚拢，外侧卡片转向观察者)
  const thetaInner = 28.5;
  const thetaOuter = 16.5;
  const rotY = s * (thetaInner * Math.pow(1 - u, 0.75) + thetaOuter * u);

  // 4. 垂直俯仰角 (上层往下看，下层往上看)
  const pitchAngle = 4.0;
  const rotX = -tierIndex * pitchAngle;

  const transform = `translate3d(0, 0, ${curveZ.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) scale(${scale.toFixed(3)})`;

  return {
    transform,
    zIndex: isFar ? 15 : 25,
    curveZ,
    rotY,
    rotX,
    scale
  };
}

// 5. 初始化与渲染 DOM
function initApp() {
  renderActiveMainWindow();
  renderSidebarStacks();
  renderStage3DGrid();
  bindEvents();
  startClock();

  // 若 URL 带 #stage 则直接默认开启 3D 舞台模式
  if (window.location.hash === '#stage') {
    toggleStageMode(true);
  } else if (window.location.hash === '#corner') {
    const stageTriggerBtn = document.getElementById('stageTriggerBtn');
    if (stageTriggerBtn) stageTriggerBtn.classList.add('force-visible');
  }
}

// 渲染桌面活动主窗口
function renderActiveMainWindow() {
  const app = APPS[state.activeAppId];
  if (!app) return;

  const activeWindowIcon = document.getElementById('activeWindowIcon');
  const activeWindowLabel = document.getElementById('activeWindowLabel');
  const activeWindowContent = document.getElementById('activeWindowContent');

  if (activeWindowIcon) activeWindowIcon.textContent = app.icon;
  if (activeWindowLabel) activeWindowLabel.textContent = `${app.name} - ${app.category}`;
  if (activeWindowContent) activeWindowContent.innerHTML = app.renderMain();
}

// B 站各分区应用精简艺术字标签映射
const BILI_APP_SHORT_NAMES = {
  slack: '通讯',
  safari: 'Safari',
  notes: '备忘录',
  dashboard: '仪表盘',
  photos: '相册',
  music: '音乐',
  settings: '设置',
  terminal: '终端',
  database: '数据库',
  code: 'VS Code',
  calendar: '日程',
  design: '设计'
};

// 渲染 B 站拟态顶部栏的分区多界面频道胶囊 (替代原左侧悬浮栏)
function renderSidebarStacks() {
  const listEl = document.getElementById('sidebarStackList');
  if (!listEl) return;
  listEl.innerHTML = '';

  // 聚合所有应用作为 B 站分区频道呈现
  const allAppKeys = Object.keys(APPS);

  allAppKeys.forEach(id => {
    const app = APPS[id];
    if (!app) return;

    const isActive = state.activeAppId === id;
    const shortName = BILI_APP_SHORT_NAMES[id] || app.name;
    const pill = document.createElement('div');
    pill.className = `bili-channel-pill ${isActive ? 'active' : ''}`;
    pill.dataset.appId = id;
    pill.title = `${app.name} · ${app.category}`;

    pill.innerHTML = `
      <span class="channel-pill-icon">${app.icon}</span>
      <span class="channel-pill-name">${shortName}</span>
      <div class="bili-pill-preview-popover">
        <div class="popover-titlebar">
          <span class="pop-dot"></span>
          <span class="pop-dot"></span>
          <span class="pop-dot"></span>
          <span class="pop-title">${app.name} · ${app.category}</span>
        </div>
        <div class="popover-body">
          ${app.renderMini()}
        </div>
      </div>
    `;

    pill.addEventListener('click', () => {
      sfx.playPop();
      switchActiveApp(id);
    });

    listEl.appendChild(pill);
  });
}

// 渲染 3D 舞台调度视口内的全部卡片 (两侧对称向内、三层排布、数学函数曲线计算)
function renderStage3DGrid() {
  Object.keys(STAGE_GRID).forEach(rowId => {
    const rowEl = document.getElementById(rowId);
    if (!rowEl) return;
    rowEl.innerHTML = '';

    const items = STAGE_GRID[rowId];
    items.forEach(item => {
      const app = APPS[item.appId];
      if (!app) return;

      const isFar = item.depth === 'far';
      const curveData = calculateSpatialCurveTransform(item.side, item.tier, isFar);

      const card = document.createElement('div');
      card.className = `stage-card depth-${item.depth}`;
      card.dataset.appId = app.id;
      card.dataset.depth = item.depth;
      card.title = `点击激活 ${app.name} 并退出调度`;

      // 应用数学曲线函数计算出的空间矩阵
      card.style.transform = curveData.transform;
      card.style.zIndex = curveData.zIndex;
      card.dataset.baseTransform = curveData.transform;

      const depthText = isFar ? '向心远景' : '近景展开';

      card.innerHTML = `
        <div class="stage-card-titlebar">
          <div class="card-title-left">
            <span class="card-app-icon">${app.icon}</span>
            <span class="card-app-name">${app.name}</span>
          </div>
          <span class="card-depth-badge">${depthText}</span>
        </div>
        <div class="stage-card-body">
          ${app.renderMini()}
        </div>
      `;

      // 绑定卡片交互：鼠标点击任意卡片即可还原并激活该界面 (彻底阻止冒泡)
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        onStageCardClicked(card, app.id);
      });

      card.addEventListener('mouseenter', () => {
        clearSpatialFocus();
        for (let r = 0; r < SPATIAL_MATRIX.length; r++) {
          for (let c = 0; c < SPATIAL_MATRIX[r].length; c++) {
            if (SPATIAL_MATRIX[r][c] === app.id) {
              keyboardFocus = { row: r, col: c };
            }
          }
        }
        sfx.playPop();
      });

      rowEl.appendChild(card);
    });
  });
}

// 切换当前主窗口 App
function switchActiveApp(newAppId) {
  const activeWin = document.getElementById('desktopActiveWindow');

  if (state.activeAppId === newAppId) {
    if (activeWin && activeWin.classList.contains('window-minimized')) {
      activeWin.classList.remove('window-minimized');
    }
    return;
  }

  const oldAppId = state.activeAppId;
  state.activeAppId = newAppId;

  // 将旧的 App 移入侧边栏列表前部，新的 App 移出
  state.sidebarAppIds = state.sidebarAppIds.filter(id => id !== newAppId);
  if (!state.sidebarAppIds.includes(oldAppId)) {
    state.sidebarAppIds.unshift(oldAppId);
  }
  if (state.sidebarAppIds.length > 4) {
    state.sidebarAppIds.pop();
  }

  if (activeWin) {
    activeWin.classList.remove('window-minimized');
    activeWin.classList.add('window-switching');
    setTimeout(() => {
      activeWin.classList.remove('window-switching');
    }, 320);
  }

  renderActiveMainWindow();
  renderSidebarStacks();
}

// 触发 3D 舞台调度开关
function toggleStageMode(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !state.isStageMode;
  state.isStageMode = shouldOpen;

  const body = document.body;
  const stage3DViewport = document.getElementById('stage3DViewport');

  if (shouldOpen) {
    sfx.playSwoosh();
    body.classList.add('stage-mode-active');
    if (stage3DViewport) {
      stage3DViewport.setAttribute('aria-hidden', 'false');
    }
    // 同步键盘导航焦点到当前 activeApp 对应卡片
    for (let r = 0; r < SPATIAL_MATRIX.length; r++) {
      for (let c = 0; c < SPATIAL_MATRIX[r].length; c++) {
        if (SPATIAL_MATRIX[r][c] === state.activeAppId) {
          keyboardFocus = { row: r, col: c };
        }
      }
    }
    updateSpatialFocus(keyboardFocus.row, keyboardFocus.col);
  } else {
    sfx.playSwoosh();
    body.classList.remove('stage-mode-active');
    if (stage3DViewport) {
      stage3DViewport.setAttribute('aria-hidden', 'true');
    }
    clearSpatialFocus();
  }
}

// 点击 3D 舞台中的任意卡片 -> 顺畅平滑关闭调度并切换至该窗口
function onStageCardClicked(cardEl, appId) {
  sfx.playPop();
  
  // 增加激活扑向镜头动效
  cardEl.classList.add('activating');

  setTimeout(() => {
    switchActiveApp(appId);
    toggleStageMode(false);
    cardEl.classList.remove('activating');
  }, 220);
}

// 绑定各类交互手势与事件
function bindEvents() {
  const stageTriggerBtn = document.getElementById('stageTriggerBtn');
  const topbarEscBtn = document.getElementById('topbarEscBtn');
  const dockStageTrigger = document.getElementById('dockStageTrigger');
  const hotCornerBL = document.getElementById('hotCornerBL');
  const stageWorld = document.getElementById('stageWorld');

  // 1. 右下角圆角方形按钮点击触发
  if (stageTriggerBtn) {
    stageTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStageMode(true);
    });
  }

  // 2. 顶部栏左侧 ESC 退出按钮
  if (topbarEscBtn) {
    topbarEscBtn.addEventListener('click', () => {
      toggleStageMode(false);
    });
  }

  // 3. 底部 Dock 调度图标切换
  if (dockStageTrigger) {
    dockStageTrigger.addEventListener('click', () => {
      toggleStageMode();
    });
  }

  // 4. 左下角备用感应区滑入触发弹出
  if (hotCornerBL) {
    hotCornerBL.addEventListener('click', () => {
      toggleStageMode();
    });
  }

  // 顶部栏热门 UI 组件：明暗微动质感切换胶囊 (Day/Night Theme Toggle)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeModeLabel = document.getElementById('themeModeLabel');
  const biliSearchInput = document.getElementById('biliSearchInput');
  const biliLogoGroup = document.getElementById('biliLogoGroup');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playPop();
      const isLight = document.body.classList.toggle('light-theme');
      themeToggleBtn.setAttribute('aria-checked', String(isLight));
      if (themeModeLabel) {
        themeModeLabel.textContent = isLight ? '明昼白璃' : '暗夜流光';
      }
    });
  }

  if (biliLogoGroup) {
    biliLogoGroup.addEventListener('click', () => {
      sfx.playPop();
      switchActiveApp('dashboard');
    });
  }

  if (biliSearchInput) {
    biliSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const pills = document.querySelectorAll('.bili-channel-pill');
      pills.forEach(pill => {
        const id = pill.dataset.appId;
        const app = APPS[id];
        if (!app) return;
        const matches = !q || app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q) || id.includes(q);
        pill.style.display = matches ? 'inline-flex' : 'none';
      });
    });

    biliSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const visiblePills = Array.from(document.querySelectorAll('.bili-channel-pill')).filter(p => p.style.display !== 'none');
        if (visiblePills.length > 0) {
          sfx.playPop();
          switchActiveApp(visiblePills[0].dataset.appId);
          biliSearchInput.blur();
        }
      }
    });
  }

  const navLinks = document.querySelectorAll('.bili-link-item[data-filter]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.id === 'biliNavStageLink') return;
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      sfx.playPop();
    });
  });

  // 窗口红黄绿三色控制按钮 (极具真实感的窗口交互)
  const dotClose = document.querySelector('.ctrl-dot.dot-close');
  const dotMinimize = document.querySelector('.ctrl-dot.dot-minimize');
  const dotExpand = document.querySelector('.ctrl-dot.dot-expand');
  const desktopActiveWindow = document.getElementById('desktopActiveWindow');

  if (dotClose) {
    dotClose.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playPop();
      if (desktopActiveWindow) {
        desktopActiveWindow.classList.add('window-minimized');
      }
    });
  }

  if (dotMinimize) {
    dotMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playPop();
      if (desktopActiveWindow) {
        desktopActiveWindow.classList.add('window-minimized');
      }
    });
  }

  if (dotExpand) {
    dotExpand.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playPop();
      if (desktopActiveWindow) {
        desktopActiveWindow.classList.toggle('window-maximized');
      }
    });
  }

  // 5. 键盘快捷键 (ESC 退出调度，方向键 3D 空间网格导航，回车激活选择；Space 或 Option+Tab 唤出)
  window.addEventListener('keydown', (e) => {
    if (state.isStageMode) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        toggleStageMode(false);
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        updateSpatialFocus(keyboardFocus.row, keyboardFocus.col + 1);
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        updateSpatialFocus(keyboardFocus.row, keyboardFocus.col - 1);
      } else if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
        e.preventDefault();
        updateSpatialFocus(keyboardFocus.row + 1, keyboardFocus.col);
      } else if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
        e.preventDefault();
        updateSpatialFocus(keyboardFocus.row - 1, keyboardFocus.col);
      } else if (e.key === 'Enter' || e.code === 'Enter') {
        e.preventDefault();
        const targetAppId = SPATIAL_MATRIX[keyboardFocus.row][keyboardFocus.col];
        const targetCard = document.querySelector(`.stage-card[data-app-id="${targetAppId}"]`);
        if (targetCard && targetAppId) {
          onStageCardClicked(targetCard, targetAppId);
        }
      }
    } else {
      if (e.code === 'Space' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        toggleStageMode(true);
      }
    }
  });

  // 6. 3D 舞台模式下的立体鼠标视差微动 (增强美术景深立体感)
  window.addEventListener('mousemove', (e) => {
    // 检查鼠标是否在右下角 80px 范围内，确保在极端角落自动保持按钮高亮
    const isNearBR = (window.innerWidth - e.clientX <= 90) && (window.innerHeight - e.clientY <= 90);
    if (stageTriggerBtn && isNearBR && !state.isStageMode) {
      stageTriggerBtn.classList.add('force-visible');
    } else if (stageTriggerBtn && !isNearBR) {
      stageTriggerBtn.classList.remove('force-visible');
    }

    // 3D 模式下的空间倾斜微视差
    if (state.isStageMode && stageWorld) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX; // -1 to 1
      const deltaY = (e.clientY - centerY) / centerY; // -1 to 1

      const wingLeft = document.getElementById('wingLeft');
      const wingRight = document.getElementById('wingRight');

      if (wingLeft) {
        wingLeft.style.transform = `rotateY(${20 + deltaX * 2.5}deg) rotateX(${-deltaY * 2}deg)`;
      }
      if (wingRight) {
        wingRight.style.transform = `rotateY(${-20 + deltaX * 2.5}deg) rotateX(${-deltaY * 2}deg)`;
      }
    }
  });

  // 7. Dock 栏快捷启动对应 App
  const dockItems = document.querySelectorAll('.dock-item[data-app]');
  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const appId = item.dataset.app;
      if (appId) {
        sfx.playPop();
        switchActiveApp(appId);
        if (state.isStageMode) {
          toggleStageMode(false);
        }
      }
    });
  });

  // 8. 点击 3D 舞台纯色背景空白处退出调度
  const stage3DViewport = document.getElementById('stage3DViewport');
  if (stage3DViewport) {
    stage3DViewport.style.pointerEvents = 'auto';
    stage3DViewport.addEventListener('click', (e) => {
      if (!e.target.closest('.stage-card')) {
        toggleStageMode(false);
      }
    });
  }
}

// 顶部时间与日期更新 (居中显示，无苹果元素)
function startClock() {
  const clockEl = document.getElementById('topbarClock');
  if (!clockEl) return;

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function update() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const weekday = weekdays[d.getDay()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${month}月${date}日 ${weekday} ${hours}:${minutes}`;
  }
  update();
  setInterval(update, 10000);
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);

// 挂载调试与自动化接口
window.state = state;
window.toggleStageMode = toggleStageMode;
window.switchActiveApp = switchActiveApp;
window.updateSpatialFocus = updateSpatialFocus;
