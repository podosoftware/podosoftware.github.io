const kendoPopupTemplate = document.createElement('template');
kendoPopupTemplate.innerHTML = `
    <div class="podo-kendo-popup">
        <div class="popup-content">
            <slot name="content">팝업 내용이 여기에 표시됩니다.</slot>
        </div>
        <div class="popup-foot"></div>
    </div>
`;

class podoKendoPopup extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(kendoPopupTemplate.content.cloneNode(true));
        this.uniqueId = `popup_${Math.random().toString(36).substr(2, 9)}`;
        this.popupContainer = this.shadowRoot.querySelector(".podo-kendo-popup");
        this.popupContainer.setAttribute("id", this.uniqueId); // 고유한 ID 설정
        this.popupOpened = false; // 팝업이 열렸는지 여부를 나타내는 상태 변수
    }

    connectedCallback() {
        console.log(`${this.uniqueId}`);
        // Kendo Popup 초기화
        if(!this.popup) {
            this.popup = $(this.shadowRoot.querySelector(`#${this.uniqueId}`)).kendoPopup({
                anchor: $("body"), // 원하는 위치에 팝업을 띄우기 위한 앵커 요소 설정
                animation: {
                    open: {
                        effects: "fade:in",
                        duration: 300
                    },
                    close: {
                        effects: "fade:out",
                        duration: 300
                    }
                }
            }).data("kendoPopup");

            // 버튼 설정 및 렌더링
            this.renderButtons();
        }
    }

    // 버튼 설정을 위한 속성으로 받은 정보에 따라 버튼을 동적으로 생성합니다.
    set buttons(buttonConfigs) {
        this._buttons = buttonConfigs;
    }

    renderButtons() {
        const buttonContainer = this.shadowRoot.querySelector(`#${this.uniqueId} .popup-foot`);

        // buttonContainer가 존재하는지 확인
        if (!buttonContainer) {
            console.error("buttonContainer 요소를 찾을 수 없습니다.");
            return;
        }

        buttonContainer.innerHTML = ''; // 기존 버튼 초기화

        if (Array.isArray(this._buttons)) {
            this._buttons.forEach(config => {
                const button = document.createElement("button");
                button.className = `${config.class}`;
                button.innerHTML = `<span>${config.label}</span>`;

                // 타입이 있으면 추가, 없으면 기본 'button' 설정
                button.type = config.type || "button";

                // 버튼에 지정된 콜백 함수 연결
                button.addEventListener("click", () => {
                    if (typeof config.onClick === "function") {
                        config.onClick(); // 외부 함수 호출
                    }
                    this.closePopup(); // 클릭 후 팝업 닫기
                });

                buttonContainer.appendChild(button);
            });
        }
    }

    openPopup() {
        // 팝업이 이미 열렸는지 체크
        if (this.popupOpened) {
            console.log("팝업은 이미 열려 있습니다.");
            return; // 이미 열려 있으면 아무 것도 하지 않음
        }

        this.renderButtons(); // 버튼을 팝업을 열 때 렌더링
        this.popup.open();
        this.popupOpened = true; // 팝업이 열렸음을 표시
    }

    closePopup() {
        this.popup.close();
        this.popupOpened = false; // 팝업이 닫혔으므로 상태 초기화
    }
}

customElements.define("podo-kendo-popup", podoKendoPopup);