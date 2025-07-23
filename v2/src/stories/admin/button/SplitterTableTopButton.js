import './splitterButton.css';

export function SplitterTableTopButton({ label, disabled = false }) {
  return `
    <div class="table_btn only-btn-right">
      <button type="button" class="btn_inner" ${disabled ? 'disabled' : ''}><span>${label}</span></button>
    </div>
  `;
}
