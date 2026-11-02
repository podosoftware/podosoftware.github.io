import { Link } from 'react-router-dom';
import AdminIcon from '../icons/AdminIcon.jsx';
import { GUIDE_VERSION } from '../routes.jsx';

/**
 * 상단 바 — 로고, 검색 진입, 버전 표시
 * (태블릿 이하: 햄버거 메뉴 / 모바일: 검색 아이콘 버튼)
 */
export default function Topbar({ onToggleSidebar, onOpenSearch }) {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

    return (
        <header className="g-topbar">
            <button type="button" className="g-topbar__menu" onClick={onToggleSidebar} aria-label="메뉴 열기">
                <AdminIcon name="menu" size={18} />
            </button>

            <Link to="/" className="g-wordmark">
                Publisher Guide<sup>ADMIN</sup>
            </Link>

            <div className="g-topbar__divider" />

            <button type="button" className="g-topbar__search" onClick={onOpenSearch}>
                <AdminIcon name="search" size={13} />
                문서 검색
                <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>

            <div className="g-topbar__right">
                <span className="g-topbar__version">{GUIDE_VERSION}</span>
                <button
                    type="button"
                    className="g-icon-btn g-topbar__mobile-search"
                    onClick={onOpenSearch}
                    aria-label="문서 검색"
                >
                    <AdminIcon name="search" size={16} />
                </button>
            </div>
        </header>
    );
}
