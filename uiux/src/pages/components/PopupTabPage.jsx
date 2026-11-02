import { Callout, ClassTable, CodeBlock, DocPage, Example, Prose, Section } from '../../components/doc';
import { getSnippet } from '../../snippets/index.js';

/**
 * 팝업 스니펫은 숨김 상태라, 미리보기에서 바로 열리도록 Window 초기화 코드를 붙입니다.
 * 미리보기 영역은 처음 높이가 작아 openWindow()(= center) 를 쓰면 제목줄이 위로 잘리므로
 * 미리보기에서만 visible: true + position 으로 고정 위치에 엽니다.
 */
const WINDOW_INIT = `
<script>
    $(function () {
        kendoUi.createWindow('#kendo_window', {
            title: '팝업 제목',
            width: '480px',
            height: 'auto',
            modal: false,
            visible: true,                    // 미리보기 전용 — 실제 화면은 false + openWindow()
            position: { top: 20, left: 20 },  // 미리보기 전용
            animation: false                  // 미리보기 전용
        });

        $('#closeAttendMngPop').on('click', function () {
            kendoUi.closeWindow('#kendo_window');
        });
    });
</script>`;

/** 실제 화면에서 쓰는 형태 */
const WINDOW_USAGE = `// 1. 페이지 로드 시 한 번 생성 (기본값: modal, 98% x 98%, 닫기 버튼)
kendoUi.createWindow('#kendo_window', {
    title: '팝업 제목',
    width: '480px',
    height: 'auto',
    onClose: function () {
        // 닫힐 때 입력값 초기화 등
    }
});

// 2. 버튼 클릭 시 열기 (화면 가운데 정렬 후 열림)
$('#openBtn').on('click', function () {
    kendoUi.openWindow('#kendo_window');
});

// 3. 닫기
$('#closeAttendMngPop').on('click', function () {
    kendoUi.closeWindow('#kendo_window');
});`;

const TAB_USAGE = `// 스니펫의 $('#tabstrip').kendoTabStrip({ … }) 는 아래 한 줄과 같습니다.
kendoUi.createTab('#tabstrip', {
    onSelect: function (e) {
        // 탭 선택 시 처리
    }
});`;

const POPUP_CLASSES = [
    { name: 'popup-content', desc: '팝업 본문 영역 (스크롤 영역)' },
    { name: 'popup-foot', desc: '팝업 하단 버튼 영역' },
    { name: 'popup-btn', desc: '하단 버튼 — 버튼 페이지 참고' },
    { name: 'k-state-active', desc: '탭 중 처음 열릴 탭' },
];

export default function PopupTabPage() {
    return (
        <DocPage
            hero={{
                label: 'Popup',
                eyebrow: 'Components',
                title: '팝업 ·',
                strong: '탭',
                desc: 'Kendo Window 기반 팝업과 Kendo TabStrip 탭 마크업입니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={POPUP_CLASSES} />

            <Section id="s-popup" num="02" title="팝업 (Kendo Window)" />
            <Example
                title="기본 팝업"
                description="마크업은 display:none 으로 두고, kendoUi.createWindow() 로 만든 뒤 kendoUi.openWindow() 로 엽니다."
                code={getSnippet('popup_01') + WINDOW_INIT}
                kendo
                minHeight={300}
            />
            <Callout type="info" title="팝업 크기">
                폭은 <code>width</code> 옵션으로 지정하고, 높이는 내용에 맞춥니다. 내용이 길면{' '}
                <code>.popup-content</code> 안에서만 스크롤되게 합니다.
            </Callout>
            <CodeBlock code={WINDOW_USAGE} language="js" fileName="page.js (예시)" />

            <Section id="s-tab" num="03" title="탭 (Kendo TabStrip)" />
            <Example title="팝업 안 탭" snippet="tab_01" kendo minHeight={120} />
            <Example title="본문 탭" snippet="tab_02" kendo minHeight={120} />
            <Prose>
                탭 스니펫은 기존 화면 원본이라 <code>kendoTabStrip()</code> 을 직접 호출합니다. 새 화면에서는{' '}
                <code>kendoUi.createTab()</code> 을 사용합니다.
            </Prose>
            <CodeBlock code={TAB_USAGE} language="js" fileName="page.js (예시)" />
        </DocPage>
    );
}
