import { useMemo } from 'react';
import useCopy from '../../hooks/useCopy.js';
import { highlight } from '../../utils/highlight.js';

/**
 * 코드 블록 (구문 강조 + 복사 버튼)
 *
 * <CodeBlock language="css" fileName="tokens.css" label="버튼 토큰" code={`--color-btn-main: …`} />
 *
 * language: html | css | js | jsx | shell (그 외 값은 강조 없이 출력)
 */
export default function CodeBlock({ code, language = 'html', fileName, label }) {
    const { copiedKey, copy } = useCopy();

    // 강조 결과는 code 가 바뀔 때만 다시 계산
    const highlighted = useMemo(() => highlight(code, language), [code, language]);
    const isCopied = copiedKey === 'code';

    return (
        <div className="g-code">
            {label && <div className="g-code__label">{label}</div>}
            <div className="g-code__block">
                <div className="g-code__bar">
                    <span className="g-code__file">{fileName || language}</span>
                    <button
                        type="button"
                        className={`g-copy-btn${isCopied ? ' is-copied' : ''}`}
                        onClick={() => copy(code, 'code')}
                    >
                        {isCopied ? 'copied ✓' : 'copy'}
                    </button>
                </div>
                <div className="g-code__body">
                    {/* highlight() 는 모든 텍스트를 escape 한 뒤 span 만 추가하므로 안전합니다. */}
                    <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
                </div>
            </div>
        </div>
    );
}
