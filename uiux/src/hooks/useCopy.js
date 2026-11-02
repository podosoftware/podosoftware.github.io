import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../utils/clipboard.js';

/**
 * 복사 + "복사됨" 표시 상태를 함께 관리하는 훅
 *
 * const { copiedKey, copy } = useCopy();
 * copy('var(--color-primary-500)', 'primary-500');
 * copiedKey === 'primary-500' 동안 "copied" 표시
 */
export default function useCopy(resetDelay = 1600) {
    const [copiedKey, setCopiedKey] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    const copy = useCallback(
        async (text, key = text) => {
            const copied = await copyText(text);

            if (!copied) {
                return;
            }

            setCopiedKey(key);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopiedKey(null), resetDelay);
        },
        [resetDelay],
    );

    return { copiedKey, copy };
}
