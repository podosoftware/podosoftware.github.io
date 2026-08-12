# UIUX Guide - MPA with gulp-file-include

SPA 형식에서 MPA(Multi-Page Application) 형식으로 변경되었습니다.  
Gulp의 `gulp-file-include`를 사용하여 공통 요소(head, header, nav, footer)를 관리합니다.

## 📁 폴더 구조

```
uiux/
├── src/
│   ├── main/                    # 소스 HTML 파일들
│   │   ├── index.html          # (삭제됨 - 더 이상 필요 없음)
│   │   ├── pages/              # 각 페이지 파일들
│   │   │   ├── overview.html
│   │   │   ├── quick-start.html
│   │   │   ├── settings.html
│   │   │   └── ... (기타 페이지)
│   │   └── sample/
│   ├── includes/               # 공통 요소 (새 폴더)
│   │   ├── head.html           # HTML head 부분
│   │   ├── header.html         # 상단 바
│   │   ├── nav.html            # 사이드바/메뉴
│   │   ├── footer.html         # 푸터
│   │   └── scripts.html        # 공통 스크립트
│   └── resources/
│       ├── css/
│       ├── js/
│       ├── fonts/
│       ├── images/
│       └── files/
├── dist/                        # 빌드된 파일 (자동 생성)
├── package.json                 # 새로 추가됨
├── gulpfile.js                  # 새로 추가됨
└── README.md                    # 이 파일
```

## 🚀 설치 및 빌드

### 1. 의존성 설치
```bash
npm install
```

### 2. HTML 빌드 (개발)
```bash
npm run watch
```

### 3. 한 번만 빌드
```bash
npm run build
```

빌드 후 `dist/` 폴더에 완성된 HTML 파일들이 생성됩니다.

## 🛠️ 새 페이지 작성 방법

각 페이지는 다음과 같은 구조를 가져야 합니다:

```html
@@include('./../../includes/head.html', { "title": "페이지 제목 - Podo Publisher Guide" })
@@include('./../../includes/header.html')
@@include('./../../includes/nav.html')

<!-- ═══ 메인 콘텐츠 ═══ -->
<div id="layout">
  <div id="main">
    <!-- 페이지 콘텐츠 -->
  </div>
</div>

@@include('./../../includes/footer.html')
@@include('./../../includes/scripts.html')
</body>
</html>
```

### 페이지 간 링크 방법
```html
<!-- a 태그로 직접 링크 (MPA) -->
<a href="overview.html">개요</a>
<a href="quick-start.html">빠른 시작</a>
```

## 📝 공통 요소 수정

### head.html
- 폰트, CSS, 공통 메타 태그 관리
- `@@title` 변수로 각 페이지 제목 설정

### header.html
- 상단 바 (검색, 메뉴, 테마 토글)
- 모든 페이지에 동일

### nav.html
- 사이드바, 메뉴, 모바일 하단 네비

### scripts.html
- 공통 JavaScript 함수 (검색, 사이드바 토글, UI 유틸)

## 🗑️ 제거된 항목

- ❌ `src/main/index.html` - SPA 진입점으로 더 이상 필요 없음
- ❌ `src/resources/js/guide/baseLayout.js` - SPA 라우터 (MPA는 필요 없음)

## ✅ 변경 사항 요약

| 항목 | 기존 (SPA) | 현재 (MPA) |
|------|----------|----------|
| 라우팅 | JS 라우터 | 일반 링크 |
| 페이지 관리 | 동적 로드 | 정적 파일 |
| 빌드 | 필요 없음 | Gulp 빌드 필수 |
| 공통 요소 | baseLayout.js | include |
| 성능 | 초기 로드 느림 | 빠른 로드 |
| SEO | 약함 | 강함 |

## 💡 사용 팁

- **개발 중**: `npm run watch` 실행하면 파일 변경 시 자동 빌드
- **배포**: `npm run build`로 최종 빌드 후 `dist/` 폴더 배포
- **상대 경로**: 모든 리소스는 `../resources/` 상대 경로 사용

## 📚 참고

- [gulp-file-include 문서](https://github.com/coderhaoxin/gulp-file-include)
- Gulp v4.0+과 호환
