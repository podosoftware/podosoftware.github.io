import './contentButton.css';

export function ContentsBottomButton({
   label = '최하든 버튼',
  className = 'btn_bot',
    disabled = false,
}) {
    return `
    <button class="${className}" ${disabled ? 'disabled' : ''}><span>${label}</span></button>
  `;
}