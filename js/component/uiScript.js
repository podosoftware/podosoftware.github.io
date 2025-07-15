"use strict";

// 윈도우 사이즈 체크
const windowSize = {
    current: null,
    breakPoint: 1024,
    getType() {
        return window.innerWidth >= this.breakPoint ? "pc" : "mobile";
    },
    update() {
        this.current = this.getType();
        document.body.setAttribute("data-device", this.current);
    },
    onChange(callback) {
        let last = this.getType();
        window.addEventListener("resize", () => {
            const now = this.getType();
            if (now !== last) {
                callback(now);
                last = now;
            }
        });
    }
};

// main menu pc
const podo_mainMenuPC = {
    init() {
        const pcMenu = document.querySelector('.podo-main-menu');
        if (!pcMenu || windowSize.getType() !== 'pc') return;
        pcMenu.classList.add('gnb-active');
        // 여기에 PC 메뉴 초기화 로직 추가 가능
    }
};

// main menu mobile
const podo_mainMenuMobile = {
    init() {
        const mobileMenu = document.querySelector('.podo-main-menu-mobile');
        if (!mobileMenu || windowSize.getType() !== 'mob') return;
        mobileMenu.classList.add('gnb-active');
        // 여기에 모바일 메뉴 초기화 로직 추가 가능
    }
};

// 휴대폰 번호 자동 -
const PhoneHyphenFormatter = (inputElement) => {
    if (!inputElement) return;

    inputElement.setAttribute("maxlength", "13");
    inputElement.setAttribute("inputmode", "numeric");

    inputElement.addEventListener("input", (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        let formatted = "";

        if (raw.length < 4) {
            formatted = raw;
        } else if (raw.length < 8) {
            formatted = raw.slice(0, 3) + "-" + raw.slice(3);
        } else {
            formatted = raw.slice(0, 3) + "-" + raw.slice(3, 7) + "-" + raw.slice(7, 11);
        }

        e.target.value = formatted;
    });
};

// 하이픈 제거 후 값 추출
const getRawPhoneNumber = (inputElement) => {
    return inputElement.value.replace(/-/g, "");
};

// 하이픈 포맷 적용 함수
const formatPhoneNumber = (raw) => {

    if(raw == null || raw == "") return false;

    raw = raw.replace(/[^0-9]/g, ""); // 숫자만 남기기
    if (raw.length < 4) {
        return raw;
    } else if (raw.length < 8) {
        return raw.slice(0, 3) + "-" + raw.slice(3);
    } else {
        return raw.slice(0, 3) + "-" + raw.slice(3, 7) + "-" + raw.slice(7, 11);
    }
};

// 생년월일 자동 하이픈 입력
const podo_birthHyphen = {
    init() {
        const inputs = document.querySelectorAll('[data-birth-hyphen]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                let val = input.value.replace(/[^0-9]/g, '');
                if (val.length > 8) val = val.slice(0, 8);
                const part1 = val.slice(0, 4);
                const part2 = val.slice(4, 6);
                const part3 = val.slice(6, 8);
                let result = part1;
                if (part2) result += '-' + part2;
                if (part3) result += '-' + part3;
                input.value = result;
            });
        });
    }
};

// 이메일 주소 select
const podo_emailDomainSelector = {
    domains: [
        { text: "직접 입력", value: "" },
        { text: "naver.com", value: "naver" },
        { text: "hanmail.net", value: "hanmail" },
        { text: "nate.com", value: "nate" },
        { text: "gmail.com", value: "gmail" },
        { text: "Hotmail.com", value: "Hotmail" },
        { text: "empal.com", value: "empal" },
        { text: "korea.com", value: "korea" }
    ],
    init() {
        const groups = document.querySelectorAll("[data-email-group]");
        groups.forEach(group => {
            const select = group.querySelector("[data-email-select]");
            const domainInput = group.querySelector("[data-email-domain]");
            if (!select || !domainInput || typeof $(select).kendoDropDownList !== "function") return;

            $(select).kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: this.domains,
                index: 0,
                change: function () {
                    const value = this.value();
                    const text = this.text();
                    domainInput.value = value ? text : "";
                }
            });
        });
    }
};

// podo_basicTab - 기본 탭 UI
const podo_basicTab = {
    init() {
        const tabGroups = document.querySelectorAll("[data-tab-basic]");
        tabGroups.forEach(group => {
            const buttons = group.querySelectorAll(".tab-nav button");
            const contents = group.querySelectorAll(".tab-cont");

            buttons.forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                    buttons.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    contents.forEach(c => c.classList.remove("active"));
                    if (contents[idx]) contents[idx].classList.add("active");
                });
            });
        });
    }
};

// 아코디언
const podo_foldToggle = {
    init() {
        const buttons = document.querySelectorAll("[data-fold-toggle]");
        buttons.forEach((btn, index) => {
            const section = btn.closest(".fold-section");
            const content = section.querySelector(".fold-content");

            const uniqueId = `fold-content-${index}`;
            content.setAttribute("id", uniqueId);
            content.setAttribute("role", "region");
            content.setAttribute("aria-labelledby", `fold-button-${index}`);
            content.setAttribute("hidden", true);

            btn.setAttribute("id", `fold-button-${index}`);
            btn.setAttribute("aria-controls", uniqueId);
            btn.setAttribute("aria-expanded", "false");
            btn.setAttribute("role", "button");
            btn.setAttribute("tabindex", "0");

            btn.addEventListener("click", () => this.toggle(btn, content));
            btn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.toggle(btn, content);
                }
            });
        });
    },
    toggle(btn, content) {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        content.toggleAttribute("hidden");
    }
};

