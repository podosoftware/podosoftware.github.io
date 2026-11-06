import { Link } from 'react-router-dom';
import { CodeBlock, DocPage, DocTable, Example, Prose, Section, SubSection } from '../../components/doc';

const AUTO_COMPLETE = `<input type="text" id="teacherName" style="width: 240px;">
<p id="teacherText" style="margin-top: 10px;">선택: 없음</p>

<script>
    $(function () {
        // 글자를 입력하면 포함된 항목을 추천합니다. (자유 입력도 가능)
        kendoUi.createAutoComplete('#teacherName', {
            data: [{ text: '김포도' }, { text: '김하나' }, { text: '이포도' }, { text: '박관리' }],
            placeholder: '강사명을 입력해 주세요.',
            onChange: function () {
                $('#teacherText').text('선택: ' + (kendoUi.getAutoCompleteValue('#teacherName') || '없음'));
            }
        });
    });
</script>`;

const AUTO_COMPLETE_OPTIONS = [
    [<code>data</code>, '-', <>추천 목록 — <code>{"[{ text: '...' }]"}</code> 객체 배열</>],
    [<code>field</code>, <code>'text'</code>, '목록에서 보여 줄 필드 이름'],
    [<code>readUrl</code> / <code>readParamFun</code>, '-', '서버에서 목록 조회 (POST)'],
    [<code>placeholder</code>, <code>'검색어를 입력해 주세요.'</code>, '빈 칸 안내 문구'],
    [<code>filter</code>, <code>'contains'</code>, <>
        <code>'contains'</code> 포함 · <code>'startswith'</code> 시작</>],
    [<code>minLength</code>, <code>1</code>, '몇 글자부터 추천할지'],
    [<code>delay</code>, <code>200</code>, '입력 후 추천까지 기다리는 시간(ms)'],
    [<code>onChange</code>, '-', '값이 확정될 때 (추천 선택 또는 입력 후 칸을 벗어날 때)'],
];

const MULTI_SELECT = `<select id="authCode" multiple style="width: 100%;"></select>
<p id="authText" style="margin-top: 10px;">선택: 없음</p>

<script>
    $(function () {
        kendoUi.createMultiSelect('#authCode', {
            data: [
                { text: '관리자', value: 'ADMIN' },
                { text: '강사', value: 'TEACHER' },
                { text: '학습자', value: 'LEARNER' },
                { text: '운영자', value: 'OPER' }
            ],
            placeholder: '권한을 선택해 주세요.',
            filter: true,             // 입력해서 찾기 (포함)
            maxSelectedItems: 3,      // 최대 선택 개수
            onChange: function () {
                var values = kendoUi.getMultiSelectValue('#authCode');   // ['ADMIN', 'LEARNER']
                $('#authText').text('선택: ' + (values.length ? values.join(', ') : '없음'));
            }
        });
    });
</script>`;

const MULTI_SELECT_OPTIONS = [
    [<code>data</code>, '-', <>목록 — <code>{"[{ text, value }]"}</code>. <code>data</code> 또는 <code>readUrl</code> 하나는 필수</>],
    [<code>readUrl</code> / <code>readParamFun</code>, '-', <>서버 조회 (POST, 응답 <code>{'{ data: [...] }'}</code>, 입력할 때마다 서버 검색)</>],
    [<code>dataTextField</code> / <code>dataValueField</code>, <><code>'text'</code> / <code>'value'</code></>, '보여 줄 필드 / 값 필드'],
    [<code>placeholder</code>, '-', '빈 칸 안내 문구'],
    [<code>filter</code>, '없음', <>
        <code>true</code> 포함 · <code>false</code> 시작 · 문자열(<code>'contains'</code> 등) 그대로</>],
    [<code>maxSelectedItems</code>, '제한 없음', '최대 선택 개수'],
    [<code>onChange</code>, '-', '선택이 바뀔 때'],
    ['그 밖의 Kendo 옵션', '-', <><code>value</code>(처음 선택 배열), <code>tagMode</code> 등 그대로 전달</>],
];

