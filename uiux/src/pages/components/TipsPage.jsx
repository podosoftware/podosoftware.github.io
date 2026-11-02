import { Callout, ClassTable, DocPage, Example, Section } from '../../components/doc';

const TIP_CLASSES = [
    { name: 'tip-box', desc: '본문 상단 번호형 Tip 박스' },
    { name: 'info-txt', desc: '입력창 아래 한 줄 안내 (파란 i 아이콘)' },
    { name: 'tip-wrap / title_box', desc: '제목 옆 ? 버튼 → 말풍선 Tip' },
    { name: 'cont-tip-box', desc: '왼쪽 제목 + 오른쪽 목록형 Tip, 한 줄 안내' },
];

export default function TipsPage() {
    return (
        <DocPage
            hero={{
                label: 'Tip',
                eyebrow: 'Components',
                title: '팁 ·',
                strong: '안내',
                desc: '사용자에게 입력 방법이나 주의 사항을 알려주는 안내 영역입니다.',
            }}
        >
            <Section id="s-classes" num="01" title="클래스 요약" />
            <ClassTable items={TIP_CLASSES} />

            <Section id="s-box" num="02" title="Tip 박스" />
            <Example title="번호형 Tip" snippet="tips_01" />
            <Example title="제목 + 목록형 Tip" snippet="tips_04" />

            <Section id="s-inline" num="03" title="한 줄 안내" />
            <Example title="입력창 아래 안내" snippet="tips_02" />
            <Example title="한 줄 안내 박스" snippet="tips_05" />

            <Section id="s-tooltip" num="04" title="말풍선 Tip" />
            <Example title="제목 옆 ? 버튼" snippet="tips_03" />
            <Callout type="tip" title="아이콘 교체 권장">
                <code>&lt;img src="…/icon_subtract.png"&gt;</code> 는{' '}
                <code>&lt;i class="ad-icon ad-icon--help"&gt;&lt;/i&gt;</code> 로 바꿀 수 있습니다. (색은 color 로 지정)
            </Callout>
        </DocPage>
    );
}
