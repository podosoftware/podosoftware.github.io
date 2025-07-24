import './inputBox.css';

export function TextareaBox({
   placeholder = '내용을 입력해 주세요.',
   disabled = false,
}) {
    return `
    <textarea type="text" class="k-textbox pd-w-full" style="height: 190px;" placeholder="${placeholder}" ${disabled ? 'disabled' : ''}></textarea>
  `;
}