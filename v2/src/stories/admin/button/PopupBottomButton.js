import './contentButton.css';

export function PopupBottomButton({
   defaultLabel = '취소',
   pointLabel = '저장',
  className = 'popup-btn',
  className2 = 'popup-btn btn-default'
}) {
    return `
    <div class="popup-foot">
        <ul class="btn-box-wrap">
            <li>
                <button type="button" class="${className2}"><span>${defaultLabel}</span></button>
                <button type="button" class="${className}"><span>${pointLabel}</span></button>
            </li>
        </ul>
    </div>
  `;
}