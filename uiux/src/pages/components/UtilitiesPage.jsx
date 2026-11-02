import { ClassTable, DocPage, DocTable, Example, Section } from '../../components/doc';

const CLAMP_CLASSES = [
    { name: 'pd-clamp-', desc: '말줄임 기본 (pd-clamp-로 시작하는 모든 클래스에 공통 적용)' },
    { name: 'pd-clamp-02 ~ 05', desc: '-webkit-line-clamp 2 ~ 5줄' },
    { name: 'pd-clamp-none', desc: '말줄임 해제' },
];

// util.css 정의 기준 ([class*=pd-flex-] 는 "pd-flex-" 가 들어간 모든 클래스에 display:flex 적용)
const FLEX_ROWS = [
    [<code>pd-flex-</code>, 'display:flex + max-width:100% — pd-flex-로 시작하는 모든 클래스에 공통 적용'],
    [<code>pd-flex-col / pd-flex-wrap</code>, '세로 방향 / 줄바꿈'],
    [<code>pd-flex-end / pd-flex-start</code>, 'justify-content: flex-end / flex-start'],
    [<code>pd-flex-all-center</code>, '가로·세로 가운데 정렬'],
    [<code>pd-flex-shrink-0</code>, 'flex-shrink: 0 (줄어들지 않음)'],
    [<code>pd-gap7 / pd-gap15</code>, 'gap: 7px / 15px'],
    [<code>pd-w-full</code>, 'width: 100% !important'],
    [<code>pd-mt10 / pd-mb20</code>, 'margin-top: 10px / margin-bottom: 20px'],
    [<code>blind</code>, '화면 밖으로 숨김 (스크린리더용 텍스트)'],
];

export default function UtilitiesPage() {
    return (
        <DocPage
            hero={{
                label: 'Util',
                eyebrow: 'Components',
                title: '',
                strong: '유틸리티',
                desc: 'util.css 의 자주 쓰는 클래스입니다. 화면마다 CSS 를 새로 쓰기 전에 먼저 확인하세요.',
            }}
        >
            <Section id="s-clamp" num="01" title="말줄임" />
            <ClassTable items={CLAMP_CLASSES} />
            <Example title="말줄임" snippet="util_01" />

            <Section id="s-flex" num="02" title="레이아웃 · 간격" />
            <DocTable columns={['클래스', '설명']} rows={FLEX_ROWS} />

            <Section id="s-nodata" num="03" title="이미지 없음" />
            <Example title="이미지 없음 안내" snippet="util_02" />
        </DocPage>
    );
}
