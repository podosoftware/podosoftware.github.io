import './color.css';

/**
 * 공통 렌더러 - 어떤 토큰 배열이든 받아서 테이블로 출력
 * @param {Array} tokenList
 */

export function PrimaryColor(tokenList = []) {
    const rowsHtml = tokenList
        .map(
            (token) => `
      <tr>
        <td>${token.name}</td>
        <td>
          <button type="button" class="token-copy">
            <span>${token.token}</span>
            <i class="svg-icon ico-copy"></i>
          </button>
        </td>
        <td>
          <div class="palette-box">
            <div class="palette ${token.className}"></div>
            <span>${token.hex}</span>
          </div>
        </td>
      </tr>`
        )
        .join('\n');

    return `
<table class="table-style">
  <colgroup>
    <col style="width: 30%;">
    <col style="width: 30%;">
    <col style="width: 40%;">
  </colgroup>
  <thead>
    <tr>
      <th>token name</th>
      <th>css token / value</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml}
  </tbody>
</table>
  `;
}

export function bindTokenCopyEvent(root = document) {
    const copyButtons = root.querySelectorAll('.token-copy');

    copyButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', () => {
            const text = newButton.querySelector('span').innerText;

            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const success = document.execCommand('copy');
                if (success) {
                    showToast(`복사되었습니다: ${text}`);
                }
            } catch (err) {
                console.error('복사 실패:', err);
            }

            document.body.removeChild(textarea);
        });
    });
}

export function showToast(message = '복사되었습니다.') {
    // 기존 토스트 제거
    const old = document.querySelector('.custom-toast');
    if (old) old.remove();

    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerText = message;

    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#333',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        zIndex: 9999,
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        opacity: '0',
        transition: 'opacity 0.3s ease',
    });

    document.body.appendChild(toast);

    // fade-in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    // 3초 후 fade-out 및 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300); // fade-out 끝난 후 제거
    }, 1500);
}