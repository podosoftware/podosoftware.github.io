/**
 * 공통 밸류데이션 유틸 (개선 버전)
 * Kendo 컴포넌트를 kendo.data()로 감지
 * 일반 input, select, textarea와 모든 Kendo 컴포넌트를 지원
 * .input-group-prepend 처리 추가
 */

const ValidationUtil = {
    /**
     * 에러 메시지 표시 DOM 생성
     * @param {string} message - 표시할 에러 메시지
     * @returns {HTMLElement} - div.wrong_message 요소
     */
    createErrorMessageElement(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'wrong_message show';
        errorDiv.textContent = message;
        return errorDiv;
    },

    /**
     * .input-group-prepend 컨테이너 확인
     * 두 가지 구조 모두 지원:
     * 1. <div class="input-group"><div class="input-group-prepend">...</div><input>
     * 2. <div class="input-group-prepend"><input>...</div> (직접 포함)
     * @param {HTMLElement} element - 확인할 요소
     * @returns {HTMLElement|null} - 컨테이너 또는 null
     */
    getInputGroupContainer(element) {
        // 1. 요소가 직접 .input-group-prepend 안에 있는 경우
        const directPrepend = element.closest('.input-group-prepend');
        if (directPrepend) {
            return directPrepend;
        }

        // 2. 표준 구조: .input-group > .input-group-prepend > input
        const inputGroup = element.closest('.input-group');
        if (inputGroup) {
            const hasPrepend = inputGroup.querySelector('.input-group-prepend');
            if (hasPrepend) {
                return inputGroup;
            }
        }

        return null;
    },

    /**
     * .input-group-prepend의 상위 .input-group 찾기 (있으면)
     * @param {HTMLElement} prepend - .input-group-prepend 요소
     * @returns {HTMLElement|null} - 상위 .input-group 또는 null
     */
    getInputGroupFromPrepend(prepend) {
        return prepend.closest('.input-group');
    },

    /**
     * radio/checkbox 그룹의 컨테이너 찾기
     * @param {HTMLElement} element - radio/checkbox 요소
     * @returns {HTMLElement|null} - 그룹 컨테이너 또는 null
     */
    getRadioCheckboxGroupContainer(element) {
        if (element.type !== 'radio' && element.type !== 'checkbox') {
            return null;
        }

        // 1. .radio-tab-group, .checkbox-group 등의 그룹 컨테이너 찾기
        const groupContainer = element.closest('.radio-tab-group, .checkbox-tab-group, .checkbox-group, .radio-group, .form-check-group');
        if (groupContainer) {
            return groupContainer;
        }

        // 2. 같은 name을 가진 요소들의 공통 부모 찾기 (td, div 등)
        const commonParent = element.closest('td, .form-group, div');
        if (commonParent) {
            const sameName = commonParent.querySelectorAll(`input[name="${element.name}"]`);
            if (sameName.length > 1) {
                return commonParent;
            }
        }

        return null;
    },

    /**
     * .grid-box 컨테이너 확인
     * @param {HTMLElement} element - 확인할 요소
     * @returns {HTMLElement|null} - .grid-box 요소 또는 null
     */
    getGridBoxContainer(element) {
        return element.closest('.grid-box');
    },

    /**
     * 요소에서 기존 에러 메시지 제거
     * @param {HTMLElement} element - 대상 요소
     */
    removeErrorMessage(element) {
        let referenceElement;
        let isInsideGridBox = false;

        // .grid-box 컨테이너인 경우
        const gridBox = this.getGridBoxContainer(element);

        // .input-group-prepend 컨테이너인 경우 (우선순위 1)
        const inputGroupContainer = this.getInputGroupContainer(element);
        if (inputGroupContainer) {
            referenceElement = inputGroupContainer;
        }
        // radio/checkbox 그룹인 경우 (우선순위 2)
        else if (this.getRadioCheckboxGroupContainer(element)) {
            referenceElement = this.getRadioCheckboxGroupContainer(element);
        }
        // Kendo 컴포넌트인 경우 (우선순위 3)
        else if (this.isKendoComponent(element)) {
            referenceElement = element.parentElement;
        }
        // 일반 요소 (우선순위 4)
        else {
            referenceElement = element;
        }

        if (gridBox && gridBox.contains(referenceElement)) {
            isInsideGridBox = true;
        }

        if (isInsideGridBox) {
            const errorMsgs = gridBox.querySelectorAll(':scope > .wrong_message');
            errorMsgs.forEach(msg => msg.remove());
        } else {
            let nextSibling = referenceElement.nextElementSibling;
            while (nextSibling && nextSibling.classList.contains('wrong_message')) {
                nextSibling.remove();
                nextSibling = referenceElement.nextElementSibling;
            }
        }
    },

    /**
     * 요소에 에러 메시지 추가
     * @param {HTMLElement} element - 대상 요소
     * @param {string} message - 에러 메시지
     * @param {boolean} scroll - 스크롤 이동 여부 (기본값: false)
     */
    addErrorMessage(element, message, scroll = false) {
        this.removeErrorMessage(element);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'wrong_message show';
        errorDiv.textContent = message;

        let referenceElement;
        let isInsideGridBox = false;

        // .grid-box 컨테이너인 경우
        const gridBox = this.getGridBoxContainer(element);

        // .input-group-prepend 컨테이너인 경우 (우선순위 1)
        const inputGroupContainer = this.getInputGroupContainer(element);
        if (inputGroupContainer) {
            referenceElement = inputGroupContainer;
        }
        // radio/checkbox 그룹인 경우 (우선순위 2)
        else if (this.getRadioCheckboxGroupContainer(element)) {
            referenceElement = this.getRadioCheckboxGroupContainer(element);
        }
        // Kendo 컴포넌트인 경우 (우선순위 3)
        else if (this.isKendoComponent(element)) {
            referenceElement = element.parentElement;
        }
        // 일반 요소 (우선순위 4)
        else {
            referenceElement = element;
        }

        if (gridBox && gridBox.contains(referenceElement)) {
            isInsideGridBox = true;
        }

        if (isInsideGridBox) {
            gridBox.appendChild(errorDiv);
        } else {
            referenceElement.insertAdjacentElement('afterend', errorDiv);
        }

        if (scroll) {
            this.scrollToElement(element);
        }
    },

    /**
     * 해당 요소로 스크롤 이동
     * @param {HTMLElement} element - 대상 요소
     */
    scrollToElement(element) {
        if (!element) return;

        let scrollElement = element;
        let focusElement = element;

        // Kendo 컴포넌트의 경우 래퍼 요소를 찾는 것이 좋음
        const kendoInstance = this.getKendoInstance(element);
        if (kendoInstance && kendoInstance.wrapper) {
            scrollElement = kendoInstance.wrapper[0] || kendoInstance.wrapper;

            // Kendo 컴포넌트의 경우 내부 input 요소로 focus
            const kendoInput = scrollElement.querySelector('input, [role="combobox"], [role="listbox"]');
            if (kendoInput) {
                focusElement = kendoInput;
            }
        } else {
            const inputGroupContainer = this.getInputGroupContainer(element);
            if (inputGroupContainer) {
                scrollElement = inputGroupContainer;
            }
        }

        scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 포커스 가능하면 포커스도 줌
        if (typeof focusElement.focus === 'function') {
            setTimeout(() => {
                focusElement.focus();
                focusElement.select?.(); // input 요소면 텍스트도 선택
            }, 100); // Kendo 렌더링 완료 후 focus
        }
    },

    /**
     * 일반 input 요소의 값 가져오기
     * @param {HTMLElement} element - input 요소
     * @returns {string|boolean} - 입력값
     */
    getNativeInputValue(element) {
        // radio/checkbox 그룹 처리
        if (element.type === 'radio') {
            const groupContainer = this.getRadioCheckboxGroupContainer(element);
            if (groupContainer) {
                const checkedRadio = groupContainer.querySelector(`input[name="${element.name}"]:checked`);
                return checkedRadio ? checkedRadio.value : null;
            }
            return element.checked ? element.value : null;
        }

        if (element.type === 'checkbox') {
            const groupContainer = this.getRadioCheckboxGroupContainer(element);
            if (groupContainer) {
                const checkedBoxes = groupContainer.querySelectorAll(`input[name="${element.name}"]:checked`);
                return checkedBoxes.length > 0;
            }
            return element.checked;
        }

        return element.value;
    },

    /**
     * Kendo 컴포넌트 인스턴스 가져오기
     * @param {HTMLElement} element - 확인할 요소
     * @returns {any|null} - Kendo 컴포넌트 인스턴스 또는 null
     */
    getKendoInstance(element) {
        if (!element || typeof kendo === 'undefined') {
            return null;
        }

        try {
            // jQuery를 통한 Kendo 인스턴스 접근
            const jElement = kendo.jQuery(element);

            // 모든 가능한 Kendo 컴포넌트 타입 확인
            const componentTypes = [
                'kendoDropDownList',
                'kendoComboBox',
                'kendoMultiSelect',
                'kendoDatePicker',
                'kendoTimePicker',
                'kendoDateTimePicker',
                'kendoSlider',
                'kendoRangeSlider',
                'kendoNumericTextBox',
                'kendoAutoComplete',
                'kendoColorPicker',
                'kendoMaskedTextBox',
                'kendoSwitch',
                'kendoCheckBox',
                'kendoRadioButton',
                'kendoTreeView',
                'kendoGrid'
            ];

            for (const type of componentTypes) {
                const instance = jElement.data(type);
                if (instance) {
                    return instance;
                }
            }

            return null;
        } catch (e) {
            console.warn('Kendo 인스턴스 조회 실패:', e);
            return null;
        }
    },

    /**
     * Kendo 컴포넌트인지 확인
     * @param {HTMLElement} element - 확인할 요소
     * @returns {boolean}
     */
    isKendoComponent(element) {
        return this.getKendoInstance(element) !== null;
    },

    /**
     * 요소의 parent 찾기 (Kendo/일반 구분)
     */
    getElementParent(element) {
        // Kendo 컴포넌트인 경우: parent() 사용
        if (this.isKendoComponent(element)) {
            return element.parentElement;
        }

        // 일반 요소인 경우: element 자체
        return element;
    },

    /**
     * Kendo 컴포넌트의 값 가져오기
     * @param {HTMLElement} element - Kendo 컴포넌트 요소
     * @returns {any} - 컴포넌트 값
     */
    getKendoValue(element) {
        const instance = this.getKendoInstance(element);

        if (!instance) {
            return null;
        }

        try {
            // value() 메서드가 있으면 사용
            if (typeof instance.value === 'function') {
                return instance.value();
            }

            // 특수한 컴포넌트 처리 (Grid, TreeView 등)
            if (typeof instance.dataSource !== 'undefined') {
                return instance.dataSource.data();
            }

            return null;
        } catch (e) {
            console.warn('Kendo 값 조회 실패:', e);
            return null;
        }
    },

    /**
     * 요소의 값 가져오기 (일반 & Kendo 모두 지원)
     * @param {HTMLElement} element - 대상 요소
     * @returns {any} - 요소의 값
     */
    getElementValue(element) {
        const kendoInstance = this.getKendoInstance(element);

        if (kendoInstance) {
            // Kendo 컴포넌트
            return this.getKendoValue(element);
        } else {
            // 일반 HTML 요소
            return this.getNativeInputValue(element);
        }
    },

    /**
     * 값이 비어있는지 확인
     * @param {any} value - 확인할 값
     * @returns {boolean} - 비어있으면 true
     */
    isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        if (typeof value === 'boolean') {
            return !value;
        }
        return false;
    },

    /**
     * URL 형식이 유효한지 검증
     * @param {string} url - 검증할 URL
     * @returns {boolean} - 유효하면 true
     */
    isValidUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        // 1. 상대 경로 허용 (/, ./, ../, /path/to/resource)
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            return true;
        }

        // 2. 절대 URL 검증 (http://, https://)
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            return false;
        }
    },

    /**
     * 요소가 필수 필드인지 확인
     * @param {HTMLElement} element - 대상 요소
     * @returns {boolean}
     */
    isRequired(element) {
        return element.hasAttribute('required') ||
            element.getAttribute('data-required') === 'true';
    },

    /**
     * 요소의 검증 타입 확인
     * @param {HTMLElement} element - 대상 요소
     * @returns {string|null} - 검증 타입 (url, email, number 등)
     */
    getValidationType(element) {
        return element.getAttribute('data-validation-type') ||
            element.getAttribute('type') ||
            null;
    },


    /**
     * 단일 요소 검증
     * @param {HTMLElement} element - 검증할 요소
     * @param {string} errorMessage - 에러 메시지 (옵션)
     * @returns {boolean} - 검증 성공 여부
     */
    validateElement(element, errorMessage = '필수 입력 항목입니다.') {
        const value = this.getElementValue(element);

        // 1. 필수 필드 검증
        if (this.isRequired(element)) {
            if (this.isEmpty(value)) {
                this.addErrorMessage(element, errorMessage);
                return false;
            }
        } else {
            // 필수가 아닌데 값이 비어있으면 통과
            if (this.isEmpty(value)) {
                this.removeErrorMessage(element);
                return true;
            }
        }

        // 2. 타입별 검증 (값이 있을 때만)
        if (!this.isEmpty(value)) {
            const validationType = this.getValidationType(element);

            if (validationType === 'url' || element.hasAttribute('data-validate-url')) {
                if (!this.isValidUrl(value)) {
                    this.addErrorMessage(element, 'URL 형식이 올바르지 않습니다.');
                    return false;
                }
            }

            if (validationType === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.addErrorMessage(element, '이메일 형식이 올바르지 않습니다.');
                    return false;
                }
            }
        }

        this.removeErrorMessage(element);
        return true;
    },

    /**
     * 다중 요소 검증
     * @param {HTMLElement} containerElement - 검증 대상을 포함한 부모 요소
     * @param {Object} options - 옵션
     * @param {string} options.errorMessage - 기본 에러 메시지
     * @param {Object} options.customMessages - 특정 요소별 커스텀 메시지 {name: 'message'}
     * @param {Array<string>} options.excludeSelectors - 제외할 선택자 배열
     * @param {boolean} options.scroll - 실패 시 첫 번째 요소로 스크롤 이동 여부 (기본값: true)
     * @returns {boolean} - 모든 검증 성공 여부
     */
    validateContainer(containerElement, options = {}) {
        const {
            errorMessage = '필수 입력 항목입니다.',
            customMessages = {},
            excludeSelectors = [],
            scroll = true
        } = options;

        if (!containerElement) {
            console.error('ValidationUtil: containerElement가 없습니다.');
            return false;
        }

        // 검증할 요소들 선택
        const selectors = [
            'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
            'select',
            'textarea'
        ];

        const elements = [];
        const excludeSet = new Set(excludeSelectors);
        const processedRadioCheckboxGroups = new Set(); // 이미 처리된 radio/checkbox 그룹 추적
        const processedInputGroups = new Set(); // 이미 처리된 input-group 추적

        // 일반 HTML 요소 수집
        selectors.forEach(selector => {
            containerElement.querySelectorAll(selector).forEach(element => {
                if (elements.includes(element)) return;

                if (Array.from(excludeSet).some(sel => element.matches(sel))) {
                    return;
                }

                // .input-group-prepend 처리: 그룹당 한 번만 검증
                const inputGroupContainer = this.getInputGroupContainer(element);
                if (inputGroupContainer) {
                    const groupKey = inputGroupContainer;
                    if (processedInputGroups.has(groupKey)) {
                        return; // 이미 처리된 그룹은 스킵
                    }
                    processedInputGroups.add(groupKey);
                }

                // radio/checkbox 그룹 처리: 그룹당 한 번만 검증
                if (element.type === 'radio' || element.type === 'checkbox') {
                    const groupKey = element.name;
                    if (processedRadioCheckboxGroups.has(groupKey)) {
                        return; // 이미 처리된 그룹은 스킵
                    }
                    processedRadioCheckboxGroups.add(groupKey);
                }

                elements.push(element);
            });
        });

        // Kendo 컴포넌트가 있는 모든 요소 수집
        containerElement.querySelectorAll('*').forEach(element => {
            if (elements.includes(element)) return;

            if (Array.from(excludeSet).some(sel => element.matches(sel))) {
                return;
            }

            // .input-group-prepend 처리
            const inputGroupContainer = this.getInputGroupContainer(element);
            if (inputGroupContainer) {
                const groupKey = inputGroupContainer;
                if (processedInputGroups.has(groupKey)) {
                    return;
                }
                processedInputGroups.add(groupKey);
            }

            // Kendo 인스턴스가 있으면 추가
            if (this.getKendoInstance(element)) {
                elements.push(element);
            }
        });

        // 각 요소 검증
        let allValid = true;
        let firstInvalidElement = null;

        elements.forEach(element => {
            const elementName = element.name || element.id;
            const customMessage = customMessages[elementName] || errorMessage;
            const isValid = this.validateElement(element, customMessage);

            if (!isValid) {
                allValid = false;
                if (!firstInvalidElement) {
                    firstInvalidElement = element;
                }
            }
        });

        if (!allValid && scroll && firstInvalidElement) {
            this.scrollToElement(firstInvalidElement);
        }

        return allValid;
    },

    /**
     * URL 단독 검증 (요소 외부에서 사용)
     * @param {string} url - 검증할 URL
     * @param {boolean} allowRelative - 상대 경로 허용 여부 (기본: true)
     * @returns {boolean} - 유효하면 true
     */
    validateUrl(url, allowRelative = true) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        const trimmedUrl = url.trim();

        // 상대 경로 허용
        if (allowRelative) {
            if (trimmedUrl.startsWith('/') ||
                trimmedUrl.startsWith('./') ||
                trimmedUrl.startsWith('../')) {
                return true;
            }
        }

        // 절대 URL 검증
        try {
            const urlObj = new URL(trimmedUrl);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            return false;
        }
    },

    /**
     * 특정 요소의 변경 감지 및 자동 에러 메시지 제거
     * @param {HTMLElement} element - 모니터링할 요소
     * @param {Function} callback - 변경 감지 시 콜백 함수 (옵션)
     */
    addAutoValidationListener(element, callback) {
        const handler = () => {
            this.removeErrorMessage(element);
            if (callback) {
                callback(element);
            }
        };

        const kendoInstance = this.getKendoInstance(element);

        if (kendoInstance) {
            // Kendo 컴포넌트인 경우
            try {
                if (typeof kendoInstance.bind === 'function') {
                    kendoInstance.bind('change', handler);
                }
            } catch (e) {
                console.warn('Kendo 이벤트 바인딩 실패:', e);
            }
        } else {
            // 일반 HTML 요소인 경우
            element.addEventListener('input', handler);
            element.addEventListener('change', handler);
        }
    },

    /**
     * 컨테이너 내 모든 요소에 자동 검증 리스너 추가
     * @param {HTMLElement} containerElement - 대상 컨테이너
     */
    addAutoValidationToContainer(containerElement) {
        const selectors = [
            'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
            'select',
            'textarea'
        ];

        const processedGroups = new Set();
        const processedInputGroups = new Set();

        // 일반 HTML 요소에 리스너 추가
        selectors.forEach(selector => {
            containerElement.querySelectorAll(selector).forEach(element => {
                // .input-group-prepend는 한 번만 처리
                const inputGroupContainer = this.getInputGroupContainer(element);
                if (inputGroupContainer) {
                    const groupKey = inputGroupContainer;
                    if (processedInputGroups.has(groupKey)) {
                        return;
                    }
                    processedInputGroups.add(groupKey);

                    // 같은 input-group 내의 모든 input에 리스너 추가
                    const groupElements = inputGroupContainer.querySelectorAll('input, select, textarea');
                    groupElements.forEach(groupEl => {
                        this.addAutoValidationListener(groupEl);
                    });
                    return;
                }

                // radio/checkbox는 그룹당 한 번만 처리
                if (element.type === 'radio' || element.type === 'checkbox') {
                    const groupKey = element.name;
                    if (processedGroups.has(groupKey)) {
                        return;
                    }
                    processedGroups.add(groupKey);

                    // 같은 name을 가진 모든 요소에 리스너 추가
                    const groupElements = containerElement.querySelectorAll(`input[name="${element.name}"]`);
                    groupElements.forEach(groupEl => {
                        this.addAutoValidationListener(groupEl);
                    });
                } else {
                    this.addAutoValidationListener(element);
                }
            });
        });

        // Kendo 컴포넌트 찾아서 리스너 추가
        containerElement.querySelectorAll('*').forEach(element => {
            if (this.getKendoInstance(element)) {
                this.addAutoValidationListener(element);
            }
        });
    },

    /**
     * 컨테이너 내 모든 에러 메시지 제거
     * @param {HTMLElement} containerElement - 대상 컨테이너
     */
    clearAllErrors(containerElement) {
        if (!containerElement) return;
        containerElement.querySelectorAll('.wrong_message').forEach(errorDiv => {
            errorDiv.remove();
        });
    },

    /**
     * 특정 필드 에러만 제거
     * @param {HTMLElement} containerElement - 대상 컨테이너
     * @param {Array<string>} fieldNames - 필드명 배열 (name 또는 id)
     */
    clearErrorsByFields(containerElement, fieldNames) {
        fieldNames.forEach(fieldName => {
            const element = containerElement.querySelector(
                `[name="${fieldName}"], #${fieldName}`
            );
            if (element) {
                this.removeErrorMessage(element);
            }
        });
    },

    /**
     * Kendo DatePicker/TimePicker 범위 검증
     * @param {HTMLElement|string} msgElement - 에러 메시지 표시 요소 (선택자 또는 요소)
     * @param {string|HTMLElement} startDateId - 시작 DatePicker ID
     * @param {string|HTMLElement} startTimeId - 시작 TimePicker ID
     * @param {string|HTMLElement} endDateId - 종료 DatePicker ID
     * @param {string|HTMLElement} endTimeId - 종료 TimePicker ID
     * @returns {boolean} - 검증 성공 여부
     */
    validateDateTimeRange(msgElement, startDateId, startTimeId, endDateId, endTimeId) {
        const $msg = $(msgElement);

        const startDatePicker = $(startDateId).data('kendoDatePicker');
        const endDatePicker = $(endDateId).data('kendoDatePicker');
        const startTimePicker = startTimeId ? $(startTimeId).data('kendoTimePicker') : null;
        const endTimePicker = endTimeId ? $(endTimeId).data('kendoTimePicker') : null;

        const startDate = startDatePicker?.value();
        const endDate = endDatePicker?.value();
        const startTime = startTimePicker?.value();
        const endTime = endTimePicker?.value();

        // 시간 피커가 둘 다 존재하면 시간까지 검증하는 모드
        const hasTime = !!(startTimePicker && endTimePicker);

        const showError = (message) => {
            $msg.text(message).addClass('show');
            return false;
        };

        const clearError = () => {
            $msg.removeClass('show');
            return true;
        };

        // ── 1. 필수값 체크 ──
        if (hasTime) {
            if (!startDate || !startTime || !endDate || !endTime) {
                return showError('필수항목이 입력되지 않았습니다.');
            }
        } else {
            if (!startDate || !endDate) {
                return showError('필수항목이 입력되지 않았습니다.');
            }
        }

        // ── 2. 날짜만 있는 경우 ──
        if (!hasTime) {
            // 시각 영향 제거 후 날짜만 비교
            const s = new Date(startDate);
            s.setHours(0, 0, 0, 0);
            const e = new Date(endDate);
            e.setHours(0, 0, 0, 0);

            if (s > e) {
                return showError('시작일은 종료일보다 이전이어야 합니다.');
            }
            return clearError();
        }

        // ── 3. 날짜+시간 합산 ──
        const toDateTime = (date, time) => {
            const d = new Date(date);
            d.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return d;
        };

        const startDateTime = toDateTime(startDate, startTime);
        const endDateTime = toDateTime(endDate, endTime);

        // ── 4. 시작일 > 종료일 ──
        if (startDate.toDateString() !== endDate.toDateString() && startDateTime > endDateTime) {
            return showError('시작일은 종료일보다 이전이어야 합니다.');
        }

        // ── 5. 같은 날인데 시작시간 >= 종료시간 ──
        if (startDate.toDateString() === endDate.toDateString() && startTime >= endTime) {
            return showError('시작시간은 종료시간보다 이전이어야 합니다.');
        }

        // ── 6. 시작 DateTime >= 종료 DateTime (통합 체크) ──
        if (startDateTime >= endDateTime) {
            return showError('시작 일시는 종료 일시보다 이전이어야 합니다.');
        }

        return clearError();
    },
}
// CommonJS 또는 모듈로 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidationUtil;
}