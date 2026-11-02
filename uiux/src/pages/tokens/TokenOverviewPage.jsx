import { Link } from 'react-router-dom';
import { Callout, CodeBlock, DocList, DocPage, DocTable, Prose, Section, SubSection } from '../../components/doc';
import useAdminTokens from '../../hooks/useAdminTokens.js';
import { TokenStatus } from './TokenTable.jsx';

const NAMING_ROWS = [
    [<code>--color-{'{팔레트}'}-{'{단계}'}</code>, '기본(primitive) 색', <code>--color-primary-500</code>],
    [<code>--color-{'{용도}'}-{'{상태}'}</code>, '의미(semantic) 색 — 용도가 이름에 드러남', <code>--color-text-muted</code>],
    [<code>--color-btn-*</code>, '버튼 전용 색', <code>--color-btn-main-dark</code>],
    [<code>--font-*</code>, '폰트 패밀리', <code>--font-pretendard</code>],
    [<code>--input-h*</code>, '입력창 높이', <code>--input-h-big</code>],
];

const BEFORE_AFTER = `/* Before — 원본 css/admin/admin.css */
.btn-default.btn-point { background: #5c61d4; border-color: #5c61d4; }
.k-grid th { color: var(--black-600); }

/* After — npm run tokens 결과 (public/admin/css/admin.css) */
.btn-default.btn-point { background: var(--color-primary-500); border-color: var(--color-primary-500); }
.k-grid th { color: var(--color-black-600); }`;

export default function TokenOverviewPage() {
    const { tokens, error } = useAdminTokens();

    return (
        <DocPage
            hero={{
                label: 'Token',
                eyebrow: 'Design Tokens',
                title: '토큰',
                strong: '개요',
                desc: '관리자 화면의 색·폰트·크기는 모두 tokens.css 한 파일에서 관리합니다. 이 가이드의 토큰 페이지도 같은 파일을 직접 읽어 그립니다.',
            }}
        >
            <Section id="s-why" num="01" title="왜 토큰인가" />
            <DocList
                items={[
                    '브랜드 색을 바꿀 때 tokens.css 한 줄만 고치면 관리자 전체에 반영됩니다.',
                    '“비슷한 회색” 수십 개가 생기는 것을 막고, 디자인과 같은 이름으로 대화할 수 있습니다.',
                    '기존 admin.css 의 하드코딩 HEX 는 스크립트로 같은 값의 토큰으로 자동 치환합니다. (동작 변경 없음)',
                ]}
            />

            <Section id="s-naming" num="02" title="이름 규칙" />
            <DocTable columns={['형식', '의미', '예시']} rows={NAMING_ROWS} />
            <Callout type="info" title="어떤 토큰을 써야 할까">
                용도가 분명하면 의미 토큰(<code>--color-text-muted</code>)을, 그 외에는 기본 색(
                <code>--color-black-600</code>)을 씁니다. 표에 없는 새 값이 필요하면 임의 HEX 대신 tokens.css 에
                토큰을 먼저 추가하세요.
            </Callout>

            <Section id="s-tokenize" num="03" title="관리자 CSS 토큰화" />
            <Prose>
                <code>npm run tokens</code> 는 원본 <code>css/admin/*.css</code> 를 읽어 <strong>값이 정확히 같은</strong>{' '}
                HEX 와 옛 변수명만 토큰으로 바꾼 사본을 <code>public/admin/css/</code> 에 만듭니다. 선택자(
                <code>#id</code>), 주석, <code>url()</code> 은 건드리지 않습니다.
            </Prose>
            <CodeBlock code={BEFORE_AFTER} language="css" fileName="admin.css" label="변환 예시" />
            <Prose>
                토큰이 없어 남겨 둔 HEX 와, 어디에도 정의되지 않은 변수 목록은{' '}
                <code>docs/admin-css-tokenize-report.md</code> 에 정리됩니다.
            </Prose>

            <Section id="s-legacy" num="04" title="옛 변수명 호환 (Legacy Alias)" />
            <Prose>
                기존 화면이 쓰던 <code>root_admin.css</code> 변수명은 tokens.css 하단에서 새 토큰으로 연결됩니다. 새
                코드에서는 오른쪽 이름을 사용하세요.
            </Prose>
            {tokens ? (
                <DocTable
                    columns={['옛 이름 (사용 금지)', '새 토큰']}
                    rows={tokens.legacy.map((item) => [<code>{item.name}</code>, <code>{item.target}</code>])}
                    rowKey={(row, index) => tokens.legacy[index].name}
                />
            ) : (
                <TokenStatus error={error} />
            )}

            <SubSection id="s-next" title="토큰 상세" />
            <DocList
                items={[
                    <Link to="/tokens/color">컬러 토큰</Link>,
                    <Link to="/tokens/typography">타이포그래피 토큰</Link>,
                    <Link to="/tokens/layout">레이아웃·폼 토큰</Link>,
                ]}
            />
        </DocPage>
    );
}
