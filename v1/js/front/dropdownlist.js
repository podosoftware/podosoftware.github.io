// kendo dropdownlist
class KendoDropdown extends HTMLElement {
    constructor() {
        super();
        // 템플릿 생성 및 내용 복사
        const template = document.createElement('template');
        template.innerHTML = `
      <select class="dropdown kw-select2"></select>
    `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // "dropdown-id" 속성으로 id 값을 지정, 없으면 기본 id 사용
        const dropdownId = this.getAttribute('dropdown-id') || `dropdown_${Math.floor(Math.random() * 10000)}`;
        const selectEl = this.querySelector('.dropdown');
        selectEl.id = dropdownId;

        // data 속성을 통해 전달된 JSON 데이터를 파싱
        let data = this.getAttribute('data');
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error('데이터 파싱 에러:', e);
                data = [];
            }
        } else {
            data = [];
        }

        // placeholder 속성 사용 (없으면 기본값 "Select..." 사용)
        const placeholder = this.getAttribute('placeholder') || 'Select...';

        // Kendo UI DropdownList 초기화
        $(selectEl).kendoDropDownList({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: data,
            optionLabel: placeholder
        });
    }
}

customElements.define('podo-dropdown', KendoDropdown);

// kendo numericText
class KendoNumericTextbox extends HTMLElement {
    constructor() {
        super();
        // 템플릿 구성: NumericTextBox로 변환할 <input> 요소 생성
        const template = document.createElement('template');
        template.innerHTML = `
      <input class="numeric-textbox k-textbox" type="text" />
    `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // "input-id" 속성으로 id 값을 지정, 없으면 기본 id 생성
        const inputId = this.getAttribute('input-id') || `numeric-textbox-${Math.floor(Math.random() * 10000)}`;
        const inputEl = this.querySelector('.numeric-textbox');
        inputEl.id = inputId;

        // 속성으로 초기값, 최소값, 최대값, 스텝, 포맷 등을 설정 (없으면 기본값 사용)
        const value = this.getAttribute('value') || 0;
        const min = this.getAttribute('min') !== null ? parseFloat(this.getAttribute('min')) : null;
        const max = this.getAttribute('max') !== null ? parseFloat(this.getAttribute('max')) : null;
        const step = this.getAttribute('step') !== null ? parseFloat(this.getAttribute('step')) : 1;
        const format = this.getAttribute('format') || 'n';

        // Kendo UI NumericTextBox 초기화
        $(inputEl).kendoNumericTextBox({
            value: parseFloat(value),
            min: min,
            max: max,
            step: step,
            format: format
        });
    }
}

customElements.define('podo-numeric-textbox', KendoNumericTextbox);

// kendo date picker
class KendoDatePicker extends HTMLElement {
    constructor() {
        super();
        // 템플릿 구성: DatePicker로 변환할 <input> 요소 생성
        const template = document.createElement('template');
        template.innerHTML = `
      <input class="date-picker" type="text" />
    `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // "input-id" 속성으로 id 값을 지정, 없으면 기본 id 생성
        const inputId = this.getAttribute('input-id') || `date-picker-${Math.floor(Math.random() * 10000)}`;
        const inputEl = this.querySelector('.date-picker');
        inputEl.id = inputId;

        // 속성으로 초기값, 최소값, 최대값, 포맷 등을 설정 (없으면 기본값 사용)
        // value, min, max 값은 ISO 포맷(yyyy-MM-dd) 혹은 Date 객체 형식의 문자열로 전달 가능
        const valueAttr = this.getAttribute('value');
        const minAttr = this.getAttribute('min');
        const maxAttr = this.getAttribute('max');
        const format = this.getAttribute('format') || 'MM/dd/yyyy';

        // 날짜 문자열이 전달되면 Date 객체로 변환 (전달되지 않으면 null)
        const value = valueAttr ? new Date(valueAttr) : null;
        const min = minAttr ? new Date(minAttr) : null;
        const max = maxAttr ? new Date(maxAttr) : null;

        // Kendo UI DatePicker 초기화
        $(inputEl).kendoDatePicker({
            value: value,
            min: min,
            max: max,
            format: format
        });
    }
}

customElements.define('podo-date-picker', KendoDatePicker);

// kendo date time picker
class KendoDateTimePicker extends HTMLElement {
    constructor() {
        super();
        // DateTimePicker로 변환할 <input> 요소를 포함하는 템플릿 생성
        const template = document.createElement('template');
        template.innerHTML = `
      <input class="date-time-picker" type="text" />
    `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // "input-id" 속성으로 id 값을 지정, 없으면 기본 id 생성
        const inputId = this.getAttribute('input-id') || `date-time-picker-${Math.floor(Math.random() * 10000)}`;
        const inputEl = this.querySelector('.date-time-picker');
        inputEl.id = inputId;

        // 속성으로 초기값, 최소값, 최대값, 포맷 등을 설정 (없으면 기본값 사용)
        // value, min, max는 ISO 형식(예: "2025-04-01T15:30")의 문자열로 전달 가능
        const valueAttr = this.getAttribute('value');
        const minAttr = this.getAttribute('min');
        const maxAttr = this.getAttribute('max');
        const format = this.getAttribute('format') || 'MM/dd/yyyy hh:mm tt';

        const value = valueAttr ? new Date(valueAttr) : null;
        const min = minAttr ? new Date(minAttr) : null;
        const max = maxAttr ? new Date(maxAttr) : null;

        // Kendo UI DateTimePicker 초기화
        $(inputEl).kendoDateTimePicker({
            value: value,
            min: min,
            max: max,
            format: format
        });
    }
}

customElements.define('podo-date-time-picker', KendoDateTimePicker);

// kendo time picker
class KendoTimePicker extends HTMLElement {
    constructor() {
        super();
        // 템플릿 구성: TimePicker로 변환할 <input> 요소 생성
        const template = document.createElement('template');
        template.innerHTML = `
      <input class="time-picker" type="text" />
    `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // "input-id" 속성으로 id 값을 지정, 없으면 기본 id 생성
        const inputId = this.getAttribute('input-id') || `time-picker-${Math.floor(Math.random() * 10000)}`;
        const inputEl = this.querySelector('.time-picker');
        inputEl.id = inputId;

        // 속성으로 초기값, 최소값, 최대값, 포맷 등을 설정 (없으면 기본값 사용)
        // value, min, max 속성은 시간 문자열 (예: "15:30:00")로 전달한다고 가정합니다.
        const valueAttr = this.getAttribute('value');
        const minAttr = this.getAttribute('min');
        const maxAttr = this.getAttribute('max');
        const format = this.getAttribute('format') || 'hh:mm tt';

        // 시간 문자열을 Date 객체로 변환 (기준 날짜는 임의로 1970-01-01로 설정)
        const value = valueAttr ? new Date(`1970-01-01T${valueAttr}`) : null;
        const min = minAttr ? new Date(`1970-01-01T${minAttr}`) : null;
        const max = maxAttr ? new Date(`1970-01-01T${maxAttr}`) : null;

        // Kendo UI TimePicker 초기화
        $(inputEl).kendoTimePicker({
            value: value,
            min: min,
            max: max,
            format: format
        });
    }
}

customElements.define('podo-time-picker', KendoTimePicker);
