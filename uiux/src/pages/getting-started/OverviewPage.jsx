import { Link } from 'react-router-dom';
import { Callout, Changelog, DocList, DocPage, DocTable, Prose, Section } from '../../components/doc';

const GUIDE_SECTIONS = [
    ['디자인 토큰', '관리자 화면의 색상·폰트·크기 변수. tokens.css 한 파일이 기준입니다.', '/tokens'],
    ['아이콘', 'PNG 아이콘을 대체하는 공통 SVG 아이콘 57종과 사용법, PNG 교체표', '/icons'],
    ['컴포넌트', '버튼, 입력 폼, 검색 영역, 팝업 등 실제 운영 마크업과 실시간 미리보기', '/components/buttons'],
    ['Kendo UI', 'Kendo UI 2025.1.211 로드 순서, 호환성, 위젯 예제', '/kendo'],
];

const CHANGELOG = [
    {
        version: 'v4.0',
        date: '2026-11',
        tags: ['feat', 'break'],
        desc: (
            <>
                가이드 사이트를 React(Vite)로 재구성(Concept B 화이트 에디토리얼). 관리자 CSS 토큰화(
                <code>tokens.css</code> + 자동 변환 스크립트), 관리자 아이콘 SVG 공통화(<code>icons.css</code>,{' '}
                <code>sprite.svg</code>), gulp 기반 MPA 파일 정리.
            </>
        ),
    },
    {
        version: 'v3.0',
        date: '2025-01',
        tags: ['fix', 'break', 'feat'],
        desc: (
            <>
                폰트 변수 오타(<code>sans-self</code>) 수정, 토큰 이름 체계(<code>--color-*</code>) 도입, Kendo UI
                2025 대응
            </>
        ),
    },
    {
        version: 'v2.0',
        date: '2024-08',
        tags: ['break'],
        desc: '토큰 시스템 전면 개편, Primary 팔레트를 Slate Blue 로 변경',
    },
];

export default function OverviewPage() {
    return (
        <DocPage
            hero={{
                label: 'Guide',
                eyebrow: 'Getting Started',
                title: 'Podo',
                strong: 'Publisher Guide',
                desc: '관리자 화면을 퍼블리싱할 때 따라야 할 토큰, 아이콘, 컴포넌트 마크업과 Kendo UI 사용법을 한곳에 정리한 가이드입니다.',
                meta: [
                    { icon: 'calendar', text: '2026-11-02' },
                    { icon: 'check-circle', text: 'Kendo UI 2025.1.211 기준' },
                ],
            }}
        >
            <Section id="s-purpose" num="01" title="이 가이드의 목적" />
            <Prose>
                같은 화면을 여러 사람이 만들어도 같은 결과가 나오도록, 실제 운영 중인 관리자 코드를 기준으로 규칙을
                정리했습니다. 이 가이드의 예제는 모두 실제 CSS(<code>tokens.css</code>, <code>admin.css</code>)를
                불러와 그리는 <strong>실시간 미리보기</strong>입니다. 화면에 보이는 그대로 복사해서 쓰면 됩니다.
            </Prose>

            <Section id="s-structure" num="02" title="가이드 구성" />
            <DocTable
                columns={['영역', '내용']}
                rows={GUIDE_SECTIONS.map(([title, desc, path]) => [<Link to={path}>{title}</Link>, desc])}
            />

            <Section id="s-rules" num="03" title="꼭 지킬 규칙 3가지" />
            <DocList
                ordered
                items={[
                    <>
                        색상·폰트·높이는 HEX 나 px 를 직접 쓰지 말고 <code>var(--color-primary-500)</code> 처럼 토큰을
                        씁니다.
                    </>,
                    <>
                        아이콘은 새 PNG 를 만들지 말고 <code>&lt;i class="ad-icon ad-icon--search"&gt;</code> 공통
                        아이콘을 씁니다. 색은 <code>color</code> 로 바꿉니다.
                    </>,
                    <>
                        Kendo UI 는 <code>2025.1.211</code> 버전 파일만 사용합니다. (2022 / 2023 폴더 파일 사용 금지)
                    </>,
                ]}
            />
            <Callout type="tip" title="처음이라면">
                <Link to="/setup">환경 설정</Link>에서 CSS 로드 순서를 먼저 확인하세요. 기존 <code>root_admin.css</code>{' '}
                자리를 <code>tokens.css</code> 로 바꾸기만 해도 기존 화면은 그대로 유지됩니다.
            </Callout>

            <Section id="s-changelog" num="04" title="변경 이력" />
            <Changelog items={CHANGELOG} />
        </DocPage>
    );
}
