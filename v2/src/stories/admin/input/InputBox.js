import './inputBox.css';

export function InputBox({
     label = '검색'
}) {
    return `
    <div class="cont_body">
    <div class="cont_body-top mb0">
        <div class="title">
            대타이틀명
        </div>
        <ul class="search-wrap">
            <li>
                <div class="input-box">
                    <input type="text" class="k-textbox" placeholder="input box">
                    <button type="button" class="btn_search">
                        <i class="icon icon-search"></i>
                        <span class="blind">${label}</span>
                    </button>
                </div>
            </li>
        </ul>
    </div>
</div>
  `;
}

export function InputBoxNormal({
   placeholder = '검색',
    disabled = false,
 }) {
    return `
    <input type="text" class="k-textbox pd-w-full" placeholder="${placeholder}" ${disabled ? 'disabled' : ''}>
  `;
}

export function InputBoxRightText({
   placeholder = '9,999,999',
   disabled = false,
    labelText = '원'
}) {
    return `
    <div class="input-box width178">
        <input type="text" class="k-textbox pd-w-full" placeholder="${placeholder}" ${disabled ? 'disabled' : ''}>
        <span class="txt">${labelText}</span>
    </div>
  `;
}

export function InputBoxButton({
  placeholder = '버튼을 클릭하세요.',
  disabled = false,
    buttonText = '검색'
}) {
    return `
    <div class="input-box">
        <input type="text" class="k-textbox pd-w-full" placeholder="${placeholder}" ${disabled ? 'disabled' : ''}>
        <button type="button" class="btn_inner" ${disabled ? 'disabled' : ''}>${buttonText}</button>
    </div>
  `;
}