# 빠른 시작 (5분 안에 시작하기)

## 🎯 지금 바로 하기

### 1단계: npm 설치 (1분)
```bash
cd uiux
npm install
```

### 2단계: 개발 모드 시작 (30초)
```bash
npm run watch
```
- 자동으로 `dist/` 폴더에 파일이 생성됩니다
- 파일 수정 시 자동으로 다시 빌드됩니다

### 3단계: 브라우저에서 열기
```
dist/pages/overview.html
```

✅ **완료!** MPA 가이드 사이트가 준비되었습니다.

---

## 📝 새 페이지 만들기 (2분)

### 새 파일 만들기
`src/main/pages/my-page.html` 생성:

```html
@@include('./../../includes/head.html', { "title": "내 페이지 - Podo Publisher Guide" })
@@include('./../../includes/header.html')
@@include('./../../includes/nav.html')

<div id="layout">
  <div id="main">
    <!-- 여기에 콘텐츠 작성 -->
    <h1>안녕하세요!</h1>
  </div>
</div>

@@include('./../../includes/footer.html')
@@include('./../../includes/scripts.html')
</body>
</html>
```

### 메뉴에 추가하기
`src/includes/nav.html` 수정:

```html
<div class="nav-item"><a href="my-page.html">내 페이지</a></div>
```

### 저장하면 자동으로 빌드됨! 🎉

---

## 🔧 일반적인 작업

### 상단 바 수정
`src/includes/header.html` 편집

### 사이드바 메뉴 수정
`src/includes/nav.html` 편집

### 페이지 스타일 수정
`src/resources/css/style.css` 편집

### 공통 스크립트 수정
`src/includes/scripts.html` 편집

---

## 📦 배포하기

```bash
# 최종 빌드
npm run build

# dist 폴더 전체 배포
# (웹 서버에 dist/ 내용 복사)
```

---

## ❓ FAQ

**Q: 개발 중 자동 새로고침이 없나요?**  
A: `npm run watch`로 실행하고 브라우저에서 수동으로 새로고침하세요. (Live reload 추가 가능)

**Q: CSS 변경이 반영 안 돼요**  
A: Gulp watch를 중단했는지 확인하세요. 다시 `npm run watch` 실행!

**Q: 특정 페이지만 다시 빌드하고 싶어요**  
A: 자동으로 변경된 파일만 빌드됩니다. 파일을 저장하면 자동 빌드됨.

**Q: 기존 index.html (SPA)은 어떻게 하나요?**  
A: 더 이상 필요 없으니 `src/main/index.html` 삭제 가능.

---

## 🚀 다음 단계

1. ✅ 기본 MPA 구조 이해
2. ⭐ 다른 페이지들도 include 형식으로 변환
   - `MIGRATION_GUIDE.md` 참고
3. 📚 필요시 공통 요소 수정

---

**준비 완료!** 페이지를 만들고 수정해 보세요! 🎨
