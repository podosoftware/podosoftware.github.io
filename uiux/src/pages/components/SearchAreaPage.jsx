import { ClassTable, CodeBlock, DocPage, Example, Prose, Section } from '../../components/doc';
import { getSnippet } from '../../snippets/index.js';

/**
 * 원본 스니펫에는 Kendo 초기화 코드가 없어 미리보기용 초기화 스크립트를 붙입니다.
 * 실제 화면과 같이 kendoComponentUtil.js 의 kendoUi.createXxx() 로 초기화합니다.
 * (kendoUi.init() / kendoUi.setSvgIcons() 는 공통 head 에서 한 번만 실행 — Kendo UI 개요 참고)
 */
const SAMPLE_OPTIONS = `
        var contsTypeData = [
            { text: '전체', value: '' },
            { text: '동영상', value: 'VOD' },
            { text: '문서', value: 'DOC' }
        ];
        var stateCodeData = [
            { text: '전체', value: '' },
            { text: '진행중', value: 'ING' },
            { text: '종료', value: 'END' }
        ];`;

/** 검색 영역 초기화 코드 — 스니펫마다 id 뒤 접미사(suffix)만 다릅니다. */
function buildSearchInit(suffix) {
    return `
<script>
    $(function () {${SAMPLE_OPTIONS}

        // 기간 (시작일 ~ 종료일) — 시작일을 고르면 종료일 최소값이 자동으로 맞춰집니다.
        kendoUi.createDatePickerStartEnd('#searchCreat_start_date${suffix}', '#searchCreat_end_date${suffix}');
        kendoUi.createDatePickerStartEnd('#start_date${suffix}', '#end_date${suffix}');

        // 드롭다운 — data 를 넘기지 않으면 빈 목록이 되므로 항상 지정합니다.
        kendoUi.createDropDownList('#searchDownloadDate${suffix}', {
            data: [{ text: '시작일', value: 'start' }, { text: '종료일', value: 'end' }]
        });
        kendoUi.createDropDownList('#CONTS_TYPE${suffix}', { data: contsTypeData });
        kendoUi.createDropDownList('#STATE_CODE${suffix}', { data: stateCodeData });
        kendoUi.createDropDownList('#FILE_TYPE${suffix}', { data: contsTypeData });
    });
</script>`;
}

const SEARCH_INIT_01 = buildSearchInit('');
const SEARCH_INIT_02 = buildSearchInit('2');

const SEARCH_INIT_03 = `
<script>
    $(function () {
        kendoUi.createDropDownList('#titleSearchSelect', {
            data: [{ text: '제목', value: 'TITLE' }, { text: '작성자', value: 'WRITER' }]
        });
        kendoUi.createDatePickerStartEnd('#titleSearchSt', '#titleSearchEd');
    });
</script>`;

const SEARCH_CLASSES = [
    { name: 'grid-search-area', desc: '표(그리드) 위 검색 영역 박스' },
    { name: 'pd-flex-line', desc: '검색 항목 한 줄' },
    { name: 'left / right', desc: '항목 이름 / 입력 영역' },
    { name: 'col-red', desc: '필수 항목 * 표시 (--color-red-500)' },
    { name: 'date-box-wrap / date-box', desc: '기간(시작 ~ 종료) 날짜 입력 묶음' },
    { name: 'label_text', desc: '기간 사이 ~ 구분자' },
    { name: 'cont_body-top / search-wrap', desc: '대타이틀 옆 간단 검색' },
];

export default function SearchAreaPage() {
    return (
        <DocPage
            hero={{
                label: 'Search',
                eyebrow: 'Components',
                title: '검색',
                strong: '영역',
                desc: '목록 화면 상단의 검색 조건 영역입니다. 버튼 위치에 따라 두 가지 형태가 있습니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={SEARCH_CLASSES} />

            <Section id="s-inline" num="02" title="버튼 내장형" />
            <Prose>검색 버튼이 마지막 줄 오른쪽 끝에 들어가는 기본형입니다.</Prose>
            <Example title="검색 영역 — 버튼 내장" code={getSnippet('searchArea_01') + SEARCH_INIT_01} kendo minHeight={360} />

            <Section id="s-outside" num="03" title="버튼 분리형" />
            <Prose>검색 항목이 많아 줄이 꽉 찰 때, 버튼을 영역 아래 오른쪽으로 분리합니다.</Prose>
            <Example title="검색 영역 — 버튼 하단" code={getSnippet('searchArea_02') + SEARCH_INIT_02} kendo minHeight={380} />

            <Section id="s-title" num="04" title="대타이틀 옆 간단 검색" />
            <Example
                title="타이틀 검색"
                code={getSnippet('searchArea_03') + SEARCH_INIT_03}
                kendo
                minHeight={320}
                defaultOpen={false}
            />

            <Section id="s-init" num="05" title="초기화 스크립트" />
            <Prose>
                Kendo 위젯은 <code>$(...).kendoXxx()</code> 를 직접 호출하지 않고 <code>kendoComponentUtil.js</code> 의{' '}
                <code>kendoUi.createXxx()</code> 로 만듭니다. 한국어 기본값, 중복 생성 방지, 시작/종료일 연동이 들어 있습니다.
            </Prose>
            <CodeBlock code={SEARCH_INIT_01.trim()} language="html" fileName="page.js (예시)" />
        </DocPage>
    );
}