const MULTI_SELECT_VALUE = `// 값 읽기 — 배열, 아무것도 안 골랐으면 []
var auths = kendoUi.getMultiSelectValue('#authCode');

// 서버로 보낼 때 — 쉼표로 이어 붙이기
var param = { authCodes: auths.join(',') };   // 'ADMIN,LEARNER'

// 값 넣기 — 전용 함수가 없어 위젯으로 처리합니다. (onChange 는 실행되지 않음)
$('#authCode').data('kendoMultiSelect').value(['ADMIN', 'TEACHER']);

// 모두 지우기
$('#authCode').data('kendoMultiSelect').value([]);`;

const DROP_DOWN_CASCADE = `<div class="pd-flex- pd-align-center pd-gap7">
    <select id="cateL" style="width: 140px;"></select>
    <select id="cateM" style="width: 140px;"></select>
    <select id="cateS" style="width: 140px;"></select>
</div>
<p id="cateText" style="margin-top: 10px;">선택: 없음</p>

<script>
    // 상위 값 → 하위 목록 (실제 화면은 서버에서 받아 옵니다)
    var MIDDLE = {
        EDU: [{ text: '직무', value: 'JOB' }, { text: '리더십', value: 'LEAD' }],
        EVT: [{ text: '세미나', value: 'SEM' }]
    };
    var SMALL = {
        JOB: [{ text: '기획', value: 'PLAN' }, { text: '개발', value: 'DEV' }],
        LEAD: [{ text: '팀장', value: 'TL' }],
        SEM: [{ text: '온라인', value: 'ON' }, { text: '오프라인', value: 'OFF' }]
    };

    $(function () {
        kendoUi.createDropDownList('#cateL', {
            optionLabel: '대분류',
            data: [{ text: '교육', value: 'EDU' }, { text: '행사', value: 'EVT' }],
            onChange: function () {
                // 상위가 바뀌면 하위 목록을 바꾸고, 그 아래는 비웁니다.
                kendoUi.setDropDownListData('#cateM', MIDDLE[kendoUi.getDropDownListValue('#cateL')] || []);
                kendoUi.setDropDownListData('#cateS', []);
                showCategory();
            }
        });
        kendoUi.createDropDownList('#cateM', {
            optionLabel: '중분류',
            data: [],
            onChange: function () {
                kendoUi.setDropDownListData('#cateS', SMALL[kendoUi.getDropDownListValue('#cateM')] || []);
                showCategory();
            }
        });
        kendoUi.createDropDownList('#cateS', { optionLabel: '소분류', data: [], onChange: showCategory });
    });

    function showCategory() {
        // 고른 값만 순서대로 (비어 있는 단계는 빠짐)
        var values = kendoUi.getDropDownValuesThree('#cateL', '#cateM', '#cateS');
        $('#cateText').text('선택: ' + (values.length ? values.join(' > ') : '없음'));
    }
</script>`;

const DROP_DOWN_VALUE = `// 값 · 글자 읽기 — 선택 전(optionLabel 상태)이면 값은 '', 글자는 optionLabel 문구
var code = kendoUi.getDropDownListValue('#stateCode');   // 'ING'
var name = kendoUi.getDropDownListText('#stateCode');    // '진행중'

// 값 넣기 — 목록에 없는 값이면 선택이 풀립니다(값 '').
kendoUi.setDropDownListValue('#stateCode', 'END');

// 목록 바꾸기 — 배열을 통째로 교체 (선택 값은 초기화)
kendoUi.setDropDownListData('#stateCode', [{ text: '대기', value: 'WAIT' }]);

// 다른 방법: 이미 만든 요소에 createDropDownList 를 다시 부르면 data / value 만 바뀝니다.
kendoUi.createDropDownList('#stateCode', { data: newList, value: 'WAIT' });

// 3단 분류 값 한 번에 — 고른 값만 배열로 (예: ['EDU', 'JOB'])
var cate = kendoUi.getDropDownValuesThree('#cateL', '#cateM', '#cateS');

// 옵션(readUrl, filter 등)을 바꿔 아예 새로 만들 때 — 위젯을 지운 뒤 다시 생성
kendoUi.resetDropDown('#stateCode');
kendoUi.createDropDownList('#stateCode', { readUrl: '/admin/code/list.do', filter: true });`;

