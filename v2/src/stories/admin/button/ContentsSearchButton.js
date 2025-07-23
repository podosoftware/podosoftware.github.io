import './contentButton.css';

export function ContentsSearchButton({
 resetLabel = '초기화',
 pointLabel = '검색',
  className = 'btn-default',
  className2 = 'btn-default btn-point'
}) {
    return `
    <button type="button" class="${className}"><span>${resetLabel}</span></button>
    <button type="button" class="${className2}"><span>${pointLabel}</span></button>
  `;
}