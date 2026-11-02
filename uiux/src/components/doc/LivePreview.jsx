import { useEffect, useMemo, useRef, useState } from 'react';
import {
    PREVIEW_JQUERY_SCRIPTS,
    PREVIEW_KENDO_SCRIPTS,
    PREVIEW_KENDO_SETUP,
    PREVIEW_STYLESHEETS,
} from '../../config/assets.js';

/**
 * 실시간 미리보기 (iframe)
 *
 * 왜 iframe 인가:
 *   관리자 CSS(admin.css 등)는 html, body, .k-grid 처럼 전역 선택자를 많이 씁니다.
 *   가이드 화면에 그대로 넣으면 가이드 디자인이 깨지므로, iframe 으로 완전히 분리해
 *   "실제 관리자 화면과 같은 CSS 순서"로만 렌더링합니다.
 *
 * 예제 코드는 업무 사이트와 같은 HTML + jQuery 로 작성하고, 여기서는 그대로 실행만 합니다.
 *  jquery=true : jQuery + 공통 아이콘 헬퍼(admin-icon.js) 로드
 *  kendo=true  : 위에 더해 Kendo UI 2025 + kendoComponentUtil.js 로드,
 *                kendoUi.init() / kendoUi.setSvgIcons() 까지 실행 (아이콘을 공통 SVG 로 교체)
 * (스니펫 안의 <script>$(function(){ … })</script> 가 그대로 실행됩니다)
 */
const BODY_PADDING = 20;
const ROOT_ID = 'podo-preview-root';

function getScriptSources(jquery, kendo) {
    if (kendo) {
        return [...PREVIEW_JQUERY_SCRIPTS, ...PREVIEW_KENDO_SCRIPTS];
    }
    if (jquery) {
        return PREVIEW_JQUERY_SCRIPTS;
    }
    return [];
}

/**
 * stackGap: 스니펫의 요소들을 세로로 쌓고 사이 간격(px)을 준다.
 *   실사용 스니펫(snippets/admin/*.html)에는 화면 배치용 여백이 없어 여러 개를 한 번에 보여주면 붙어 보인다.
 *   스니펫 코드는 그대로 두고 미리보기에서만 간격을 준다. (복사되는 코드에는 영향 없음)
 */
function buildStackStyle(stackGap) {
    if (!stackGap) {
        return '';
    }
    return `#${ROOT_ID} { display: flex; flex-direction: column; gap: ${stackGap}px; }`;
}

function buildDocument(html, jquery, kendo, stackGap) {
    const links = PREVIEW_STYLESHEETS.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n');
    const scriptTags = getScriptSources(jquery, kendo).map((src) => `<script src="${src}"></script>`);

    // 공통 초기화는 위젯 생성(예제의 $(function(){ … }))보다 먼저 실행되어야 한다.
    if (kendo) {
        scriptTags.push(`<script>\n${PREVIEW_KENDO_SETUP}\n</script>`);
    }
    const scripts = scriptTags.join('\n');

    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
${links}
${scripts}
<style>
    html, body { min-width: 0 !important; height: auto !important; background: #fff; }
    /*
     * 스크롤바는 html 에서만 숨긴다.
     * 관리자 CSS 가 body 를 position:relative + overflow:hidden 으로 두기 때문에
     * 그대로면 body 밖에 뜨는 Kendo 팝업(Window, 달력, 드롭다운)이 잘린다 → 미리보기에서만 해제.
     */
    html { overflow: hidden; }
    body { padding: ${BODY_PADDING}px; overflow: visible !important; }
    /* float / absolute 요소까지 높이에 포함되도록 flow-root 로 감싼다 */
    #${ROOT_ID} { display: flow-root; }
    ${buildStackStyle(stackGap)}
</style>
</head>
<body>
<div id="${ROOT_ID}">
${html}
</div>
</body>
</html>`;
}

export default function LivePreview({
    html,
    jquery = false,
    kendo = false,
    minHeight = 60,
    stackGap = 0,
    title = '미리보기',
}) {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState(minHeight);

    const srcDoc = useMemo(
        () => buildDocument(html, jquery, kendo, stackGap),
        [html, jquery, kendo, stackGap],
    );

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return undefined;
        }

        let resizeObserver = null;

        // iframe 안 내용 높이에 맞춰 늘어나게 한다. (srcdoc 은 같은 출처라 접근 가능)
        const handleLoad = () => {
            const doc = iframe.contentDocument;
            const root = doc?.getElementById(ROOT_ID);
            if (!root) {
                return;
            }

            // 관리자 CSS 가 html/body 높이를 고정하는 경우가 있어 body 대신 내용 래퍼 높이를 잰다.
            const updateHeight = () => {
                const contentHeight = Math.ceil(root.getBoundingClientRect().height) + BODY_PADDING * 2;
                setHeight(Math.max(minHeight, contentHeight));
            };

            updateHeight();
            resizeObserver?.disconnect();
            resizeObserver = new ResizeObserver(updateHeight);
            resizeObserver.observe(root);
        };

        iframe.addEventListener('load', handleLoad);

        // 이벤트 등록 전에 이미 로드가 끝난 경우 대비
        if (iframe.contentDocument?.readyState === 'complete' && iframe.contentDocument.getElementById(ROOT_ID)) {
            handleLoad();
        }

        return () => {
            iframe.removeEventListener('load', handleLoad);
            resizeObserver?.disconnect();
        };
    }, [srcDoc, minHeight]);

    return (
        <iframe
            ref={iframeRef}
            className="g-example__frame"
            title={title}
            srcDoc={srcDoc}
            style={{ height }}
            loading="lazy"
        />
    );
}