const DATE_SINGLE = `<div class="date-box" style="width: 160px;">
    <input type="text" id="openDate">
</div>
<p id="openDateText" style="margin-top: 10px;">개강일: 2026-11-02</p>

<script>
    $(function () {
        // 숫자만 입력해도 2026-11-05 형식으로 자동 변환되고, 없는 날짜는 비워집니다.
        kendoUi.createDatePicker('#openDate', {
            value: '2026-11-02',
            onChange: function () {
                var value = kendoUi.getDatePickerValue('#openDate');   // 'yyyy-MM-dd' 또는 ''
                $('#openDateText').text('개강일: ' + (value || '없음'));
            }
        });
    });
</script>`;

const DATE_VALUE = `// 값 읽기 — 'yyyy-MM-dd', 비어 있으면 ''
var openDate = kendoUi.getDatePickerValue('#openDate');

// 값 넣기 — 'yyyy-MM-dd' / 'yyyyMMdd' / Date, 비우려면 null
kendoUi.setDatePickerValue('#openDate', '2026-12-01');
kendoUi.setDatePickerValue('#openDate', '20261201');
kendoUi.setDatePickerValue('#openDate', null);

// 기간(StartEnd)·월 선택 칸도 같은 함수로 하나씩 읽을 수 있습니다.
var start = kendoUi.getDatePickerValue('#searchStart');`;

const DATE_OPTIONS = [
    [<code>value</code>, '-', <>처음 값 — <code>'yyyy-MM-dd'</code> 또는 Date</>],
    [<code>onChange</code>, '-', '날짜가 바뀔 때 실행 (Kendo change 이벤트 e 전달)'],
    [<code>format</code>, <code>'yyyy-MM-dd'</code>, '표시 형식'],
    [<code>dateInput</code>, <code>false</code>, <>
        <code>false</code>: 숫자만 입력해도 <code>-</code> 자동 삽입 · <code>true</code>: <code>YYYY-MM-DD</code> 틀 입력</>],
    [<code>placeholder</code>, <code>'YYYY-MM-DD'</code>, <>빈 칸 안내 문구 (<code>dateInput: false</code> 일 때)</>],
    ['그 밖의 Kendo 옵션', '-', <><code>min</code>, <code>max</code>, <code>disableDates</code> 등 그대로 전달 (Date 로 넘기기)</>],
];

const TIME_PICKER = `<div class="pd-flex- pd-align-center pd-gap10">
    <input type="text" id="classStart" style="width: 120px;">
    <span class="label_text">~</span>
    <input type="text" id="classEnd" style="width: 120px;">
</div>

<script>
    $(function () {
        // 'HH:mm' 문자열로 넘깁니다. interval 은 목록 간격(분) — Kendo 옵션
        kendoUi.createTimePicker('#classStart', { value: '09:00', min: '08:00', max: '18:00', interval: 30 });
        kendoUi.createTimePicker('#classEnd', { value: '18:00', min: '08:00', max: '22:00', interval: 30 });
    });
</script>`;

const TIME_VALUE = `// 값 읽기 — 'HH:mm', 비어 있으면 ''
var startTime = kendoUi.getTimePickerValue('#classStart');   // '09:00'

// 값 넣기 — 'HH:mm' 또는 Date. min ~ max 밖의 값은 들어가지 않고 비워집니다.
kendoUi.setTimePickerValue('#classStart', '14:30');`;

const TIME_OPTIONS = [
    [<code>value</code>, '-', <>처음 값 — <code>'HH:mm'</code> 또는 Date</>],
    [<code>min</code> / <code>max</code>, '-', <>고를 수 있는 시간 — <code>'HH:mm'</code></>],
    [<code>onChange</code>, '-', '시간이 바뀔 때 실행'],
    [<code>format</code>, <code>'HH:mm'</code>, '표시 형식 (24시간)'],
    [<code>dateInput</code>, <code>true</code>, <>입력칸에 <code>시:분</code> 틀 표시 · 키보드 입력</>],
    ['그 밖의 Kendo 옵션', '-', <><code>interval</code>(목록 간격, 분) 등 그대로 전달</>],
];

