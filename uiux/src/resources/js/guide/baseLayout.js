// ═══════════════════════════════════════════════════════════════
// baseLayout.js - SPA 레이아웃 관리
// 상단바, 사이드바 고정 + 메인 콘텐츠 동적 로드
// ═══════════════════════════════════════════════════════════════

// ┌─ ROUTING 설정 ─────────────────────────────────────────────┐
const ROUTES = {
  // 라우트 정의: path -> html 파일
  overview: { path: '/overview', file: 'pages/overview.html', label: '개요' },
  settings: { path: '/settings', file: 'pages/settings.html', label: '환경 설정' },
  quickStart: { path: '/quick-start', file: 'pages/quick-start.html', label: '빠른 시작' },
  grid: { path: '/grid', file: 'pages/grid-system.html', label: '그리드 시스템' },
  typography: { path: '/typography', file: 'pages/typography.html', label: '타이포그래피' },
  spacing: { path: '/spacing', file: 'pages/spacing.html', label: '간격 규칙' },
  tokenOverview: { path: '/tokens/overview', file: 'pages/token-overview.html', label: '토큰 개요' },
  colorTokens: { path: '/tokens/color', file: 'pages/color-tokens.html', label: '컬러 토큰' },
  typographyTokens: { path: '/tokens/typography', file: 'pages/typography-tokens.html', label: '타이포그래피 토큰' },
  sizing: { path: '/tokens/sizing', file: 'pages/sizing.html', label: '간격·사이즈' },
  icons: { path: '/icons/overview', file: 'pages/icons-overview.html', label: '아이콘 개요' },
  iconsUsage: { path: '/icons/usage', file: 'pages/icons-usage.html', label: '사용법' },
  iconsList: { path: '/icons/list', file: 'pages/icons-list.html', label: '아이콘 목록' },
  buttons: { path: '/components/buttons', file: 'pages/buttons.html', label: '버튼' },
  forms: { path: '/components/forms', file: 'pages/forms.html', label: '폼 요소' },
  table: { path: '/components/table', file: 'pages/table.html', label: '테이블' },
  kendoOverview: { path: '/kendo/overview', file: 'pages/kendo-overview.html', label: 'Kendo 개요' },
  kendoGrid: { path: '/kendo/grid', file: 'pages/kendo-grid.html', label: 'Grid' },
  kendoDropdown: { path: '/kendo/dropdown', file: 'pages/kendo-dropdown.html', label: 'DropDownList' },
  kendoDatepicker: { path: '/kendo/datepicker', file: 'pages/kendo-datepicker.html', label: 'DatePicker' },
  kendoWindow: { path: '/kendo/window', file: 'pages/kendo-window.html', label: 'Window' },
  kendoTreeview: { path: '/kendo/treeview', file: 'pages/kendo-treeview.html', label: 'TreeView' },
};

// 역방향 라우트 매핑 (path -> routeKey)
const PATH_TO_ROUTE = {};
Object.entries(ROUTES).forEach(([key, route]) => {
  PATH_TO_ROUTE[route.path] = key;
});
// └─────────────────────────────────────────────────────────────┘


