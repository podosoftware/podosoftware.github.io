/**
 * 리소스 경로 한 곳 관리
 *
 * BASE_URL
 *   vite.config.js 의 base('./') 값. 개발/운영 어디에 배포해도 상대 경로로 동작합니다.
 *
 * ADMIN_ASSET  : 이 가이드가 "관리"하는 관리자 리소스 (uiux/public/admin)
 * REPO_ASSET   : 저장소 루트의 실사용 리소스 (/css, /js, /images)
 *                 → 복사본을 두지 않고 원본을 그대로 참조합니다. (vite.config.js 참고)
 */
const BASE_URL = import.meta.env.BASE_URL;

export const KENDO_VERSION = '2025.1.211';

export const ADMIN_ASSET = {
    baseCss: `${BASE_URL}admin/css/base.css`,
    tokensCss: `${BASE_URL}admin/css/tokens.css`,
    commonCss: `${BASE_URL}admin/css/common.css`,
    adminCss: `${BASE_URL}admin/css/admin.css`,
    iconsCss: `${BASE_URL}admin/css/icons.css`,
    buttonCss: `${BASE_URL}admin/css/button.css`,
    iconJs: `${BASE_URL}admin/js/admin-icon.js`,
    iconSprite: `${BASE_URL}admin/icons/sprite.svg`,
    iconSvgDir: `${BASE_URL}admin/icons/svg/`,
    kendoUtilJs: `${BASE_URL}admin/js/kendoComponentUtil.js`,
};

export const REPO_ASSET = {
    resetCss: '/css/reset2.css',
    kendoThemeCss: `/css/kendo/${KENDO_VERSION}/bootstrap-3.css`,
    pdKendoCss: '/css/pd_kendo.css',
    utilCss: '/css/util.css',
    jquery: '/js/jquery/jquery-3.7.1.min.js',
    kendoJs: `/js/kendo/${KENDO_VERSION}/kendo.all.min.js`,
    kendoLicense: `/js/kendo/${KENDO_VERSION}/telerik-license.js`,
    kendoCulture: '/js/kendo/2022.1.119/cultures/kendo.culture.ko-KR.min.js',
    kendoMessages: '/js/kendo/kendo.messages.ko-KR.js',
};

/**
 * 실시간 미리보기(iframe)에 넣는 CSS — 실제 관리자 화면 head 와 같은 순서
 * (root_admin.css 자리를 tokens.css 가 대신합니다)
 */
export const PREVIEW_STYLESHEETS = [
    REPO_ASSET.resetCss,
    ADMIN_ASSET.baseCss,
    ADMIN_ASSET.tokensCss,
    REPO_ASSET.kendoThemeCss,
    REPO_ASSET.pdKendoCss,
    REPO_ASSET.utilCss,
    ADMIN_ASSET.commonCss,
    ADMIN_ASSET.adminCss,
    ADMIN_ASSET.buttonCss,
    ADMIN_ASSET.iconsCss,
];

/** jQuery 예제에 넣는 스크립트 (jQuery + 공통 아이콘 헬퍼) */
export const PREVIEW_JQUERY_SCRIPTS = [
    REPO_ASSET.jquery,
    ADMIN_ASSET.iconJs,
];

/**
 * Kendo 위젯이 필요한 미리보기에 추가로 넣는 스크립트 (PREVIEW_JQUERY_SCRIPTS 다음, 순서 중요)
 * 마지막 kendoComponentUtil.js 가 kendoUi.createXxx() 와 아이콘 교체(setSvgIcons)를 제공합니다.
 */
export const PREVIEW_KENDO_SCRIPTS = [
    REPO_ASSET.kendoJs,
    REPO_ASSET.kendoLicense,
    REPO_ASSET.kendoCulture,
    REPO_ASSET.kendoMessages,
    ADMIN_ASSET.kendoUtilJs,
];

/**
 * Kendo 미리보기 공통 초기화 — 실제 업무 화면의 공통 head 에서 한 번 실행하는 코드와 같습니다.
 * (예제 코드에는 이 줄을 반복해서 쓰지 않습니다)
 */
export const PREVIEW_KENDO_SETUP = `kendoUi.init();
kendoUi.setSvgIcons({ url: '${ADMIN_ASSET.iconSprite}' });`;
