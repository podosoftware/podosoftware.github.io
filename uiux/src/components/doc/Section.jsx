/**
 * 문서 섹션 제목
 *
 * id 를 꼭 지정하세요. 우측 "이 페이지" 목차(TOC)가 id 로 섹션을 찾아 링크를 만듭니다.
 *
 * <Section id="s-primary" num="01" title="Primary Palette" />
 * <SubSection id="s-primary-code" title="팔레트 코드" />
 */
export function Section({ id, num, title }) {
    return (
        <h2 className="g-sec" id={id} data-toc={title}>
            {num && <span className="g-sec__num">{num}</span>}
            {title}
        </h2>
    );
}

export function SubSection({ id, title }) {
    return (
        <h3 className="g-subsec" id={id} data-toc={title}>
            {title}
        </h3>
    );
}

/** 본문 문단 */
export function Prose({ children }) {
    return <p className="g-prose">{children}</p>;
}

/** 글머리 목록 — items 는 문자열 또는 JSX */
export function DocList({ items, ordered = false }) {
    const ListTag = ordered ? 'ol' : 'ul';

    return (
        <ListTag className="g-list">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ListTag>
    );
}
