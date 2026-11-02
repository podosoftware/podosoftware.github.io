import { ClassTable, DocPage, Example, Section } from '../../components/doc';

const BADGE_CLASSES = [
    { name: 'pd-badge', desc: '상태 뱃지 (disabled 추가 시 비활성)' },
    { name: 'pd-tag', desc: '계약 상태 등 태그형 표시' },
    { name: 'pd-badge02', desc: '진행 상태 (end 추가 시 종료)' },
    { name: 'list-box / box', desc: '건수 요약 카드 (active 로 선택 상태)' },
    { name: 'pay-box', desc: '결제 현황 카드 (pay-complete / pay-wating / pay-del / pay-chart)' },
];

export default function BadgesPage() {
    return (
        <DocPage
            hero={{
                label: 'Badge',
                eyebrow: 'Components',
                title: '뱃지 ·',
                strong: '현황',
                desc: '상태를 짧게 보여주는 뱃지·태그와 건수 요약 카드입니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={BADGE_CLASSES} />

            <Section id="s-badge" num="02" title="뱃지 · 태그" />
            <Example
                title="뱃지 / 태그 / 등급"
                description="뱃지·태그 한 줄, 회원 등급(골드·실버·비회원) 한 줄로 묶어 가로로 정렬합니다. (pd-flex- + pd-gap)"
                snippet="badge_01"
                stackGap={16}
            />

            <Section id="s-summary" num="03" title="현황 카드" />
            <Example title="건수 요약" snippet="badge_02" />
            <Example title="결제 현황" snippet="etc_01" defaultOpen={false} />
        </DocPage>
    );
}
