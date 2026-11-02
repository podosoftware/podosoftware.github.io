import { useState } from 'react';
import AdminIcon from '../../icons/AdminIcon.jsx';
import { getSnippet } from '../../snippets/index.js';
import CodeBlock from './CodeBlock.jsx';
import LivePreview from './LivePreview.jsx';

/**
 * 예제 = 실시간 미리보기 + 코드
 *
 * 실사용 스니펫 파일로:  <Example title="상단 버튼" snippet="button_contents_01" />
 * 코드를 직접 넘길 때:   <Example title="아이콘" code={`<i class="ad-icon ad-icon--search"></i>`} />
 *
 * jquery    : jQuery / 아이콘 헬퍼(PodoIcon)를 쓰는 예제면 true
 * kendo     : Kendo UI 위젯이 들어간 예제면 true (jQuery 도 함께 로드)
 * minHeight : Kendo 팝업(달력, 드롭다운)이 펼쳐질 공간이 필요할 때 지정
 * stackGap  : 스니펫 안 요소들을 세로로 쌓고 간격(px)을 줄 때 지정 (미리보기 전용, 코드에는 영향 없음)
 */
export default function Example({
    title,
    description,
    snippet,
    code,
    jquery = false,
    kendo = false,
    minHeight,
    stackGap,
    defaultOpen = true,
    preview = true,
}) {
    const [isCodeOpen, setIsCodeOpen] = useState(defaultOpen);
    const source = code ?? getSnippet(snippet);
    const fileName = snippet ? `snippets/admin/${snippet}.html` : 'example.html';

    return (
        <section className="g-example">
            <div className="g-example__head">
                <span className="g-example__title">{title}</span>
                {snippet && <span className="g-example__file">{snippet}.html</span>}
            </div>

            {description && <p className="g-example__desc">{description}</p>}

            {preview && (
                <div className="g-example__preview">
                    <LivePreview
                        html={source}
                        jquery={jquery}
                        kendo={kendo}
                        minHeight={minHeight}
                        stackGap={stackGap}
                        title={`${title} 미리보기`}
                    />
                </div>
            )}

            <button
                type="button"
                className="g-example__toggle"
                aria-expanded={isCodeOpen}
                onClick={() => setIsCodeOpen((open) => !open)}
            >
                <AdminIcon name={isCodeOpen ? 'chevron-up' : 'chevron-down'} size={14} />
                {isCodeOpen ? '코드 접기' : '코드 보기'}
            </button>

            {isCodeOpen && <CodeBlock code={source} language="html" fileName={fileName} />}
        </section>
    );
}
