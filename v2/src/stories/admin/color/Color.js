import './color.css';

export function PrimaryColor({
 }) {
    return `
<table>
    <colgroup>
        <col style="width: 30%;">
        <col style="width: 30%;">
        <col style="width: 40%;">
    </colgroup>
    <thead>
        <tr>
            <th>token name</th>
            <th>css token / value</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>--color-lightest-primary</td>
        <td>
            <button type="button" class="token-copy">
                <span>--color-lightest-primary</span>
                <i class="svg-icon ico-copy"></i>
            </button>
        </td>
        <td>
            <div class="palette-box">
                <div class="palette"></div>
                <span>#F8F9FD</span>
            </div>
        </td>
    </tr>
    </tbody>
</table>
  `;
}