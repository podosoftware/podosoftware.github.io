/**
 * 클립보드 복사
 *
 * navigator.clipboard 는 HTTPS 또는 localhost 에서만 동작합니다.
 * 사내 http 서버에서 열었을 때도 복사가 되도록 textarea 방식을 대체 수단으로 둡니다.
 */
export async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('[clipboard] Clipboard API 실패, 대체 방식으로 재시도합니다.', error);
        }
    }

    return copyWithTextarea(text);
}

function copyWithTextarea(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
        copied = document.execCommand('copy');
    } catch (error) {
        console.error('[clipboard] 복사에 실패했습니다.', error);
    } finally {
        document.body.removeChild(textarea);
    }

    return copied;
}
