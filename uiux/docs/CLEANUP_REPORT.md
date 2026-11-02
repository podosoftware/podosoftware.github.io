# uiux 정리 리포트 (2026-11-02)

- 범위: 1~5 는 **uiux 폴더만** 정리했습니다. `v1/`, `v2/` 정리는 아래 6 에 따로 적었습니다.
- 커밋/푸시 하지 않았습니다. 삭제한 파일은 모두 git 에 기록되어 있어 아래 명령으로 되돌릴 수 있습니다.

```bash
git restore --source=HEAD -- uiux/   # uiux 전체를 정리 전 상태로
git status                           # 변경 내역 확인
```

## 1. 삭제 — 중복 파일

| 파일 | 중복 근거 |
|------|-----------|
| `src/resources/js/kendo/kendo.all.min.js` | `js/kendo/2025.1.211/kendo.all.min.js` 와 바이트 동일 (MD5 2D98B9F0F2) |
| `src/resources/js/kendo/kendo.all.min.js.map` | 위 파일의 소스맵 (본 파일 삭제로 의미 없음) |
| `src/resources/js/kendo/telerik-license.js` | `js/kendo/2025.1.211/telerik-license.js` 와 바이트 동일 (MD5 9558D6113D) |
| `src/resources/js/etc/_kendoComponentUtil.js` | `kendoComponentUtil.js` 최적화 이전 백업본 (참조 0건) |
| `src/resources/files/kendoComponentUtil_optimized.js` | `kendoComponentUtil.js` 와 공백·네임스페이스(`kbrainc`→`podo`)만 다른 이전본 |
| `src/resources/js/guide/baseLayout_fixed.js` | `baseLayout.js` 와 1줄 차이, 참조 0건 |
| `src/main/sample/guide-concept-b.html` | `guide-concept-b-responsive.html` 의 이전(비반응형) 버전 |

## 2. 삭제 — React 로 대체된 파일 (내용은 새 페이지로 이전)

| 파일 | 대체 |
|------|------|
| `src/includes/*.html` (head, header, nav, footer, scripts) | `src/layout/*.jsx` |
| `src/main/index.html`, `src/main/pages/*.html` (22개) | `src/pages/**` + `src/routes.jsx` |
| `src/resources/js/guide/baseLayout.js` (SPA 라우터) | react-router `HashRouter` |
| `src/resources/css/style.css`, `front_tokens.css` | `src/styles/*.css` (가이드 디자인) |
| `src/resources/css/admin/tokens.css` | `public/admin/css/tokens.css` (Legacy Alias 추가) |
| `gulpfile.js`, `MIGRATION_GUIDE.md`, `QUICK_START.md`, `SETUP_COMPLETE.md` | Vite + `README.md` |

## 3. 이동 — 유지 (중복 아님)

| 이전 위치 | 새 위치 | 비고 |
|-----------|---------|------|
| `src/resources/js/etc/*.js` (8개) | `public/admin/js/` | 실사용 공통 스크립트 |
| `src/resources/js/kendo/` 나머지 | `vendor/kendo/` | `kendo.custom.min.js` 는 2025 폴더 파일과 빌드가 달라 보존 |
| `src/resources/js/jquery/` | `vendor/jquery/` | 루트 `jquery-3.7.1.min.js` 와 버전이 달라 보존 |
| `src/resources/js/scrollbar/` | `vendor/scrollbar/` | |
| `src/resources/files/*.md` | `docs/` | 문서 안의 `kendoComponentUtil_optimized.js` 는 현재 `public/admin/js/kendoComponentUtil.js` 입니다 |
| `src/main/sample/*.html` (3개) | `docs/design-samples/` | 디자인 시안 참고용 |

## 4. 새로 만든 것

- React 가이드 사이트 (`src/`), 4칸 들여쓰기 `.editorconfig`
- `public/admin/css/tokens.css` — 관리자 토큰 단일 소스 + 옛 변수명 호환
- `scripts/tokenize-admin-css.mjs` — 관리자 CSS 하드코딩 HEX/옛 변수명 → 토큰 (원본 미수정)
- `src/icons/adminIcons.js` + `scripts/build-icons.mjs` — 관리자 공통 SVG 아이콘 57종
  - 업무 사이트용: `icons.css`, `admin-icon.js`(ES5, `PodoIcon.html()` / `$(el).adIcon()`), sprite, 개별 svg
  - 가이드 내부용: React `<AdminIcon>`
