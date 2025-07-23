import './contentButton.css';

export function ContentsTopSearchButton({
   label = '최상단 검색 버튼',
  className = 'btn_search',
    disabled = false,
}) {
    return `
    <button type="button" class="${className}" ${disabled ? 'disabled' : ''}>
        <i class="icon-search"></i>
        <span class="blind">${label}</span>
    </button>
  `;
}