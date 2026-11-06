import { Callout, CodeBlock, DocList, DocPage, DocTable, Example, Prose, Section, SubSection } from '../../components/doc';

/**
 * Kendo Grid — kendoComponentUtil.js 의 kendoUi.createGrid() 사용법
 *
 * 미리보기는 서버가 없으므로 화면에서 만든 배열을 { data, totalCount } 로 감싸 넘깁니다.
 * (createGrid 는 서버 응답 형식을 기준으로 읽습니다 — 아래 "서버 조회" 참고)
 */

/** 예제마다 같은 샘플 데이터를 만드는 코드 (미리보기용) */
const SAMPLE_ROWS = `        var rows = [];
        for (var i = 1; i <= 23; i++) {
            rows.push({
                title: '공지사항 ' + i,
                writer: i % 2 ? '관리자' : '운영팀',
                regDate: '2026-10-' + (i < 10 ? '0' + i : i),
                viewCnt: i * 1234,
                useYn: i % 3 ? 'Y' : 'N'
            });
        }`;

const GRID_BASIC = `<div id="noticeGrid"></div>

<script>
    $(function () {
${SAMPLE_ROWS}

        kendoUi.createGrid('#noticeGrid', {
            data: { data: rows, totalCount: rows.length },  // 서버 응답과 같은 형식
            pageSize: 10,
            height: false,                                   // 높이 고정 안 함 (기본은 화면 높이에 맞춤)
            columns: [
                { field: 'title', title: '제목' },
                { field: 'writer', title: '작성자', width: 120 },
                { field: 'regDate', title: '등록일', width: 130 }
            ]
        });
    });
</script>`;

const GRID_CHECK = `<div id="memberGrid"></div>
<p id="memberChkResult" style="margin-top: 10px;">선택: 없음</p>

<script>
    $(function () {
${SAMPLE_ROWS}

        kendoUi.createGrid('#memberGrid', {
            data: { data: rows, totalCount: rows.length },
            pageSize: 10,
            height: false,
            numbering: true,      // 번호 컬럼 (서버가 rnum 을 주면 그 값, 없으면 화면에서 매김)
            selectable: true,     // 맨 앞 체크박스 컬럼 + 전체 선택
            totalTxt: '회원 목록',
            topButton: '<button type="button" class="btn_inner" id="btnChkData"><span>선택 항목 확인</span></button>',
            columns: [
                { field: 'title', title: '제목' },
                { field: 'writer', title: '작성자', width: 120 }
            ]
        });

        // 체크된 행의 데이터 가져오기
        $(document).on('click', '#btnChkData', function () {
            var checked = kendoUi.getGridChkRowData('#memberGrid');
            var titles = checked.map(function (item) { return item.title; });
            $('#memberChkResult').text('선택: ' + (titles.length ? titles.join(', ') : '없음'));
        });
    });
</script>`;

const GRID_COLUMNS = `<div id="boardGrid"></div>

<script>
    $(function () {
${SAMPLE_ROWS}

        kendoUi.createGrid('#boardGrid', {
            data: { data: rows, totalCount: rows.length },
            pageSize: 5,
            height: false,
            columns: [
                {
                    field: 'title',
                    title: '제목',
                    // 템플릿 안 데이터는 #: # 로 넣습니다. (자동으로 HTML 이스케이프)
                    template: '<a href="javascript:void(0);" class="text-link" onclick="openBoard(\\'#: uid #\\')">#: title #</a>'
                },
                { field: 'regDate', title: '등록일', type: 'date', width: 130 },          // yyyy-MM-dd 로 표시
                {
                    field: 'viewCnt',
                    title: '조회수',
                    type: 'number',                                                      // 천 단위 쉼표 (n0)
                    width: 100,
                    attributes: { style: 'text-align: right' }
                },
                {
                    field: 'useYn',
                    title: '사용',
                    width: 90,
                    filterable: false,
                    attributes: { style: 'text-align: center' },
                    template: '# if (useYn === "Y") { #<span class="pd-badge">사용</span># } else { #<span class="pd-badge disabled">미사용</span># } #'
                }
            ]
        });
    });

    // 링크 클릭 → 행 데이터 꺼내기
    function openBoard(uid) {
        var item = kendoUi.getGridRowData('#boardGrid', uid);
        console.log(item.title, item.writer);
    }
</script>`;

