# SPA → MPA 마이그레이션 가이드

## 단계별 가이드

### 1️⃣ 기존 pages/*.html 파일 변환

**기존 파일 구조 (fragment):**
```html
<nav class="breadcrumb">...</nav>
<div class="page-hero">...</div>
<div id="doc-content">...</div>
<aside id="toc-panel">...</aside>
```

**새로운 파일 구조 (완전한 페이지):**
```html
@@include('./../../includes/head.html', { "title": "페이지 이름 - Podo Publisher Guide" })
@@include('./../../includes/header.html')
@@include('./../../includes/nav.html')

<!-- ═══ 메인 레이아웃 ═══ -->
<div id="layout">
  <div id="main">
    <!-- 기존 fragment 내용 넣기 -->
  </div>
</div>

@@include('./../../includes/footer.html')
@@include('./../../includes/scripts.html')
</body>
</html>
```

### 2️⃣ 각 페이지별 수정 필요 항목

#### Router.navigate() 제거
**기존:**
```javascript
onclick="Router.navigate('/quick-start')"
```

**변경:**
```html
<a href="quick-start.html">...</a>
<!-- 또는 -->
<button onclick="location.href='quick-start.html'">...</button>
```

#### 동적 페이지 로드 제거
**기존:**
```html
<button onclick="Router.navigate('/kendo/grid')">Grid</button>
```

**변경:**
```html
<a href="kendo-grid.html">Grid</a>
```

### 3️⃣ 샘플 변환 (quick-start.html)

```html
@@include('./../../includes/head.html', { "title": "빠른 시작 - Podo Publisher Guide" })
@@include('./../../includes/header.html')
@@include('./../../includes/nav.html')

<div id="layout">
  <div id="main">
    <nav class="breadcrumb">
      <span><a href="overview.html">홈</a></span>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-cur">빠른 시작</span>
    </nav>
    
    <div class="page-hero">
      <!-- 페이지 콘텐츠 -->
    </div>
  </div>
</div>

@@include('./../../includes/footer.html')
@@include('./../../includes/scripts.html')
</body>
</html>
```

## 🔄 변환 순서 추천

1. ✅ **overview.html** (이미 완료)
2. **pages 폴더의 나머지 파일들**
   - quick-start.html
   - settings.html
   - grid-system.html
   - ... (모든 페이지)
3. **sample 폴더 파일들** (필요시)

## ⚠️ 주의사항

### 1. 경로 확인
- `@@include` 경로는 현재 파일 위치 기준으로 상대 경로 사용
- `pages/` 폴더 내 파일: `./../../includes/file.html`
- `sample/` 폴더 내 파일: `./../../includes/file.html`

### 2. 링크 수정
모든 `Router.navigate()` 호출을 찾아서 일반 링크로 변경:
```bash
# 터미널에서 검색
grep -r "Router.navigate" src/main/pages/
```

### 3. 이미지/파일 경로
- CSS: `../resources/css/style.css` ✅
- JS: `../resources/js/kendo/...` ✅
- 이미지: `../resources/images/...` ✅

### 4. 상단 바 네비게이션 (breadcrumb)
페이지 링크를 클릭 가능하도록 수정:
```html
<!-- 변경 전 -->
<span>홈</span>

<!-- 변경 후 -->
<a href="overview.html">홈</a>
```

## 🛠️ 자동 변환 팁

### VSCode 찾기/바꾸기 사용
1. **Ctrl+H** (찾기/바꾸기 열기)
2. **정규식 활성화** (.*/)
3. 다음과 같이 치환:

```regex
# Router.navigate 호출 → 링크로 변경
# 찾기:
onclick="Router\.navigate\('([^']+)'\)"

# 바꾸기:
onclick="location.href='$1.html'"
```

## 📋 체크리스트

변환 후 각 페이지마다 확인:

- [ ] `@@include` 구문이 올바른가?
- [ ] 모든 `Router.navigate()` 제거됨?
- [ ] 모든 링크가 `.html`로 끝남?
- [ ] CSS/JS/이미지 경로가 정확한가?
- [ ] `npm run build` 성공?
- [ ] `dist/` 파일이 생성됨?
- [ ] 브라우저에서 정상 작동?

## 🎯 최종 확인

```bash
# 1. 모든 페이지 빌드
npm run build

# 2. dist 폴더 확인
ls dist/pages/

# 3. 웹 서버에서 테스트
# dist 폴더를 웹 서버의 root로 설정하여 테스트
```

---

**질문:** 혹시 모든 페이지를 한 번에 변환해야 하나요?  
**답:** 아니요! 페이지별로 천천히 진행해도 괜찮습니다. Gulp는 변환된 페이지만 `dist/`에 출력합니다.
