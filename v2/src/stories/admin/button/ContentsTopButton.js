import './contentButton.css';

export function ContentsTopButton({
   label = '최상단 버튼',
  className = 'btn_top',
    disabled = false,
}) {
    return `
    <button type="button" class="${className}" ${disabled ? 'disabled' : ''}><span>${label}</span></button>
  `;
}