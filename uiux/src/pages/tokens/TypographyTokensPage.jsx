import { Callout, CodeBlock, DocPage, DocTable, Prose, Section } from '../../components/doc';
import useAdminTokens from '../../hooks/useAdminTokens.js';
import { findSection } from '../../utils/parseTokens.js';
import TokenTable, { TokenStatus } from './TokenTable.jsx';

const SAMPLE_TEXT = '포도 관리자 Admin 0123';

const USAGE_CODE = `body {
    font-family: var(--font-pretendard);
    font-size: var(--font-size);
    letter-spacing: var(--font-let-spc);
    line-height: var(--line-height);
    color: var(--color-text-default);
}`;

export default function TypographyTokensPage() {
    const { tokens, error } = useAdminTokens();
    const section = tokens ? findSection(tokens, 'Typography') : null;

    const fontTokens = section ? section.tokens.filter((token) => token.name.startsWith('--font-') && token.value.includes('"')) : [];
    const styleTokens = section ? section.tokens.filter((token) => !fontTokens.includes(token)) : [];

    return (
        <DocPage
            hero={{
                label: 'Type',
                eyebrow: 'Design Tokens',
                title: '타이포그래피',
                strong: '토큰',
                desc: '폰트 패밀리와 기본 크기·자간·행간 토큰입니다. 관리자 기본 폰트는 Pretendard 입니다.',
            }}
        >
            {!tokens && <TokenStatus error={error} />}

            {tokens && (
                <>
                    <Section id="s-family" num="01" title="폰트 패밀리" />
                    <Prose>견본은 사용자 PC 에 해당 폰트가 설치(또는 웹폰트 로드)되어 있어야 정확히 보입니다.</Prose>
                    <DocTable
                        columns={['토큰', '값', '견본']}
                        rows={fontTokens.map((token) => [
                            <code>{token.name}</code>,
                            token.value,
                            <span className="g-font-sample" style={{ fontFamily: token.value }}>
                                {SAMPLE_TEXT}
                            </span>,
                        ])}
                        rowKey={(row, index) => fontTokens[index].name}
                    />
                    <Callout type="tip" title="오타 수정됨">
                        기존 <code>root_admin.css</code> 의 대체 폰트 값 <code>sans-self</code>(오타)를{' '}
                        <code>sans-serif</code> 로 바로잡았습니다. 지정 폰트가 없을 때만 영향이 있습니다.
                    </Callout>

                    <Section id="s-style" num="02" title="기본 크기 · 자간 · 행간" />
                    <TokenTable tokens={styleTokens} byName={tokens.byName} />
                </>
            )}

            <Section id="s-usage" num="03" title="사용 예" />
            <CodeBlock code={USAGE_CODE} language="css" fileName="base.css" />
        </DocPage>
    );
}
