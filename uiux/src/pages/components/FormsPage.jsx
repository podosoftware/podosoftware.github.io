import { Callout, ClassTable, CodeBlock, DocPage, DocTable, Example, Prose, Section } from '../../components/doc';

/** 숫자 입력 — kendoComponentUtil.js 의 kendoUi.createNumericTextBox() 사용 예 */
const NUMERIC_UTIL = `<div class="input-box" style="width: 200px;">
    <input type="text" id="limitDay">
    <span class="txt">일</span>
</div>

<script>
    $(function () {
        // 기본값: min 0, max 100, step 1, format 'n0' → 다른 값만 넘깁니다.
        kendoUi.createNumericTextBox('#limitDay', {
            max: 9999
        });
    });
</script>`;

const NUMERIC_VALUE = `// 값 읽기 / 넣기 — 위젯 인스턴스로 처리합니다.
var numeric = $('#limitDay').data('kendoNumericTextBox');

var day = numeric.value();     // 숫자 또는 null (비어 있으면 null)
numeric.value(30);             // 값 넣기

// 소수점 입력 (예: 0.5 단위)
kendoUi.createNumericTextBox('#rate', {
    max: 100,
    step: 0.5,
    format: 'n1',
    decimals: 1                // Kendo 옵션은 그대로 전달됩니다.
});`;

const NUMERIC_OPTIONS = [
    [<code>min</code>, <code>0</code>, '최솟값'],
    [<code>max</code>, <code>100</code>, '최댓값 — 100 보다 큰 값을 받으려면 꼭 지정'],
    [<code>step</code>, <code>1</code>, '화살표 버튼 · 키보드 위/아래로 바뀌는 양'],
    [<code>format</code>, <code>'n0'</code>, "표시 형식 — n0 정수(천 단위 쉼표), n1 소수 한 자리, '#' 쉼표 없음"],
    ['그 밖의 Kendo 옵션', '-', <><code>decimals</code>, <code>placeholder</code>, <code>change</code> 등 그대로 전달</>],
];

const FORM_CLASSES = [
    { name: 'k-textbox', desc: '모든 텍스트 입력창 / textarea 기본 클래스 (Kendo 스타일)' },
    { name: 'input-box', desc: '입력창 + 단위 텍스트(.txt) 또는 버튼을 한 줄로 묶는 래퍼' },
    { name: 'radio-box / radio-box-wrap', desc: '라디오 — input 뒤 label 안에 <i class="icon radio">' },
    { name: 'check-box / check-box-wrap', desc: '체크박스 — input 뒤 label 안에 <i class="icon check">' },
    { name: 'pd-w-full', desc: '부모 폭 100% (util.css)' },
];

export default function FormsPage() {
    return (
        <DocPage
            hero={{
                label: 'Form',
                eyebrow: 'Components',
                title: '입력',
                strong: '폼',
                desc: '텍스트 입력, textarea, 라디오·체크박스, 숫자 입력 마크업입니다. 높이는 --input-h 토큰을 따릅니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={FORM_CLASSES} />

            <Section id="s-text" num="02" title="텍스트 입력" />
            <Example
                title="입력창 유형"
                description="대타이틀 옆 상단 검색(42px), 기본, 비활성, 단위 텍스트, 버튼 결합형입니다."
                snippet="input_01"
                stackGap={16}
            />
            <Example title="Textarea" snippet="input_02" stackGap={16} />

            <Section id="s-choice" num="03" title="라디오 · 체크박스" />
            <Example title="라디오 / 체크박스 (기본 · 선택 · 비활성)" snippet="input_03" stackGap={16} />
            <Callout type="warn" title="id / for 짝 맞추기">
                라디오·체크박스 모양은 <code>label</code> 안의 아이콘이 그립니다. <code>input</code> 의 id 와{' '}
                <code>label</code> 의 for 가 다르면 클릭해도 선택되지 않습니다.
            </Callout>

            <Section id="s-number" num="04" title="숫자 입력" />
            <Prose>
                <code>input type="number"</code> 는 쓰지 않습니다. 숫자만 받는 입력창은{' '}
                <code>kendoComponentUtil.js</code> 의 <code>kendoUi.createNumericTextBox(선택자, 옵션)</code> 으로
                만듭니다. 한글·문자 입력을 막고, 최솟값·최댓값을 넘으면 자동으로 맞춰 주며, 위/아래 버튼이 붙습니다.
                같은 요소에 두 번 호출해도 다시 만들지 않습니다.
            </Prose>
            <Example
                title="kendoUi.createNumericTextBox()"
                description="단위 텍스트(.txt)와 함께 쓰는 기본형입니다. 기본값과 다른 옵션만 넘깁니다."
                code={NUMERIC_UTIL}
                kendo
            />
            <DocTable columns={['옵션', '기본값', '설명']} rows={NUMERIC_OPTIONS} />
            <CodeBlock code={NUMERIC_VALUE} language="js" fileName="page.js (예시)" />
            <Callout type="warn" title="value 옵션은 적용되지 않습니다">
                현재 <code>createNumericTextBox</code> 는 <code>value</code> 옵션을 받기만 하고 위젯에 넘기지 않습니다.
                처음 값은 <code>input</code> 의 <code>value</code> 속성으로 넣거나, 생성 후{' '}
                <code>.value()</code> 로 넣으세요.
            </Callout>

            <Example
                title="Kendo 없이 숫자만 받기 (기존 화면)"
                description="Kendo 를 쓰지 않는 화면은 k-textbox 에 onkeyup='chkNull(this); chkNum(this);' 를 넣습니다. (스니펫은 기존 화면 원본이라 kendoNumericTextBox() 를 직접 호출하는 코드가 남아 있습니다)"
                snippet="input_04"
                kendo
            />
        </DocPage>
    );
}
