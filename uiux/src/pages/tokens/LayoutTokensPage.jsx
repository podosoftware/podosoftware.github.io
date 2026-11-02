import { DocPage, Example, Section } from '../../components/doc';
import useAdminTokens from '../../hooks/useAdminTokens.js';
import { findSection } from '../../utils/parseTokens.js';
import TokenTable, { TokenStatus } from './TokenTable.jsx';

/** tokens.css 섹션 제목 키워드 → 화면 섹션 */
const SECTIONS = [
    { keyword: 'Layout', id: 's-layout', title: '레이아웃' },
    { keyword: 'Form', id: 's-form', title: '입력창 높이' },
    { keyword: 'Scroll', id: 's-scroll', title: '스크롤바' },
    { keyword: 'Etc', id: 's-etc', title: '기타 (푸터 · 스켈레톤 · 아코디언)' },
];

const INPUT_HEIGHT_EXAMPLE = `<div style="display:flex; gap:8px; align-items:flex-end;">
    <input type="text" class="k-textbox" style="height:var(--input-h-s)" placeholder="--input-h-s (32)">
    <input type="text" class="k-textbox" style="height:var(--input-h)" placeholder="--input-h (35)">
    <input type="text" class="k-textbox" style="height:var(--input-h-big)" placeholder="--input-h-big (42)">
</div>`;

export default function LayoutTokensPage() {
    const { tokens, error } = useAdminTokens();

    return (
        <DocPage
            hero={{
                label: 'Size',
                eyebrow: 'Design Tokens',
                title: '레이아웃·폼',
                strong: '토큰',
                desc: '레이아웃 폭, 입력창 높이, 스크롤바 등 크기와 관련된 토큰입니다.',
            }}
        >
            {!tokens && <TokenStatus error={error} />}

            {tokens &&
                SECTIONS.map((config, index) => {
                    const section = findSection(tokens, config.keyword);
                    if (!section) {
                        return null;
                    }

                    return (
                        <div key={config.id}>
                            <Section id={config.id} num={String(index + 1).padStart(2, '0')} title={config.title} />
                            <TokenTable tokens={section.tokens} byName={tokens.byName} />
                            {config.keyword === 'Form' && (
                                <Example title="입력창 높이 비교" code={INPUT_HEIGHT_EXAMPLE} defaultOpen={false} />
                            )}
                        </div>
                    );
                })}
        </DocPage>
    );
}