// ┌─ SIDEBAR MENU 데이터 (라우팅과 연결) ──────────────────────┐
const SIDEBAR_MENU = [
  {
    group: '시작하기',
    items: [
      { label: '개요', path: ROUTES.overview.path },
      { label: '환경 설정', path: ROUTES.settings.path },
      { label: '빠른 시작', path: ROUTES.quickStart.path }
    ]
  },
  {
    group: '기본 원칙',
    items: [
      { label: '그리드 시스템', path: ROUTES.grid.path },
      { label: '타이포그래피', path: ROUTES.typography.path },
      { label: '간격 규칙', path: ROUTES.spacing.path }
    ]
  },
  {
    group: '디자인 토큰',
    items: [
      { label: '토큰 개요', path: ROUTES.tokenOverview.path },
      {
        label: '컬러 토큰',
        path: ROUTES.colorTokens.path,
        children: [
          { label: 'Primary Palette', path: ROUTES.colorTokens.path, sub: true },
          { label: 'Semantic Colors', path: ROUTES.colorTokens.path, sub: true },
          { label: 'Button Tokens', path: ROUTES.colorTokens.path, sub: true }
        ]
      },
      { label: '타이포그래피 토큰', path: ROUTES.typographyTokens.path },
      { label: '간격·사이즈', path: ROUTES.sizing.path }
    ]
  },
  {
    group: '아이콘 시스템',
    items: [
      { label: '아이콘 개요', path: ROUTES.icons.path },
      { label: '사용법', path: ROUTES.iconsUsage.path },
      { label: '아이콘 목록', path: ROUTES.iconsList.path }
    ]
  },
  {
    group: '컴포넌트',
    items: [
      { label: '버튼', path: ROUTES.buttons.path },
      { label: '폼 요소', path: ROUTES.forms.path },
      { label: '테이블', path: ROUTES.table.path }
    ]
  },
  {
    group: 'Kendo UI',
    items: [
      { label: 'Kendo 개요', path: ROUTES.kendoOverview.path, badge: 'K' },
      { label: 'Grid', path: ROUTES.kendoGrid.path },
      { label: 'DropDownList', path: ROUTES.kendoDropdown.path },
      { label: 'DatePicker', path: ROUTES.kendoDatepicker.path },
      { label: 'Window', path: ROUTES.kendoWindow.path },
      { label: 'TreeView', path: ROUTES.kendoTreeview.path }
    ]
  }
];
// └─────────────────────────────────────────────────────────────┘


