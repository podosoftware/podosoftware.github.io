import { useEffect, useState } from 'react';
import { ADMIN_ASSET } from '../config/assets.js';
import { parseTokens } from '../utils/parseTokens.js';

/**
 * 관리자 tokens.css 를 읽어 파싱한 결과를 돌려준다.
 *
 * 왜 import 가 아니라 fetch 인가:
 *   tokens.css 는 관리자 화면에서도 그대로 쓰는 "정적 파일"(public/)입니다.
 *   Vite 는 public 파일을 JS 에서 import 하는 것을 막기 때문에 런타임에 읽습니다.
 *   → 가이드와 실제 화면이 항상 같은 파일을 봅니다.
 *
 * 여러 페이지가 같은 파일을 쓰므로 한 번 읽은 결과는 모듈 변수에 캐시합니다.
 */
let cachedPromise = null;

function loadTokens() {
    if (!cachedPromise) {
        cachedPromise = fetch(ADMIN_ASSET.tokensCss)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`tokens.css 요청 실패 (HTTP ${response.status})`);
                }
                return response.text();
            })
            .then(parseTokens)
            .catch((error) => {
                cachedPromise = null; // 다음 진입 시 다시 시도할 수 있게 비운다.
                throw error;
            });
    }

    return cachedPromise;
}

export default function useAdminTokens() {
    const [state, setState] = useState({ tokens: null, error: null });

    useEffect(() => {
        let ignore = false;

        loadTokens()
            .then((tokens) => {
                if (!ignore) {
                    setState({ tokens, error: null });
                }
            })
            .catch((error) => {
                console.error('[useAdminTokens]', error);
                if (!ignore) {
                    setState({ tokens: null, error });
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    return state;
}
