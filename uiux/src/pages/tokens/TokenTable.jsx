import { Callout, DocTable } from '../../components/doc';
import useCopy from '../../hooks/useCopy.js';
import { resolveTokenValue } from '../../utils/parseTokens.js';

/**
 * 토큰 목록 표 (토큰 페이지 공통)
 *
 * tokens : parseTokens 결과의 section.tokens
 * byName : var(--x) 참조를 실제 값으로 풀기 위한 전체 토큰 맵
 * swatch : 색상 견본 표시 여부
 */
export default function TokenTable({ tokens, byName, swatch = false }) {
    const { copiedKey, copy } = useCopy();

    const rows = tokens.map((token) => {
        const resolved = resolveTokenValue(token.value, byName);
        const isReference = resolved !== token.value;

        return [
            <button
                type="button"
                className="g-class-name"
                title="클릭하면 var() 로 복사됩니다"
                onClick={() => copy(`var(${token.name})`, token.name)}
            >
                {copiedKey === token.name ? 'copied ✓' : token.name}
            </button>,
            <span>
                {swatch && <span className="g-swatch" style={{ background: resolved }} />}
                <code>{token.value}</code>
                {isReference && <span style={{ marginLeft: 6, color: 'var(--g-ink3)' }}>= {resolved}</span>}
            </span>,
            token.comment || '-',
        ];
    });

    return (
        <DocTable
            columns={['토큰', '값', '설명']}
            rows={rows}
            rowKey={(row, index) => tokens[index].name}
        />
    );
}

/** 토큰 로딩/실패 상태 공통 표시 */
export function TokenStatus({ error }) {
    if (error) {
        return (
            <Callout type="warn" title="tokens.css 를 불러오지 못했습니다">
                <code>public/admin/css/tokens.css</code> 경로를 확인하세요. ({error.message})
            </Callout>
        );
    }

    return <div className="g-empty">tokens.css 를 불러오는 중…</div>;
}
