import { ICON_VIEWBOX, findAdminIcon, getIconSvgAttributes } from './adminIcons.js';

/**
 * 관리자 공통 아이콘 (React) — 가이드 사이트 화면을 그릴 때만 쓰는 내부 컴포넌트
 * 업무 사이트(jQuery)에서는 icons.css + admin-icon.js 를 사용합니다.
 *
 * <AdminIcon name="search" />
 * <AdminIcon name="close" size={20} title="닫기" />
 *
 * - 색상은 부모의 color 를 따라갑니다 (currentColor).
 * - title 이 없으면 장식용으로 보고 스크린리더에서 숨깁니다(aria-hidden).
 *
 * 왜 dangerouslySetInnerHTML 인가:
 *   아이콘 도형(body)은 adminIcons.js 에 정적 문자열로만 존재하는 내부 데이터입니다.
 *   같은 문자열을 sprite/CSS 빌드에도 그대로 쓰기 때문에 JSX 로 다시 옮겨 적지 않고
 *   한 곳에서만 관리하려는 목적입니다. (외부 입력은 절대 넣지 않습니다)
 */
function toReactAttributes(attributes) {
    const reactAttributes = {};

    Object.entries(attributes).forEach(([key, value]) => {
        // stroke-width → strokeWidth
        const reactKey = key.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
        reactAttributes[reactKey] = value;
    });

    return reactAttributes;
}

export default function AdminIcon({ name, size = 16, title, className }) {
    const icon = findAdminIcon(name);

    if (!icon) {
        // 개발 중 오타를 빨리 찾기 위한 경고 (운영 빌드에서는 조용히 무시)
        if (import.meta.env.DEV) {
            console.warn(`[AdminIcon] 등록되지 않은 아이콘입니다: "${name}"`);
        }
        return null;
    }

    const accessibility = title
        ? { role: 'img', 'aria-label': title }
        : { 'aria-hidden': true, focusable: 'false' };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={ICON_VIEWBOX}
            width={size}
            height={size}
            className={className}
            {...toReactAttributes(getIconSvgAttributes(icon))}
            {...accessibility}
            dangerouslySetInnerHTML={{ __html: icon.body }}
        />
    );
}
