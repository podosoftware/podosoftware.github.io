import { Callout, CodeBlock, DocList, DocPage, DocTable, Example, Prose, Section, SubSection } from '../../components/doc';

/**
 * Kendo TreeView — kendoComponentUtil.js 의 kendoUi.createTreeView() 사용법
 */

/** 예제마다 같은 조직도 데이터 (미리보기용) */
const ORG_DATA = `        var orgData = [
            {
                id: 1, text: '본사', expanded: true,
                items: [
                    { id: 11, text: '경영지원팀' },
                    {
                        id: 12, text: '교육운영팀', expanded: true,
                        items: [
                            { id: 121, text: '운영1파트' },
                            { id: 122, text: '운영2파트' }
                        ]
                    }
                ]
            },
            {
                id: 2, text: '지사',
                items: [{ id: 21, text: '부산지사' }, { id: 22, text: '대구지사' }]
            }
        ];`;

const TREE_BASIC = `<div id="orgTree"></div>
<p id="orgSelected" style="margin-top: 10px;">선택: 없음</p>

<script>
    $(function () {
${ORG_DATA}

        kendoUi.createTreeView('#orgTree', {
            data: orgData,
            dragAndDrop: false,          // 기본값 true — 이동이 필요 없으면 꼭 끄세요
            onSelect: function (e) {
                var item = this.dataItem(e.node);   // 선택한 항목 데이터 { id, text, ... }
                $('#orgSelected').text('선택: ' + item.text + ' (id ' + item.id + ')');
            }
        });
    });
</script>`;

const TREE_CHECK = `<div id="authTree"></div>
<button type="button" class="btn_inner" id="btnChecked" style="margin-top: 10px;"><span>체크한 항목 확인</span></button>
<p id="authChecked" style="margin-top: 10px;">체크: 없음</p>

<script>
    $(function () {
${ORG_DATA}

        kendoUi.createTreeView('#authTree', {
            data: orgData,
            checkboxes: true,            // 상위를 체크하면 하위도 함께 체크
            dragAndDrop: false
        });

        $('#btnChecked').on('click', function () {
            var tree = $('#authTree').data('kendoTreeView');
            var ids = getCheckedIds(tree.dataSource.view());
            $('#authChecked').text('체크: ' + (ids.length ? ids.join(', ') : '없음'));
        });
    });

    // 체크된 항목의 id 를 하위까지 모두 모읍니다. (접혀 있는 항목 포함)
    function getCheckedIds(nodes) {
        var ids = [];
        $.each(nodes, function (i, node) {
            if (node.checked) {
                ids.push(node.id);
            }
            if (node.hasChildren) {
                node.load();   // 아직 펼치지 않은 하위도 읽어 오기
                ids = ids.concat(getCheckedIds(node.children.view()));
            }
        });
        return ids;
    }
</script>`;

const TREE_TEMPLATE = `<div id="menuTree"></div>

<!-- 항목 모양 템플릿 — item 이 각 항목 데이터 -->
<script type="text/x-kendo-template" id="menuTreeTemplate">
    #: item.text #
    # if (item.useYn === 'N') { #<span class="pd-badge disabled">미사용</span># } #
    <button type="button" class="kendo-icon btn_input" title="삭제">삭제</button>
</script>

<script>
    $(function () {
        kendoUi.createTreeView('#menuTree', {
            data: [
                {
                    text: '교육관리', expanded: true,
                    items: [
                        { text: '과정 관리' },
                        { text: '수강 신청', useYn: 'N' }
                    ]
                },
                { text: '회원관리', items: [{ text: '회원 목록' }] }
            ],
            template: '#menuTreeTemplate',   // 템플릿 script 의 선택자
            dragAndDrop: false
        });
    });
</script>`;

const TREE_FUNCTIONS = `var tree = $('#orgTree').data('kendoTreeView');

// 선택한 항목
var selected = tree.dataItem(tree.select());          // 없으면 undefined

// 데이터 다시 넣기 — 같은 요소에 createTreeView 를 다시 부르면 목록만 바뀝니다.
kendoUi.createTreeView('#orgTree', { data: newOrgData });

// 모두 펼치기 / 접기
tree.expand('.k-treeview-item');
tree.collapse('.k-treeview-item');

// id 로 찾아 선택
var node = tree.findByUid(tree.dataSource.get(121).uid);
tree.select(node);

// 드래그로 옮긴 뒤 서버에 저장 (dragAndDrop: true 일 때)
tree.bind('drop', function (e) {
    var source = tree.dataItem(e.sourceNode);
    var target = tree.dataItem(e.destinationNode);
    // e.dropPosition: 'over'(안으로) / 'before' / 'after'
    console.log(source.id, e.dropPosition, target.id);
});`;

const DATA_FORMAT = `[
    {
        id: 1,              // 구분 값 (dataSource.get(id) 로 찾을 때 사용)
        text: '본사',        // 보이는 글자
        expanded: true,     // 처음부터 펼침
        checked: false,     // 체크 상태 (checkboxes 사용 시)
        sprite: 'folder',   // 앞에 붙일 아이콘 클래스 (선택)
        items: [ ... ]      // 하위 항목 — 같은 형식
    }
]`;

