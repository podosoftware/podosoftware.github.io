import './inputBox.css';

export function Radio({
    label = '사과',
    label2 = '귤',
    label3 = '수박',
    disabled = false,
    checked = false,
}) {
    return `
<ul class="radio-box-wrap">
    <li>
        <div class="radio-box">
            <input type="radio" id="check_1" name="radioboxChk" value="1" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_1"><i class="icon radio"></i>${label}</label>
        </div>
    </li>
    <li>
        <div class="radio-box">
            <input type="radio" id="check_2" name="radioboxChk" value="2" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_2"><i class="icon radio"></i>${label2}</label>
        </div>
    </li>
    <li>
        <div class="radio-box">
            <input type="radio" id="check_3" name="radioboxChk" value="3" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_3"><i class="icon radio"></i>${label3}</label>
        </div>
    </li>
</ul>
  `;
}