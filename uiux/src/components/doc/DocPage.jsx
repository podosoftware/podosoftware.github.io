import { Link } from 'react-router-dom';
import AdminIcon from '../../icons/AdminIcon.jsx';
import { usePageMeta } from '../../context/PageMetaContext.js';

/**
 * 문서 페이지 공통 틀
 *
 * 브레드크럼 / 히어로 / 본문 / 이전·다음 버튼을 한 번에 그립니다.
 * 브레드크럼과 이전·다음은 routes.jsx 메뉴 순서에서 자동 계산되므로
 * 페이지에서는 hero 와 본문(children)만 작성하면 됩니다.
 *
 * <DocPage hero={{ label: 'Color', eyebrow: 'Design Tokens', title: '컬러', strong: '토큰', desc: '…' }}>
 *     <Section id="s-primary" num="01" title="Primary" /> …
 * </DocPage>
 */
export default function DocPage({ hero, children }) {
    const { current, previous, next } = usePageMeta();

    return (
        <>
            <Breadcrumb groupLabel={current?.groupLabel} title={current?.title} />
            {hero && <PageHero {...hero} />}
            <div className="g-doc" id="doc-content">
                {children}
                <PageNav previous={previous} next={next} />
            </div>
        </>
    );
}

function Breadcrumb({ groupLabel, title }) {
    return (
        <nav className="g-breadcrumb" aria-label="현재 위치">
            <Link to="/">홈</Link>
            {groupLabel && (
                <>
                    <span className="g-breadcrumb__sep">›</span>
                    <span>{groupLabel}</span>
                </>
            )}
            {title && (
                <>
                    <span className="g-breadcrumb__sep">›</span>
                    <span className="g-breadcrumb__current" aria-current="page">
                        {title}
                    </span>
                </>
            )}
        </nav>
    );
}

function PageHero({ label, eyebrow, title, strong, desc, meta = [] }) {
    return (
        <header className="g-hero" data-label={label}>
            {eyebrow && <div className="g-hero__eyebrow">{eyebrow}</div>}
            <h1 className="g-hero__title">
                {title}
                {title && strong ? ' ' : ''}
                {strong && <strong>{strong}</strong>}
            </h1>
            {desc && <p className="g-hero__desc">{desc}</p>}
            {meta.length > 0 && (
                <div className="g-hero__meta">
                    {meta.map((item) => (
                        <span key={item.text}>
                            {item.icon && <AdminIcon name={item.icon} size={13} />}
                            {item.text}
                        </span>
                    ))}
                </div>
            )}
        </header>
    );
}

function PageNav({ previous, next }) {
    if (!previous && !next) {
        return null;
    }

    return (
        <nav className="g-page-nav" aria-label="이전, 다음 문서">
            {previous ? (
                <Link className="g-page-nav__btn" to={previous.path}>
                    <div className="g-page-nav__label">← 이전</div>
                    <div className="g-page-nav__title">{previous.title}</div>
                </Link>
            ) : (
                <span className="g-page-nav__btn is-empty" aria-hidden="true" />
            )}
            {next ? (
                <Link className="g-page-nav__btn is-next" to={next.path}>
                    <div className="g-page-nav__label">다음 →</div>
                    <div className="g-page-nav__title">{next.title}</div>
                </Link>
            ) : (
                <span className="g-page-nav__btn is-empty" aria-hidden="true" />
            )}
        </nav>
    );
}
