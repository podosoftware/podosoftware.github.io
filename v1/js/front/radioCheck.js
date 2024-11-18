/**
 * radio 배열로 그려질 경우
  */
class podoRadio extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static radioCounter = 1;

    constructor() {
        super();
        this._list = [];
    }

    // 배열을 설정하는 setter
    set list(value) {
        this._list = value;
        this.render();
    }

    render() {
        if (!this._list) return;

        const name = this.getAttribute("name") || "radio";
        // `ul` 내부의 <li>로 라디오 버튼 생성
        this.innerHTML = `
        <ul class="radio-box-wrap">
          ${this._list
            .map(
                (item, index) => `
              <li class="radio-box">
                <input type="radio" id="${name}_${index}" name="${name}" value="${item.value}" ${item.value2 ? `value2=${item.value2}` : ""} ${item.value3 ? `value3=${item.value3}` : ""} />
                <label for="${name}_${index}"><i class="radio"></i>${item.title} ${item.title2 ? ` ${item.title2}` : ""}</label>
              </li>
            `
            )
            .join("")}
        </ul>`;
    }

    connectedCallback() {
        this.render();
    }
}

/**
 * checkbox 배열로 그려질 경우
 */
class podoCheckbox extends HTMLElement {
    // 클래스의 정적 변수로 counter를 선언하여 순차적 ID 부여
    static radioCounter = 1;

    constructor() {
        super();
        this._list = [];
    }

    // 배열을 설정하는 setter
    set list(value) {
        this._list = value;
        this.render();
    }

    render() {
        if (!this._list) return;

        const name = this.getAttribute("name") || "radio";
        // `ul` 내부의 <li>로 라디오 버튼 생성
        this.innerHTML = `
        <ul class="radio-box-wrap">
          ${this._list
            .map(
                (item, index) => `
              <li class="check-box">
                <input type="checkbox" id="${name}_${index}" name="${name}" value="${item.value}" />
                <label for="${name}_${index}"><i class="check"></i>${item.title} ${item.frequency ? ` (${item.frequency})` : ""}</label>
              </li>
            `
            )
            .join("")}
        </ul>`;
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define("podo-radio", podoRadio);
customElements.define("podo-checkbox", podoCheckbox);