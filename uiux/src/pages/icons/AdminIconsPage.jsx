import { useMemo, useState } from 'react';
import { Callout, CodeBlock, DocPage, DocTable, Example, Prose, Section, SubSection } from '../../components/doc';
import useCopy from '../../hooks/useCopy.js';
import AdminIcon from '../../icons/AdminIcon.jsx';
import { ADMIN_ICONS, ICON_CATEGORIES } from '../../icons/adminIcons.js';

const ALL = 'all';

/**
 * 아이콘 카드를 눌렀을 때 복사할 형식 — 모두 업무 사이트(HTML / jQuery)에서 쓰는 코드입니다.
 * (가이드 화면 자체를 그리는 <AdminIcon> React 컴포넌트는 가이드 내부용이라 여기 넣지 않습니다)
 */
const COPY_FORMATS = [
    { id: 'class', label: 'HTML', build: (name) => `<i class="ad-icon ad-icon--${name}" aria-hidden="true"></i>` },
    { id: 'jquery', label: 'jQuery', build: (name) => `$('#target').adIcon('${name}');` },
    { id: 'js', label: 'JS 문자열', build: (name) => `PodoIcon.html('${name}')` },
    { id: 'sprite', label: 'SVG 스프라이트', build: (name) => `<svg class="ad-svg" aria-hidden="true"><use href="/images/admin/icons/sprite.svg#ad-icon-${name}"></use></svg>` },
    { id: 'name', label: '이름만', build: (name) => name },
];

const JS_EXAMPLE = `<div class="pd-flex- pd-gap7">
    <button type="button" class="btn-default" id="btnExcel"><span>엑셀 다운로드</span></button>
    <button type="button" class="btn-default" id="btnDelete"><span>삭제</span></button>
</div>

<p id="infoText" style="margin-top: 12px; color: var(--color-blue-500);">저장 후 7일 동안 수정할 수 있습니다.</p>

<ul id="fileList" style="margin-top: 12px;"></ul>

<script>
    $(function () {
        // 1) jQuery — 버튼 맨 앞에 아이콘 넣기
        $('#btnExcel').adIcon('download');
        $('#btnDelete').adIcon('trash', { size: 'sm' });

        // 2) 문자열 — 기존 HTML 조립 코드에 끼워 넣기
        $('#infoText').prepend(PodoIcon.html('info') + ' ');

        // 3) 요소 — 데이터로 목록 만들기 (텍스트는 .text() 로 넣어 XSS 방지)
        var files = [
            { name: '교육 계약서.pdf', icon: 'document' },
            { name: '오리엔테이션.mp4', icon: 'video' }
        ];

        $.each(files, function (index, file) {
            $('<li>')
                .append(PodoIcon.create(file.icon), ' ', $('<span>').text(file.name))
                .appendTo('#fileList');
        });
    });
</script>`;

const JS_LOAD_CODE = `<link rel="stylesheet" href="/css/admin/icons.css">        <!-- 아이콘 모양 (필수) -->

<script src="/js/jquery/jquery-3.7.1.min.js"></script>
<script src="/js/admin/admin-icon.js"></script>             <!-- PodoIcon, $.fn.adIcon (jQuery 다음) -->`;

const JS_API_ROWS = [
    [<code>PodoIcon.html(name, options)</code>, '아이콘 태그 문자열', '기존 문자열 조립 코드, 그리드 템플릿'],
    [<code>PodoIcon.create(name, options)</code>, '<i> 요소', 'append / prepend 로 바로 붙일 때'],
    [<code>$(selector).adIcon(name, options)</code>, 'jQuery 객체 (체이닝)', '버튼·제목 앞뒤에 아이콘 넣기'],
    [<code>PodoIcon.has(name)</code>, 'true / false', '서버 데이터로 아이콘 이름을 받을 때 확인'],
    [<code>PodoIcon.names</code>, '아이콘 이름 배열', '목록 확인용'],
];

const JS_OPTION_ROWS = [
    [<code>size</code>, "'sm' | 'md' | 'lg'", '12 / 20 / 24px (생략 시 16px)'],
    [<code>className</code>, '문자열', '추가 클래스'],
    [<code>label</code>, '문자열', '의미 있는 아이콘이면 스크린리더 이름 (없으면 aria-hidden)'],
    [<code>position</code>, "'prepend' | 'append'", '$.fn.adIcon 전용 — 앞(기본) / 뒤에 넣기'],
];

