/**
 * 실사용 마크업 스니펫
 *
 * src/snippets/admin/*.html 은 기존 관리자 가이드(v1/admin/code — 현재 삭제, git 기록에 있음)에서 가져온 "실제 운영 코드"입니다.
 * 페이지에서는 파일명으로 꺼내 쓰고, 같은 문자열로 미리보기와 코드 보기를 함께 만듭니다.
 *
 *   import { getSnippet } from '../../snippets';
 *   <Example snippet="button_contents_01" />
 *
 * 새 스니펫 추가: admin 폴더에 .html 파일만 넣으면 자동 등록됩니다. (import.meta.glob)
 */
const modules = import.meta.glob('./admin/*.html', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const SNIPPETS = {};

Object.entries(modules).forEach(([filePath, source]) => {
    const name = filePath.replace('./admin/', '').replace('.html', '');
    SNIPPETS[name] = source.trim();
});

export function getSnippet(name) {
    if (!(name in SNIPPETS)) {
        console.warn(`[snippets] 스니펫을 찾을 수 없습니다: ${name}.html`);
        return '';
    }

    return SNIPPETS[name];
}

export function hasSnippet(name) {
    return name in SNIPPETS;
}
