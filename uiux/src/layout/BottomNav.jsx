import { NavLink } from 'react-router-dom';
import AdminIcon from '../icons/AdminIcon.jsx';

/**
 * 모바일 하단 탭 (768px 이하에서만 CSS 로 노출)
 */
export default function BottomNav({ onToggleSidebar, onOpenSearch }) {
    const linkClass = ({ isActive }) => `g-bottom-nav__item${isActive ? ' active' : ''}`;

    return (
        <nav className="g-bottom-nav" aria-label="모바일 메뉴">
            <NavLink to="/overview" className={linkClass}>
                <AdminIcon name="document" size={20} />
                <span>문서</span>
            </NavLink>
            <button type="button" className="g-bottom-nav__item" onClick={onToggleSidebar}>
                <AdminIcon name="menu" size={20} />
                <span>메뉴</span>
            </button>
            <button type="button" className="g-bottom-nav__item" onClick={onOpenSearch}>
                <AdminIcon name="search" size={20} />
                <span>검색</span>
            </button>
            <NavLink to="/icons" className={linkClass}>
                <AdminIcon name="grid" size={20} />
                <span>아이콘</span>
            </NavLink>
        </nav>
    );
}
