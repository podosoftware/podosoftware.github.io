import './splitterButton.css';

export function SplitterInputBox({ placeholder = '', buttonLabel = '확인' }) {
  return `
    <div class="input-box" style="width: 30%;">
      <input type="text" class="k-textbox" placeholder="${placeholder}">
      <button type="button" class="btn_input">${buttonLabel}</button>
    </div>
  `;
}