const SERVER_CODE = `<div id="noticeGrid"></div>

<script>
    $(function () {
        kendoUi.createGrid('#noticeGrid', {
            mid: 'NOTICE_LIST',                  // 화면 ID — 컬럼 숨김 상태를 화면별로 기억 (columnMenu 사용 시)
            readUrl: '/admin/notice/list.do',    // POST 로 조회
            readParamFun: getSearchParam,        // 검색 조건을 돌려주는 함수 (조회할 때마다 호출)
            numbering: true,
            columnMenu: true,
            columns: [
                { field: 'title', title: '제목' },
                { field: 'regDate', title: '등록일', type: 'date', width: 130 }
            ]
        });

        // 검색 버튼 → 1 페이지부터 다시 조회 (정렬·필터 초기화)
        $('#searchBtn').on('click', function () {
            kendoUi.readGridData('#noticeGrid');
        });

        // 저장 후 → 지금 페이지 그대로 다시 조회
        // kendoUi.readGridData('#noticeGrid', true);
    });

    function getSearchParam() {
        return {
            searchTitle: $('#searchTitle').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val()
        };
    }
</script>`;

const SERVER_FORMAT = `// 요청 (POST, form) — kendoUi.getParamterMap 이 만들어 보냅니다.
page=1&pageSize=30&sortField=regDate&sortDir=desc
&searchTitle=...&startDate=...&endDate=...      // readParamFun() 이 돌려준 값
// 컬럼 필터를 쓰면 filter 정보도 함께 전송 (날짜는 yyyy-MM-dd 로 바꿔서)

// 응답 (JSON) — 이 형식이 아니면 그리드가 비어 보입니다.
{
    "data": [
        { "rnum": 1, "title": "신규 과정 안내", "regDate": "2026-11-02" },
        ...
    ],
    "totalCount": 120,      // 전체 건수 → "검색결과 (총 120건)" + 페이지 수 계산
    "data2": { ... }        // (선택) data2Nm 옵션으로 지정한 전역 변수에 담김
}`;

const OPTION_ROWS = [
    [<code>columns</code>, '-', <>컬럼 목록 (필수). <code>type: 'date' | 'datetime' | 'number'</code> 를 주면 형식이 자동 지정</>],
    [<code>data</code>, '-', <>화면에서 만든 데이터 — <code>{'{ data: [...], totalCount: n }'}</code> 형식</>],
    [<code>readUrl</code>, '-', '서버 조회 주소 (POST). 지정하면 페이지·정렬·필터를 서버에서 처리'],
    [<code>readParamFun</code>, '-', '검색 조건 객체를 돌려주는 함수'],
    [<code>pageSize</code>, <code>30</code>, '한 페이지 행 수'],
    [<code>pageSizes</code>, '자동', <>페이지 크기 선택 목록 (30 → [30, 50, 100, 300, 500])</>],
    [<code>pageable</code>, <code>true</code>, <><code>false</code> 면 페이지 영역 숨김</>],
    [<code>height</code>, '자동', <>생략·<code>true</code>: 화면 높이에 맞춤 / 숫자: 고정 / <code>false</code>: 내용만큼</>],
    [<code>minHeight</code>, <code>'300px'</code>, <><code>height: false</code> 일 때 최소 높이</>],
    [<code>numbering</code>, <code>false</code>, <>번호 컬럼 추가. <code>{'{ width: 60 }'}</code> 로 폭 지정</>],
    [<code>selectable</code>, <code>false</code>, '맨 앞 체크박스 컬럼 + 전체 선택'],
    [<code>totaling</code>, <code>true</code>, <>상단 "검색결과 (총 n건)" 표시. <code>false</code> 면 숨김</>],
    [<code>totalTxt</code>, <code>'검색결과'</code>, '건수 앞 문구'],
    [<code>topButton</code>, '-', '그리드 상단 오른쪽에 넣을 버튼 HTML'],
    [<code>filterable</code>, <code>true</code>, <>컬럼 필터 (메뉴형, 한글 조건). <code>false</code> 면 끔</>],
    [<code>sortable</code>, <code>true</code>, '컬럼 정렬'],
    [<code>columnMenu</code>, <code>false</code>, <>컬럼 숨김/보이기 메뉴. 숨김 상태는 <code>mid</code> 별로 저장</>],
    [<code>mid</code>, '-', '화면 ID — 컬럼 숨김 상태 저장 키'],
    [<code>idField</code>, <code>'rnum'</code>, <>행을 구분하는 필드 (<code>setGridDataPush</code> 에 필요)</>],
    [<code>autoBind</code>, <code>true</code>, <><code>false</code> 면 처음에 조회하지 않음 (검색 버튼을 눌러야 조회)</>],
    [<code>onDataBound</code>, '-', '조회·그리기가 끝날 때마다 실행할 함수'],
    [<code>rowTemplate</code>, '-', '행 전체를 직접 그릴 때 (Kendo 옵션)'],
];

