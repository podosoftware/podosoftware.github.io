import './splitterButton.css';

export function SplitterBottomButtonGroup({
  deleteLabel = '삭제',
  cancelLabel = '취소',
  saveLabel = '저장'
}) {
  return `
    <div class="op_detail_btn">
      <button type="button" class="btn_bot"><span>${deleteLabel}</span></button>
      <button type="button" class="btn_bot"><span>${cancelLabel}</span></button>
      <button type="button" class="btn_bot"><span>${saveLabel}</span></button>
    </div>
  `;
}
