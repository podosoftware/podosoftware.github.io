import { Callout, CodeBlock, DocPage, DocTable, Prose, Section, SubSection } from '../../components/doc';

const HEAD_CODE = `<!-- 1. 리셋 -->
<link rel="stylesheet" href="/css/reset2.css">
<link rel="stylesheet" href="/css/admin/base.css">        <!-- 관리자 기본 보정 (body line-height 등) -->
<!-- 2. 토큰 (기존 root_admin.css 대체 — 옛 변수명도 그대로 동작) -->
<link rel="stylesheet" href="/css/admin/tokens.css">
<!-- 3. Kendo UI 2025 테마 + 커스텀 -->
<link rel="stylesheet" href="/css/kendo/2025.1.211/bootstrap-3.css">
<link rel="stylesheet" href="/css/pd_kendo.css">
<!-- 4. 유틸 → 공통 → 관리자 -->
<link rel="stylesheet" href="/css/util.css">
<link rel="stylesheet" href="/css/admin/common.css">
<link rel="stylesheet" href="/css/admin/admin.css">
<link rel="stylesheet" href="/css/admin/button.css">      <!-- 버튼 정렬 보정 (admin.css 다음) -->
<!-- 5. 공통 아이콘 (SVG) -->
<link rel="stylesheet" href="/css/admin/icons.css">

<script src="/js/jquery/jquery-3.7.1.min.js"></script>
<script src="/js/kendo/2025.1.211/kendo.all.min.js"></script>
<script src="/js/kendo/2025.1.211/telerik-license.js"></script>
<script src="/js/kendo/2022.1.119/cultures/kendo.culture.ko-KR.min.js"></script>
<script src="/js/kendo/kendo.messages.ko-KR.js"></script>
<!-- 6. 공통 아이콘 JS 헬퍼 (PodoIcon, $.fn.adIcon) — jQuery 다음 -->
<script src="/js/admin/admin-icon.js"></script>
<!-- 7. Kendo 공통 유틸 (kendoUi.createXxx) — Kendo 다음 -->
<script src="/js/admin/kendoComponentUtil.js"></script>
<script>
    kendoUi.init();                                                   // 한국어(ko-KR)
    kendoUi.setSvgIcons({ url: '/images/admin/icons/sprite.svg' });   // Kendo 아이콘 → 공통 SVG
</script>`;

const RUN_CODE = `# uiux 폴더에서 실행
npm install        # 최초 1회
npm run dev        # 가이드 개발 서버 (http://localhost:5173)
npm run build      # dist/ 로 정적 빌드

npm run tokens     # css/admin/*.css → public/admin/css/ 토큰화 + 리포트
npm run icons      # src/icons/adminIcons.js → svg / sprite / icons.css / admin-icon.js
npm run admin      # tokens + icons 한 번에`;

const TREE = `uiux/
├── public/admin/            <em># 관리자 화면에 그대로 배포하는 결과물</em>
│   ├── css/tokens.css       <em># ★ 토큰 단일 소스 (직접 수정)</em>
│   ├── css/base.css         <em># 관리자 기본 보정 (직접 수정)</em>
│   ├── css/common.css       <em># 자동 생성 (npm run tokens)</em>
│   ├── css/admin.css        <em># 자동 생성</em>
│   ├── css/sub.css          <em># 자동 생성</em>
│   ├── css/button.css       <em># 버튼 정렬 보정 (직접 수정)</em>
│   ├── css/icons.css        <em># 자동 생성 (npm run icons)</em>
│   ├── icons/sprite.svg     <em># 자동 생성</em>
│   ├── icons/svg/*.svg      <em># 자동 생성</em>
│   ├── js/admin-icon.js     <em># 자동 생성 — 아이콘 JS/jQuery 헬퍼</em>
│   └── js/                  <em># 공통 스크립트 (kendoComponentUtil 등)</em>
├── vendor/                  <em># 기존 uiux 전용 라이브러리 사본 (가이드는 미사용)</em>
├── scripts/                 <em># tokenize-admin-css / build-icons</em>
├── docs/                    <em># 리포트, Kendo 2025 호환성 문서</em>
├── src/
│   ├── routes.jsx           <em># ★ 메뉴 + 페이지 등록 (여기 하나만 수정)</em>
│   ├── layout/              <em># 상단바, 사이드바, 목차, 검색</em>
│   ├── components/doc/      <em># DocPage, Section, Example, CodeBlock …</em>
│   ├── icons/               <em># ★ adminIcons.js (아이콘 단일 소스)</em>
│   ├── snippets/admin/      <em># 실사용 마크업 (.html) — 미리보기에 그대로 사용</em>
│   ├── pages/               <em># 문서 페이지</em>
│   └── styles/              <em># 가이드 디자인 (Concept B)</em>
└── .editorconfig            <em># 들여쓰기 공백 4칸</em>`;

const PAGE_CODE = `import { DocPage, Section, Prose, Example } from '../../components/doc';

export default function MyPage() {
    return (
        <DocPage hero={{ label: 'New', eyebrow: 'Components', title: '새', strong: '컴포넌트' }}>
            <Section id="s-basic" num="01" title="기본형" />
            <Prose>설명 문장</Prose>
            <Example title="기본" snippet="my_snippet" />
        </DocPage>
    );
}`;

