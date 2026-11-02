import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from '../routes.jsx';

/**
 * 좌측 메뉴 — routes.jsx 의 NAV_GROUPS 를 그대로 그립니다.
 * 메뉴를 추가/정렬하려면 routes.jsx 만 수정하세요.
 */
export default function Sidebar({ isOpen, onNavigate }) {
    return (
        <nav className={`g-sidebar${isOpen ? ' is-open' : ''}`} aria-label="가이드 메뉴">
            {NAV_GROUPS.map((group) => (
                <div className="g-nav-group" key={group.label}>
                    <span className="g-nav-group__label">{group.label}</span>
                    {group.items.map((item) => (
                        // end: '/tokens' 가 '/tokens/color' 에서도 활성화되지 않도록 정확히 일치할 때만 active
                        <NavLink key={item.path} to={item.path} end className="g-nav-item" onClick={onNavigate}>
                            {item.title}
                            {item.badge && <span className="g-nav-item__badge">{item.badge}</span>}
                        </NavLink>
                    ))}
                </div>
            ))}
        </nav>
    );
}
