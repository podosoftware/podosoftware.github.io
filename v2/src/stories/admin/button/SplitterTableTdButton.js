import './splitterButton.css';

export function SplitterTableTdButton({ label, disabled = false }) {
  return `
    <button type="button" class="btn_input" ${disabled ? 'disabled' : ''}><span>${label}</span></button>
  `;
}