const DATE_QUICK = `<div class="pd-flex- pd-align-center pd-gap10">
    <div class="date-box-wrap" style="width: 300px;">
        <div class="date-box"><input type="text" id="searchStart"></div>
        <span class="label_text">~</span>
        <div class="date-box"><input type="text" id="searchEnd"></div>
    </div>
    <button type="button" class="btn_inner" data-range="today"><span>오늘</span></button>
    <button type="button" class="btn_inner" data-range="week"><span>최근 7일</span></button>
    <button type="button" class="btn_inner" data-range="month"><span>이번 달</span></button>
    <button type="button" class="btn_inner" data-range="clear"><span>초기화</span></button>
</div>

<script>
    $(function () {
        kendoUi.createDatePickerStartEnd('#searchStart', '#searchEnd');

        $('[data-range]').on('click', function () {
            var today = new Date();
            var start = null;
            var end = null;

            switch ($(this).data('range')) {
                case 'today':
                    start = today;
                    end = today;
                    break;
                case 'week':
                    start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
                    end = today;
                    break;
                case 'month':
                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                // 'clear' → start, end 모두 null 로 비움
            }

            // 두 값을 함께 넣고, 종료 최소값·시작 최대값도 새 값에 맞춰 다시 잡습니다.
            kendoUi.setDatePickerStartEndValues('#searchStart', '#searchEnd', start, end);
        });
    });
</script>`;

const DATE_SYNC = `// 값 함께 넣기 — 'yyyy-MM-dd' / 'yyyyMMdd' / 'yyyy-MM'(월 선택) / Date, 비우려면 null
kendoUi.setDatePickerStartEndValues('#searchStart', '#searchEnd', '2026-11-01', '2026-11-30');

// 위젯을 직접 다뤄 값을 바꾼 뒤에는 범위를 다시 맞춥니다.
// (picker.value() 로 넣으면 change 가 실행되지 않아 종료 최소값·시작 최대값이 그대로 남음)
$('#searchStart').data('kendoDatePicker').value(new Date(2026, 10, 10));
kendoUi.syncDatePickerStartEndRange('#searchStart', '#searchEnd');`;

const MONTH_PICKER = `<div class="date-box-wrap" style="width: 300px;">
    <div class="date-box"><input type="text" id="statStartMonth"></div>
    <span class="label_text">~</span>
    <div class="date-box"><input type="text" id="statEndMonth"></div>
</div>
<p id="statMonthText" style="margin-top: 10px;">기간: 2026-01 ~ 2026-06</p>

<script>
    $(function () {
        // 연·월만 고르는 달력 (일 선택 없음). 값은 그 달 1일의 Date 입니다.
        kendoUi.createMonthPickerStartEnd('#statStartMonth', '#statEndMonth', {
            defaultStart: '2026-01',
            defaultEnd: '2026-06',
            onChange: function (range) {
                var start = range.start ? kendo.toString(range.start, 'yyyy-MM') : '';
                var end = range.end ? kendo.toString(range.end, 'yyyy-MM') : '';
                $('#statMonthText').text('기간: ' + start + ' ~ ' + end);
            }
        });
    });
</script>`;

const MONTH_OPTIONS = [
    [<code>defaultStart</code> / <code>defaultEnd</code>, '-', <>처음 값 — <code>'yyyy-MM'</code>, <code>'yyyy-MM-dd'</code>, Date</>],
    [<code>min</code> / <code>max</code>, <><code>'1000-01-01'</code> / <code>'9999-12-31'</code></>, '고를 수 있는 범위'],
    [<code>onChange</code>, '-', <>값이 바뀔 때 <code>{'{ start, end }'}</code> (Date, 그 달 1일) 로 실행</>],
    [<code>format</code>, <code>'yyyy-MM'</code>, '표시 형식'],
    [<code>dateInput</code>, <code>true</code>, <>입력칸에 <code>YYYY-MM</code> 틀 표시 · 키보드 입력</>],
    [<code>placeholder</code>, <code>''</code>, <>입력칸 placeholder (<code>dateInput: false</code> 일 때 보임)</>],
    ['그 밖의 Kendo 옵션', '-', '두 DatePicker 에 똑같이 전달'],
];

const DATE_RANGE = `<div id="eduPeriod" style="width: 440px;"></div>
<p id="eduPeriodText" style="margin-top: 10px;">기간: 없음</p>

<script>
    $(function () {
        // input 이 아니라 div 에 만듭니다. (시작·종료 입력칸 2개가 안에 생김)
        kendoUi.createDateRangePicker('#eduPeriod', {
            min: '2026-01-01',
            max: '2026-12-31',
            onChange: function () {
                var range = kendoUi.getDateRangePickerData('#eduPeriod');   // 둘 다 골라야 값이 있음
                $('#eduPeriodText').text(range ? '기간: ' + range.start + ' ~ ' + range.end : '기간: 없음');
            }
        });
    });
</script>`;

