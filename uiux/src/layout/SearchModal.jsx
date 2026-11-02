import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminIcon from '../icons/AdminIcon.jsx';
import { FLAT_ROUTES } from '../routes.jsx';

/**
 * 문서 검색 (⌘K / Ctrl+K)
 *
 * 검색 대상: 메뉴 제목, 그룹명, routes.jsx 의 keywords
 * 키보드: ↑ ↓ 이동, Enter 이동, Esc 닫기
 */
const DEFAULT_RESULT_COUNT = 8;

function matchRoute(route, query) {
    const target = [route.title, route.groupLabel, ...(route.keywords || [])].join(' ').toLowerCase();
    return target.includes(query);
}

export default function SearchModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [focusIndex, setFocusIndex] = useState(0);

    const results = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        if (!keyword) {
            return FLAT_ROUTES.slice(0, DEFAULT_RESULT_COUNT);
        }
        return FLAT_ROUTES.filter((route) => matchRoute(route, keyword));
    }, [query]);

    // 열릴 때마다 입력창 초기화 + 포커스
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setFocusIndex(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    useEffect(() => {
        setFocusIndex(0);
    }, [query]);

    if (!isOpen) {
        return null;
    }

    const goTo = (route) => {
        if (!route) {
            return;
        }
        navigate(route.path);
        onClose();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setFocusIndex((index) => Math.min(index + 1, results.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setFocusIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            goTo(results[focusIndex]);
        }
    };

    return (
        <div
            className="g-search"
            role="dialog"
            aria-modal="true"
            aria-label="문서 검색"
            onMouseDown={(event) => {
                // 바깥(어두운 영역) 클릭 시 닫기
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="g-search__box">
                <div className="g-search__input-row">
                    <AdminIcon name="search" size={16} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        placeholder="문서 검색… (예: 버튼, 토큰, kendo)"
                        autoComplete="off"
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" className="g-search__esc" onClick={onClose}>
                        ESC
                    </button>
                </div>

                <div className="g-search__results">
                    {results.length === 0 && <div className="g-search__empty">검색 결과가 없습니다.</div>}

                    {results.map((route, index) => (
                        <button
                            type="button"
                            key={route.path}
                            className={`g-search__item${index === focusIndex ? ' is-focused' : ''}`}
                            onMouseEnter={() => setFocusIndex(index)}
                            onClick={() => goTo(route)}
                        >
                            <span className="g-search__item-icon">
                                <AdminIcon name="document" size={14} />
                            </span>
                            <span>
                                <span className="g-search__item-group">{route.groupLabel}</span>
                                <br />
                                <span className="g-search__item-label">{route.title}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
