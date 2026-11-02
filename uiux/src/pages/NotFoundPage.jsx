import { Link } from 'react-router-dom';
import { DocPage, Prose } from '../components/doc';
import { HOME_PATH } from '../routes.jsx';

export default function NotFoundPage() {
    return (
        <DocPage hero={{ label: '404', eyebrow: 'Not Found', title: '페이지를', strong: '찾을 수 없습니다' }}>
            <Prose>
                주소가 바뀌었거나 삭제된 문서입니다. <Link to={HOME_PATH}>개요로 이동</Link>하거나 상단 검색(⌘K)을 이용하세요.
            </Prose>
        </DocPage>
    );
}
