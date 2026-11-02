/**
 * 메뉴 + 라우트 설정 — 페이지를 추가할 때 수정하는 곳은 여기 하나입니다.
 *
 * 1. src/pages/… 에 페이지 컴포넌트를 만든다.
 * 2. 아래 NAV_GROUPS 의 알맞은 그룹에 { path, title, component } 를 추가한다.
 *    → 좌측 메뉴, 검색, 브레드크럼, 이전/다음 버튼이 자동으로 반영됩니다.
 *
 * keywords : 검색창에서 제목 외에 걸리게 할 단어 (선택)
 * badge    : 메뉴 오른쪽 작은 표시 (선택)
 */
import OverviewPage from './pages/getting-started/OverviewPage.jsx';
import SetupPage from './pages/getting-started/SetupPage.jsx';
import TokenOverviewPage from './pages/tokens/TokenOverviewPage.jsx';
import ColorTokensPage from './pages/tokens/ColorTokensPage.jsx';
import TypographyTokensPage from './pages/tokens/TypographyTokensPage.jsx';
import LayoutTokensPage from './pages/tokens/LayoutTokensPage.jsx';
import AdminIconsPage from './pages/icons/AdminIconsPage.jsx';
import ButtonsPage from './pages/components/ButtonsPage.jsx';
import FormsPage from './pages/components/FormsPage.jsx';
import SearchAreaPage from './pages/components/SearchAreaPage.jsx';
import PopupTabPage from './pages/components/PopupTabPage.jsx';
import TipsPage from './pages/components/TipsPage.jsx';
import BadgesPage from './pages/components/BadgesPage.jsx';
import UtilitiesPage from './pages/components/UtilitiesPage.jsx';
import KendoOverviewPage from './pages/kendo/KendoOverviewPage.jsx';
import KendoWidgetsPage from './pages/kendo/KendoWidgetsPage.jsx';

export const GUIDE_VERSION = 'v4.0';

export const HOME_PATH = '/overview';

export const NAV_GROUPS = [
    {
        label: '시작하기',
        items: [
            { path: '/overview', title: '개요', component: OverviewPage, keywords: ['소개', 'intro'] },
            { path: '/setup', title: '환경 설정', component: SetupPage, keywords: ['설치', 'npm', 'css 로드', '폴더'] },
        ],
    },
    {
        label: '디자인 토큰',
        items: [
            { path: '/tokens', title: '토큰 개요', component: TokenOverviewPage, keywords: ['token', 'legacy', '변수'] },
            { path: '/tokens/color', title: '컬러 토큰', component: ColorTokensPage, keywords: ['color', 'primary', '색상'] },
            { path: '/tokens/typography', title: '타이포그래피 토큰', component: TypographyTokensPage, keywords: ['font', '폰트'] },
            { path: '/tokens/layout', title: '레이아웃·폼 토큰', component: LayoutTokensPage, keywords: ['input', 'scroll', '높이'] },
        ],
    },
    {
        label: '아이콘',
        items: [
            {
                path: '/icons',
                title: '관리자 아이콘',
                component: AdminIconsPage,
                badge: 'SVG',
                keywords: ['icon', 'svg', 'sprite', 'ad-icon'],
            },
        ],
    },
    {
        label: '컴포넌트',
        items: [
            { path: '/components/buttons', title: '버튼', component: ButtonsPage, keywords: ['button', 'btn'] },
            { path: '/components/forms', title: '입력 폼', component: FormsPage, keywords: ['input', 'radio', 'checkbox', 'textarea'] },
            { path: '/components/search-area', title: '검색 영역', component: SearchAreaPage, keywords: ['search', '검색폼'] },
            { path: '/components/popup-tab', title: '팝업·탭', component: PopupTabPage, keywords: ['window', 'popup', 'tabstrip'] },
            { path: '/components/tips', title: '팁·안내', component: TipsPage, keywords: ['tip', 'tooltip', 'info'] },
            { path: '/components/badges', title: '뱃지·현황', component: BadgesPage, keywords: ['badge', 'tag'] },
            { path: '/components/utilities', title: '유틸리티', component: UtilitiesPage, keywords: ['util', 'clamp', 'no data'] },
        ],
    },
    {
        label: 'Kendo UI',
        items: [
            { path: '/kendo', title: 'Kendo 개요', component: KendoOverviewPage, badge: '2025', keywords: ['kendo', 'telerik'] },
            {
                path: '/kendo/widgets',
                title: '위젯 예제',
                component: KendoWidgetsPage,
                keywords: ['grid', 'datepicker', 'dropdownlist', 'numeric'],
            },
        ],
    },
];

/** 메뉴를 한 줄로 편 목록 (검색, 이전/다음 계산용) */
export const FLAT_ROUTES = NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({ ...item, groupLabel: group.label })),
);

/** 현재 경로의 메뉴 정보 + 이전/다음 페이지 */
export function getPageMeta(pathname) {
    const index = FLAT_ROUTES.findIndex((route) => route.path === pathname);

    if (index === -1) {
        return { current: null, previous: null, next: null };
    }

    return {
        current: FLAT_ROUTES[index],
        previous: FLAT_ROUTES[index - 1] || null,
        next: FLAT_ROUTES[index + 1] || null,
    };
}
