import './contentButton.css';

export function ContentsTableTopButton({
   label = '콘텐츠 테이블 상단 버튼',
  className = 'btn-default',
    disabled = false,
}) {
    return `
    <button type="button" class="${className}" ${disabled ? 'disabled' : ''}><span>${label}</span></button>
  `;
}