import { Callout, CodeBlock, DocList, DocPage, DocTable, Prose, Section } from '../../components/doc';
import { KENDO_VERSION } from '../../config/assets.js';

const LOAD_ORDER = `<!-- CSS -->
<link rel="stylesheet" href="/css/kendo/${KENDO_VERSION}/bootstrap-3.css">
<link rel="stylesheet" href="/css/pd_kendo.css">            <!-- 포도 커스텀 (테마 다음) -->

<!-- JS : jQuery → Kendo → 라이선스 → 한글화 → 공통 유틸(kendoComponentUtil.js) -->
<script src="/js/jquery/jquery-3.7.1.min.js"></script>
<script src="/js/kendo/${KENDO_VERSION}/kendo.all.min.js"></script>
<script src="/js/kendo/${KENDO_VERSION}/telerik-license.js"></script>
<script src="/js/kendo/2022.1.119/cultures/kendo.culture.ko-KR.min.js"></script>
<script src="/js/kendo/kendo.messages.ko-KR.js"></script>
<script src="/js/admin/kendoComponentUtil.js"></script>  <!-- kendoUi.createXxx 공통 유틸 -->

<!-- 공통 초기화 : 화면마다 한 번 (공통 head 에 둡니다) -->
<script>
    kendoUi.init();                                                   // 한국어(ko-KR) 설정
    kendoUi.setSvgIcons({ url: '/images/admin/icons/sprite.svg' });   // Kendo 아이콘 → 공통 SVG 아이콘
</script>`;

const CREATE_EXAMPLE = `$(function () {
    // $('#stateCode').kendoDropDownList({ … }) 대신
    kendoUi.createDropDownList('#stateCode', {
        optionLabel: '전체',
        data: [{ text: '진행중', value: 'ING' }, { text: '종료', value: 'END' }]
    });

    // 값 읽기 / 넣기도 kendoUi 로
    var state = kendoUi.getDropDownListValue('#stateCode');
});`;

const ICON_MAP_EXAMPLE = `kendoUi.setSvgIcons({
    url: '/images/admin/icons/sprite.svg',
    map: {
        'caret-alt-down': 'caret-down',   // 드롭다운 화살표를 채워진 삼각형으로
        'x-circle': null                  // null = Kendo 기본 아이콘 그대로
    }
}).then(function (icons) {
    console.log('교체된 Kendo 아이콘', icons);
});`;

const ICON_REFRESH_EXAMPLE = `// setSvgIcons() 이후에 만든 위젯은 자동으로 공통 아이콘으로 그려집니다.
// 직접 붙여 넣은 Kendo 마크업 등, 이미 그려진 아이콘만 다시 그릴 때:
kendoUi.refreshSvgIcons('#searchArea');   // 영역 생략 시 문서 전체`;

const ICON_MAP_ROWS = [
    ['calendar', 'calendar', 'DatePicker, DateRangePicker'],
    ['clock', 'clock', 'TimePicker'],
    ['caret-alt-down / up', 'chevron-down / up', 'DropDownList, NumericTextBox, TreeView'],
    ['caret-alt-left / right', 'chevron-left / right', '달력 이전·다음 달, Pager'],
    ['caret-alt-to-left / to-right', 'chevrons-left / right', 'Pager 처음·마지막'],
    ['x · x-circle', 'close', 'Window 닫기, 값 지우기, 태그 삭제'],
    ['search', 'search', '드롭다운 필터 입력창'],
    ['filter · more-vertical', 'filter · more', 'Grid 필터, 컬럼 메뉴'],
    ['sort-asc-small / desc-small', 'arrow-up / down', 'Grid 정렬'],
];

const VERSION_CHECK = `// 개발자도구 콘솔에서 실행
console.log('Kendo UI :', kendo.VERSION);      // 2025.1.211
console.log('jQuery   :', jQuery.fn.jquery);   // 3.7.1
console.log(kendo.ui.svgIcons.calendarIcon.viewBox);  // '0 0 24 24' 이면 공통 아이콘 적용됨`;

const COMPONENT_ROWS = [
    ['Grid', '호환', 'kendoUi.createGrid — 컬럼 숨김 상태 캐시(GridColumnCache) 포함'],
    ['DropDownList · MultiSelect · AutoComplete', '호환', 'kendoUi.createDropDownList / createMultiSelect / createAutoComplete'],
    ['DatePicker · TimePicker · DateRangePicker', '호환', 'kendoUi.createDatePicker / createDatePickerStartEnd / createTimePicker'],
    ['NumericTextBox', '호환', 'kendoUi.createNumericTextBox — input type="number" 대신 사용'],
    ['TabStrip · Window · TreeView', '호환', 'kendoUi.createTab / createWindow · openWindow / createTreeView'],
];

