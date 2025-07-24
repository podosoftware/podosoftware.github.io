import './inputBox.css';

export function Checkbox({
    label = '사과',
    label2 = '귤',
    label3 = '수박',
    disabled = false,
    checked = false,
}) {
    return `
<ul class="check-box-wrap">
    <li>
        <div class="check-box">
            <input type="checkbox" id="check_1" name="checkboxChk" value="1" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_1"><i class="icon check"></i>${label}</label>
        </div>
    </li>
    <li>
        <div class="check-box">
            <input type="checkbox" id="check_2" name="checkboxChk" value="2" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_2"><i class="icon check"></i>${label2}</label>
        </div>
    </li>
    <li>
        <div class="check-box">
            <input type="checkbox" id="check_3" name="checkboxChk" value="3" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
            <label for="check_3"><i class="icon check"></i>${label3}</label>
        </div>
    </li>
</ul>
  `;
}