const KENDO_ICON_CODE = `<script src="/js/admin/kendoComponentUtil.js"></script>
<script>
    kendoUi.init();
    kendoUi.setSvgIcons({ url: '/images/admin/icons/sprite.svg' });  // sprite.svg 주소 지정
</script>`;

const KENDO_TEMPLATE_CODE = `// Kendo Grid 컬럼 템플릿에서도 문자열 함수를 그대로 사용
columns: [
    {
        field: 'fileName',
        title: '첨부',
        template: function (item) {
            return PodoIcon.html('paperclip', { size: 'sm' }) + ' ' + kendo.htmlEncode(item.fileName);
        }
    }
]`;

const CLASS_EXAMPLE = `<!-- 기본 16px, 글자색을 따라감 -->
<button type="button" class="btn_search">
    <i class="ad-icon ad-icon--search" aria-hidden="true"></i>
    <span class="blind">검색</span>
</button>

<!-- 크기: font-size 또는 --sm(12) / --md(20) / --lg(24) -->
<i class="ad-icon ad-icon--info ad-icon--md" aria-hidden="true"></i>

<!-- 색상: color 로 지정 (토큰 사용) -->
<span style="color: var(--color-primary-500)">
    <i class="ad-icon ad-icon--check-circle ad-icon--lg" aria-hidden="true"></i>
</span>
<span style="color: var(--color-red-500)">
    <i class="ad-icon ad-icon--alert ad-icon--lg" aria-hidden="true"></i>
</span>`;

const SPRITE_CODE = `<!-- 스프라이트 파일 하나로 모든 아이콘 사용 (캐시 효율 좋음) -->
<svg class="ad-svg" aria-hidden="true">
    <use href="/images/admin/icons/sprite.svg#ad-icon-download"></use>
</svg>`;

const IMG_CODE = `<!-- 개별 파일 (색 변경 불가 — 검정 고정) -->
<img src="/images/admin/icons/svg/download.svg" width="16" height="16" alt="다운로드">`;

const MIGRATION_CODE = `/* Before — PNG + 색상별 이미지 */
.btn_del       { background: url("../../images/runway/admin_btn_del.png") no-repeat center; }
.btn_del:hover { background-image: url("../../images/runway/admin_btn_del_on.png"); }

/* After — 공통 아이콘 하나 + 색상 토큰 */
<button type="button" class="btn_del">
    <i class="ad-icon ad-icon--trash" aria-hidden="true"></i>
</button>

.btn_del       { color: var(--color-black-400); }
.btn_del:hover { color: var(--color-primary-500); }`;

const ADD_ICON_CODE = `// src/icons/adminIcons.js
{
    name: 'bookmark',              // ad-icon--bookmark
    label: '북마크',
    category: 'action',
    legacy: ['icon_bookmark.png'], // 대체하는 기존 PNG (교체표에 표시)
    body: '<path d="M6 4h12v16l-6-4-6 4z"/>',  // 24x24, 선 두께는 자동(1.6)
},

// 저장 후
// npm run icons   → svg / sprite.svg / icons.css / admin-icon.js 자동 갱신`;

function countByCategory(categoryId) {
    return ADMIN_ICONS.filter((icon) => icon.category === categoryId).length;
}