export default function KendoOverviewPage() {
    return (
        <DocPage
            hero={{
                label: 'Kendo',
                eyebrow: 'Kendo UI',
                title: 'Kendo UI',
                strong: KENDO_VERSION,
                desc: '관리자 화면은 Kendo UI for jQuery 2025.1.211 (2025 Q1) 기준입니다. 이전 버전(2022, 2023) 파일은 새 화면에서 사용하지 않습니다.',
                meta: [{ icon: 'check-circle', text: `kendo.VERSION = ${KENDO_VERSION}` }],
            }}
        >
            <Section id="s-load" num="01" title="로드 순서" />
            <CodeBlock code={LOAD_ORDER} language="html" fileName="head.html" />
            <Callout type="warn" title="한글화 파일 경로">
                ko-KR culture 파일은 2025 폴더에 없어 <code>2022.1.119/cultures</code> 의 파일을 그대로 씁니다. 2025
                용 culture 파일을 받으면 이 경로만 바꾸면 됩니다.
            </Callout>

            <Section id="s-util" num="02" title="kendoComponentUtil.js 로 생성" />
            <Prose>
                위젯은 <code>$(...).kendoXxx()</code> 를 직접 호출하지 않고 <code>kendoUi.createXxx(선택자, 옵션)</code>{' '}
                으로 만듭니다. 한국어 기본값, 중복 생성 방지, 요소가 없을 때 경고, 시작/종료일 연동 같은 공통 처리가 들어
                있어 화면마다 같은 코드를 반복하지 않아도 됩니다. 유틸에 없는 Kendo 옵션도 옵션 객체에 그대로 넣으면
                전달됩니다.
            </Prose>
            <CodeBlock code={CREATE_EXAMPLE} language="js" fileName="page.js (예시)" />

            <Section id="s-icon" num="03" title="아이콘 (SVG 교체)" />
            <Prose>
                Kendo UI 2025 는 아이콘을 <code>&lt;span class=&quot;k-svg-icon k-svg-i-이름&quot;&gt;&lt;svg&gt;…</code>{' '}
                처럼 인라인 SVG 로 그립니다. 그래서 CSS 배경 이미지로 지정한 아이콘은 적용되지 않습니다.{' '}
                <code>kendoUi.setSvgIcons({'{ url }'})</code> 는 지정한 주소의 공통 아이콘 스프라이트(
                <code>sprite.svg</code>)를 한 번 불러와, Kendo 가 아이콘을 그릴 때 참조하는 등록값(
                <code>kendo.ui.svgIcons</code>)을 공통 아이콘 도형으로 바꿉니다.
            </Prose>
            <DocList
                items={[
                    <>이후 생성되는 위젯(달력·드롭다운 팝업 포함)은 처음부터 공통 아이콘으로 그려집니다.</>,
                    <>스프라이트를 받기 전에 이미 만들어진 위젯은 받은 직후 자동으로 다시 그립니다.</>,
                    <>
                        Kendo 원본 파일은 수정하지 않습니다. 아이콘 색은 <code>currentColor</code> 라 기존처럼 CSS{' '}
                        <code>color</code> 로 바꿉니다.
                    </>,
                    <>
                        스프라이트를 못 불러오면 콘솔에 오류를 남기고 Kendo 기본 아이콘을 그대로 씁니다. (화면은 깨지지
                        않음)
                    </>,
                ]}
            />
            <DocTable columns={['Kendo 아이콘', '공통 아이콘', '쓰이는 곳']} rows={ICON_MAP_ROWS} />
            <Prose>
                표에 없는 아이콘을 바꾸거나 일부만 Kendo 기본으로 두려면 <code>map</code> 옵션을 씁니다. Kendo 아이콘
                이름은 개발자도구에서 <code>k-svg-i-이름</code> 클래스로 확인할 수 있고, 공통 아이콘 이름은 아이콘
                페이지에서 확인합니다.
            </Prose>
            <CodeBlock code={ICON_MAP_EXAMPLE} language="js" fileName="head.html (예시)" />
            <CodeBlock code={ICON_REFRESH_EXAMPLE} language="js" fileName="page.js (예시)" />
            <Callout type="warn" title="sprite.svg 주소">
                <code>url</code> 은 실제 배포 경로로 지정합니다. 다른 도메인(CDN)에 둘 경우 CORS 허용이 필요하므로 같은
                도메인에 두는 것을 권장합니다.
            </Callout>

            <Section id="s-compat" num="04" title="컴포넌트 호환성" />
            <DocTable columns={['컴포넌트', '2025', '비고']} rows={COMPONENT_ROWS} />
            <Prose>
                자세한 검증 내용은 <code>uiux/docs/KENDO_UI_2025_COMPATIBILITY.md</code> 를 참고하세요.
            </Prose>

            <Section id="s-notice" num="05" title="주의할 점" />
            <DocList
                items={[
                    <>
                        jQuery 는 <code>3.7.x</code> 를 사용합니다. (구버전 jquery.min.js 혼용 금지)
                    </>,
                    <>
                        Pager <code>adaptive</code> 옵션은 2025 Q2 부터 지원되어 현재 버전(Q1)에서는 쓸 수 없습니다.
                    </>,
                    <>
                        Kendo 기본 스타일 수정은 테마 CSS 를 고치지 말고 <code>pd_kendo.css</code> 에 작성합니다.
                    </>,
                    <>
                        전체 번들 <code>kendo.all.min.js</code> 를 기준으로 합니다. 일부 화면의{' '}
                        <code>kendo.custom.min.js</code> 는 빌드가 달라 위젯이 빠져 있을 수 있습니다.
                    </>,
                ]}
            />

            <Section id="s-check" num="06" title="버전 확인" />
            <CodeBlock code={VERSION_CHECK} language="js" fileName="console" />
        </DocPage>
    );
}
