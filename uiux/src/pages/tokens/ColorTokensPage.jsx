import { Callout, CodeBlock, DocPage, DocTable, Palette, Prose, Section, SubSection } from '../../components/doc';
import useAdminTokens from '../../hooks/useAdminTokens.js';
import { findSection, resolveTokenValue } from '../../utils/parseTokens.js';
import TokenTable, { TokenStatus } from './TokenTable.jsx';

/** 팔레트로 보여줄 기본 색 섹션 (tokens.css 섹션 제목 일부) */
const PALETTE_SECTIONS = [
    { keyword: 'Primary', id: 's-primary', title: 'Primary', keyName: '--color-primary-500' },
    { keyword: 'Black', id: 's-black', title: 'Black' },
    { keyword: 'Gray', id: 's-gray', title: 'Gray' },
    { keyword: 'White', id: 's-white', title: 'White' },
    { keyword: 'Tint', id: 's-accent', title: 'Tint & Accent' },
];

const STATUS_COLORS = [
    { name: '--color-success', pill: 'g-pill--green', label: '성공', usage: '저장 완료, 승인, 통과' },
    { name: '--color-danger', pill: 'g-pill--red', label: '오류', usage: '삭제 경고, 유효성 실패, 필수(*) 표시' },
    { name: '--color-warning', pill: 'g-pill--amber', label: '주의', usage: '진행률, 경고 안내' },
    { name: '--color-info', pill: 'g-pill--blue', label: '정보', usage: '링크, 안내 메시지' },
];

const USAGE_CODE = `/* ✕ 하지 말 것 */
.my-title { color: #46464f; border-bottom: 1px solid #dddddd; }

/* ○ 이렇게 */
.my-title {
    color: var(--color-text-default);
    border-bottom: 1px solid var(--color-white-600);
}`;

export default function ColorTokensPage() {
    const { tokens, error } = useAdminTokens();

    return (
        <DocPage
            hero={{
                label: 'Color',
                eyebrow: 'Design Tokens',
                title: '컬러',
                strong: '토큰',
                desc: '색상은 CSS 변수로 중앙 관리합니다. 코드에서 HEX 값을 직접 쓰지 말고 반드시 토큰을 참조하세요. 팔레트 칸을 누르면 var() 가 복사됩니다.',
            }}
        >
            {!tokens && <TokenStatus error={error} />}

            {tokens && (
                <>
                    {PALETTE_SECTIONS.map((config, index) => {
                        const section = findSection(tokens, config.keyword);
                        if (!section) {
                            return null;
                        }

                        const colorTokens = section.tokens.filter((token) => token.value.startsWith('#'));
                        const commented = section.tokens.filter((token) => token.comment);

                        return (
                            <div key={config.id}>
                                <Section id={config.id} num={String(index + 1).padStart(2, '0')} title={config.title} />
                                <Palette tokens={colorTokens} keyName={config.keyName} />
                                {commented.length > 0 && (
                                    <DocTable
                                        columns={['토큰', '용도']}
                                        rows={commented.map((token) => [<code>{token.name}</code>, token.comment])}
                                        rowKey={(row, rowIndex) => commented[rowIndex].name}
                                    />
                                )}
                            </div>
                        );
                    })}

                    <Section id="s-status" num="06" title="상태 색" />
                    <Prose>UI 상태를 표현할 때는 아래 4가지만 사용합니다.</Prose>
                    <DocTable
                        columns={['토큰', '값', '상태', '사용 예']}
                        rows={STATUS_COLORS.map((item) => {
                            const token = tokens.byName[item.name];
                            const value = token ? resolveTokenValue(token.value, tokens.byName) : '-';
                            return [
                                <code>{item.name}</code>,
                                <span>
                                    <span className="g-swatch" style={{ background: value }} />
                                    {value}
                                </span>,
                                <span className={`g-pill ${item.pill}`}>{item.label}</span>,
                                item.usage,
                            ];
                        })}
                        rowKey={(row, index) => STATUS_COLORS[index].name}
                    />

                    <Section id="s-semantic" num="07" title="의미 색 (텍스트 · 배경)" />
                    <TokenTable tokens={findSection(tokens, 'Semantic')?.tokens || []} byName={tokens.byName} swatch />

                    <Section id="s-button" num="08" title="버튼 색" />
                    <TokenTable tokens={findSection(tokens, 'Button')?.tokens || []} byName={tokens.byName} swatch />
                    <Callout type="warn" title="--btn-line 은 사용 중지">
                        같은 값인 <code>--color-btn-default-border</code> 를 사용하세요. 옛 이름은 호환용으로만
                        남아 있습니다.
                    </Callout>
                </>
            )}

            <Section id="s-usage" num="09" title="사용 예" />
            <SubSection id="s-usage-code" title="HEX 대신 토큰" />
            <CodeBlock code={USAGE_CODE} language="css" fileName="my-page.css" />
        </DocPage>
    );
}
