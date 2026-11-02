import useCopy from '../../hooks/useCopy.js';
import { getReadableTextColor } from '../../utils/parseTokens.js';

/**
 * 컬러 스케일 팔레트 — 칸을 누르면 var(--토큰) 이 복사됩니다.
 *
 * tokens : [{ name: '--color-primary-500', value: '#5C61D4' }]
 * keyName: 강조할 기준 토큰 이름 (예: '--color-primary-500')
 */
function getStepLabel(name) {
    // --color-primary-500 → 500, --color-white → white
    const parts = name.split('-');
    return parts[parts.length - 1];
}

export default function Palette({ tokens, keyName }) {
    const { copiedKey, copy } = useCopy();

    return (
        <div className="g-palette">
            {tokens.map((token) => {
                const textColor = getReadableTextColor(token.value);
                const isKey = token.name === keyName;

                return (
                    <button
                        type="button"
                        key={token.name}
                        className={`g-palette__cell${isKey ? ' is-key' : ''}`}
                        style={{ background: token.value, color: textColor }}
                        title={`${token.name} 복사`}
                        onClick={() => copy(`var(${token.name})`, token.name)}
                    >
                        {copiedKey === token.name && <span className="g-palette__copied">copied</span>}
                        <span className="g-palette__step">
                            {getStepLabel(token.name)}
                            {isKey && ' ★'}
                        </span>
                        <span className="g-palette__hex">{token.value}</span>
                    </button>
                );
            })}
        </div>
    );
}