const DATE_RANGE_VALUE = `// 값 읽기 — 시작·종료가 모두 있을 때만 { start, end } ('yyyy-MM-dd'), 하나라도 비면 null
var range = kendoUi.getDateRangePickerData('#eduPeriod');
if (range) {
    console.log(range.start, range.end);   // '2026-11-01' '2026-11-30'
}

// 값 넣기 — 'yyyy-MM-dd', 'yyyyMMdd', Date 모두 가능
kendoUi.setDateRangePickerData('#eduPeriod', '2026-11-01', '2026-11-30');
kendoUi.setDateRangePickerData('#eduPeriod', '20261101', '20261130');

// 비우기 — 값을 넘기지 않으면 초기화
kendoUi.setDateRangePickerData('#eduPeriod');`;

const DATE_RANGE_OPTIONS = [
    [<code>min</code> / <code>max</code>, '-', <>고를 수 있는 기간 — <code>'yyyy-MM-dd'</code>, <code>'yyyyMMdd'</code>, Date</>],
    [<code>onChange</code>, '-', '시작 또는 종료가 바뀔 때마다 실행 (한쪽만 고른 상태에서도 실행)'],
    [<code>format</code>, <code>'yyyy-MM-dd'</code>, '표시 형식'],
    [<code>dateInput</code>, <code>true</code>, <>입력칸에 <code>YYYY-MM-DD</code> 틀 표시 · 키보드 입력</>],
    [<code>clearButton</code>, <code>true</code>, '값 지우기(×) 버튼'],
    [<code>calendarButton</code>, <code>true</code>, '달력 버튼'],
    [<code>messages</code>, '시작 / 종료', <>입력칸 이름(<code>startLabel</code>, <code>endLabel</code>)과 빈 칸 표시(<code>dateInput</code>)</>],
    ['그 밖의 Kendo 옵션', '-', <><code>range</code>(처음 기간), <code>depth</code> 등 그대로 전달</>],
];

const COLOR_PICKER = `<div class="pd-flex- pd-align-center pd-gap10">
    <input type="text" id="themeColor">
    <span id="themeColorText">#5c61d4</span>
</div>

<script>
    $(function () {
        // 열면 색 영역(gradient)에서 고르고 [적용] 버튼으로 확정합니다.
        kendoUi.createColorPicker('#themeColor', {
            value: '#5c61d4',
            onChange: function (e) {
                $('#themeColorText').text(e.value);   // 선택한 색 (#rrggbb)
            }
        });
    });
</script>`;

const COLOR_PALETTE = `<input type="text" id="labelColor">

<script>
    $(function () {
        // 정해진 색 중에서만 고르게 할 때 — views 를 'palette' 로 바꾸고 색 목록을 넘깁니다.
        kendoUi.createColorPicker('#labelColor', {
            value: '#5c61d4',
            views: ['palette'],
            palette: ['#5c61d4', '#ff6b00', '#22a06b', '#e5484d', '#333333', '#cccccc'],
            columns: 6,            // 한 줄에 놓을 색 개수 (Kendo 옵션)
            buttons: false         // [적용] 버튼 없이, 고른 뒤 팝업이 닫힐 때 적용
        });
    });
</script>`;

const COLOR_VALUE = `// 값 읽기 — 위젯이 없으면 '' 를 돌려줍니다.
var color = kendoUi.getColorPickerValue('#themeColor');   // '#5c61d4'

// 값 넣기 — onChange 는 실행되지 않습니다. (사용자가 고를 때만 실행)
kendoUi.setColorPickerValue('#themeColor', '#22a06b');

// 투명도까지 받을 때: opacity: true → 값이 'rgba(92, 97, 212, 0.5)' 형식
kendoUi.createColorPicker('#bgColor', { value: 'rgba(92, 97, 212, 0.5)', opacity: true });`;