// 휴대폰 번호 형식 검증
function isValidPhone(phone) {
    var regex = /^01[016789]-\d{3,4}-\d{4}$/;
    return regex.test(phone);
}

// 모달 대체 컴포넌트
const podo_layerPopup = {
    triggers: null,
    init() {
        this.triggers = document.querySelectorAll('[data-layer-open]');
        this.triggers.forEach(trigger => {
            const targetId = trigger.getAttribute('data-layer-open');
            const popup = document.getElementById(targetId);
            const closeBtn = popup.querySelector('[data-layer-close]');

            trigger.addEventListener('click', () => this.open(popup, trigger));
            closeBtn?.addEventListener('click', () => this.close(popup, trigger));
        });
    },
    open(popup, trigger) {
        popup.classList.add('visible');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('tabindex', '-1');
        popup.focus();
        document.body.classList.add('scroll-no');

        popup.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close(popup, trigger);
        });

        trigger.setAttribute('data-last-focus', 'true');
        this.focusTrap(popup);
    },
    close(popup, trigger) {
        popup.classList.remove('visible');
        popup.removeAttribute('aria-modal');
        popup.removeAttribute('tabindex');
        document.body.classList.remove('scroll-no');

        document.querySelector('[data-last-focus="true"]')?.focus();
        trigger.removeAttribute('data-last-focus');
    },
    focusTrap(container) {
        const focusable = container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        container.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });
    }
};

// 탭 대체 컴포넌트
const podo_segmentTab = {
    init() {
        const tabGroups = document.querySelectorAll('[data-tab-group]');
        tabGroups.forEach((group) => {
            const triggers = group.querySelectorAll('[data-tab]');
            const panels = group.querySelectorAll('[data-tab-panel]');

            group.setAttribute("role", "tablist");
            triggers.forEach((trigger, idx) => {
                const id = trigger.getAttribute("data-tab");
                trigger.setAttribute("role", "tab");
                trigger.setAttribute("aria-controls", id);
                trigger.setAttribute("tabindex", idx === 0 ? "0" : "-1");
                trigger.setAttribute("aria-selected", idx === 0 ? "true" : "false");
                trigger.id = `tab-${id}`;
                trigger.addEventListener("click", () => this.activate(trigger, group));
                trigger.addEventListener("keydown", (e) => this.onKeydown(e, triggers));
            });

            panels.forEach((panel, idx) => {
                const id = panel.getAttribute("data-tab-panel");
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-labelledby", `tab-${id}`);
                if (idx !== 0) panel.classList.remove("active");
            });
        });
    },
    activate(trigger, group) {
        const triggers = group.querySelectorAll('[data-tab]');
        const panels = group.querySelectorAll('[data-tab-panel]');
        const targetId = trigger.getAttribute("data-tab");

        triggers.forEach(t => {
            t.setAttribute("aria-selected", "false");
            t.setAttribute("tabindex", "-1");
            t.classList.remove("active");
        });

        trigger.setAttribute("aria-selected", "true");
        trigger.setAttribute("tabindex", "0");
        trigger.classList.add("active");

        panels.forEach(panel => {
            panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === targetId);
        });
        trigger.focus();
    },
    onKeydown(e, triggers) {
        const index = [...triggers].indexOf(document.activeElement);
        let newIndex = index;
        if (e.key === "ArrowRight") newIndex = (index + 1) % triggers.length;
        else if (e.key === "ArrowLeft") newIndex = (index - 1 + triggers.length) % triggers.length;
        triggers[newIndex].focus();
    }
};


// 캘린더 대체 컴포넌트
const podo_dateSelector = {
    init() {
        const inputs = document.querySelectorAll('[data-date-selector]');
        inputs.forEach(input => {
            input.setAttribute("role", "combobox");
            input.setAttribute("aria-haspopup", "dialog");
            input.setAttribute("aria-expanded", "false");
            input.addEventListener("focus", () => {
                input.setAttribute("aria-expanded", "true");
                input.showPicker?.();
            });
            input.addEventListener("blur", () => {
                input.setAttribute("aria-expanded", "false");
            });
        });
    }
};

// 툴팁 대체 컴포넌트
const podo_tipBubble = {
    init() {
        const tooltips = document.querySelectorAll('[data-tip]');
        tooltips.forEach(target => {
            const tipText = target.getAttribute('data-tip');
            const bubbleId = `tip-${Math.random().toString(36).slice(2, 8)}`;

            const bubble = document.createElement('span');
            bubble.className = 'tip-bubble';
            bubble.id = bubbleId;
            bubble.innerText = tipText;
            bubble.setAttribute("role", "tooltip");

            target.setAttribute("aria-describedby", bubbleId);

            target.addEventListener('mouseenter', () => target.appendChild(bubble));
            target.addEventListener('mouseleave', () => bubble.remove());
            target.addEventListener('focus', () => target.appendChild(bubble));
            target.addEventListener('blur', () => bubble.remove());
        });
    }
};


// 초기 이벤트
window.addEventListener("DOMContentLoaded", () => {

    windowSize.update();

    podo_mainMenuPC.init();
    podo_mainMenuMobile.init();

    podo_birthHyphen.init();
    podo_emailDomainSelector.init();
    podo_basicTab.init();
    podo_layerPopup.init();
    podo_segmentTab.init();
    podo_dateSelector.init();
    podo_tipBubble.init();
    podo_foldToggle.init();

    document.querySelectorAll(".pd-phone").forEach(el => {
        PhoneHyphenFormatter(el);
    });
});

