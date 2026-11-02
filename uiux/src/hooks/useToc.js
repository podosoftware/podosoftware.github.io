import { useEffect, useState } from 'react';

/**
 * 본문의 섹션 제목(h2.g-sec, h3.g-subsec)을 읽어 목차와 "현재 보고 있는 섹션"을 만든다.
 *
 * 왜 DOM 에서 읽는가:
 *   페이지마다 목차 배열을 따로 작성하면 제목을 바꿀 때 두 군데를 고쳐야 합니다.
 *   <Section id title> 만 쓰면 목차가 자동으로 따라오도록 했습니다.
 *
 * 토큰 페이지처럼 데이터를 늦게 불러와 섹션이 나중에 생기는 경우를 위해
 * MutationObserver 로 본문 변경을 감지해 다시 계산합니다.
 */
const HEADING_SELECTOR = '#doc-content .g-sec[id], #doc-content .g-subsec[id]';

function readHeadings() {
    return Array.from(document.querySelectorAll(HEADING_SELECTOR)).map((element) => ({
        id: element.id,
        title: element.dataset.toc || element.textContent,
        level: element.tagName === 'H3' ? 3 : 2,
    }));
}

function isSameHeadings(a, b) {
    return a.length === b.length && a.every((item, index) => item.id === b[index].id && item.title === b[index].title);
}

export default function useToc(pathname) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState(null);

    // 1) 목차 수집
    useEffect(() => {
        const main = document.querySelector('.g-main');
        if (!main) {
            return undefined;
        }

        let frameId = null;
        const refresh = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const next = readHeadings();
                setHeadings((prev) => (isSameHeadings(prev, next) ? prev : next));
            });
        };

        refresh();

        const observer = new MutationObserver(refresh);
        observer.observe(main, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [pathname]);

    // 2) 스크롤 위치에 따른 현재 섹션 표시
    useEffect(() => {
        if (headings.length === 0) {
            setActiveId(null);
            return undefined;
        }

        setActiveId(headings[0].id);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-20% 0px -70% 0px' },
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    return { headings, activeId };
}
