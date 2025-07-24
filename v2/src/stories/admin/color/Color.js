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

export function bindTokenCopyEvent() {
    const copyButtons = document.querySelectorAll('.token-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const text = this.querySelector('span').innerText;

            // 임시 textarea 생성
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // 화면에서 보이지 않도록
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('복사되었습니다: ' + text);
                } else {
                    alert('복사 실패 (execCommand)');
                }
            } catch (err) {
                console.error('복사 실패:', err);
            }

            document.body.removeChild(textarea);
        });
    });
}