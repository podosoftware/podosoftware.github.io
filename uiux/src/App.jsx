import { Navigate, Route, Routes } from 'react-router-dom';
import GuideLayout from './layout/GuideLayout.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { FLAT_ROUTES, HOME_PATH } from './routes.jsx';

export default function App() {
    return (
        <Routes>
            <Route element={<GuideLayout />}>
                <Route index element={<Navigate to={HOME_PATH} replace />} />
                {FLAT_ROUTES.map(({ path, component: PageComponent }) => (
                    <Route key={path} path={path} element={<PageComponent />} />
                ))}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