// ┌─ ROUTER SPA 라우터 ─────────────────────────────────────────┐
const Router = {
  currentPath: '',
  isLoading: false,

  // 초기화
  init() {
    // 초기 경로 설정 (기본: /tokens/color)
    const initialPath = ROUTES.colorTokens.path;
    
    // 브라우저 히스토리 이벤트 처리
    window.addEventListener('popstate', e => {
      const path = e.state?.path || initialPath;
      this.navigate(path, false);
    });

    // 초기 페이지 로드
    this.navigate(initialPath, false);
  },

  // 페이지 네비게이션
  navigate(path, pushHistory = true) {
    if (this.currentPath === path) return;
    if (this.isLoading) return;

    this.isLoading = true;

    // 라우트 정보 가져오기
    const routeKey = PATH_TO_ROUTE[path];
    const route = routeKey ? ROUTES[routeKey] : null;

    if (!route) {
      console.error('Invalid route:', path);
      this.isLoading = false;
      return;
    }

    // HTML 파일 로드
    this._loadPage(route.file)
      .then(html => {
        // 메인 콘텐츠 영역에 삽입
        const mainEl = document.getElementById('main');
        if (mainEl) {
          mainEl.innerHTML = html;
        }

        // 현재 경로 업데이트
        this.currentPath = path;

        // 브라우저 히스토리 추가
        if (pushHistory) {
          window.history.pushState({ path }, route.label, path);
        }

        // 메뉴 활성화 상태 업데이트
        Sidebar.updateActiveMenu(path);

        // 사이드바 닫기 (모바일)
        if (window.innerWidth <= 1024) {
          Sidebar.close();
        }

        // 스크롤 맨 위로
        window.scrollTo(0, 0);

        // 페이지별 스크립트 실행
        this._executePageScripts();

        console.log('✓ Loaded:', route.label);
      })
      .catch(err => {
        console.error('Failed to load page:', err);
        const mainEl = document.getElementById('main');
        if (mainEl) {
          mainEl.innerHTML = `<div style="padding:40px; text-align:center;"><p>페이지를 로드할 수 없습니다.</p><p>${err.message}</p></div>`;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  },

  // HTML 파일 로드
  async _loadPage(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load: ${filePath} (${response.status})`);
    }
    return await response.text();
  },

  // 페이지별 스크립트 실행
  _executePageScripts() {
    // 페이지 로드 후 동적으로 스크립트 실행
    // 예: TOC 재구성, 코드 복사 버튼 재설정 등
    
    // TOC 재구성
    TOC.init();

    // 스크롤 이펙트 재설정
    UI._setupScrollEffects();
  }
};
// └─────────────────────────────────────────────────────────────┘


// ┌─ SIDEBAR 사이드바 관리 ─────────────────────────────────────┐
const Sidebar = {
  state: {
    isOpen: false,
  },
  
  // DOM 선택자
  selectors: {
    container: '#sidebar',
    overlay: '#sidebar-overlay',
    inner: '.sidebar-inner',
    navItems: '.nav-item',
  },

  // 초기화
  init() {
    this.render();
    this._setupEventListeners();
  },

  // 사이드바 렌더링
  render() {
    const inner = document.querySelector(this.selectors.inner);
    if (!inner) return;

    inner.innerHTML = SIDEBAR_MENU.map(group => this._createGroupHTML(group)).join('');
  },

  // 네비 그룹 HTML 생성
  _createGroupHTML(group) {
    const itemsHTML = group.items
      .map(item => this._createItemHTML(item))
      .join('');

    return `
      <div class="nav-group">
        <span class="nav-group-label">${group.group}</span>
        ${itemsHTML}
      </div>`;
  },

  // 네비 아이템 HTML 생성
  _createItemHTML(item) {
    const { label, path, badge = null, sub = false, children = null } = item;
    
    let html = `<div class="nav-item${sub ? ' nav-sub' : ''}" onclick="Router.navigate('${path}')">
      ${label}`;

    if (badge) {
      html += `<span class="nav-item-badge">${badge}</span>`;
    }

    html += `</div>`;

    if (children && children.length > 0) {
      html += children
        .map(child => this._createItemHTML(child))
        .join('');
    }

    return html;
  },

  // 활성화 메뉴 업데이트
  updateActiveMenu(path) {
    document.querySelectorAll(this.selectors.navItems).forEach(item => {
      item.classList.remove('active');
    });

    // 현재 경로와 일치하는 메뉴 찾기
    const activeItem = document.querySelector(
      `.nav-item[onclick*="'${path}'"]`
    );
    if (activeItem) {
      activeItem.classList.add('active');
      // 부모 그룹의 첫 번째 아이템도 활성화 (시각적 효과)
      const parent = activeItem.parentElement?.querySelector('.nav-item:first-child');
      if (parent && parent !== activeItem) {
        parent.classList.add('active');
      }
    }
  },

  // 토글 열기/닫기
  toggle() {
    this.state.isOpen ? this.close() : this.open();
  },

  // 사이드바 열기
  open() {
    this.state.isOpen = true;
    document.querySelector(this.selectors.container)?.classList.add('open');
    document.querySelector(this.selectors.overlay)?.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  // 사이드바 닫기
  close() {
    this.state.isOpen = false;
    document.querySelector(this.selectors.container)?.classList.remove('open');
    document.querySelector(this.selectors.overlay)?.classList.remove('show');
    document.body.style.overflow = '';
  },

  // 이벤트 리스너 등록
  _setupEventListeners() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        this.close();
      }
    });

    const overlay = document.querySelector(this.selectors.overlay);
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }
  },
};
// └─────────────────────────────────────────────────────────────┘


// ┌─ SEARCH 검색 기능 ─────────────────────────────────────────┐
const Search = {
  state: {
    isOpen: false,
  },

  selectors: {
    modal: '#search-modal',
    input: '#search-input',
    results: '#search-results',
  },

  items: [
    { group: '시작하기', label: '개요', path: ROUTES.overview.path },
    { group: '시작하기', label: '환경 설정', path: ROUTES.settings.path },
    { group: '디자인 토큰', label: '컬러 토큰', path: ROUTES.colorTokens.path },
    { group: '디자인 토큰', label: '타이포그래피 토큰', path: ROUTES.typographyTokens.path },
    { group: '디자인 토큰', label: '간격·사이즈', path: ROUTES.sizing.path },
    { group: '아이콘 시스템', label: '아이콘 개요', path: ROUTES.icons.path },
    { group: '아이콘 시스템', label: '사용법', path: ROUTES.iconsUsage.path },
    { group: 'Kendo UI', label: 'Grid', path: ROUTES.kendoGrid.path },
    { group: 'Kendo UI', label: 'DropDownList', path: ROUTES.kendoDropdown.path },
    { group: 'Kendo UI', label: 'DatePicker', path: ROUTES.kendoDatepicker.path },
    { group: 'Kendo UI', label: 'Window', path: ROUTES.kendoWindow.path },
  ],

  init() {
    this._setupEventListeners();
  },

  open() {
    this.state.isOpen = true;
    document.querySelector(this.selectors.modal)?.classList.add('open');
    setTimeout(() => {
      document.querySelector(this.selectors.input)?.focus();
    }, 50);
    this.render('');
  },

  close() {
    this.state.isOpen = false;
    document.querySelector(this.selectors.modal)?.classList.remove('open');
    document.querySelector(this.selectors.input).value = '';
  },

  render(query) {
    const resultsEl = document.querySelector(this.selectors.results);
    if (!resultsEl) return;

    const filtered = query
      ? this.items.filter(item =>
          item.label.includes(query) || item.group.includes(query)
        )
      : this.items.slice(0, 6);

    if (!filtered.length) {
      resultsEl.innerHTML = '<div class="search-empty">검색 결과가 없습니다</div>';
      return;
    }

    resultsEl.innerHTML = filtered
      .map(item => this._createSearchItem(item))
      .join('');
  },

  _createSearchItem(item) {
    return `
      <div class="search-item" onclick="Router.navigate('${item.path}'); Search.close();">
        <div class="search-item-icon">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="M2 1.5h7a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2"/>
            <path d="M2 12.5V1.5"/>
          </svg>
        </div>
        <div>
          <div class="search-item-group">${item.group}</div>
          <div class="search-item-label">${item.label}</div>
        </div>
      </div>`;
  },

  _setupEventListeners() {
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });

    const modal = document.querySelector(this.selectors.modal);
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          this.close();
        }
      });
    }

    const input = document.querySelector(this.selectors.input);
    if (input) {
      input.addEventListener('input', e => {
        this.render(e.target.value);
      });
    }
  },
};
// └─────────────────────────────────────────────────────────────┘


// ┌─ UI 일반 UI 기능 ──────────────────────────────────────────┐
const UI = {
  copyCode(btn, id) {
    const text = document.getElementById(id)?.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.textContent;
      btn.textContent = 'copied ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 1800);
    }).catch(err => {
      console.error('복사 실패:', err);
    });
  },

  scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  },

  init() {
    this._setupScrollEffects();
    this._setupSearchBtnVisibility();
  },

  _setupScrollEffects() {
    const topbar = document.querySelector('#topbar');
    if (!topbar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      topbar.style.borderBottomColor =
        scrollTop > 4 ? 'var(--rule)' : 'transparent';
    });
  },

  _setupSearchBtnVisibility() {
    const updateSearchBtn = () => {
      const btn = document.getElementById('search-btn-mobile');
      if (btn) {
        btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
      }
    };

    window.addEventListener('resize', updateSearchBtn);
    updateSearchBtn();
  },
};
// └─────────────────────────────────────────────────────────────┘


// ┌─ TOC 목차 관리 ────────────────────────────────────────────┐
const TOC = {
  sections: ['s-primary', 's-semantic', 's-button', 's-changelog'],
  observer: null,

  init() {
    this._setupObserver();
  },

  _setupObserver() {
    // 기존 observer 제거
    if (this.observer) {
      this.observer.disconnect();
    }

    const tocLinks = document.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(link => link.classList.remove('active'));
            const idx = this.sections.indexOf(entry.target.id);
            if (idx >= 0 && tocLinks[idx * 2]) {
              tocLinks[idx * 2].classList.add('active');
            }
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    this.sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        this.observer.observe(el);
      }
    });
  },
};
// └─────────────────────────────────────────────────────────────┘


// ┌─ 전역 래퍼 함수 ──────────────────────────────────────────┐
function toggleSidebar() {
  Sidebar.toggle();
}

function closeSidebar() {
  Sidebar.close();
}

function navClick(el) {
  Sidebar.handleNavClick(el);
}

function openSearch() {
  Search.open();
}

function closeSearch() {
  Search.close();
}

function doSearch(q) {
  Search.render(q);
}

function copyCode(btn, id) {
  UI.copyCode(btn, id);
}

function scrollTo(id) {
  UI.scrollTo(id);
}
// └─────────────────────────────────────────────────────────────┘


// ┌─ 초기화 ──────────────────────────────────────────────────┐
function initLayout() {
  Sidebar.init();      // 사이드바 렌더링
  Search.init();       // 검색 기능
  UI.init();           // UI 효과
  Router.init();       // SPA 라우터 초기화 (반드시 마지막)
  console.log('✓ baseLayout initialized (SPA mode)');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}
// └─────────────────────────────────────────────────────────────┘
