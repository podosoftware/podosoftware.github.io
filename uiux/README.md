# Podo Publisher Guide (uiux)

관리자 화면 퍼블리싱 가이드 — React + Vite, 디자인은 **Concept B 화이트 에디토리얼**.

```bash
npm install      # 최초 1회 (Node.js 20 이상)
npm run dev      # http://localhost:5173
npm run build    # dist/ 정적 빌드 (HashRouter 라 어느 경로에 올려도 동작)

npm run tokens   # css/admin/*.css → public/admin/css/ 토큰화 + docs/admin-css-tokenize-report.md
npm run icons    # src/icons/adminIcons.js → public/admin/icons/*, css/icons.css, js/admin-icon.js
npm run admin    # tokens + icons
```

> Windows PowerShell 에서 `npm` 실행이 막히면(`npm.ps1` 실행 정책) `npm.cmd run dev` 로 실행하세요.

## 폴더 구조

```
uiux/
├── public/admin/            # 관리자 화면에 배포하는 결과물
│   ├── css/tokens.css       # ★ 토큰 단일 소스 (직접 수정) — root_admin.css 대체
│   ├── css/common.css       # 자동 생성 (npm run tokens) — 직접 수정 금지
│   ├── css/admin.css        # 자동 생성
│   ├── css/sub.css          # 자동 생성
│   ├── css/icons.css        # 자동 생성 (npm run icons)
│   ├── icons/sprite.svg     # 자동 생성
│   ├── icons/svg/*.svg      # 자동 생성
│   ├── js/admin-icon.js     # 자동 생성 (npm run icons) — 아이콘 JS/jQuery 헬퍼
│   └── js/                  # 공통 스크립트 (kendoComponentUtil.js 등, 기존 resources/js/etc)
├── vendor/                  # 기존 uiux 전용 외부 라이브러리 사본 (가이드는 사용하지 않음)
├── scripts/                 # tokenize-admin-css.mjs, build-icons.mjs
├── docs/                    # 리포트, Kendo 2025 호환성 문서, 디자인 시안
├── src/
│   ├── routes.jsx           # ★ 메뉴 + 페이지 등록 (페이지 추가 시 여기만 수정)
│   ├── layout/              # 상단바, 사이드바, 목차(TOC), 하단 내비, 검색
│   ├── components/doc/      # DocPage, Section, Example, CodeBlock, Callout …
│   ├── icons/               # ★ adminIcons.js (아이콘 단일 소스), AdminIcon.jsx
│   ├── snippets/admin/      # 실사용 마크업(.html) — 원본이던 v1/admin/code 는 삭제됨 (여기가 원본)
│   ├── pages/               # 문서 페이지
│   ├── hooks/ utils/ config/ context/
│   └── styles/              # 가이드 디자인 (guide-tokens → base → layout → doc → components → responsive)
└── .editorconfig            # 들여쓰기 공백 4칸
```

## 역할 구분

- **가이드 사이트 화면** (메뉴, 검색, 목차, 코드 블록, 가이드 UI 아이콘) → React
- **예제 / 업무 사이트에 쓰는 코드** (마크업, Kendo 초기화, 아이콘 헬퍼) → HTML + jQuery + Kendo UI 2025
  - 미리보기는 iframe 안에서 업무 사이트와 같은 CSS·스크립트로 예제 코드를 그대로 실행합니다.

## 핵심 원칙

| 항목 | 단일 소스 | 자동으로 따라오는 것 |
|------|-----------|----------------------|
| 메뉴 / 페이지 | `src/routes.jsx` | 사이드바, 검색, 브레드크럼, 이전·다음, 라우트 |
| 관리자 토큰 | `public/admin/css/tokens.css` | 토큰 페이지 화면, `npm run tokens` 치환 기준 |
| 관리자 아이콘 | `src/icons/adminIcons.js` | icons.css, admin-icon.js, sprite.svg, 개별 svg, 아이콘 페이지, 가이드 내부용 `<AdminIcon>` |
| 실사용 마크업 | `src/snippets/admin/*.html` | 실시간 미리보기 + 코드 보기 |
| 목차(TOC) | 페이지의 `<Section id title>` | 우측 "이 페이지" |

## 실시간 미리보기

`<Example>` 은 iframe 안에 **실제 관리자 화면과 같은 순서**로 CSS 를 로드해 그립니다.

```
reset2.css → base.css → tokens.css → kendo 2025.1.211 bootstrap-3.css → pd_kendo.css → util.css → common.css → admin.css → button.css → icons.css
```

`/css`, `/js`, `/images` 는 저장소 루트 원본을 그대로 씁니다. (개발 서버: `vite.config.js` 의 `serveRepoAssets`,
운영: GitHub Pages 에서는 저장소 루트 = 사이트 루트) — 복사본을 두지 않아 중복 파일이 생기지 않습니다.

`kendo` 예제는 여기에 더해 Kendo 2025 스크립트와 `public/admin/js/kendoComponentUtil.js` 를 로드하고,
`kendoUi.init()` / `kendoUi.setSvgIcons({ url })` 를 먼저 실행합니다. (`src/config/assets.js` 의 `PREVIEW_KENDO_SETUP`)

## Kendo 위젯 / 아이콘

- 위젯은 `$(...).kendoXxx()` 대신 `kendoComponentUtil.js` 의 `kendoUi.createXxx(선택자, 옵션)` 로 만듭니다.
- Kendo 2025 는 아이콘을 인라인 SVG 로 그려 CSS 아이콘이 먹지 않습니다.
  `kendoUi.setSvgIcons({ url: '/images/admin/icons/sprite.svg' })` 가 스프라이트를 불러와
  `kendo.ui.svgIcons` 등록값을 공통 아이콘으로 바꿉니다. (Kendo 원본 파일 수정 없음)
- 대응표·`map` 옵션은 가이드의 **Kendo 개요 › 아이콘 (SVG 교체)** 참고.

## 정리 내역

[docs/CLEANUP_REPORT.md](docs/CLEANUP_REPORT.md) 참고.
