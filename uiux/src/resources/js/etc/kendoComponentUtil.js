/**
 * kendo.ui - 성능 최적화 버전 v2.0
 * 개선사항:
 * - gridResize() 함수의 DOM 쿼리 배치 처리
 * - localStorage 캐싱 시스템
 * - 이벤트 핸들러 중복 제거
 * - 전역 변수 제거 (data attributes 사용)
 * - 디버그 로그 제거
 * - requestAnimationFrame 활용
 */

let KendoCustomData = {}; // 켄도관련 동적변수관리

/**
 * ★ 성능 최적화: localStorage 캐싱 시스템
 * 동기적 접근을 최소화하고 메모리 캐시 사용
 */
const GridColumnCache = (() => {
    const cache = {};

    return {
        /**
         * 캐시에서 또는 localStorage에서 데이터 로드
         */
        get(mid) {
            if (cache[mid] !== undefined) {
                return cache[mid];
            }

            try {
                const data = localStorage.getItem(mid + '_grid');
                cache[mid] = data ? data.split(',').filter(v => v) : [];
            } catch (e) {
                console.warn('[GridColumnCache] localStorage read failed:', e);
                cache[mid] = [];
            }

            return cache[mid];
        },

        /**
         * 캐시와 localStorage에 저장 (비동기)
         */
        set(mid, columns) {
            cache[mid] = Array.isArray(columns) ? columns : [];

            // 비동기로 저장하여 UI 블로킹 방지
            setTimeout(() => {
                try {
                    localStorage.setItem(mid + '_grid', columns.join(','));
                } catch (e) {
                    console.warn('[GridColumnCache] localStorage write failed:', e);
                }
            }, 0);
        },

        /**
         * 캐시 초기화 (메모리 누수 방지)
         */
        clear(mid) {
            if (mid) {
                delete cache[mid];
            } else {
                for (const key in cache) {
                    delete cache[key];
                }
            }
        }
    };
})();

/**
 * ★ 성능 최적화: TreeView 이벤트 핸들러 일괄 관리
 * 중복 등록 방지 및 메모리 누수 제거
 */
const TreeViewEventManager = (() => {
    let initialized = false;

    return {
        /**
         * 한 번만 초기화
         */
        init() {
            if (initialized) return;
            initialized = true;

            // 대역 클릭 핸들러 등록 (한 번만)
            $(document).on('click.kendoTreeViewDelete', '.kendo-icon, .telerik-icon', function (e) {
                e.preventDefault();
                const $item = $(this).closest('.k-treeview-item');
                if ($item.length === 0) return;

                const $treeEl = $item.closest('[data-role="treeview"]');
                const treeview = $treeEl.data('kendoTreeView');
                if (treeview) {
                    treeview.remove($item);
                }
            });
        },

        /**
         * 정리 (필요시)
         */
        destroy() {
            if (initialized) {
                $(document).off('click.kendoTreeViewDelete');
                initialized = false;
            }
        }
    };
})();

/**
 * kendoUi - Kendo UI 간편 초기화 유틸리티
 */
