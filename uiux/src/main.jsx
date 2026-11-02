import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

/**
 * HashRouter 를 쓰는 이유
 *   GitHub Pages / 사내 정적 서버처럼 서버 라우팅 설정을 할 수 없는 곳에서도
 *   새로고침·직접 링크(#/tokens/color)가 404 없이 동작합니다.
 *
 * future 플래그: react-router v7 동작을 미리 켜서 업그레이드 시 변경이 없게 하고 콘솔 경고를 없앱니다.
 */
const ROUTER_FUTURE_FLAGS = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter future={ROUTER_FUTURE_FLAGS}>
            <App />
        </HashRouter>
    </StrictMode>,
);