const FUNCTION_ROWS = [
    [<code>kendoUi.readGridData(id)</code>, '1 페이지부터 다시 조회 (정렬·필터·체크 초기화)'],
    [<code>kendoUi.readGridData(id, true)</code>, '지금 페이지 그대로 다시 조회'],
    [<code>kendoUi.getGridChkRowData(id)</code>, '체크된 행의 데이터 배열'],
    [<code>kendoUi.getGridChkList(id)</code>, '체크된 체크박스 요소 (jQuery)'],
    [<code>kendoUi.clearGridChk(id)</code>, '체크 모두 해제'],
    [<code>kendoUi.getGridRowData(id, uid)</code>, <>행 하나의 데이터 (템플릿의 <code>#: uid #</code> 로 전달)</>],
    [
        <code>kendoUi.selectGridRow(this)</code>,
        <>템플릿 안 버튼·링크에서 그 행을 선택 상태로 (예: <code>{'onclick="kendoUi.selectGridRow(this)"'}</code>)</>,
    ],
    [<code>kendoUi.getGridData(id)</code>, '현재 그리드 데이터 전체'],
    [<code>kendoUi.setGridData(id, data)</code>, '데이터 통째로 바꾸기 (배열)'],
    [<code>kendoUi.setGridDataPush(id, row)</code>, <>행 추가 — <code>idField</code> 기준, 같은 ID 는 추가 안 됨</>],
];

export default function KendoGridPage() {
    return (
        <DocPage
            hero={{
                label: 'Grid',
                eyebrow: 'Kendo UI',
                title: '',
                strong: 'Grid',
                desc: '목록 화면의 표는 kendoComponentUtil.js 의 kendoUi.createGrid() 로 만듭니다. 건수 표시, 페이지, 필터, 정렬, 번호·체크박스가 기본으로 들어 있습니다.',
            }}
        >
            <Prose>
                <code>$('#grid').kendoGrid()</code> 를 직접 호출하지 않습니다. <code>kendoUi.createGrid()</code> 는 관리자
                화면 공통 설정(한글 필터 조건, 페이지 크기 목록, "검색결과 (총 n건)", 검색결과 없음 문구, 화면 높이 맞춤)을
                한 번에 적용합니다. 같은 요소에 다시 호출하면 기존 그리드를 지우고 새로 만듭니다.
            </Prose>

            <Section id="s-basic" num="01" title="기본" />
            <Example
                title="기본 목록"
                description="columns 와 데이터만 넘기면 건수·페이지·필터·정렬이 붙습니다."
                code={GRID_BASIC}
                kendo
                minHeight={520}
            />

            <Section id="s-check" num="02" title="번호 · 체크박스 · 상단 버튼" />
            <Example
                title="번호 + 체크박스 + 상단 버튼"
                description="numbering, selectable, topButton, totalTxt 옵션입니다. 체크 후 버튼을 누르면 선택한 행의 제목이 아래에 표시됩니다."
                code={GRID_CHECK}
                kendo
                minHeight={560}
            />

            <Section id="s-columns" num="03" title="컬럼 형식 · 템플릿" />
            <Example
                title="날짜 · 숫자 · 링크 · 뱃지"
                description="type 으로 날짜·숫자 형식을, template 으로 링크나 뱃지를 넣습니다."
                code={GRID_COLUMNS}
                kendo
                minHeight={380}
            />
            <DocList
                items={[
                    <>
                        <code>type: 'date'</code> → <code>yyyy-MM-dd</code>, <code>'datetime'</code> →{' '}
                        <code>yyyy-MM-dd HH:mm:ss</code>, <code>'number'</code> → 천 단위 쉼표 (<code>format</code> 을 주면 그
                        값 사용)
                    </>,
                    <>
                        템플릿에서 데이터는 <code>#: 필드 #</code> 로 넣습니다. <code>#= #</code> 은 HTML 을 그대로 넣으므로
                        사용자 입력값에는 쓰지 않습니다.
                    </>,
                    <>
                        행 데이터가 필요하면 템플릿에서 <code>#: uid #</code> 를 넘기고{' '}
                        <code>kendoUi.getGridRowData(id, uid)</code> 로 꺼냅니다.
                    </>,
                ]}
            />

            <Section id="s-server" num="04" title="서버 조회" />
            <Prose>
                실제 화면은 <code>readUrl</code> 로 서버에서 조회합니다. 페이지·정렬·필터는 서버에서 처리하고, 조회할
                때마다 <code>readParamFun()</code> 이 돌려준 검색 조건이 함께 전송됩니다.
            </Prose>
            <CodeBlock code={SERVER_CODE} language="html" fileName="page.html (예시)" />
            <SubSection id="s-server-format" title="요청 · 응답 형식" />
            <CodeBlock code={SERVER_FORMAT} language="js" fileName="서버 연동" />
            <Callout type="warn" title="응답은 { data, totalCount }">
                배열만 돌려주면 그리드가 비어 보입니다. 화면에서 만든 데이터를 넘길 때도 같은 형식으로 감싸야 합니다.
                조회 오류는 <code>podo.ui.handleAjaxError</code> 로 처리하므로, 이 함수가 있는 공통 스크립트를 함께
                불러와야 합니다.
            </Callout>

            <Section id="s-options" num="05" title="옵션" />
            <DocTable columns={['옵션', '기본값', '설명']} rows={OPTION_ROWS} />
            <Prose>
                표에 없는 Kendo Grid 옵션은 지원하지 않는 것도 있습니다. <code>createGrid</code> 는 위 옵션만 골라
                Kendo 에 넘기므로, 다른 옵션이 필요하면 생성 후 <code>$('#grid').data('kendoGrid')</code> 로 위젯을 꺼내
                설정하세요.
            </Prose>

            <Section id="s-functions" num="06" title="함수" />
            <DocTable columns={['함수', '설명']} rows={FUNCTION_ROWS} />

            <Section id="s-notice" num="07" title="주의할 점" />
            <DocList
                items={[
                    <>
                        <code>height</code> 를 생략하면 창 크기에 맞춰 높이를 다시 계산합니다. 팝업·탭 안이나 높이가 정해지지
                        않은 곳에서는 <code>height: false</code> 또는 숫자를 주세요.
                    </>,
                    <>
                        <code>selectable</code> 체크박스는 <code>name="CHK_OBJ"</code> 를 씁니다. 체크 상태는 페이지를
                        넘기면 초기화됩니다.
                    </>,
                    <>
                        <code>columnMenu</code> 로 숨긴 컬럼은 브라우저에 저장되어 다음에도 숨겨집니다. 화면마다 다른{' '}
                        <code>mid</code> 를 주세요.
                    </>,
                ]}
            />
        </DocPage>
    );
}