const COLOR_OPTIONS = [
    [<code>value</code>, <code>'#ffffff'</code>, '처음 색'],
    [<code>onChange</code>, '-', <>색을 확정했을 때 실행. <code>e.value</code> 가 선택한 색</>],
    [<code>buttons</code>, <code>true</code>, <>[취소] [적용] 버튼 표시. <code>false</code> 면 고른 뒤 팝업이 닫힐 때 적용</>],
    [<code>opacity</code>, <code>false</code>, <>투명도 조절 표시. 켜면 값이 <code>rgba(...)</code> 형식</>],
    [<code>palette</code>, '-', <>색 목록 배열 — <code>views: ['palette']</code> 와 함께 사용</>],
    ['그 밖의 Kendo 옵션', '-', <><code>views</code>, <code>columns</code>, <code>enable</code> 등 그대로 전달</>],
];

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

            <SubSection id="s-date-single" title="날짜 하나" />
            <Prose>
                기간이 아닌 날짜 하나는 <code>kendoUi.createDatePicker(선택자, 옵션)</code> 으로 만듭니다.
            </Prose>
            <Example title="날짜 하나" code={DATE_SINGLE} kendo minHeight={440} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={DATE_OPTIONS} />
            <CodeBlock code={DATE_VALUE} language="js" fileName="page.js (예시)" />

            <SubSection id="s-date-quick" title="기간 버튼 (값 함께 넣기)" />
            <Prose>
                검색 영역의 "오늘 / 최근 7일 / 이번 달" 같은 버튼은{' '}
                <code>kendoUi.setDatePickerStartEndValues(시작, 종료, 시작값, 종료값)</code> 으로 두 칸을 함께 채웁니다.
                넣은 뒤 종료 최소값·시작 최대값도 새 값에 맞춰 다시 잡으므로, 이전 기간에 막혀 값이 안 들어가는 일이
                없습니다.
            </Prose>
            <Example title="기간 버튼" code={DATE_QUICK} kendo minHeight={390} />
            <CodeBlock code={DATE_SYNC} language="js" fileName="page.js (예시)" />

            <Section id="s-month" num="02" title="월 선택 (시작 ~ 종료)" />
            <Prose>
                통계·정산처럼 월 단위로 조회하는 화면은{' '}
                <code>kendoUi.createMonthPickerStartEnd(시작, 종료, 옵션)</code> 을 씁니다. 달력이 연·월 단계에서
                멈추고, 일 기간과 마찬가지로 시작월을 고르면 종료월의 최소값이 맞춰집니다. 값을 함께 넣을 때도{' '}
                <code>setDatePickerStartEndValues</code> 를 그대로 씁니다. (<code>'2026-05'</code> 형식 가능)
            </Prose>
            <Example title="월 기간" code={MONTH_PICKER} kendo minHeight={440} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={MONTH_OPTIONS} />

            <Section id="s-daterange" num="03" title="DateRangePicker" />
            <Prose>
                시작일·종료일을 <b>한 위젯</b>으로 고를 때 씁니다. 달력 하나에서 시작일과 종료일을 차례로 누르면 기간이
                잡힙니다. 입력칸 두 개를 따로 두는 방식은 위 DatePicker 의 <code>createDatePickerStartEnd</code> 를
                쓰세요. 같은 요소에 다시 호출하면 새로 만들지 않습니다.
            </Prose>
            <Example title="기간 (한 위젯)" code={DATE_RANGE} kendo minHeight={460} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={DATE_RANGE_OPTIONS} />
            <SubSection id="s-daterange-value" title="값 읽기 · 넣기" />
            <CodeBlock code={DATE_RANGE_VALUE} language="js" fileName="page.js (예시)" />

            <Section id="s-time" num="04" title="TimePicker" />
            <Prose>
                시간 입력은 <code>kendoUi.createTimePicker(선택자, 옵션)</code> 으로 만듭니다. 값·최소·최대는{' '}
                <code>'HH:mm'</code> 문자열로 넘기면 됩니다. 같은 요소에 다시 호출하면 새로 만들지 않습니다.
            </Prose>
            <Example title="시간 (시작 ~ 종료)" code={TIME_PICKER} kendo minHeight={340} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={TIME_OPTIONS} />
            <SubSection id="s-time-value" title="값 읽기 · 넣기" />
            <CodeBlock code={TIME_VALUE} language="js" fileName="page.js (예시)" />

            <Section id="s-dropdown" num="05" title="DropDownList" />
            <Example title="상태 선택" code={DROP_DOWN} kendo minHeight={200} />

            <SubSection id="s-dropdown-cascade" title="분류 3단 연동" />
            <Prose>
                대·중·소 분류처럼 위 칸을 고르면 아래 칸 목록이 바뀌는 경우입니다. <code>onChange</code> 에서{' '}
                <code>setDropDownListData</code> 로 아래 목록을 바꾸고, 고른 값은{' '}
                <code>getDropDownValuesThree</code> 로 한 번에 읽습니다.
            </Prose>
            <Example title="대 · 중 · 소 분류" code={DROP_DOWN_CASCADE} kendo minHeight={240} />

            <SubSection id="s-dropdown-value" title="값 읽기 · 넣기 · 목록 바꾸기" />
            <CodeBlock code={DROP_DOWN_VALUE} language="js" fileName="page.js (예시)" />
            <DocTable
                columns={['함수', '설명']}
                rows={[
                    [<code>getDropDownListValue(id)</code>, <>선택 값. 없으면 <code>''</code></>],
                    [<code>getDropDownListText(id)</code>, '선택 글자 (선택 전이면 optionLabel 문구)'],
                    [<code>setDropDownListValue(id, value)</code>, '값 넣기 — onChange 는 실행되지 않음'],
                    [<code>setDropDownListData(id, data)</code>, '목록 통째로 바꾸기'],
                    [<code>getDropDownValuesThree(id1, id2, id3)</code>, '세 칸 중 고른 값만 배열로'],
                    [<code>resetDropDown(id)</code>, <>위젯 지우기 — 바로 <code>createDropDownList</code> 로 다시 만들 때만 사용</>],
                ]}
            />

            <Section id="s-autocomplete" num="06" title="AutoComplete" />
            <Prose>
                입력하면서 목록에서 추천받는 칸입니다. 목록에 없는 값도 그대로 입력할 수 있다는 점이 DropDownList 와
                다릅니다. (정해진 값만 받아야 하면 DropDownList 의 <code>filter: true</code> 를 쓰세요)
            </Prose>
            <Example title="강사명 추천" code={AUTO_COMPLETE} kendo minHeight={260} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={AUTO_COMPLETE_OPTIONS} />
            <CodeBlock
                code={`// 값 읽기 — 입력된 글자 그대로 (없으면 '')\nvar name = kendoUi.getAutoCompleteValue('#teacherName');`}
                language="js"
                fileName="page.js (예시)"
            />

            <Section id="s-multiselect" num="07" title="MultiSelect" />
            <Prose>
                여러 개를 고르는 칸입니다. 고른 항목은 태그로 표시되고 × 로 하나씩 뺄 수 있습니다.
            </Prose>
            <Example title="권한 여러 개 선택" code={MULTI_SELECT} kendo minHeight={300} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={MULTI_SELECT_OPTIONS} />
            <SubSection id="s-multiselect-value" title="값 읽기 · 넣기" />
            <CodeBlock code={MULTI_SELECT_VALUE} language="js" fileName="page.js (예시)" />

            <Section id="s-numeric" num="08" title="NumericTextBox" />
            <Example title="숫자 입력" code={NUMERIC} kendo />

            <Section id="s-color" num="09" title="ColorPicker" />
            <Prose>
                색을 고르는 입력창은 <code>kendoUi.createColorPicker(선택자, 옵션)</code> 으로 만듭니다. 관리자 공통
                설정으로 미리보기·직접 입력칸을 숨기고 색 영역(gradient)만 보여 줍니다. 같은 요소에 다시 호출하면 새로
                만들지 않고 <code>value</code> 만 바꿉니다.
            </Prose>
            <Example title="기본 (색 영역)" code={COLOR_PICKER} kendo minHeight={420} />
            <Example title="팔레트 (정해진 색만)" code={COLOR_PALETTE} kendo minHeight={200} />
            <DocTable columns={['옵션', '기본값', '설명']} rows={COLOR_OPTIONS} />
            <SubSection id="s-color-value" title="값 읽기 · 넣기" />
            <CodeBlock code={COLOR_VALUE} language="js" fileName="page.js (예시)" />

            <Section id="s-grid" num="10" title="Grid" />
            <Prose>
                그리드는 옵션이 많아 별도 페이지로 정리했습니다 →{' '}
                <Link to="/kendo/grid">Kendo UI › Grid</Link>
            </Prose>
        </DocPage>
    );
}