- `src/snippets/admin/*.html` — `v1/admin/code` 실사용 마크업 사본 (이미지 경로 `../images/` → `/images/`, 줄바꿈 LF)

### 토큰화 검증 결과

변환본의 토큰을 다시 값으로 풀어 원본과 한 글자씩 대조했습니다. 치환된 곳은 모두 원래 값과 같고, 나머지는 원본과 동일합니다.

| 파일 | HEX → 토큰 | 옛 변수명 → 새 이름 | 결과 |
|------|-----------:|--------------------:|------|
| common.css | 53 | 7 | 일치 |
| admin.css | 444 | 185 | 일치 |
| sub.css | 836 | 0 | 일치 |

## 5. 저장소 루트의 중복 — 확인 필요 (수정하지 않음)

| 항목 | 측정값 | 권장 |
|------|--------|------|
| `css/admin/admin.css` ↔ `css/admin/sub.css` | admin.css 규칙 1,490개 중 **1,251개가 sub.css 와 완전히 동일** | 두 파일을 함께 로드하는 화면이 있는지 확인 후, sub.css 에서 공통 규칙 제거 또는 admin.css 로 통합 |
| `css/admin/common.css` ↔ `css/admin/sub.css` | common.css 규칙 131개 중 92개 동일 | 위와 같음 |
| `css/admin/backup/` (3개) | 참조 0건, 현재 파일과 내용이 다른 옛 버전 | 삭제 후보 |
| `css/kendo/2022.1.119`, `2023.1.314` | 2023 폴더는 7곳, 2022 kendo.all 은 191곳에서 참조 (v1/v2 옛 화면) | 옛 화면 정리 시 함께 정리 |
| `sub.css` 의 미정의 변수 | `--primary`, `--border-gray-dd` 등 20여 개 (상세: `admin-css-tokenize-report.md`) | 현재 브라우저에서 무시되는 값 — 의도 확인 필요 |

CSS 중복 규칙을 지우면 **로드 순서에 따라 결과가 달라질 수 있어**(뒤 파일이 앞 파일을 덮어쓰는 구조) 이번 작업에서는
자동 정리하지 않았습니다.

## 6. v1 · v2 정리 (관리자 가이드 → uiux 로 대체)

관리자 관련 화면과 다시 설치할 수 있는 파일만 지웠습니다. 사용자 사이트(html2), podosw, kendo(사용자), pdf, web, test,
v2 전용(웹 접근성) 가이드는 아직 uiux 로 옮기지 않아 **남겨 두었습니다.** — 삭제 파일 7,193개, 약 220MB

| 삭제 | 이유 |
|------|------|
| `v1/admin/`, `v1/src/admin/`, `v1/gulpfile-admin.js` | 관리자 가이드 — uiux 로 대체 (실사용 마크업은 `uiux/src/snippets/admin` 에 이미 복사) |
| `v1/kendo/admin_kendoUi*.html`, `v1/src/kendo/admin_kendoUi*.html` (각 12개) | Kendo 가이드 중 관리자 메뉴 — uiux Kendo 페이지로 대체 |
| `v1/guide/` 캡처 이미지 102개 | 남은 화면 어디에서도 쓰지 않음 (`273.png`, `logo.png`, `table_m_01.png` 는 사용 중이라 남김) |
| `v1/node_modules/`, `v2/node_modules/`, `v2/package-lock.json` | `npm install` 로 다시 설치 가능 |
| `v2/.storybook/`, `v2/storybook/`, `v2/src/stories/` | 이전 관리자 가이드 시도(Storybook) — 링크 없음, uiux 로 대체 |
| `v2/src/admin`, `kendo`, `podosw`, `test`, `web` | `v1/src` 와 같은 중복본 — v2 빌드(`gulpfile-html.js`)가 쓰지 않음 |
| `v2/public/kendo/` (2022 · 2023 · 2025) | 참조 0건 — 루트 `css/`, `js/kendo` 를 사용 |

함께 고친 곳

- `v1/kendo/*.html`, `v1/src/kendo/header.html`: 지운 관리자 Kendo 페이지로 가는 메뉴(Admin) 제거
- `v1/index.html`: "관리자" 링크 제거
- `v1/package.json`: `admin` 스크립트 제거 / `v2/package.json`: 없는 gulpfile·Storybook 스크립트와 Storybook 의존성 제거
- 루트 `.gitignore`: `node_modules/` 추가 (다시 커밋되지 않도록)

되돌리기

```bash
git restore -- v1 v2 .gitignore   # 커밋 전이면 v1, v2 전체를 정리 전 상태로
```