const OPTION_ROWS = [
    [<code>data</code>, '-', <>항목 배열 (필수) — 아래 "데이터 형식" 참고</>],
    [<code>dragAndDrop</code>, <code>true</code>, <>끌어서 옮기기. <b>기본으로 켜져 있으니</b> 필요 없으면 <code>false</code></>],
    [<code>checkboxes</code>, <code>false</code>, <><code>true</code>: 체크박스 + 상위 체크 시 하위 함께 체크</>],
    [<code>template</code>, '-', <>항목 모양 템플릿의 <b>선택자</b> (예: <code>'#menuTreeTemplate'</code>)</>],
    [<code>onSelect</code>, '-', <>항목을 클릭했을 때 — <code>this.dataItem(e.node)</code> 로 데이터</>],
    [<code>onExpand</code> / <code>onCollapse</code>, '-', '펼칠 때 / 접을 때'],
    [<code>loadOnDemand</code>, <code>false</code>, '펼칠 때 하위를 그리기 (항목이 아주 많을 때)'],
    ['그 밖의 Kendo 옵션', '-', <><code>dataSource</code>(서버 조회), <code>drop</code>, <code>check</code> 등 그대로 전달</>],
];

export default function KendoTreeViewPage() {
    return (
        <DocPage
            hero={{
                label: 'TreeView',
                eyebrow: 'Kendo UI',
                title: '',
                strong: 'TreeView',
                desc: '조직도·메뉴·카테고리처럼 단계가 있는 목록은 kendoComponentUtil.js 의 kendoUi.createTreeView() 로 만듭니다.',
            }}
        >
            <Prose>
                <code>$('#tree').kendoTreeView()</code> 를 직접 호출하지 않습니다. <code>kendoUi.createTreeView()</code> 는
                체크박스 하위 연동, 템플릿 선택자 처리, 삭제 버튼 동작을 함께 설정합니다. 같은 요소에 다시 호출하면 위젯을
                새로 만들지 않고 <b>데이터만</b> 바꿉니다.
            </Prose>

            <Section id="s-basic" num="01" title="기본" />
            <Example
                title="조직도"
                description="항목을 누르면 onSelect 에서 선택한 항목의 데이터를 꺼냅니다."
                code={TREE_BASIC}
                kendo
                minHeight={300}
            />

            <Section id="s-check" num="02" title="체크박스" />
            <Example
                title="체크박스 + 체크한 항목 가져오기"
                description="상위를 체크하면 하위가 함께 체크됩니다. 버튼을 누르면 체크한 항목의 id 를 모아 보여 줍니다."
                code={TREE_CHECK}
                kendo
                minHeight={380}
            />
            <Callout type="info" title="체크한 항목을 꺼내는 공통 함수는 없습니다">
                예제의 <code>getCheckedIds()</code> 처럼 <code>dataSource.view()</code> 를 하위까지 돌며 모읍니다. 접혀
                있는 하위는 <code>node.load()</code> 로 먼저 읽어야 빠지지 않습니다.
            </Callout>

            <Section id="s-template" num="03" title="템플릿 · 삭제 버튼" />
            <Example
                title="뱃지 + 삭제 버튼"
                description="템플릿으로 항목 옆에 뱃지·버튼을 넣습니다. class 에 kendo-icon 이 있는 버튼을 누르면 그 항목이 바로 삭제됩니다."
                code={TREE_TEMPLATE}
                kendo
                minHeight={240}
            />
            <Callout type="warn" title="kendo-icon 클래스 = 삭제 버튼">
                <code>createTreeView</code> 는 트리 안의 <code>.kendo-icon</code> (또는 <code>.telerik-icon</code>) 클릭을
                <b>확인 없이 삭제</b>로 처리합니다. <code>allowDeleteNodes</code> 옵션 값과 관계없이 동작하므로, 삭제가 아닌
                버튼·아이콘에는 이 클래스를 쓰지 마세요. 화면에서만 지워지므로 서버 저장은 따로 처리해야 합니다.
            </Callout>

            <Section id="s-data" num="04" title="데이터 형식" />
            <CodeBlock code={DATA_FORMAT} language="js" fileName="data" />

            <Section id="s-options" num="05" title="옵션" />
            <DocTable columns={['옵션', '기본값', '설명']} rows={OPTION_ROWS} />

            <Section id="s-functions" num="06" title="자주 쓰는 처리" />
            <Prose>
                값 읽기·넣기 전용 함수는 없어서, 위젯(<code>$('#id').data('kendoTreeView')</code>)을 꺼내 처리합니다.
            </Prose>
            <CodeBlock code={TREE_FUNCTIONS} language="js" fileName="page.js (예시)" />
            <SubSection id="s-notice" title="주의할 점" />
            <DocList
                items={[
                    <>
                        <code>dragAndDrop</code> 기본값이 <code>true</code> 입니다. 옮기기가 없는 화면은 꼭{' '}
                        <code>false</code> 로 주세요.
                    </>,
                    <>
                        <code>data</code> 는 필수입니다. 서버에서 받아 올 때는 받은 뒤에 <code>createTreeView</code> 를
                        호출하거나, Kendo <code>dataSource</code> 옵션을 넘깁니다.
                    </>,
                    <>
                        <code>template</code> 은 템플릿 문자열이 아니라 <b>템플릿 script 의 선택자</b>입니다.
                    </>,
                ]}
            />
        </DocPage>
    );
}