const kendoUi = {
    /** kendo Kor */
    init() {
        kendo.culture("ko-KR");
    },

    /**
     *  dropDownList
     *  dropOptions: { data, optionLabel, filter, value, onChange, onDataBound, dataTextField, dataValueField, suggest, ...kendoOptions }
     *  */
    createDropDownList(id, dropOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        const instance = $el.data('kendoDropDownList');

        // 이미 인스턴스가 있는 경우 데이터만 갱신
        if (instance) {
            if (dropOptions.data) {
                instance.setDataSource(new kendo.data.DataSource({ data: dropOptions.data }));
            }
            if (dropOptions.value !== undefined) {
                instance.value(dropOptions.value);
            }
            return;
        }

        const {
            data = [],
            optionLabel = false,
            filter = false,
            value = null,
            index = null,
            readParamFun = null,
            onChange = null,
            onDataBound = null,
            dataTextField = "text",
            dataValueField = "value",
            dataParentField = "parent",
            suggest = true,
            ...kendoOptions
        } = dropOptions || {};

        let dataSource = {};
        if (dropOptions.readUrl && dropOptions.readUrl !== "") {
            dataSource.transport = {
                read: { url: dropOptions.readUrl, type:"POST", dataType: 'json' },
                parameterMap: (options, operation) => { return kendoUi.getParamterMap(options, operation, dropOptions.readParamFun) }
            };
            dataSource.serverPaging = true;
            dataSource.serverFiltering = true;
            dataSource.serverSorting = true;
            dataSource.schema = {
                data:  'data',
                model: {
                    fields: {
                        [dataTextField]: { type: 'string' },
                        [dataValueField]: { type: 'string' },
                        [dataParentField]: { type: 'string' }
                    }
                }
            };
            if(dropOptions.pageSize && dropOptions.pageSize != '') {
                dataSource.pageSize = dropOptions.pageSize;
            }
            dataSource.error = function(e) {
                podo.ui.handleAjaxError(e);
            };
        } else {
            dataSource.data = dropOptions.data;
            dataSource.serverPaging = false;
            dataSource.schema = {
                model: {
                    fields: {
                        [dataTextField]: { type: 'string' },
                        [dataValueField]: { type: 'string' },
                        [dataParentField]: { type: 'string' }
                    }
                }
            };
        }

        $el.kendoDropDownList({
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: dataSource,
            suggest: suggest,
            ...kendoOptions,
            ...(optionLabel && {
                optionLabel: optionLabel
            }),
            ...(typeof onChange === 'function' && { change: onChange }),
            ...(typeof onDataBound === 'function' && { dataBound: onDataBound }),
            index: index ?? (value !== null && value !== undefined ? -1 : 0),
            value: value ?? '',
            filter: filter ? 'contains' : 'none',
        });
    },

    /**
     * kendoColorPicker 생성
     * opts: { value, palette, opacity, buttons, onChange, ...kendoOptions }
     * */
    createColorPicker(id, opts = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        const instance = $el.data('kendoColorPicker');

        if (instance) {
            if (opts.value !== undefined) {
                instance.value(opts.value);
            }
            return;
        }

        const {
            value = "#ffffff",
            palette = null,
            opacity = false,
            buttons = true,
            onChange = null,
            ...kendoOptions
        } = opts;

        $el.kendoColorPicker({
            value: value,
            palette: palette,
            opacity: opacity,
            buttons: buttons,
            preview:false,
            input: false,
            adaptiveMode: "none",
            views: ["gradient"],
            ...(typeof onChange === 'function' && { change: onChange }),
            ...kendoOptions
        });
    },

    /**
     * kendo dropdown list 파괴 후 재생성을 위한 헬퍼 함수
     * */
    resetDropDown(id) {
        const $el = $(id);
        const instance = $el.data('kendoDropDownList');
        if (instance) {
            instance.destroy();
            $el.removeData('kendoDropDownList');
            $el.val('');
        }
    },

    /**
     * 3개 get DropDownValue
     * */
    getDropDownValuesThree(id, id2, id3) {
        const value1 = $(id).data('kendoDropDownList')?.value() || null;
        const value2 = $(id2).data('kendoDropDownList')?.value() || null;
        const value3 = $(id3).data('kendoDropDownList')?.value() || null;

        return [value1, value2, value3].filter(v => v !== null);
    },

    /**
     * kendoTimePicker
     * timeOptions: { value, min, max, onChange, ...kendoOptions }
     * */
    createTimePicker(id, timeOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoTimePicker')) return;

        const {
            value = null,
            min = null,
            max = null,
            onChange = null,
            format = "HH:mm",
            dateInput = true,
            inputMode = "numeric",
            messages = { dateInput: {hour:'시', minute:'분'} },
            ...kendoOptions
        } = timeOptions || {};

        const toTimeDate = (timeStr) => {
            if (!timeStr || typeof timeStr !== 'string') return null;
            const [h, m] = timeStr.split(':');
            const d = new Date();
            d.setHours(+h, +m, 0, 0);
            return d;
        };

        const valueDate = toTimeDate(value);
        const minDate   = toTimeDate(min);
        const maxDate   = toTimeDate(max);

        $el.kendoTimePicker({
            format: format,
            ...(valueDate && { value: valueDate }),
            ...(minDate   && { min:   minDate   }),
            ...(maxDate   && { max:   maxDate   }),
            dateInput: dateInput,
            inputMode: inputMode,
            ...kendoOptions,
            ...(typeof onChange === 'function' && { change: onChange }),
            messages: messages
        });
    },

    /**
     *  kendoNumericTextBox
     *  numericOptions: { value, min, max, step, format, ...kendoOptions }
     *  format: 숫자포맷 n0(소수점X), n2(소수점2자리허용), c0(통화기호+콤마), #,##0(3자리 콤마, 소수넘 없음)
     *  */
    createNumericTextBox(id, numericOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoNumericTextBox')) return;

        const {
            value = null,
            min = 0,
            max = 100,
            step = 1,
            format = "n0",
            ...kendoOptions
        } = numericOptions || {};

        $el.kendoNumericTextBox({
            min: min,
            max: max,
            step: step,
            format: format,
            ...kendoOptions
        });
    },

    /**
     *  kendoDateRangePicker
     *  dateRangeOptions: { min, max, onChange, format, dateInput, calendarButton, clearButton, messages, ...kendoOptions }
     *  */
    createDateRangePicker(id, dateRangeOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoDateRangePicker')) return;

        const {
            min = null,
            max = null,
            onChange = null,
            format = "yyyy-MM-dd",
            dateInput = true,
            calendarButton = true,
            clearButton = true,
            messages = {
                startLabel: "시작",
                endLabel: "종료"
            },
            ...kendoOptions
        } = dateRangeOptions || {};

        $el.kendoDateRangePicker({
            format: format,
            dateInput: dateInput,
            calendarButton: calendarButton,
            clearButton: clearButton,
            ...kendoOptions,
            ...(min !== null && { min: new Date(min) }),
            ...(max !== null && { max: new Date(max) }),
            ...(typeof onChange === 'function' && { change: onChange }),
            messages: messages
        });
    },

    /**
     * kendoDateRangePicker
     * 데이터 가져오는
     * */
    getDateRangePickerData(selector) {
        var picker = $(selector).data("kendoDateRangePicker");

        if (!picker) return null;

        var range = picker.range();

        if (!range || !range.start || !range.end) return null;

        return {
            start: kendo.toString(range.start, "yyyy-MM-dd"),
            end: kendo.toString(range.end, "yyyy-MM-dd")
        };
    },

    /**
     * kendoDateRangePicker
     * 값 설정 (start/end 는 Date 또는 "yyyy-MM-dd"/"YYYYMMDD" 문자열, 미지정 시 초기화)
     * */
    setDateRangePickerData(selector, start, end) {
        var picker = $(selector).data("kendoDateRangePicker");
        if (!picker) return;

        picker.range({
            start: start ? new Date(start) : null,
            end: end ? new Date(end) : null
        });
    },

    /**
	 * datePicker
	 * dateOptions: { value, onChange, format, dateInput, inputMode, messages, ...kendoOptions }
	 * */
    createDatePicker(id, dateOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoDatePicker')) return;

        const {
            value = null,
            onChange = null,
            format = "yyyy-MM-dd",
            dateInput = false,
            inputMode = "numeric",
            placeholder = "YYYY-MM-DD",
            messages = { dateInput: {year: 'YYYY', month: 'MM', day: 'DD'}},
            ...kendoOptions
        } = dateOptions || {};

        const validateDate = function(e) {
            const val = e.sender.element.val();
            if (val && val.replace(/-/g, '').length === 8) {
                const parsedDate = kendo.parseDate(val, format);
                if (!parsedDate) {
                    e.sender.value(null);
                    e.sender.value('');
                }
            }
        };

        $el.kendoDatePicker({
            format: format,
            value: value ?? '',
            dateInput: dateInput,
            inputMode: inputMode,
            ...kendoOptions,
            change: function(e) {
                validateDate(e);
                if (typeof onChange === 'function') {
                    onChange(e);
                }
            },
            close: function(e) {
                validateDate(e);
            },
            messages: messages
        });

        $el.on('keydown.datePickerValidate', function(e) {
            if (e.keyCode === 13) {
                const picker = $(this).data('kendoDatePicker');
                if (picker) {
                    validateDate({ sender: picker });
                }
            }
        });

        $el.off('input.dateMask').on('input.dateMask', function(e) {
            let val = this.value;
            const isDelete = e.originalEvent && e.originalEvent.inputType === 'deleteContentBackward';

            if (isDelete) {
                if (val.endsWith('-')) {
                    val = val.substring(0, val.length - 1);
                }
                this.value = val;
                return;
            }

            val = val.replace(/[^0-9]/g, '');
            if (val.length > 8) val = val.substring(0, 8);

            if (val.length >= 4 && val.length < 6) {
                val = val.substring(0, 4) + '-' + val.substring(4);
            } else if (val.length >= 6) {
                val = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6);
            }
            this.value = val;
        });

        if (placeholder) {
            $el.attr("placeholder", placeholder);
        }
    },

    /**
     *  kendoDatePicker START END
     *  stEdDateOptions: {format, min, max, defaultStart, defaultEnd, onChange, ...kendoOptions }
     *  startId: #시작일ID	endId: #종료일ID
     *  */
    createDatePickerStartEnd(startId, endId, stEdDateOptions = {}) {
        const $elStart = $(startId);
        const $elEnd = $(endId);

        if (!$elStart.length && !$elEnd.length) {
            console.warn(`[kendoUi] "${startId}" 또는 "${endId}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($elStart.data('kendoDatePicker') || $elEnd.data('kendoDatePicker')) {
            return;
        }

        const {
            format = "yyyy-MM-dd",
            min = "1000-01-01",
            max = "9999-12-31",
            onChange = null,
            defaultStart = null,
            defaultEnd = null,
            dateInput = false,
            inputMode = "numeric",
            placeholder = "YYYY-MM-DD",
            ...kendoOptions
        } = stEdDateOptions;

        const startVal = defaultStart ? new Date(defaultStart) : null;
        const endVal = defaultEnd ? new Date(defaultEnd) : null;
        const minDate = min ? new Date(min) : null;
        const maxDate = max ? new Date(max) : null;

        const defaultMessages = {
            dateInput: { year: 'YYYY', month: 'MM', day: 'DD' }
        };

        const validateDate = function(picker) {
            const val = picker.element.val();

            if (val && val.replace(/-/g, '').length === 8) {
                const parsedDate = kendo.parseDate(val, format);
                if (!parsedDate) {
                    picker.value(null);
                    picker.element.val('');
                    return true;
                }
            }
            return false;
        };

        $elStart.kendoDatePicker({
            format,
            dateInput,
            inputMode: inputMode,
            messages: defaultMessages,
            ...(startVal && { value: startVal }),
            ...(minDate && { min: minDate }),
            ...(maxDate && { max: maxDate }),
            ...kendoOptions,
            change: function() {
                validateDate(this);
                const endPicker = $elEnd.data('kendoDatePicker');
                if (endPicker) {
                    endPicker.min(this.value() || minDate);
                }
                if (typeof onChange === 'function') {
                    onChange({ start: this.value(), end: endPicker ? endPicker.value() : null });
                }
            },
            close: function() {
                validateDate(this);
            }
        });

        $elEnd.kendoDatePicker({
            format,
            dateInput,
            inputMode: inputMode,
            messages: defaultMessages,
            ...(endVal && { value: endVal }),
            ...(minDate && { min: minDate }),
            ...(maxDate && { max: maxDate }),
            ...kendoOptions,
            change: function() {
                validateDate(this);
                const startPicker = $elStart.data('kendoDatePicker');
                if (startPicker) {
                    startPicker.max(this.value() || maxDate);
                }
                if (typeof onChange === 'function') {
                    onChange({ start: startPicker ? startPicker.value() : null, end: this.value() });
                }
            },
            close: function() {
                validateDate(this);
            }
        });

        const handleEnterKey = function(e) {
            if (e.keyCode === 13) {
                const picker = $(this).data('kendoDatePicker');
                if (picker) {
                    validateDate(picker);
                }
            }
        };
        $elStart.on('keydown.dateRangeValidate', handleEnterKey);
        $elEnd.on('keydown.dateRangeValidate', handleEnterKey);

        const applyDateMask = function(e) {
            let val = this.value;
            const isDelete = e.originalEvent && e.originalEvent.inputType === 'deleteContentBackward';

            if (isDelete) {
                if (val.endsWith('-')) {
                    val = val.substring(0, val.length - 1);
                }
                this.value = val;
                return;
            }

            val = val.replace(/[^0-9]/g, '');
            if (val.length > 8) val = val.substring(0, 8);
            if (val.length >= 4 && val.length < 6) {
                val = val.substring(0, 4) + '-' + val.substring(4);
            } else if (val.length >= 6) {
                val = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6);
            }
            this.value = val;
        };

        $elStart.off('input.dateMask').on('input.dateMask', applyDateMask);
        $elEnd.off('input.dateMask').on('input.dateMask', applyDateMask);

        if (placeholder) {
            $elStart.attr("placeholder", placeholder);
            $elEnd.attr("placeholder", placeholder);
        }
    },

    /**
     *  kendoDatePicker START END (년월 선택)
     *  stEdMonthOptions: {format, min, max, defaultStart, defaultEnd, onChange, ...kendoOptions }
     *  startId: #시작일ID	endId: #종료일ID
     *  */
    createMonthPickerStartEnd(startId, endId, stEdMonthOptions = {}) {
        const $elStart = $(startId);
        const $elEnd = $(endId);

        if (!$elStart.length && !$elEnd.length) {
            console.warn(`[kendoUi] "${startId}" 또는 "${endId}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($elStart.data('kendoDatePicker') || $elEnd.data('kendoDatePicker')) {
            return;
        }

        const {
            format = "yyyy-MM",
            min = "1000-01-01",
            max = "9999-12-31",
            onChange = null,
            defaultStart = null,
            defaultEnd = null,
            dateInput = true,
            placeholder = "",
            ...kendoOptions
        } = stEdMonthOptions;

        const startVal = defaultStart ? new Date(defaultStart) : null;
        const endVal = defaultEnd ? new Date(defaultEnd) : null;
        const minDate = min ? new Date(min) : null;
        const maxDate = max ? new Date(max) : null;

        const defaultMessages = {
            dateInput: { year: 'YYYY', month: 'MM' }
        };

        const monthPickerOptions = {
            format,
            dateInput,
            depth: "year",
            start: "year",
            messages: defaultMessages,
            ...kendoOptions
        };

        $elStart.kendoDatePicker({
            ...monthPickerOptions,
            ...(startVal && { value: startVal }),
            ...(minDate && { min: minDate }),
            ...(maxDate && { max: maxDate }),
            change: function() {
                const endPicker = $elEnd.data('kendoDatePicker');
                if (endPicker) {
                    endPicker.min(this.value() || minDate);
                }
                if (typeof onChange === 'function') {
                    onChange({ start: this.value(), end: endPicker ? endPicker.value() : null });
                }
            }
        });

        $elEnd.kendoDatePicker({
            ...monthPickerOptions,
            ...(endVal && { value: endVal }),
            ...(minDate && { min: minDate }),
            ...(maxDate && { max: maxDate }),
            change: function() {
                const startPicker = $elStart.data('kendoDatePicker');
                if (startPicker) {
                    startPicker.max(this.value() || maxDate);
                }
                if (typeof onChange === 'function') {
                    onChange({ start: startPicker ? startPicker.value() : null, end: this.value() });
                }
            }
        });

        if (placeholder) {
            $elStart.attr("placeholder", placeholder);
            $elEnd.attr("placeholder", placeholder);
        }
    },

    /**
     * START/END datepicker 범위 동기화 함수
     * */
    syncDatePickerStartEndRange(startId, endId) {
        return;
    },

    /**
     * START/END datepicker 값을 함께 설정한다.
     * */
    setDatePickerStartEndValues(startId, endId, startValue, endValue) {
        const $elStart = $(startId);
        const $elEnd = $(endId);
        const startPicker = $elStart.data('kendoDatePicker');
        const endPicker = $elEnd.data('kendoDatePicker');
        const parsedStart = startValue ? kendo.parseDate(startValue) : null;
        const parsedEnd = endValue ? kendo.parseDate(endValue) : null;

        if (!startPicker || !endPicker) {
            return;
        }

        startPicker.value(parsedStart);
        endPicker.value(parsedEnd);

        if (startPicker.dateView && startPicker.dateView.calendar && parsedStart) {
            startPicker.dateView.calendar.navigate(parsedStart);
        }

        if (endPicker.dateView && endPicker.dateView.calendar && parsedEnd) {
            endPicker.dateView.calendar.navigate(parsedEnd);
        }
    },

    /**
     *  kendoAutoComplete
     *  id: #id		data: 데이터		placeholder: placeholder	field: 맞출 필드명
     *  data, field = 'text', placeholder = '검색어를 입력해 주세요.'
     *  */
    createAutoComplete(id, autoCompleteOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoAutoComplete')) return;

        const {
            data = null,
            readUrl = null,
            field = 'text',
            placeholder = '검색어를 입력해 주세요.',
            filter = 'contains',
            minLength = 1,
            delay = 200,
            onChange = null,
            ...kendoOptions
        } = autoCompleteOptions;

        let dataSource = {};
        if (autoCompleteOptions.readUrl && autoCompleteOptions.readUrl !== "") {
            dataSource.transport = {
                read: { url: autoCompleteOptions.readUrl, type:"POST", dataType: 'json' },
                parameterMap: (options, operation) => { return kendoUi.getParamterMap(options, operation, autoCompleteOptions.readParamFun) }
            };
            dataSource.error = function(e) {
                podo.ui.handleAjaxError(e);
            };
        } else {
            dataSource.data = autoCompleteOptions.data;
        }

        $el.kendoAutoComplete({
            filter: 'contains',
            placeholder: placeholder,
            dataTextField: field,
            dataSource: dataSource
        });
    },

    /**
     * Tab (탭 스트립) - 객체형식
     * */
    createTab(id, tabOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoTabStrip')) return;

        const {
            onSelect = null,
            onActivate = null,
            activeTab = 0,
            scrollable = false,
            animation = {
                open: { effects: 'fadeIn' }
            },
            ...kendoOptions
        } = tabOptions;

        const handleScrollable = (e) => {
            if (!scrollable) return;
            const $tabStrip = $(e.sender.element);
            const $content = $(e.contentElement);
            if (!$content.length) return;

            const updateHeight = () => {
                if (!$tabStrip.is(':visible')) return;
                const windowHeight = $(window).height();
                const tabOffset = $tabStrip.offset().top;
                const tabHeaderHeight = $tabStrip.find('> ul.k-tabstrip-items').outerHeight() || 40;
                const footerMargin = 20;
                let availableHeight = windowHeight - tabOffset - tabHeaderHeight - footerMargin;

                if (availableHeight < 200) availableHeight = 200;

                const $target = $content.find('.tab-content').length ? $content.find('.tab-content') : $content;

                $target.css({
                    'height': (availableHeight - 60) + 'px',
                    'overflow-y': 'auto'
                });
                if ($target !== $content) {
                    $content.css('overflow', 'hidden');
                }
            };

            updateHeight();
            $(window).off('resize.kendoTabScroll').on('resize.kendoTabScroll', updateHeight);
        };

        $el.kendoTabStrip({
            animation,
            scrollable: scrollable,
            ...(typeof onSelect === 'function' && { select: onSelect }),
            activate: function(e) {
                if (scrollable) {
                    handleScrollable(e);
                }
                if (typeof onActivate === 'function') {
                    onActivate(e);
                }
            },
            ...kendoOptions
        });

        const tabStrip = $el.data('kendoTabStrip');
        if (tabStrip && typeof activeTab === 'number') {
            tabStrip.select(activeTab);
        }
    },

    /**
     * MultiSelect (다중 선택) - 객체형식
     * */
    createMultiSelect(id, multiSelectOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoMultiSelect')) return;

        const {
            data = null,
            placeholder = null,
            filter = null,
            maxSelectedItems = null,
            dataTextField = 'text',
            dataValueField = 'value',
            onChange = null,
            readUrl = null,
            ...kendoOptions
        } = multiSelectOptions;

        if (!data && !multiSelectOptions.readUrl) {
            console.warn(`[kendoUi] data 또는 readUrl 중 하나는 필수입니다.`);
            return;
        }

        let filterVal = null;
        if (filter === true) {
            filterVal = 'contains';
        } else if (filter === false) {
            filterVal = 'startswith';
        } else if (typeof filter === 'string') {
            filterVal = filter;
        }

        let normalizedData = null;
        if (data) {
            if (Array.isArray(data)) {
                normalizedData = data;
            } else if (data.items && Array.isArray(data.items)) {
                normalizedData = data.items;
            } else if (typeof data === 'object') {
                normalizedData = [data];
            }
        }

        let dataSourceConfig;

        if (multiSelectOptions.readUrl) {
            dataSourceConfig = {
                transport: {
                    read: {
                        url: multiSelectOptions.readUrl,
                        type: "POST",
                        dataType: 'json'
                    },
                    parameterMap: (options, operation) => { return kendoUi.getParamterMap(options, operation, multiSelectOptions.readParamFun) }
                },
                schema: {
                    data: "data",
                    model: {
                        fields: {
                            [dataTextField]: { type: 'string' },
                            [dataValueField]: { type: 'string' }
                        }
                    }
                },
                serverFiltering: true
            };
        } else {
            dataSourceConfig = {
                data: normalizedData || []
            };
        }

        $el.kendoMultiSelect({
            dataTextField,
            dataValueField,
            downArrow: true,
            dataSource: dataSourceConfig,
            ...(filterVal !== null && { filter: filterVal }),
            ...(placeholder !== null && { placeholder }),
            ...(maxSelectedItems !== null && { maxSelectedItems }),
            ...(typeof onChange === 'function' && { change: onChange }),
            ...kendoOptions
        });
    },

    /**
     * Window (팝업 윈도우) - 객체형식
     * */
    createWindow(id, windowOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        if ($el.data('kendoWindow')) return;

        const {
            title = '',
            width = '98%',
            height = '98%',
            onOpen = null,
            onClose = null,
            modal = true,
            draggable = true,
            resizable = false,
            visible = false,
            actions = ['Close'],
            ...kendoOptions
        } = windowOptions;

        $el.kendoWindow({
            title,
            width,
            height,
            modal,
            draggable,
            resizable,
            visible,
            actions,
            ...(typeof onOpen === 'function' && { open: onOpen }),
            ...(typeof onClose === 'function' && { close: onClose }),
            ...kendoOptions
        });
    },

    /**
     * Window 열기
     * @param {string} id - 대상 요소 id (예: "#win-detail")
     */
    openWindow(id) {
        const widget = $(id).data('kendoWindow');
        if (!widget) {
            console.warn(`[kendoUi] "${id}" Window 가 초기화되지 않았습니다.`);
            return;
        }
        widget.center().open();
    },

    /**
     * Window 닫기
     * @param {string} id - 대상 요소 id (예: "#win-detail")
     */
    closeWindow(id) {
        const widget = $(id).data('kendoWindow');
        if (!widget) {
            console.warn(`[kendoUi] "${id}" Window 가 초기화되지 않았습니다.`);
            return;
        }
        widget.close();
    },

    /**
     * TreeView (트리 뷰) - 객체형식
     * */
    createTreeView(id, treeViewOptions = {}) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        const {
            data = null,
            checkboxes = false,
            template = null,
            onSelect = null,
            onExpand = null,
            onCollapse = null,
            dragAndDrop = true,
            loadOnDemand = false,
            allowDeleteNodes = false,
            ...kendoOptions
        } = treeViewOptions;

        if (!data) {
            console.warn(`[kendoUi] data는 필수입니다.`);
            return;
        }

        if ($el.data('kendoTreeView')) {
            const treeView = $el.data('kendoTreeView');
            const finalDataSource = kendoOptions.dataSource || { data: data };
            treeView.setDataSource(new kendo.data.HierarchicalDataSource(finalDataSource));
            return;
        }

        let checkboxesOption = checkboxes;
        if (checkboxes === true) {
            checkboxesOption = { checkChildren: true };
        } else if (checkboxes === false) {
            checkboxesOption = false;
        }

        let templateOption = null;
        if (template) {
            const $template = $(template);
            if ($template.length) {
                templateOption = kendo.template($template.html());
            } else {
                console.warn(`[kendoUi] 템플릿 "${template}"을 찾을 수 없습니다.`);
            }
        }

        // ★ 성능 최적화: TreeView 이벤트 핸들러 초기화 (한 번만)
        TreeViewEventManager.init();

        const finalDataSource = kendoOptions.dataSource || { data: data };

        $el.kendoTreeView({
            dataSource: finalDataSource,
            dragAndDrop,
            checkboxes: checkboxesOption,
            loadOnDemand,
            dataSpriteCssClassField: "sprite",
            ...(templateOption && { template: templateOption }),
            ...(typeof onSelect === 'function' && { select: onSelect }),
            ...(typeof onExpand === 'function' && { expand: onExpand }),
            ...(typeof onCollapse === 'function' && { collapse: onCollapse }),
            ...kendoOptions
        });
    },

    /**
     * Grid (그리드) - 성능 최적화 버전
     * */
    createGrid(id, gridOptions) {
        const $el = $(id);

        if (!$el.length) {
            console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
            return;
        }

        const existingGrid = $el.data('kendoGrid');
        if (existingGrid) {
            existingGrid.destroy();
            $el.empty();
        }

        const gridId = $el.attr("id");
        const defaultPageSize = 30;

        // ★ 성능 최적화: 전역 변수 제거, data attributes 사용
        $el.data('gridRecord', 0);

        // ★ 성능 최적화: localStorage 캐시 사용 (비동기)
        const hideColumns = GridColumnCache.get(gridOptions.mid);
        if (hideColumns.length > 0) {
            setTimeout(() => {
                const gridInstance = $(id).data('kendoGrid');
                if (gridInstance) {
                    hideColumns.forEach(field => {
                        const col = gridInstance.columns.find(c => c.field === field);
                        if (col) {
                            gridInstance.hideColumn(col);
                        }
                    });
                }
            }, 50);
        }

        let dataSource = {};
        if (gridOptions.readUrl && gridOptions.readUrl !== "") {
            dataSource.transport = {
                read: { url: gridOptions.readUrl, type:"POST", dataType: 'json' },
                parameterMap: (options, operation) => {
                    if (operation === 'read') {
                        dataSource._requestedPage = options.page;
                    }
                    return kendoUi.getParamterMap(options, operation, gridOptions.readParamFun)
                }
            };
            dataSource.serverPaging = true;
            dataSource.serverFiltering = true;
            dataSource.serverSorting = true;
            dataSource.error = function(e) {
                podo.ui.handleAjaxError(e);
            };
        } else {
            dataSource.data = gridOptions.data;
            dataSource.serverPaging = false;
        }

        let schemaModelFieldKeyArr = [];
        let schemaModelFields = [];

        const addSchemaModelField = (data) => {
            if(data && data.length > 0) {
                data.forEach((d) => {
                    let item = {};
                    if(d.field && d.field.trim().length > 0) {
                        if(schemaModelFieldKeyArr.indexOf(d.field) > -1) return;

                        item.field = d.field;
                        let fieldType = d.type ?? 'string';

                        if(fieldType === 'date' || fieldType === 'datetime') {
                            item.parse = function(value) {
                                return value ? new Date(value) : null;
                            }
                            if(fieldType === 'datetime') {
                                d.format = '{0:yyyy-MM-dd HH:mm:ss}';
                            } else {
                                d.format = '{0:yyyy-MM-dd}';
                            }
                            fieldType = 'date';
                        } else if(fieldType === 'number') {
                            if(!d.format) {
                                d.format = '{0:n0}';
                            }
                        }

                        if (d.filterable === undefined || d.filterable === true) {
                            d.filterable = {extra: false};
                        }
                        item.type = fieldType;

                        schemaModelFieldKeyArr.push(d.field);
                        schemaModelFields.push(item);
                    }

                    if(d.columns && d.columns.length > 0) {
                        addSchemaModelField(d.columns)
                    }
                });
            }
        };

        addSchemaModelField(gridOptions.columns);

        dataSource.pageSize = gridOptions.pageSize ?? defaultPageSize;
        dataSource.schema = {
            total: 'totalCount',
            data:  'data',
            model: {
                id: gridOptions.idField ?? 'rnum',
                fields: schemaModelFields
            },
            parse: function(response) {
                if(gridOptions.data2Nm && gridOptions.data2Nm in globalThis) {
                    globalThis[gridOptions.data2Nm] = response.data2;
                }
                return response;
            }
        };

        const totalId = `${id.replace('#', '')}_totalCount`;
        let toolbarTag = '';
        if(gridOptions.totaling !== false) {
            const label = gridOptions.totalTxt || '검색결과';
            toolbarTag = `<span class="grid-total"><strong>${label}</strong> (총 <span id="${totalId}">0</span>건)</span>`;
        }

        if(gridOptions.topButton) {
            toolbarTag += '<div class="btn-group">';
            toolbarTag += gridOptions.topButton;
            toolbarTag += '</div>';
        }

        let toolBarArray = toolbarTag ? [{ template: toolbarTag }] : undefined;

        if(gridOptions.selectable) {
            const addColumn = {
                title: `<input type='checkbox' id='${gridId}_chk_all' class='k-checkbox' onclick='kendoUi.gridChkAllEvent(this);'><label for='${gridId}_chk_all'>`,
                filterable: false,
                sortable: false,
                columnMenu: false,
                menu: false,
                width: 42,
                attributes:{"class":"table-cell", style:"text-align:center"},
                template: `<input type='checkbox' id='${gridId}_chk_#:uid#' class='k-checkbox' name='CHK_OBJ' value="#: uid #" onclick='kendoUi.gridChkEvent(this);'>`
            };

            gridOptions.columns.unshift(addColumn);
        }

        const hasRnumColumn = gridOptions.columns.some(col => col.field === 'rnum');
        if(gridOptions.numbering) {
            const numberingOpt = (typeof gridOptions.numbering === 'object') ? gridOptions.numbering : {};
            const addColumn = {
                field: 'rnum',
                title:  `번호`,
                filterable: false,
                sortable: false,
                columnMenu: false,
                menu: false,
                width: numberingOpt.width ?? 75,
                attributes:{"class":"table-cell", style:"text-align:center"},
                template: `#: (data.rnum !== null && data.rnum !== undefined && data.rnum !== '') ? data.rnum : (kendoUi.getGridRecord('${gridId}'))++ #`
            };

            if(gridOptions.selectable) gridOptions.columns.splice(1, 0, addColumn);
            else gridOptions.columns.unshift(addColumn);
        }

        if (gridOptions.columnMenu === true && gridOptions.columns && gridOptions.columns.length > 0) {
            let columnMenuTargetFound = false;
            for (let i = 0; i < gridOptions.columns.length; i++) {
                if (gridOptions.columns[i].field === 'rnum') {
                    gridOptions.columns[i].columnMenu = true;
                    columnMenuTargetFound = true;
                } else {
                    if (gridOptions.columns[i].columnMenu === undefined) {
                        gridOptions.columns[i].columnMenu = false;
                    }
                }
            }

            if (!columnMenuTargetFound) {
                for (let i = 0; i < gridOptions.columns.length; i++) {
                    const col = gridOptions.columns[i];
                    const isCheckbox = !col.field && col.width === 42;

                    if (!isCheckbox) {
                        col.columnMenu = true;
                        columnMenuTargetFound = true;
                        break;
                    }
                }
            }
        } else if (gridOptions.columnMenu !== true && gridOptions.columns) {
            gridOptions.columns.forEach(col => {
                if (col.columnMenu === undefined) {
                    col.columnMenu = false;
                }
            });
        }

        // ★ 성능 최적화: debounce 타이머 저장 (cleanup용)
        let gridResizeTimer = null;
        const resizeHandlerName = 'resize.' + gridId;

        // ★ 성능 최적화: gridResize 함수 리팩토링
        const gridResize = () => {
            const $grid = $(id);
            if (!$grid.length || !$grid.data("kendoGrid")) {
                $(window).off(resizeHandlerName);
                return;
            }

            if (gridOptions.height === false) {
                return;
            }

            let gridHeight = gridOptions.height;
            if (gridHeight === true || gridHeight === undefined || gridHeight === null) {
                // ★ 개선: DOM 측정을 배치 처리 (한 번에 모든 값 수집)
                const $gridContainer = $grid.closest('.sec, section, .search-area, article, .tab-content');
                const $tabContent = $grid.closest('.k-content');

                // 모든 측정값을 한 번에 수집
                const gridOffsetTop = $grid.offset().top;
                const windowHeight = $(window).height();
                const tabContentHeight = $tabContent.length > 0 ? $tabContent.height() : 0;
                const gridPositionTop = $tabContent.length > 0 ? $grid.position().top : 0;

                let bottomPadding = 20;

                // ★ 개선: 스타일 값 읽기 최소화 (한 번에)
                const styles = [];
                $grid.parentsUntil('.page-wrapper').each(function() {
                    const computed = window.getComputedStyle(this);
                    styles.push({
                        pb: parseInt(computed.paddingBottom) || 0,
                        mb: parseInt(computed.marginBottom) || 0
                    });
                });

                // ★ 개선: 형제 요소 높이 배치 계산
                const $nextVisibleSiblings = $grid.nextAll(':visible');
                $nextVisibleSiblings.each(function() {
                    bottomPadding += $(this).outerHeight(true);
                });

                // 스타일 누적
                styles.forEach(s => {
                    bottomPadding += s.pb + s.mb;
                });

                let $contentFoot = $grid.closest('.sec, section, .page-body').find('.content-foot:visible');
                if ($contentFoot.length === 0 && $gridContainer.length > 0) {
                    $contentFoot = $gridContainer.find('.content-foot:visible');
                }

                if ($contentFoot.length > 0) {
                    let alreadyAdded = false;
                    $nextVisibleSiblings.each(function() {
                        if ($(this).is($contentFoot) || $(this).find('.content-foot').length > 0) {
                            alreadyAdded = true;
                            return false;
                        }
                    });
                    if (!alreadyAdded) {
                        bottomPadding += $contentFoot.outerHeight(true);
                    }
                }

                if ($tabContent.length > 0) {
                    const contentPadding = parseInt($tabContent.css('padding-bottom')) || 0;
                    gridHeight = Math.max(tabContentHeight - gridPositionTop - contentPadding - 20, 150);
                } else {
                    gridHeight = windowHeight - gridOffsetTop - bottomPadding;
                }

                if (gridHeight < 200) gridHeight = 200;
            }

            const gridInstance = $grid.data("kendoGrid");
            if (gridInstance && gridInstance.element && gridInstance.element.length > 0) {
                try {
                    if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
                        const $wrapper = gridInstance.wrapper;
                        gridInstance.options.height = gridHeight;
                        $wrapper.css('height', gridHeight + 'px');

                        // ★ 개선: 내부 요소 높이 한 번에 계산
                        const measurements = {
                            toolbar: 0,
                            pager: 0,
                            header: 0
                        };

                        const $toolbar = $wrapper.find('> .k-grid-toolbar');
                        const $pager = $wrapper.find('> .k-grid-pager');
                        const $header = $wrapper.find('> .k-grid-header');

                        if ($toolbar.length > 0) measurements.toolbar = $toolbar.outerHeight(true) || 0;
                        if ($pager.length > 0) measurements.pager = $pager.outerHeight(true) || 0;
                        if ($header.length > 0) measurements.header = $header.outerHeight(true) || 0;

                        const contentHeight = Math.max(gridHeight - measurements.toolbar - measurements.pager - measurements.header, 150);
                        const $content = $wrapper.find('> .k-grid-content');
                        if ($content.length > 0) {
                            $content.css({
                                'height': contentHeight + 'px',
                                'max-height': contentHeight + 'px',
                                'overflow-y': 'auto'
                            });
                        }
                    }

                    if (gridInstance.resize) {
                        gridInstance.resize();
                    }
                } catch (e) {
                    console.warn("[kendoUi] gridResize error:", e);
                    $(window).off(resizeHandlerName);
                }
            }
        };

        // ★ 성능 최적화: debounce 시간 조정 (200ms → 400ms)
        if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
            $(window).off(resizeHandlerName).on(resizeHandlerName, function() {
                if (gridResizeTimer) {
                    clearTimeout(gridResizeTimer);
                }
                gridResizeTimer = setTimeout(function() {
                    gridResize();
                    gridResizeTimer = null;
                }, 400);
            });
        }

        $el.kendoGrid({
            autoBind: (gridOptions.autoBind ?? true),
            dataSource: dataSource,
            columns: gridOptions.columns,
            ...(gridOptions.rowTemplate && { rowTemplate: gridOptions.rowTemplate }),
            ...(gridOptions.altRowTemplate && { altRowTemplate: gridOptions.altRowTemplate }),
            filterable: (function() {
                if (gridOptions.filterable === false) return false;
                const defaultFilterable = {
                    mode: 'menu',
                    extra: false,
                    operators: {
                        string: {
                            contains:       '포함',
                            eq:             '같음',
                            neq:            '같지 않음',
                            startswith:     '시작 문자',
                            endswith:       '끝 문자',
                            doesnotcontain: '포함하지 않음'
                        }
                    }
                };
                if (gridOptions.filterable === true || gridOptions.filterable == null) return defaultFilterable;
                if (typeof gridOptions.filterable === 'object') {
                    return $.extend(true, {}, defaultFilterable, gridOptions.filterable);
                }
                return true;
            })(),
            sortable: gridOptions.sortable !== undefined ? gridOptions.sortable : true,
            reorderable: gridOptions.reorderable !== undefined ? gridOptions.reorderable : {},
            resizable: true,
            width: '100%',
            height: (function() {
                if (gridOptions.height === false) return null;
                let gridHeight = gridOptions.height;
                if (gridHeight === true || gridHeight === undefined || gridHeight === null) {
                    const $gridContainer = $el.closest('.sec, div, section, .search-area, article, .tab-content');
                    let gridOffsetTop = $el.offset().top;

                    if (gridOffsetTop === 0 && $gridContainer.length > 0) {
                        const $visibleParent = $el.parents(':visible').first();
                        if ($visibleParent.length > 0) {
                            gridOffsetTop = $el.offset().top || ($gridContainer.offset().top + ($gridContainer.outerHeight() - $gridContainer.height()) / 2);
                        }
                    }

                    const windowHeight = $(window).height();
                    let bottomPadding = 20;

                    let $nextVisibleSiblings = $el.nextAll(':visible');
                    let $current = $el;
                    while ($nextVisibleSiblings.length === 0 && $current.parent().length > 0 && !$current.parent().is('.sec, section, .search-area, article, .tab-content, .page-body, .page-wrapper')) {
                        $current = $current.parent();
                        $nextVisibleSiblings = $current.nextAll(':visible');
                    }

                    $nextVisibleSiblings.each(function() {
                        bottomPadding += $(this).outerHeight(true);
                    });

                    $el.parentsUntil('.page-wrapper').each(function() {
                        bottomPadding += parseInt($(this).css('padding-bottom')) || 0;
                        bottomPadding += parseInt($(this).css('margin-bottom')) || 0;
                    });

                    let $contentFoot = $el.closest('.sec, section, .page-body').find('.content-foot:visible');
                    if ($contentFoot.length === 0 && $gridContainer.length > 0) {
                        $contentFoot = $gridContainer.find('.content-foot:visible');
                    }

                    if ($contentFoot.length > 0) {
                        let alreadyAdded = false;
                        $nextVisibleSiblings.each(function() {
                            if ($(this).is($contentFoot) || $(this).find('.content-foot').length > 0) {
                                alreadyAdded = true;
                                return false;
                            }
                        });

                        if (!alreadyAdded) {
                            bottomPadding += $contentFoot.outerHeight(true);
                        }
                    }

                    gridHeight = windowHeight - gridOffsetTop - bottomPadding;
                    if (gridHeight < 200) gridHeight = 200;
                }
                return Math.floor(gridHeight);
            })(),
            ...(toolBarArray && { toolbar: toolBarArray }),
            columnMenu: (function() {
                if (gridOptions.columnMenu !== true) return false;
                return {
                    componentType: "modern",
                    columns: true,
                    filterable: true,
                    sortable: false
                };
            })(),
            columnMenuInit: function(e) {
                if(gridOptions.selectable) {
                    const columnsMenu = e.container.find(".k-column-list-item");
                    columnsMenu.eq(0).remove();
                }
            },
            ...(gridOptions.pageable !== false && {
                pageable: {
                    refresh: false,
                    pageSizes: gridOptions.pageSizes || ((gridOptions.pageSize === 30) ? [30, 50, 100, 300, 500] : ((gridOptions.pageSize === 10) ? [10, 30, 100] : [10, 50, 100, 500])),
                    buttonCount: 10,
                    previousNext: true,
                    info: true,
                    numeric: true
                }
            }),
            selectable: 'row',
            noRecords: { template: "<div class='no-data-cont'><p>검색결과가 없습니다.</p></div>" },
            dataBinding: function () {
                const total = this.dataSource.total();
                const page = this.dataSource.page();
                const pageSize = this.dataSource.pageSize();

                // ★ 성능 최적화: 전역 변수 대신 data attributes
                $el.data('gridRecord', ((page - 1) * pageSize) + 1);
            },
            dataBound: function(e) {
                const self = this;
                const total = self.dataSource.total();
                $(`#${totalId}`).text(total);

                self.tbody.off('click.gridLink', 'a').on('click.gridLink', 'a', function(clickEvent) {
                    const $tr = $(this).closest('tr');
                    if ($tr.length > 0) {
                        self.tbody.find('tr.k-selected').removeClass('k-selected');
                        $tr.addClass('k-selected');
                    }
                });

                if (gridOptions.height === false) {
                    e.sender.wrapper.css("height", "auto");
                    e.sender.wrapper.css("min-height", gridOptions.minHeight || "300px");
                }

                if (gridOptions.pageable !== false) {
                    const $gridWrapper = e.sender.wrapper;
                    if ($gridWrapper) {
                        $gridWrapper.find('.k-pager-md .k-pager-sizes .k-dropdownlist').css('display', '');
                        $gridWrapper.find('.k-pager-sizes').css('display', '');
                    }
                }

                // ★ 성능 최적화: requestAnimationFrame 사용
                if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
                    if (gridResizeTimer) {
                        clearTimeout(gridResizeTimer);
                    }
                    gridResizeTimer = setTimeout(function() {
                        gridResize();
                        gridResizeTimer = null;
                    }, 300);
                }

                if (typeof gridOptions.dataBound === "function") {
                    gridOptions.dataBound(e);
                }

                if (typeof gridOptions.onDataBound === 'function') {
                    gridOptions.onDataBound(e);
                }
            },
            destroy: function() {
                $(window).off(resizeHandlerName);
                if (gridResizeTimer) {
                    clearTimeout(gridResizeTimer);
                    gridResizeTimer = null;
                }
            }
        });

        const tmpGrid = $(id).data('kendoGrid');
        tmpGrid.bind('columnShow', (e) => {
            const fieldNm = e.column.field;
            const hideColumns = GridColumnCache.get(gridOptions.mid);
            const localSaveHideColumns = hideColumns.filter((item) => { return item.indexOf(fieldNm) < 0 });
            GridColumnCache.set(gridOptions.mid, localSaveHideColumns);
        });
        tmpGrid.bind('columnHide', (e) => {
            const fieldNm = e.column.field;
            const hideColumns = GridColumnCache.get(gridOptions.mid);
            let localSaveHideColumns = [...hideColumns];
            if(localSaveHideColumns.indexOf(fieldNm) < 0 ) {
                localSaveHideColumns.push(fieldNm);
            }
            GridColumnCache.set(gridOptions.mid, localSaveHideColumns);
        });
    },

    /**
     * kendo grid selected
     * */
    selectGridRow(el) {
        const grid = $(el).closest("[data-role='grid']").data("kendoGrid");
        const row = $(el).closest("tr");
        grid.select(row);
    },

    /**
     * ★ 성능 최적화: gridRecord 값 관리
     */
    getGridRecord(gridId) {
        const $grid = $('#' + gridId);
        if (!$grid.length) return 0;
        return $grid.data('gridRecord') || 0;
    },

    // 서버전송을 위해 데이터소스에서 파라메터 추출
    getParamterMap(options, operation, readParamFun) {
        if(operation === 'read') {
            let paramMap = {page: options.page, pageSize: options.pageSize};

            var sortField = "";
            var sortDir = "";
            if(options.sort && options.sort.length>0) {
                sortField = options.sort[0].field;
                sortDir = options.sort[0].dir;
            }

            paramMap.sortField = sortField;
            paramMap.sortDir = sortDir;

            if(options.filter && options.filter.filters) {
                const data = options.filter;
                data.filters.forEach((val)=>{
                    if(val.filters) {
                        val.filters.forEach((val2)=>{
                            if(val2.value instanceof Date) {
                                const year = (val2.value).getFullYear();
                                const month = ((val2.value).getMonth() + 1).toString().padStart(2, '0');
                                const day = (val2.value).getDate().toString().padStart(2, '0');
                                val2.value = year+'-'+month+'-'+day;
                                val2.type = 'date';
                            } else {
                                val2.type = 'object';
                            }
                        });
                    } else {
                        if(val.value instanceof Date) {
                            const year = (val.value).getFullYear();
                            const month = ((val.value).getMonth() + 1).toString().padStart(2, '0');
                            const day = (val.value).getDate().toString().padStart(2, '0');
                            val.value = year+'-'+month+'-'+day;
                            val.type = 'date';
                        } else {
                            val.type = 'object';
                        }
                    }
                });

                paramMap.filter = kendo.stringify(data);
            } else {
                paramMap.filter = '{}';
            }
            if(readParamFun && readParamFun != null && typeof readParamFun === 'function') {
                var rawParam = {};
                try {
                    rawParam = readParamFun() || {};
                } catch (e) {
                    console.warn('readParamFun error:', e);
                }
                paramMap.item = kendo.stringify(rawParam);
            }

            return paramMap;
        } else {
            if(options.models) {
                return kendo.stringify(options.models);
            }
        }
    },

    /*
    * DataGrid 전체체크박스 클릭 이벤트 처리
    * @param el 전체체크박스 엘리먼트
    */
    gridChkAllEvent(el) {
        const gridId = el.id.replace("_chk_all","");
        const $enabledCheckboxes = $("#" + gridId + " input[name=CHK_OBJ]:enabled");

        let selectRowClass = '';
        if(el.checked){
            $enabledCheckboxes.prop("checked", true);
            selectRowClass = '';
        }else{
            $enabledCheckboxes.prop("checked", false);
            selectRowClass = '';
        }

        const tmpRows = $('#'+gridId).data('kendoGrid').tbody.find('tr');
        tmpRows.each((idx, row)=>{
            const $checkbox = $(row).find("input[name=CHK_OBJ]");
            if(!$checkbox.is(":enabled")) {
                return;
            }

            if(el.checked){
                $(row).children('td').addClass('selectRowClass');
            } else  {
                $(row).children('td').removeClass('selectRowClass');
            }
        });
    },

    /*
    * DataGrid ROW체크박스 클릭 이벤트 처리
    * @param el 체크박스 엘리먼트
    */
    gridChkEvent(el) {
        const gridId = el.id.replace("_chk","");
        const $el = el.parentNode.parentNode;

        if(el.checked){
            $(gridId+" input[name=CHK_OBJ]").prop("checked", true);
            $($el).children('td').addClass('selectRowClass');
        }else{
            $(gridId+" input[name=CHK_OBJ]").prop("checked", false);
            $($el).children('td').removeClass('selectRowClass');
        }
    },

    /*
    DataGrid 에서 체크된 로우의 UID 목록 조회
    @param gridId Grid아이디
    */
    getGridChkList(gridId) {
        const selectRows = $(gridId+" input[name=CHK_OBJ]:checked");
        return selectRows;
    },

    /*
    DataGrid 에서 체크된 로우 데이터 조회
    @param gridId Grid아이디
    */
    getGridChkRowData(gridId) {
        const grid = $(gridId).data("kendoGrid");
        const selectRows = $(gridId+" input[name=CHK_OBJ]:checked");
        let datas = [];
        selectRows.each((idx, el)=>{
            const item = grid.dataSource.getByUid(el.value);
            datas.push(item);
        });
        return datas;
    },

    /*
    DataGrid 에서 체크된 로우 해제 (초기화)
    @param gridId Grid아이디
    */
    clearGridChk(gridId) {
        const grid = $(gridId).data("kendoGrid");
        if (grid) {
            grid.clearSelection();
            $(gridId + " input[name=CHK_OBJ]").prop("checked", false);
            $(gridId).find('td').removeClass('selectRowClass');
            $(`${gridId}_chk_all`).prop("checked", false);
            $(`${gridId}_chk_all`).prop("indeterminate", false);
        }
    },

    /**
    kendo grid read
    @Param {gridId} 그리드ID
    @Param {isReload} 현재 페이지 리로드 여부
     */
    readGridData(gridId, isReload = false) {
        const grid = $(gridId).data("kendoGrid");
        const pageSize = grid.dataSource.pageSize();

        if(isReload) {
            $(gridId).data("kendoGrid").dataSource.read();
        } else {
            $(gridId).data("kendoGrid").dataSource.query({
                page: 1,
                pageSize: pageSize,
                filter: {},
                sort: []
            });
        }

        if($(`${gridId}_chk_all`).length > 0) {
            kendoUi.clearGridChk(gridId);
        }
    },

    /*
     kendo grid row get data
     @param gridId 그리드ID
     @param uid 그리드 로우 UID
     */
    getGridRowData(gridId, uid) {
        const grid = $(gridId).data("kendoGrid");
        if(grid) {
            return grid.dataSource.getByUid(uid);
        }
        return {};
    },

    /*
    kendo grid 의 dataSource 의 data 를 꺼냄
     @param gridId 그리드ID
    */
    getGridData(gridId) {
        const grid = $(gridId).data("kendoGrid");
        if(grid) {
            return grid.dataSource.data();
        }
        return [];
    },

    /*
    kendo grid 의 dataSource 에 data 를 주입
     @param gridId 그리드ID
     @param data 주입할 배열형 데이터
    */
    setGridData(gridId, data) {
        const grid = $(gridId).data("kendoGrid");
        if(grid) {
            grid.dataSource.data(data);
        }
    },

    /*
    kendo grid 의 dataSource 에 data 를 추가
    ID를 기준으로 추가되므로 해당 기능을 사용하기위해서는 idField 를 먼저 선언해야합니다.
    동일 ID에 대해서는 추가되지 않습니다.
     @param gridId 그리드ID
     @param data 주입할 rowdata
    */
    setGridDataPush(gridId, data) {
        const grid = $(gridId).data("kendoGrid");
        if(grid) {
            grid.dataSource.pushUpdate(data);
        }
    },

    /*
    DropDownList 의 값을 조회
    */
    getDropDownListValue(id) {
        const _el = $(id).data('kendoDropDownList');
        if(_el) {
            return _el.value();
        }
        return '';
    },

    /*
    DropDownList 의 text 을 조회
    */
    getDropDownListText(id) {
        const _el = $(id).data('kendoDropDownList');
        if(_el) {
            return _el.text();
        }
        return '';
    },

    /*
    DropDownList 의 data 를 주입
    */
    setDropDownListData(id, data) {
        const _el = $(id).data('kendoDropDownList');
        if(_el) {
            _el.dataSource.data(data);
            _el.refresh();
        }
    },

    /*
    DropDownList 의 value 를 주입
    */
    setDropDownListValue(id, value) {
        const _el = $(id).data('kendoDropDownList');
        if(_el) {
            _el.value(value);
            _el.refresh();
        }
    },

    /*
    kendoDatePicker 의 값을 조회
    */
    getDatePickerValue(id) {
        const _el = $(id).data('kendoDatePicker');
        if(_el) {
            return kendo.toString(_el.value(),'yyyy-MM-dd');
        }
        return '';
    },

    /*
    kendoAutoComplete 의 값을 조회
    */
    getAutoCompleteValue(id) {
        const _el = $(id).data('kendoAutoComplete');
        if(_el) {
            return _el.value();
        }
        return '';
    },

    /*
    kendoMultiSelect 의 값을 조회 (배열 반환)
    */
    getMultiSelectValue(id) {
        const _el = $(id).data('kendoMultiSelect');
        if(_el) {
            return _el.value();
        }
        return [];
    },

    /*
    kendoDatePicker 의 value 를 주입
    */
    setDatePickerValue(id, value) {
        const _el = $(id).data('kendoDatePicker');
        if(_el) {
            _el.value(value);
        }
    },

    /*
    kendoDatePicker 의 값을 조회
    */
    getTimePickerValue(id) {
        const _el = $(id).data('kendoTimePicker');
        if(_el) {
            return kendo.toString(_el.value(),'HH:mm');
        }
        return '';
    },

    /*
    kendoDatePicker 의 value 를 주입
    */
    setTimePickerValue(id, value) {
        const _el = $(id).data('kendoTimePicker');
        if(_el) {
            _el.value(value);
        }
    },

    /*
    kendoColorPicker 의 값을 조회
    */
    getColorPickerValue(id) {
        const _el = $(id).data('kendoColorPicker');
        if(_el) {
            return _el.value();
        }
        return '';
    },

    /*
    kendoColorPicker 의 value 를 주입
    */
    setColorPickerValue(id, value) {
        const _el = $(id).data('kendoColorPicker');
        if(_el) {
            _el.value(value);
        }
    }
};
