import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageMetaProvider } from '../context/PageMetaContext.js';
import { getPageMeta } from '../routes.jsx';
import BottomNav from './BottomNav.jsx';
import SearchModal from './SearchModal.jsx';
import Sidebar from './Sidebar.jsx';
import TocPanel from './TocPanel.jsx';
import Topbar from './Topbar.jsx';

/**
 * 가이드 전체 레이아웃
 *
 *  ┌──────────── Topbar ────────────┐
 *  │ Sidebar │   Main(페이지)   │ TOC │
 *  └──────── BottomNav(모바일) ─────┘
 *
 * 화면 상태(사이드바 열림, 검색창 열림)는 여기서만 관리하고 하위에는 콜백만 내려줍니다.
 */
const DESKTOP_MIN_WIDTH = 1024;

export default function GuideLayout() {
    const { pathname } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const toggleSidebar = useCallback(() => setIsSidebarOpen((open) => !open), []);
    const openSearch = useCallback(() => setIsSearchOpen(true), []);
    const closeSearch = useCallback(() => setIsSearchOpen(false), []);

    // 페이지 이동 시: 맨 위로 + 모바일 사이드바 닫기 + 브라우저 탭 제목
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsSidebarOpen(false);

        const title = pageMeta.current?.title;
        document.title = title ? `${title} - Podo Publisher Guide` : 'Podo Publisher Guide';
    }, [pathname, pageMeta]);

    // 단축키: ⌘K / Ctrl+K 검색, Esc 닫기
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setIsSearchOpen(true);
            }
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 데스크톱 폭으로 커지면 오버레이 사이드바 상태 해제
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > DESKTOP_MIN_WIDTH) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 모바일 사이드바/검색이 열려 있으면 뒤 화면 스크롤 잠금
    useEffect(() => {
        document.body.style.overflow = isSidebarOpen || isSearchOpen ? 'hidden' : '';
    }, [isSidebarOpen, isSearchOpen]);

    return (
        <PageMetaProvider value={pageMeta}>
            <Topbar onToggleSidebar={toggleSidebar} onOpenSearch={openSearch} />

            <div className={`g-sidebar-overlay${isSidebarOpen ? ' is-open' : ''}`} onClick={closeSidebar} />
            <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />

            <div className="g-layout">
                <main className="g-main">
                    <Outlet />
                </main>
                <TocPanel />
            </div>

            <BottomNav onToggleSidebar={toggleSidebar} onOpenSearch={openSearch} />
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
        </PageMetaProvider>
    );
}
