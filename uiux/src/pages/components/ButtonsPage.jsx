import { Callout, ClassTable, DocPage, Example, Prose, Section } from '../../components/doc';

const BUTTON_CLASSES = [
    { name: 'btn_top', desc: '페이지 최상단(대타이틀 옆)에 쓰는 버튼' },
    { name: 'btn_bot', desc: '페이지 최하단 저장/취소/삭제 버튼' },
    { name: 'btn_search', desc: '검색 아이콘 버튼 (안에 .icon-search + .blind 텍스트)' },
    { name: 'btn-default', desc: '콘텐츠 표 상단 버튼, 검색 영역의 기본(라인) 버튼' },
    { name: 'btn-point', desc: 'btn-default 와 함께 써서 진한(주요) 버튼으로 표시 — 검색' },
    { name: 'popup-btn', desc: '팝업 하단 버튼. 단독=긍정(저장), btn-default 추가=부정(취소)' },
    { name: 'btn_inner', desc: '표 상단 · 입력창 옆 작은 버튼' },
    { name: 'btn_input', desc: '입력창과 붙여 쓰는 확인/선택 버튼' },
];

export default function ButtonsPage() {
    return (
        <DocPage
            hero={{
                label: 'Button',
                eyebrow: 'Components',
                title: '',
                strong: '버튼',
                desc: '관리자 화면에서 실제로 사용 중인 버튼 마크업입니다. 위치(상단·하단·팝업·검색)에 따라 클래스가 정해져 있습니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={BUTTON_CLASSES} />
            <Callout type="info" title="텍스트는 span 으로 감싸기">
                관리자 CSS 가 <code>button &gt; span</code> 기준으로 여백을 잡습니다. 버튼 안 글자는 항상{' '}
                <code>&lt;span&gt;</code> 으로 감싸세요.
            </Callout>
            <Callout type="info" title="글자 세로 정렬 (button.css)">
                <code>btn-default</code> · <code>btn_inner</code> · <code>btn_input</code> · <code>popup-btn</code> 은{' '}
                <code>inline-flex</code> + <code>align-items: center</code> 로 가운데 정렬하고, 높이는{' '}
                <code>height</code> 로 고정합니다. 관리자 글꼴(Noto Sans KR)은 글꼴 자체 여백 값이 실제 글자와 달라
                줄높이만으로는 글자가 2~3px 위로 뜨므로, 글자 줄을 실제 글자 높이로 자르는{' '}
                <code>text-box: trim-both cap alphabetic</code> 을 함께 씁니다. line-height 나 padding 으로 높이를
                맞추지 마세요. 보정 규칙은 <code>css/admin/button.css</code> 에 있습니다.
            </Callout>

            <Section id="s-page" num="02" title="페이지 상단 · 하단" />
            <Example title="상단 버튼 (엑셀 다운로드 등)" snippet="button_contents_01" />
            <Example title="하단 버튼" snippet="button_contents_02" />
            <Example title="하단 버튼 그룹 (상세 화면)" snippet="button_contents_10" />

            <Section id="s-search" num="03" title="검색" />
            <Example title="검색 아이콘 버튼" snippet="button_contents_03" />
            <Example
                title="검색 영역 버튼 (초기화 / 검색)"
                description="btn-default 는 보조, btn-default + btn-point 는 주요 동작입니다."
                snippet="button_contents_05"
            />

            <Section id="s-table" num="04" title="표 상단 · 입력창 옆" />
            <Example title="표 상단 기본 버튼" snippet="button_contents_04" />
            <Example title="표 상단 오른쪽 정렬" snippet="button_contents_07" />
            <Example title="입력창 + 버튼" snippet="button_contents_08" />
            <Example title="선택 버튼 (단독)" snippet="button_contents_09" />

            <Section id="s-popup" num="05" title="팝업 하단" />
            <Prose>
                취소(부정) 버튼을 왼쪽, 저장(긍정) 버튼을 오른쪽에 둡니다. 순서를 바꾸지 마세요.
            </Prose>
            <Example title="팝업 하단 버튼" snippet="button_contents_06" />
            <Callout type="warn" title="마크업 변경">
                <code>popup-foot &gt; ul.btn-box-wrap &gt; li</code> 구조는 쓰지 않습니다.{' '}
                <code>popup-foot &gt; div.btn-box-wrap</code> 안에 버튼을 바로 넣습니다. 두 버튼은 모두 높이 42px 입니다.
                (기존 ul 마크업도 깨지지 않게 호환 규칙을 남겨 두었습니다)
            </Callout>
        </DocPage>
    );
}
