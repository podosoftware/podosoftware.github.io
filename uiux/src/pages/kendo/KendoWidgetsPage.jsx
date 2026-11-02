import { DocPage, Example, Prose, Section } from '../../components/doc';

const DATE_PICKER = `<div class="date-box-wrap">
    <div class="date-box">
        <input type="text" id="startDate" placeholder="YYYY-MM-DD">
    </div>
    <span class="label_text">~</span>
    <div class="date-box">
        <input type="text" id="endDate" placeholder="YYYY-MM-DD">
    </div>
</div>

<script>
    $(function () {
        // 시작일을 고르면 종료일의 최소값이 자동으로 바뀝니다.
        kendoUi.createDatePickerStartEnd('#startDate', '#endDate', {
            onChange: function (range) {
                console.log(range.start, range.end);
            }
        });
    });
</script>`;

const DROP_DOWN = `<select id="stateCode" style="width: 200px;"></select>

<script>
    $(function () {
        // 서버 목록이면 data 대신 readUrl 을 넘깁니다.
        kendoUi.createDropDownList('#stateCode', {
            optionLabel: '전체',
            data: [
                { text: '진행중', value: 'ING' },
                { text: '종료', value: 'END' },
                { text: '대기', value: 'WAIT' }
            ],
            onChange: function () {
                console.log(kendoUi.getDropDownListValue('#stateCode'));
            }
        });
    });
</script>`;

const NUMERIC = `<div class="input-box" style="width: 200px;">
    <input type="text" id="limitCount">
    <span class="txt">명</span>
</div>

<script>
    $(function () {
        // 기본값: min 0, max 100, step 1, format n0 → 다른 값만 넘깁니다.
        kendoUi.createNumericTextBox('#limitCount', {
            max: 9999
        });
    });
</script>`;

const GRID = `<div id="sampleGrid"></div>

<script>
    $(function () {
        var rows = [
            { no: 3, title: '신규 과정 등록 안내', writer: '관리자', date: '2026-11-02' },
            { no: 2, title: '시스템 점검 공지', writer: '운영팀', date: '2026-10-28' },
            { no: 1, title: '이용 가이드', writer: '관리자', date: '2026-10-01' }
        ];

        kendoUi.createGrid('#sampleGrid', {
            // createGrid 는 서버 응답 형식 { data: [...], totalCount: n } 을 기준으로 읽으므로
            // 화면에서 만든 배열도 같은 형식으로 감싸서 넘깁니다.
            data: { data: rows, totalCount: rows.length },
            // 서버 조회면 data 대신 readUrl(조회 주소)과 readParamFun(검색 조건을 돌려주는 함수)을 넘깁니다.
            height: false,      // false = 높이 고정 안 함 (기본은 화면 높이에 맞춤)
            columns: [
                { field: 'no', title: '번호', width: 80, attributes: { style: 'text-align:center' } },
                { field: 'title', title: '제목' },
                { field: 'writer', title: '작성자', width: 120 },
                { field: 'date', title: '등록일', width: 140 }
            ]
        });
    });
</script>`;

export default function KendoWidgetsPage() {
    return (
        <DocPage
            hero={{
                label: 'Widget',
                eyebrow: 'Kendo UI',
                title: '위젯',
                strong: '예제',
                desc: '자주 쓰는 Kendo 위젯의 최소 초기화 코드입니다. 미리보기는 실제 Kendo 2025 + 관리자 CSS 로 동작합니다.',
            }}
        >
            <Prose>
                모든 위젯은 <code>kendoComponentUtil.js</code> 의 <code>kendoUi.createXxx(선택자, 옵션)</code> 으로
                만듭니다. 자주 쓰는 옵션은 기본값이 정해져 있어 다른 값만 넘기면 되고, 그 밖의 Kendo 옵션도 그대로
                전달됩니다. 아이콘은 <code>kendoUi.setSvgIcons()</code> 로 공통 SVG 아이콘으로 바뀌어 있습니다.
            </Prose>

            <Section id="s-date" num="01" title="DatePicker" />
            <Example title="기간 선택" code={DATE_PICKER} kendo minHeight={390} />

            <Section id="s-dropdown" num="02" title="DropDownList" />
            <Example title="상태 선택" code={DROP_DOWN} kendo minHeight={200} />

            <Section id="s-numeric" num="03" title="NumericTextBox" />
            <Example title="숫자 입력" code={NUMERIC} kendo />

            <Section id="s-grid" num="04" title="Grid" />
            <Example title="기본 그리드" code={GRID} kendo minHeight={220} />
        </DocPage>
    );
}