export default function AdminIconsPage() {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(ALL);
    const [formatId, setFormatId] = useState(COPY_FORMATS[0].id);
    const { copiedKey, copy } = useCopy();

    const format = COPY_FORMATS.find((item) => item.id === formatId);

    const filteredIcons = useMemo(() => {
        const query = keyword.trim().toLowerCase();

        return ADMIN_ICONS.filter((icon) => {
            if (category !== ALL && icon.category !== category) {
                return false;
            }
            if (!query) {
                return true;
            }
            const target = [icon.name, icon.label, ...icon.legacy].join(' ').toLowerCase();
            return target.includes(query);
        });
    }, [keyword, category]);

    const legacyRows = ADMIN_ICONS.filter((icon) => icon.legacy.length > 0);

    return (
        <DocPage
            hero={{
                label: 'Icon',
                eyebrow: 'Icon System',
                title: '관리자',
                strong: '아이콘',
                desc: `PNG 아이콘을 대체하는 공통 SVG 아이콘 ${ADMIN_ICONS.length}종입니다. 색은 글자색(color)을 따라가므로 _on, _gray 같은 색상별 이미지가 더 이상 필요 없습니다.`,
                meta: [
                    { icon: 'grid', text: `${ADMIN_ICONS.length} icons` },
                    { icon: 'edit', text: '24 × 24 · stroke 1.6' },
                ],
            }}
        >
            <Section id="s-gallery" num="01" title="아이콘 목록" />
            <Prose>
                아이콘을 누르면 선택한 형식으로 코드가 복사됩니다. 기존 PNG 파일명(예: <code>icon_search</code>)으로도
                검색할 수 있습니다.
            </Prose>

            <div className="g-toolbar">
                <label className="g-toolbar__search">
                    <AdminIcon name="search" size={14} />
                    <span className="sr-only">아이콘 검색</span>
                    <input
                        type="text"
                        value={keyword}
                        placeholder="이름, 한글, PNG 파일명"
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                </label>
                {COPY_FORMATS.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        className={`g-chip${item.id === formatId ? ' active' : ''}`}
                        onClick={() => setFormatId(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="g-toolbar">
                <button
                    type="button"
                    className={`g-chip${category === ALL ? ' active' : ''}`}
                    onClick={() => setCategory(ALL)}
                >
                    전체<span className="g-chip__count">{ADMIN_ICONS.length}</span>
                </button>
                {ICON_CATEGORIES.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        className={`g-chip${category === item.id ? ' active' : ''}`}
                        onClick={() => setCategory(item.id)}
                    >
                        {item.label}
                        <span className="g-chip__count">{countByCategory(item.id)}</span>
                    </button>
                ))}
            </div>

            {filteredIcons.length === 0 ? (
                <div className="g-empty">“{keyword}” 에 해당하는 아이콘이 없습니다.</div>
            ) : (
                <div className="g-icon-grid">
                    {filteredIcons.map((icon) => (
                        <button
                            type="button"
                            key={icon.name}
                            className="g-icon-card"
                            title={format.build(icon.name)}
                            onClick={() => copy(format.build(icon.name), icon.name)}
                        >
                            {copiedKey === icon.name && <span className="g-icon-card__copied">copied</span>}
                            <AdminIcon name={icon.name} size={24} />
                            <span className="g-icon-card__name">{icon.name}</span>
                            <span className="g-icon-card__label">{icon.label}</span>
                        </button>
                    ))}
                </div>
            )}

            <Section id="s-usage" num="02" title="사용법" />
            <Prose>
                관리자 화면에는 <code>icons.css</code> 를 로드하고 <code>ad-icon</code> 클래스를 쓰는 방식을 기본으로
                합니다. 아래 미리보기는 실제 관리자 CSS 위에서 그린 결과입니다.
            </Prose>
            <Example title="CSS 클래스 (권장)" code={CLASS_EXAMPLE} />

            <SubSection id="s-usage-size" title="크기" />
            <div className="g-icon-sizes">
                {[12, 16, 20, 24, 32].map((size) => (
                    <div className="g-icon-sizes__item" key={size}>
                        <AdminIcon name="settings" size={size} />
                        {size}px
                    </div>
                ))}
            </div>
            <DocTable
                columns={['클래스', '크기', '사용처']}
                rows={[
                    [<code>.ad-icon--sm</code>, '12px', '표 안, 태그 옆'],
                    [<code>.ad-icon</code>, '16px (기본)', '버튼, 입력창, 본문'],
                    [<code>.ad-icon--md</code>, '20px', '카드 제목, 팝업 헤더'],
                    [<code>.ad-icon--lg</code>, '24px', 'GNB 메뉴, 빈 화면 안내'],
                ]}
            />

            <SubSection id="s-usage-js" title="JS · jQuery 로 넣기" />
            <Prose>
                화면을 스크립트로 그릴 때는 <code>admin-icon.js</code> 를 씁니다. jQuery 다음에 로드하면{' '}
                <code>$(selector).adIcon()</code> 이 함께 등록됩니다. 아이콘 모양은 <code>icons.css</code> 가 그리므로 두
                파일을 같이 넣어 주세요.
            </Prose>
            <CodeBlock code={JS_LOAD_CODE} language="html" fileName="head.html" />
            <Example title="jQuery / JS 사용 예" code={JS_EXAMPLE} jquery />
            <DocTable columns={['함수', '돌려주는 값', '언제 쓰나']} rows={JS_API_ROWS} />
            <DocTable columns={['옵션', '값', '설명']} rows={JS_OPTION_ROWS} />
            <CodeBlock code={KENDO_TEMPLATE_CODE} language="js" fileName="Kendo Grid 템플릿" />
            <Callout type="warn" title="사용자 입력은 문자열에 그대로 넣지 않기">
                <code>PodoIcon.html()</code> 은 아이콘 태그만 안전하게 만들어 줍니다. 옆에 붙이는 파일명·제목 같은 데이터는{' '}
                <code>.text()</code> 나 <code>kendo.htmlEncode()</code> 로 넣으세요.
            </Callout>

            <SubSection id="s-usage-kendo" title="Kendo 위젯 아이콘" />
            <Prose>
                Kendo UI 2025 위젯(달력, 드롭다운 화살표, Window 닫기 등)은 아이콘을 인라인 SVG 로 직접 그려서{' '}
                <code>icons.css</code> 가 적용되지 않습니다. 대신 <code>kendoComponentUtil.js</code> 의{' '}
                <code>kendoUi.setSvgIcons({'{ url }'})</code> 가 이 페이지의 <code>sprite.svg</code> 를 불러와 Kendo
                아이콘을 공통 아이콘으로 바꿉니다. 대응표와 사용법은{' '}
                <a href="#/kendo">Kendo UI 개요 › 아이콘 (SVG 교체)</a> 를 참고하세요.
            </Prose>
            <CodeBlock code={KENDO_ICON_CODE} language="html" fileName="head.html" />

            <SubSection id="s-usage-other" title="다른 방식" />
            <CodeBlock code={SPRITE_CODE} language="html" fileName="sprite.svg 사용" />
            <CodeBlock code={IMG_CODE} language="html" fileName="개별 svg 파일" />

            <Section id="s-migration" num="03" title="PNG → SVG 교체" />
            <Prose>
                기존 PNG 와 대응되는 공통 아이콘 목록입니다. 화면 단위로 하나씩 교체하고, 교체가 끝난 PNG 는 사용처를
                검색해 정리합니다. (자동 교체는 화면 깨짐 위험이 있어 하지 않았습니다)
            </Prose>
            <CodeBlock code={MIGRATION_CODE} language="css" fileName="교체 예시" />
            <DocTable
                columns={['아이콘', '이름', '대체하는 기존 PNG']}
                rows={legacyRows.map((icon) => [
                    <AdminIcon name={icon.name} size={18} />,
                    <code>{icon.name}</code>,
                    <span className="g-legacy-list">{icon.legacy.join(', ')}</span>,
                ])}
                rowKey={(row, index) => legacyRows[index].name}
            />
            <Callout type="warn" title="스프라이트 PNG (icon_map.png, icon_map2.png)">
                라디오·체크박스·페이저 등 여러 아이콘이 한 장에 모인 이미지입니다. 라디오/체크박스는 모양이 상태별로
                달라 이번 범위에서 제외했고, 나머지(닫기, 필터, 화살표, 달력, 시계)는 위 표의 아이콘으로 대체합니다.
            </Callout>

            <Section id="s-add" num="04" title="아이콘 추가 규칙" />
            <CodeBlock code={ADD_ICON_CODE} language="js" fileName="src/icons/adminIcons.js" />
            <DocTable
                columns={['항목', '규칙']}
                rows={[
                    ['캔버스', '24 × 24, 바깥 여백 2~3px'],
                    ['선', 'stroke 1.6, 끝/모서리 둥글게 — 면 아이콘은 fill: true'],
                    ['색', '색상 지정 금지 (currentColor 자동 적용)'],
                    ['이름', '영문 소문자 + 하이픈, 모양 기준(trash) — 화면 기준(btn_del) 금지'],
                ]}
            />
        </DocPage>
    );
}