export default function SetupPage() {
    return (
        <DocPage
            hero={{
                label: 'Setup',
                eyebrow: 'Getting Started',
                title: '환경',
                strong: '설정',
                desc: '관리자 화면에 CSS·JS 를 불러오는 순서와, 이 가이드 사이트를 실행·수정하는 방법입니다.',
            }}
        >
            <Section id="s-head" num="01" title="관리자 화면 로드 순서" />
            <Prose>
                순서가 바뀌면 덮어쓰기 우선순위가 달라져 화면이 깨집니다. 아래 순서를 그대로 지켜 주세요.
                <code>tokens.css</code> 는 반드시 다른 CSS 보다 먼저 로드합니다.
            </Prose>
            <CodeBlock code={HEAD_CODE} language="html" fileName="head.html" label="CSS / JS 로드 순서" />
            <Callout type="warn" title="root_admin.css → tokens.css 교체">
                <code>tokens.css</code> 하단의 Legacy Alias 가 옛 변수명(<code>--primary-500</code> 등)을 새 토큰으로
                연결합니다. 두 파일을 함께 로드하지 말고 <code>root_admin.css</code> 줄을 바꿔 끼우세요.
            </Callout>

            <SubSection id="s-head-files" title="배포 파일 위치" />
            <DocTable
                columns={['가이드 결과물', '운영 배포 위치', '비고']}
                rows={[
                    [<code>uiux/public/admin/css/tokens.css</code>, <code>/css/admin/tokens.css</code>, '직접 관리'],
                    [<code>uiux/public/admin/css/base.css</code>, <code>/css/admin/base.css</code>, '관리자 기본 보정 (직접 관리)'],
                    [<code>uiux/public/admin/css/admin.css</code>, <code>/css/admin/admin.css</code>, '토큰화 결과 (자동 생성)'],
                    [<code>uiux/public/admin/css/button.css</code>, <code>/css/admin/button.css</code>, '버튼 정렬 보정 (직접 관리)'],
                    [<code>uiux/public/admin/css/icons.css</code>, <code>/css/admin/icons.css</code>, '아이콘 (자동 생성)'],
                    [<code>uiux/public/admin/js/admin-icon.js</code>, <code>/js/admin/admin-icon.js</code>, '아이콘 JS 헬퍼 (자동 생성)'],
                    [
                        <code>uiux/public/admin/js/kendoComponentUtil.js</code>,
                        <code>/js/admin/kendoComponentUtil.js</code>,
                        'Kendo 공통 유틸 + SVG 아이콘 교체 (직접 관리)',
                    ],
                    [<code>uiux/public/admin/icons/</code>, <code>/images/admin/icons/</code>, 'sprite / 개별 SVG'],
                ]}
            />

            <Section id="s-run" num="02" title="가이드 사이트 실행" />
            <Prose>
                Node.js 20 이상이 필요합니다. 개발 서버는 저장소 루트의 <code>/css</code>, <code>/js</code>,{' '}
                <code>/images</code> 를 그대로 연결해 미리보기에 사용합니다. (복사본을 두지 않습니다)
            </Prose>
            <CodeBlock code={RUN_CODE} language="shell" fileName="terminal" />

            <Section id="s-tree" num="03" title="폴더 구조" />
            <pre className="g-tree" dangerouslySetInnerHTML={{ __html: TREE }} />

            <Section id="s-add-page" num="04" title="페이지 추가하기" />
            <Prose>
                ① <code>src/pages</code> 에 컴포넌트를 만들고 ② <code>src/routes.jsx</code> 의 메뉴 그룹에 등록하면
                끝입니다. 좌측 메뉴, 검색, 브레드크럼, 이전/다음 버튼, 우측 목차는 자동으로 만들어집니다.
            </Prose>
            <CodeBlock code={PAGE_CODE} language="jsx" fileName="src/pages/components/MyPage.jsx" />
            <Prose>
                실사용 마크업은 <code>src/snippets/admin/</code> 에 <code>.html</code> 파일로 넣으면{' '}
                <code>snippet="파일명"</code> 으로 바로 쓸 수 있습니다.
            </Prose>

            <Section id="s-style" num="05" title="코드 스타일" />
            <DocTable
                columns={['항목', '규칙']}
                rows={[
                    ['들여쓰기', '공백 4칸 (.editorconfig — IntelliJ 가 자동 적용)'],
                    ['역할 구분', '가이드 화면 = React / 예제·업무 코드 = HTML + jQuery + Kendo (미리보기에서 그대로 실행)'],
                    ['컴포넌트', '함수형 컴포넌트 + 훅, 파일 하나에 컴포넌트 하나'],
                    ['클래스명', '가이드 UI 는 g- 접두사, 관리자 아이콘은 ad- 접두사 (관리자 CSS 와 충돌 방지)'],
                    ['색상', '가이드는 --g-* , 관리자 화면은 --color-* 토큰만 사용'],
                ]}
            />
        </DocPage>
    );
}
