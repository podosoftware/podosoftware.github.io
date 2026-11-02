import { useLocation } from 'react-router-dom';
import useToc from '../hooks/useToc.js';

/**
 * 우측 "이 페이지" 목차 (1280px 이하에서는 CSS 로 숨김)
 *
 * HashRouter 를 쓰기 때문에 <a href="#id"> 를 쓰면 라우트가 바뀝니다.
 * 그래서 버튼 + scrollIntoView 로 이동합니다.
 */
export default function TocPanel() {
    const { pathname } = useLocation();
    const { headings, activeId } = useToc(pathname);

    if (headings.length === 0) {
        return null;
    }

    const scrollToHeading = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <aside className="g-toc" aria-label="이 페이지 목차">
            <div className="g-toc__title">이 페이지</div>
            {headings.map((heading) => {
                const classNames = ['g-toc__link'];
                if (heading.level === 3) classNames.push('is-sub');
                if (heading.id === activeId) classNames.push('active');

                return (
                    <button
                        type="button"
                        key={heading.id}
                        className={classNames.join(' ')}
                        onClick={() => scrollToHeading(heading.id)}
                    >
                        {heading.title}
                    </button>
                );
            })}
        </aside>
    );
}
