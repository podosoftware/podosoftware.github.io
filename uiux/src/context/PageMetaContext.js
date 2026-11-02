import { createContext, useContext } from 'react';

/**
 * 현재 페이지의 메뉴 정보(그룹, 제목, 이전/다음)를 문서 컴포넌트에 전달하는 컨텍스트
 *
 * 왜 컨텍스트인가:
 *   페이지 컴포넌트가 routes.jsx 를 직접 import 하면 순환 참조가 생깁니다.
 *   (routes.jsx → 페이지 → routes.jsx)
 *   레이아웃이 현재 경로의 정보를 계산해 내려주면 페이지는 메뉴 구조를 몰라도 됩니다.
 */
const PageMetaContext = createContext({
    current: null,
    previous: null,
    next: null,
});

export const PageMetaProvider = PageMetaContext.Provider;

export function usePageMeta() {
    return useContext(PageMetaContext);
}
