/**
 * kendo.ui.Dialog
 * alert, confirm
 * */
let KendoCustomData = {}; // 켄도관련 동적변수관리

const KendoDialog = (function () {
	"use strict";

	// ── 타입별 설정 ──────────────────────────────────────────────────────
	const TYPE_CONFIG = {
		success: {title: "성공", iconClass: "k-icon k-font-icon k-i-check-circle"},
		error: {title: "오류", iconClass: "k-icon k-font-icon k-i-x-circle"},
		warning: {title: "경고", iconClass: "k-icon k-font-icon k-i-warning"},
		info: {title: "안내", iconClass: "k-icon k-font-icon k-i-information"},
	};

	// ── 메시지 HTML 생성 ──────────────────────────────────────────────────
	function buildContent(message, type) {
		var cfg = type && TYPE_CONFIG[type];

		if (!cfg) {
			return "<p class='kd-message'>" + escapeHtml(message) + "</p>";
		}

		return [
			"<div class='kd-content'>",
			"  <span class='kd-icon " + cfg.iconClass + "'></span>",
			"  <p class='kd-message'>" + escapeHtml(message) + "</p>",
			"</div>",
		].join("");
	}

	// ── 공통 dialog 생성 ─────────────────────────────────────────────────
	// kendoDialog를 직접 생성하여 인스턴스를 즉시 제어
	// → kendo.alert/confirm의 비동기 DOM 생성 타이밍 문제 없음
	function createDialog(type, message, opts) {
		opts = opts || {};

		// 타입 기본값 적용
		const cfg = type && TYPE_CONFIG[type];

		const title = opts.title || (cfg && cfg.title) || "알림";
		const okText = opts.okText || "확인";
		const cancelText = opts.cancelText || "취소";

		return new Promise(function (resolve) {
			// dialog 컨테이너 생성
			const $container = $("<div>");
			$("body").append($container);

			const actions = [];

			// confirm 타입이면 취소 버튼 추가
			if (type === "confirm") {
				actions.push({
					text: cancelText,
					action: function () {
						resolve(false);
					},
				});
			}

			// 확인 버튼
			actions.push({
				text: okText,
				primary: true,
				action: function () {
					resolve(type === "confirm" ? true : undefined);
				},
			});

			// kendoDialog 직접 생성 → 인스턴스 즉시 제어 가능
			$container.kendoDialog({
				title: title,
				content: buildContent(message, opts.type || (type === "confirm" ? null : type)),
				actions: actions,
				modal: true,
				visible: true,
				close: function () {
					// X 버튼 or ESC → 취소로 처리
					if (type === "confirm") resolve(false);

					// dialog 제거
					var dialog = $container.data("kendoDialog");
					setTimeout(function () {
						dialog.destroy();
						$container.remove();
					}, 300);
				},
			});

			// 타입 class 추가 → CSS에서 타입별 스타일 관리
			const dialogType = opts.type || (type !== "confirm" ? type : null);
			if (dialogType) {
				$container.data("kendoDialog").wrapper.addClass("kd-type-" + dialogType);
			}
		});
	}

	// ── XSS 방지 ─────────────────────────────────────────────────────────
	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	// ────────────────────────────────────────────────────────────────────
	// alert
	// @param {string} message
	// @param {string|object} [typeOrOpts] - "success"|"error"|"warning"|"info" 또는 { type, title, okText }
	// @returns {Promise<void>}
	// ────────────────────────────────────────────────────────────────────
	function alert(message, typeOrOpts) {
		let opts = {};

		if (typeof typeOrOpts === "string") {
			opts.type = typeOrOpts;
		} else if (typeOrOpts && typeof typeOrOpts === "object") {
			opts = typeOrOpts;
		}

		return createDialog(opts.type || "alert", message, opts);
	}

	// ────────────────────────────────────────────────────────────────────
	// confirm
	// @param {string} message
	// @param {object} [opts] - { title, okText, cancelText }
	// @returns {Promise<boolean>}  확인: true / 취소: false
	// ────────────────────────────────────────────────────────────────────
	function confirm(message, opts) {
		return createDialog("confirm", message, opts || {});
	}

	// ────────────────────────────────────────────────────────────────────
	// 타입별 alert 단축 메서드 (success/error/warning/info)
	// TYPE_CONFIG 에 정의된 타입을 alert 로 간편 호출한다.
	// @param {string} message
	// @param {object} [opts] - { title, okText } (type 은 자동 지정)
	// @returns {Promise<void>}
	// ────────────────────────────────────────────────────────────────────
	function typedAlert(type) {
		return function (message, opts) {
			var o = (opts && typeof opts === "object") ? opts : {};
			o.type = type; // 호출 타입으로 고정
			return alert(message, o);
		};
	}

	return {
		alert: alert,
		confirm: confirm,
		success: typedAlert("success"),
		error: typedAlert("error"),
		warning: typedAlert("warning"),
		info: typedAlert("info"),
	};

})();

/**
 * kendoUi - Kendo UI 간편 초기화 유틸리티
 * ----------------------------------------
 * Kendo UI를 몰라도 함수 호출만으로 컴포넌트를 생성할 수 있습니다.
 * HTML에 <div id="..."></div> 만 있으면 됩니다.
 *
 * ----------------------------------------
 * 지원 컴포넌트
 * ----------------------------------------
 *  kendoUi.dropDownList (id, data, optionLabel, filter)
 *  kendoUi.datePicker   (id, value, min, max)
 *  kendoUi.dateRangePicker (id, startValue, endValue)
 *  kendoUi.timePicker   (id, value, min, max, interval)
 *  kendoUi.numericTextBox (id, value, min, max, step)
 *  kendoUi.multiSelect  (id, data, placeholder, filter)
 *  kendoUi.comboBox     (id, data, filter, suggest)
 * ----------------------------------------
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
			readParamFun = null, // 파라메터 함수
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
			// 전달되는 data 가 DataSource
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
				kbrainc.ui.handleAjaxError(e);
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
			dataTextField: dataTextField, // view 속성으로 사용될 field 를 정의
			dataValueField: dataValueField, // data 속성으로 사용될 field 를 정의
			dataSource: dataSource,
			suggest: suggest,
			...kendoOptions,
			...(optionLabel && {
				optionLabel: optionLabel
			}),
			// change 이벤트: 콜백이 있을 때만 포함
			...(typeof onChange === 'function' && { change: onChange }),

			// dataBound 이벤트: 콜백이 있을 때만 포함
			...(typeof onDataBound === 'function' && { dataBound: onDataBound }),
			index: index ?? (value !== null && value !== undefined ? -1 : 0),
			value: value ?? '', // 기본값셋팅
			filter: filter ? 'contains' : 'none', // 검색추가(포함)
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

		// 이미 인스턴스가 있는 경우 값만 갱신
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
			$el.removeData('kendoDropDownList'); // 중복 방지 플래그 제거
			$el.val('');                         // DOM 초기화
		}
	},

	/**
	 * 3개 get DropDownValue
	 * */
	getDropDownValuesThree(id, id2, id3) {
		const value1 = $(id).data('kendoDropDownList')?.value() || null;
		const value2 = $(id2).data('kendoDropDownList')?.value() || null;
		const value3 = $(id3).data('kendoDropDownList')?.value() || null;

		// null 제거 후 배열로 반환
		return [value1, value2, value3].filter(v => v !== null);
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

		// 이미 초기화된 경우 중복 생성 방지
		if ($el.data('kendoDatePicker')) return;

		const {
			value = null,
			onChange = null,
			format = "yyyy-MM-dd",
			dateInput = true,
			inputMode = "numeric",
			messages = { dateInput: {year: 'YYYY', month: 'MM', day: 'DD'}},
			...kendoOptions
		} = dateOptions || {};

		$el.kendoDatePicker({
			format: format, // view 포맷입니다. getValue 와 관계없습니다
			value: value ?? '',//new Date(), // 초기값이 있을 경우 넣어주세요
			dateInput: dateInput, // 일자외입력방지
			inputMode: inputMode, //숫자만입력허용
			...kendoOptions,
			// change 이벤트: 콜백이 있을 때만 포함
			...(typeof onChange === 'function' && { change: onChange }),
			messages: messages
		});
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

		// 이미 초기화된 경우 중복 생성 방지
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
			format: format, // view 포맷입니다. getValue 와 관계없습니다
			...(valueDate && { value: valueDate }),
			...(minDate   && { min:   minDate   }),
			...(maxDate   && { max:   maxDate   }),
			dateInput: dateInput, // 시간외입력방지
			inputMode: inputMode, //숫자만입력허용
			...kendoOptions,
			// change 이벤트: 콜백이 있을 때만 포함
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

		// 이미 초기화된 경우 중복 생성 방지
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
			min: min, // 최소
			max: max, // 최대
			step: step, // 스탭간격
			format: format, // 숫자포맷, n0(소수점X), n2(소수점2자리허용), c0(통화기호+콤마), #,##0(3자리 콤마, 소수넘 없음)
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

		// 이미 초기화된 경우 중복 생성 방지
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
			format: format, // view 포맷입니다. getValue 와 관계없습니다
			dateInput: dateInput, // 시간외입력방지
			calendarButton: calendarButton,		// 캘린더 버튼
			clearButton: clearButton,			// 초기화 버튼
			...kendoOptions,
			// min, max: 값이 있을 때만 포함
			...(min !== null && { min: new Date(min) }),
			...(max !== null && { max: new Date(max) }),
			// onChange: 콜백이 있을 때만 포함
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
	 *  kendoDatePicker START END
	 *  stEdDateOptions: {format, min, max, defaultStart, defaultEnd, onChange, ...kendoOptions }
	 *  startId: #시작일ID	endId: #종료일ID
	 *  */
	createDatePickerStartEnd(startId, endId, stEdDateOptions = {}) {
		const $elStart = $(startId);
		const $elEnd = $(endId);

		if (!$elStart.length && !$elEnd.length) {
			console.warn(`[kendoUi] "${$elStart}" 또는 "${$elEnd}" 요소를 찾을 수 없습니다.`);
			return;
		}

		// 이미 초기화된 경우 중복 생성 방지
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
			dateInput = true,
			...kendoOptions
		} = stEdDateOptions;

		// ── 기본값: 시작일 = 이달 1일, 종료일 = 다음달 1일 ──
		const startVal = defaultStart ? new Date(defaultStart) : null;
		const endVal = defaultEnd ? new Date(defaultEnd) : null;
		const minDate = min ? new Date(min) : null;
		const maxDate = max ? new Date(max) : null;

		const defaultMessages = {
			dateInput: { year: 'YYYY', month: 'MM', day: 'DD' }
		};

		// ── 시작일 DatePicker ──
		$elStart.kendoDatePicker({
			format,
			dateInput,
			messages: defaultMessages,
			...(startVal && { value: startVal }),
			...(minDate && { min: minDate }),
			...(maxDate && { max: maxDate }),
			...kendoOptions,
			change: function() {
				const endPicker = $elEnd.data('kendoDatePicker');
				if (endPicker) endPicker.min(this.value());
				if (typeof onChange === 'function') {
					onChange({ start: this.value(), end: endPicker ? endPicker.value() : null });
				}
			}
		});

		// ── 종료일 DatePicker ──
		$elEnd.kendoDatePicker({
			format,
			dateInput,
			messages: defaultMessages,
			...(endVal && { value: endVal }),
			...(minDate && { min: minDate }),
			...(maxDate && { max: maxDate }),
			...kendoOptions,
			change: function() {
				const startPicker = $elStart.data('kendoDatePicker');
				if (typeof onChange === 'function') {
					onChange({ start: startPicker ? startPicker.value() : null, end: this.value() });
				}
			}
		});
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
			console.warn(`[kendoUi] "${$elStart}" 또는 "${$elEnd}" 요소를 찾을 수 없습니다.`);
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
			...kendoOptions
		} = stEdMonthOptions;

		const startVal = defaultStart ? new Date(defaultStart) : null;
		const endVal = defaultEnd ? new Date(defaultEnd) : null;
		const minDate = min ? new Date(min) : null;
		const maxDate = max ? new Date(max) : null;

		const defaultMessages = {
			dateInput: { year: 'YYYY', month: 'MM' }
		};

		// 년월 선택을 위해 depth와 start를 year로 설정
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
				if (endPicker) endPicker.min(this.value());
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
				if (typeof onChange === 'function') {
					onChange({ start: startPicker ? startPicker.value() : null, end: this.value() });
				}
			}
		});
	},

	/**
	 * START/END datepicker 범위 동기화 함수
	 * 현재 기획 기준으로는 범위 제한을 두지 않는다.
	 * */
	syncDatePickerStartEndRange(startId, endId) {
		return;
	},

	/**
	 * START/END datepicker 값을 함께 설정한다.
	 * 범위 제한 없이 값과 달력 위치만 반영한다.
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

		// 이미 초기화된 경우 중복 생성 방지
		if ($el.data('kendoAutoComplete')) return;

		const {
			data = null,  // data는 선택사항
			readUrl = null,  // 새로 추가: URL로 동적 로딩
			field = 'text',
			placeholder = '검색어를 입력해 주세요.',
			filter = 'contains',
			minLength = 1,          // 새로 추가
			delay = 200,            // 새로 추가
			onChange = null,        // 콜백 함수
			...kendoOptions         // 기타 kendo 옵션
		} = autoCompleteOptions;

		let dataSource = {};
		if (autoCompleteOptions.readUrl && autoCompleteOptions.readUrl !== "") {
			// 전달되는 data 가 DataSource
			dataSource.transport = {
				read: { url: autoCompleteOptions.readUrl, type:"POST", dataType: 'json' },
				parameterMap: (options, operation) => { return kendoUi.getParamterMap(options, operation, autoCompleteOptions.readParamFun) }
			};
			dataSource.error = function(e) {
				kbrainc.ui.handleAjaxError(e);
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
	 *
	 * @param {string} id - 대상 요소 selector (예: "#tab-main") [필수]
	 *                      HTML 구조:
	 *                      <div id="tab-main">
	 *                          <ul>
	 *                              <li class="k-state-active">탭1</li>
	 *                              <li>탭2</li>
	 *                          </ul>
	 *                          <div>탭1 내용</div>
	 *                          <div>탭2 내용</div>
	 *                      </div>
	 *
	 * @param {Object} tabOptions - 탭 옵션 객체
	 *    - onSelect: 탭 클릭 시 실행 (전환 시작) [선택] 기본값: null
	 *      콜백 파라미터: e.item (클릭한 탭 요소)
	 *    - onActivate: 탭 전환 완료 후 실행 [선택] 기본값: null
	 *      콜백 파라미터: e.item (활성화된 탭 요소)
	 *    - activeTab: 초기 활성 탭 인덱스 [선택] 기본값: 0
	 *    - scrollable: 탭 콘텐츠 영역에 스크롤 생성 여부 (브라우저 높이에 맞춰 유동적 조절) [선택] 기본값: false
	 *    - animation: 애니메이션 설정 [선택]
	 *      예: { open: { effects: 'fadeIn' } }
	 *    - ...kendoOptions: 기타 kendo 옵션
	 *
	 * @example
	 * // 기본 사용
	 * kendoUi.createTab("#tab-main");
	 *
	 * // 스크롤 적용 사용
	 * kendoUi.createTab("#tab-main", {
	 *     scrollable: true
	 * });
	 *
	 * // 콜백 함수 포함
	 * kendoUi.createTab("#tab-main", {
	 *     onSelect: function(e) {
	 *         console.log("선택 탭:", $(e.item).text());
	 *     },
	 *     onActivate: function(e) {
	 *         console.log("전환 완료:", $(e.item).text());
	 *     }
	 * });
	 *
	 * // 초기 활성 탭 지정
	 * kendoUi.createTab("#tab-main", {
	 *     activeTab: 1,  // 두 번째 탭 활성화
	 *     onActivate: function(e) {
	 *         console.log("활성화:", $(e.item).text());
	 *     }
	 * });
	 *
	 * // 애니메이션 커스터마이징
	 * kendoUi.createTab("#tab-main", {
	 *     animation: {
	 *         open: { effects: 'fadeIn slideDown', duration: 300 },
	 *         close: { effects: 'fadeOut slideUp', duration: 300 }
	 *     }
	 * });
	 */
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
				// 하단 여백 (예: 20px)
				const footerMargin = 20;
				let availableHeight = windowHeight - tabOffset - tabHeaderHeight - footerMargin;

				// 최소 높이 보장
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
			scrollable: scrollable, // kendo 자체 옵션이 아닌 커스텀 속성으로 보관
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

		// 무조건 첫번째 탭 활성화
		const tabStrip = $el.data('kendoTabStrip');
		if (tabStrip && typeof activeTab === 'number') {
			tabStrip.select(activeTab);
		}
	},

	/**
	 * MultiSelect (다중 선택) - 객체형식
	 *
	 * @param {string} id - 대상 요소 selector (예: "#ms-tags") [필수]
	 *
	 * @param {Object} multiSelectOptions - 다중 선택 옵션 객체
	 *    - data: 선택 항목 데이터 배열 (예: [{ text: "Vue", value: "vue" }, ...]) [필수]
	 *      또는 { totalCount: 21, items: [...] } 형식
	 *    - placeholder: 선택 전 안내 문구 [선택] 기본값: null
	 *    - filter: 검색 기능 설정 [선택] 기본값: null
	 *      값: null → 검색 기능 없음
	 *          'contains' → 포함 검색
	 *          'startswith' → 시작 검색
	 *          'endswith' → 끝 검색
	 *    - maxSelectedItems: 최대 선택 가능 개수 [선택] 기본값: null (제한 없음)
	 *    - dataTextField: 표시할 필드명 [선택] 기본값: 'text'
	 *    - dataValueField: 값으로 사용할 필드명 [선택] 기본값: 'value'
	 *    - onChange: 값 변경 시 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e.sender (multiSelect 객체)
	 *    - dataSourceUrl: 데이터 로딩 URL [선택] (data 대신 사용)
	 *    - ...kendoOptions: 기타 kendo 옵션
	 *
	 * @example
	 * // 기본 사용
	 * kendoUi.createMultiSelect("#ms-tags", {
	 *     data: [
	 *         { text: "Vue", value: "vue" },
	 *         { text: "React", value: "react" }
	 *     ]
	 * });
	 *
	 * // 옵션 포함
	 * kendoUi.createMultiSelect("#ms-tags", {
	 *     data: [
	 *         { text: "Vue", value: "vue" },
	 *         { text: "React", value: "react" }
	 *     ],
	 *     placeholder: "기술 스택을 선택하세요",
	 *     filter: "contains",
	 *     maxSelectedItems: 3,
	 *     onChange: function(e) {
	 *         console.log("선택값:", e.sender.value());
	 *     }
	 * });
	 *
	 * // items 배열만 있는 경우
	 * kendoUi.createMultiSelect("#ms-tags", {
	 *     data: dataObj.items,
	 *     placeholder: "선택하세요",
	 *     filter: "startswith"
	 * });
	 *
	 * // URL에서 동적 로딩
	 * kendoUi.createMultiSelect("#ms-tags", {
	 *     dataSourceUrl: "/api/tags/search",
	 *     placeholder: "태그를 선택하세요",
	 *     filter: "contains"
	 * });
	 */
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

		// ── 필터 값 변환 ──
		// filter가 true이면 'contains', false이면 'startswith'
		let filterVal = null;
		if (filter === true) {
			filterVal = 'contains';
		} else if (filter === false) {
			filterVal = 'startswith';
		} else if (typeof filter === 'string') {
			filterVal = filter;  // 'contains', 'startswith', 'endswith' 등
		}

		// ── 데이터 정규화 ──
		let normalizedData = null;
		if (data) {
			if (Array.isArray(data)) {
				// 배열 형식
				normalizedData = data;
			} else if (data.items && Array.isArray(data.items)) {
				// { totalCount, items } 형식
				normalizedData = data.items;
			} else if (typeof data === 'object') {
				// 단일 객체인 경우
				normalizedData = [data];
			}
		}

		// ── DataSource 설정 ──
		let dataSourceConfig;

		if (multiSelectOptions.readUrl) {
			// 서버에서 동적 로딩: schema 필요
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
					data: "data"  // 서버 응답의 data 필드
				},
				serverFiltering: true
			};
		} else {
			// 로컬 데이터: schema 불필요
			dataSourceConfig = {
				data: normalizedData || []
			};
		}

		// ── kendoMultiSelect 초기화 ──
		$el.kendoMultiSelect({
			dataTextField,
			dataValueField,
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
	 *
	 * @param {string} id - 대상 요소 selector (예: "#win-detail") [필수]
	 *                      HTML 구조:
	 *                      <div id="win-detail">
	 *                          <div class="popup-content">윈도우 내용</div>
	 *                          <div class="popup-foot"><div class="btn-group">버튼들</div></div>
	 *                      </div>
	 *
	 * @param {Object} windowOptions - 윈도우 옵션 객체
	 *    - title: 윈도우 상단 제목 [필수]
	 *    - width: 너비 (px 또는 %) [선택] 기본값: '98%'
	 *      예: 500, '500px', '98%'
	 *    - height: 높이 (px 또는 %) [선택] 기본값: '98%'
	 *      예: 400, '400px', '98%', null (내용에 맞게 자동)
	 *    - onOpen: 윈도우 열릴 때 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e (윈도우 이벤트 객체)
	 *    - onClose: 윈도우 닫힐 때 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e (윈도우 이벤트 객체)
	 *    - modal: 배경 어둡게 처리 [선택] 기본값: true
	 *    - draggable: 드래그 이동 가능 [선택] 기본값: true
	 *    - resizable: 크기 조절 가능 [선택] 기본값: false
	 *    - visible: 생성 시 표시 여부 [선택] 기본값: false
	 *    - actions: 윈도우 액션 버튼 [선택] 기본값: ['Close']
	 *      예: ['Minimize', 'Maximize', 'Close']
	 *    - ...kendoOptions: 기타 kendo 옵션
	 *
	 * @example
	 * // 기본 사용
	 * kendoUi.createWindow("#win-detail", {
	 *     title: "상세 정보"
	 * });
	 *
	 * // 옵션 포함
	 * kendoUi.createWindow("#win-detail", {
	 *     title: "상세 정보",
	 *     width: 600,
	 *     height: 400,
	 *     onOpen: function(e) {
	 *         console.log("윈도우 열림");
	 *     },
	 *     onClose: function(e) {
	 *         console.log("윈도우 닫힘");
	 *     }
	 * });
	 *
	 * // 크기 조절 가능
	 * kendoUi.createWindow("#win-detail", {
	 *     title: "상세 정보",
	 *     width: '80%',
	 *     height: '80%',
	 *     resizable: true,
	 *     draggable: true
	 * });
	 *
	 * // 최소화, 최대화 버튼 포함
	 * kendoUi.createWindow("#win-detail", {
	 *     title: "상세 정보",
	 *     width: 500,
	 *     height: 500,
	 *     actions: ['Minimize', 'Maximize', 'Close']
	 * });
	 *
	 * // 윈도우 열기 / 닫기
	 * kendoUi.windowOpen("#win-detail");
	 * kendoUi.windowClose("#win-detail");
	 */
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
	 *
	 * @param {string} id - 대상 요소 selector (예: "#tree-menu") [필수]
	 *
	 * @param {Object} treeViewOptions - 트리 뷰 옵션 객체
	 *    - data: 트리 데이터 [필수]
	 *      예: [
	 *          { id: 1, text: "항목1", items: [...] },
	 *          { id: 2, text: "항목2", items: [...] }
	 *      ]
	 *    - checkboxes: 체크박스 표시 여부 [선택] 기본값: false
	 *      false → 체크박스 없음
	 *      true  → 체크박스 표시 (부모 체크 시 자식 일괄 체크)
	 *      또는 옵션 객체: { checkChildren: true }
	 *    - template: 템플릿 script 요소 selector [선택] 기본값: null
	 *      예: "#tmpl-tree" → <script id="tmpl-tree" type="text/x-kendo-template">
	 *          # <span>#: item.text #</span>
	 *      </script>
	 *    - onSelect: 노드 클릭 시 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e (이벤트 객체, e.node 로 선택된 노드 접근)
	 *    - onExpand: 노드 펼칠 때 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e (이벤트 객체)
	 *    - onCollapse: 노드 접을 때 실행할 콜백 함수 [선택] 기본값: null
	 *      콜백 파라미터: e (이벤트 객체)
	 *    - dragAndDrop: 드래그 앤 드롭 [선택] 기본값: true
	 *    - loadOnDemand: 필요할 때만 로드 [선택] 기본값: true
	 *    - allowDeleteNodes: 노드 삭제 버튼 활성화 [선택] 기본값: false
	 *      true일 경우 .kendo-icon, .telerik-icon 클릭으로 노드 삭제 가능
	 *    - ...kendoOptions: 기타 kendo 옵션
	 *
	 * @example
	 * // 기본 사용
	 * kendoUi.createTreeView("#tree-menu", {
	 *     data: treeData
	 * });
	 *
	 * // 체크박스 포함
	 * kendoUi.createTreeView("#tree-menu", {
	 *     data: treeData,
	 *     checkboxes: true
	 * });
	 *
	 * // 콜백 함수 포함
	 * kendoUi.createTreeView("#tree-menu", {
	 *     data: treeData,
	 *     checkboxes: true,
	 *     onSelect: function(e) {
	 *         console.log("선택 노드:", e.node.textContent);
	 *     },
	 *     onExpand: function(e) {
	 *         console.log("펼침:", e.node.textContent);
	 *     },
	 *     onCollapse: function(e) {
	 *         console.log("접음:", e.node.textContent);
	 *     }
	 * });
	 *
	 * // 템플릿 사용
	 * kendoUi.createTreeView("#tree-menu", {
	 *     data: treeData,
	 *     template: "#tmpl-tree",
	 *     checkboxes: true
	 * });
	 *
	 * // 노드 삭제 아이콘 활성화
	 * kendoUi.createTreeView("#tree-menu", {
	 *     data: treeData,
	 *     allowDeleteNodes: true,
	 *     onSelect: function(e) {
	 *         console.log("선택:", e.node.textContent);
	 *     }
	 * });
	 *
	 * // 템플릿 HTML 예시
	 * // <script id="tmpl-tree" type="text/x-kendo-template">
	 * //     # <span class="tree-item">#: item.text #</span>
	 * //     # if(item.hasDelete) { #
	 * //         <span class="kendo-icon">×</span>
	 * //     # } #
	 * // </script>
	 */
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
			treeView.setDataSource(new kendo.data.HierarchicalDataSource({ data: data }));
			return;
		}

		// ── 체크박스 옵션 정규화 ──
		let checkboxesOption = checkboxes;
		if (checkboxes === true) {
			checkboxesOption = { checkChildren: true };
		} else if (checkboxes === false) {
			checkboxesOption = false;
		}

		// ── 템플릿 처리 ──
		let templateOption = null;
		if (template) {
			const $template = $(template);
			if ($template.length) {
				templateOption = kendo.template($template.html());
			} else {
				console.warn(`[kendoUi] 템플릿 "${template}"을 찾을 수 없습니다.`);
			}
		}

		// ── kendoTreeView 초기화 ──
		$el.kendoTreeView({
			dataSource: {
				data: data
			},
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

		$(document).on("click", ".kendo-icon", function (e) {
			e.preventDefault();
			var treeview = $el.data("kendoTreeView");
			treeview.remove($(this).closest(".k-treeview-item"));
		});
		$(document).on("click", ".telerik-icon", function (e) {
			e.preventDefault();
			var treeview = $el.data("kendoTreeView");
			treeview.remove($(this).closest(".k-treeview-item"));
		});
	},

	/**
     * Grid (그리드)
     *
     * @param {string} id           - 대상 요소 id (예: "#grid")          [필수]
	 * @param {Object} gridOptions 
	 * @param {string} gridOptions.mid; - 메뉴ID [필수]
	 * @param {boolean|null} gridOptions.autoBind - 데이터 자동 반인딩여부, default true
	 * @param {idField} gridOptions.idField - 데이터셋의 ID, 없을 경우 rnum 을 자동셋팅
	 * @param {string|null} gridOptions.readUrl - 서버통신 시 조회URL [선택]
	 * @param {Function|null} gridOptions.readParamFun - 서버통신 시 조회를 사용할 경우 검색조건 [선택] 
	 *                                         {키: 조회방법, 키: 조회방법}  으로 구성
	 *                                         ex) { srchTxt: $('#srchTxt').val() }
	 * @param {Object|null} gridOptions.data2Nm     - 데이터2 객체를 저장할 변수명 [선택]
	 *                                              - 서버에서 받는 response 는 기본적으로 totalCOunt 와 data 이나 필요에 따라 data2 를 추가로 받을 경우 해당 값을 저장할 변수명
	 *                                              - 해당명은 안전성을 위해 객체내의 변수명으로 정의해서 사용
     * @param {Object|null} gridOptions.data        - 데이터 객체            [선택]
     * @param {number} gridOptions.data.totalCount  - 전체 데이터 건수
     * @param {Array}  gridOptions.data.items       - 실제 데이터 배열
     * @param {Array}  gridOptions.columns      - 컬럼 정의 배열               [필수]
     *                                       [{ field, title, width, type, template, ... }]
     * @param {number} gridOptions.pageSize     - 페이지당 표시 개수                   [선택] 기본값: 10
     * @param {boolean|null} gridOptions.selectable   - 체크박스 활성 true/false, default false
	 * @param {boolean|null} gridOptions.numbering   - No활성화, true/false, default false
     * @param {Array|null} gridOptions.toolbar      - 툴바 버튼 목록                       [선택] 기본값: null
     *                                       ['create']          → 추가 버튼
     *                                       ['excel']           → 엑셀 export 버튼
     *                                       ['create', 'excel'] → 둘 다
     * @param {Function|null} gridOptions.onDataBound  - 데이터 바인딩 후 실행할 콜백          [선택] 기본값: null
     *
     * @example — 기본
     * kendoUi.grid("#grid", dataObj, columns);
     *
     * @example — 전체 옵션
     * kendoUi.grid("#grid", dataObj, columns,
     *     20,                                             // pageSize
     *     'row',                                          // selectable
     *     ['create', 'excel'],                            // toolbar
     *     function(e) { console.log("데이터 바인딩 완료"); } // onDataBound
     * );
     */
	createGrid(id, gridOptions) {
		const $el = $(id);

		if (!$el.length) {
			console.warn(`[kendoUi] "${id}" 요소를 찾을 수 없습니다.`);
			return;
		}

		// 이미 그리드가 존재하면 파괴하고 새로 생성 (컬럼 변경 등 대응)
		const existingGrid = $el.data('kendoGrid');
		if (existingGrid) {
			existingGrid.destroy();
			$el.empty();
		}

		const gridId = $el.attr("id");
		const defaultPageSize = 30; // 기본페이지수

		// 로컬스토리지에 저장된 그리드 컬럼 숨김정보가 있는지 확인
		const gridHideColumns = window.localStorage.getItem(gridOptions.mid+'_grid');
		if(gridHideColumns != null) {
			const hideColumns = gridHideColumns.split(",");
			gridOptions.columns.forEach((item, idx) => {
				if(hideColumns.indexOf(item.field) >= 0) {
					item.hidden = true;
				}
			});
		}

		let dataSource = {};
		if (gridOptions.readUrl && gridOptions.readUrl !== "") {
			// 전달되는 data 가 DataSource
			dataSource.transport = {
				read: { url: gridOptions.readUrl, type:"POST", dataType: 'json' },
				parameterMap: (options, operation) => { return kendoUi.getParamterMap(options, operation, gridOptions.readParamFun) }
			};
			dataSource.serverPaging = true;
			dataSource.serverFiltering = true;
			dataSource.serverSorting = true;
			dataSource.error = function(e) {
				kbrainc.ui.handleAjaxError(e);
			};
		} else {
			dataSource.data = gridOptions.data;
			dataSource.serverPaging = false;
		}

		let schemaModelFieldKeyArr = [];
		let schemaModelFields = [];

		addSchemaModelField(gridOptions.columns);

		function addSchemaModelField(data) {
			if(data && data!= null && data.length > 0) {
				data.forEach(function(d, i) {
					let item = {};
					if(d.field && d.field.trim().length>0) {
						if(schemaModelFieldKeyArr.indexOf(d.field) > -1) return;

						item.field = d.field;
					
						let fieldType = d.type??'string';

						if(fieldType === 'date' || fieldType === 'datetime') {
							item.parse = function(value) {
								return value? new Date(value) : null;
							}
							if(fieldType === 'datetime') {
								d.format = '{0:yyyy-MM-dd HH:mm:ss}'; // 일시타입일 경우 기본포맷
							} else {
								d.format = '{0:yyyy-MM-dd}'; // 일자타입일 경우 기본포맷
							}

							fieldType = 'date';
						} else if(fieldType === 'number') {
                            if(!d.format) {
                                d.format = '{0:n0}'; // 기본값만 적용
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
		}

		dataSource.pageSize = gridOptions.pageSize??defaultPageSize;
		dataSource.schema = {
			total: 'totalCount',
			data:  'data',
			model: {
				// id 는 기본 rnum 에 특정 필드를 지정할 경우 해당 필드를 사용(1개만 가능)
				id: gridOptions.idField??'rnum',
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
		if(gridOptions.totaling !== false) {  // 조건 먼저 체크
			const label = gridOptions.totalTxt || '전체';
			toolbarTag = `<span class="grid-total"><strong>${label}</strong> (총 건수 <span id="${totalId}">0</span>)</span>`;
		}

		if(gridOptions.topButton) {
			toolbarTag += '<div class="btn-group">';
			toolbarTag += gridOptions.topButton;
			toolbarTag += '</div>';
		}

		let toolBarArray = toolbarTag ? [{ template: toolbarTag }] : undefined;

		// 체크박스 필드 활성화
		if(gridOptions.selectable) {
			const addColumn = {
				title: `<input type='checkbox' id='${gridId}_chk_all' class='k-checkbox' onclick='kendoUi.gridChkAllEvent(this);'><label for='${gridId}_chk_all'>`,
				filterable: false, // 필터제외
				sortable: false, // 정렬제외
				columnMenu: false, // 컬럼메뉴제외
				width: 42,
				attributes:{"class":"table-cell", style:"text-align:center"},
				template: `<input type='checkbox' id='${gridId}_chk_#:uid#' class='k-checkbox' name='CHK_OBJ' value="#: uid #" onclick='kendoUi.gridChkEvent(this);'>`
			};
			
			gridOptions.columns.unshift(addColumn);
		}
		// 번호 필드 활성화
		if(gridOptions.numbering) {
			const addColumn = {
				field: 'rnum',
				title: `번호`,
				filterable: false, // 필터제외
				sortable: false, // 정렬제외
				columnMenu: false, // 컬럼메뉴제외
				width: 75,
				attributes:{"class":"table-cell", style:"text-align:center"},
			};
			
			if(gridOptions.selectable) gridOptions.columns.splice(1, 0,addColumn);
			else gridOptions.columns.unshift(addColumn);
		}

		//console.log(gridOptions.columns);

		// console.log('gridOptions:', gridOptions);       // 넘어온 옵션 전체
		// console.log('dataSource.data:', dataSource.data); // data에 뭐가 들어갔는지
		// console.log('schema:', dataSource.schema);        // schema 확인

        // Debounce 타이머 변수 선언
        let gridResizeTimer = null;

		const gridResize = () => {
			const $grid = $(id);
			if (!$grid.length || !$grid.data("kendoGrid")) {
				$(window).off('resize.' + gridId);
				return;
			}

			if (gridOptions.height === false) {
				return;
			}

			let gridHeight = gridOptions.height;
			if (gridHeight === true || gridHeight === undefined || gridHeight === null) {
				const $gridContainer = $grid.closest('.sec, section, .search-area, article, .tab-content');
				const $tabContent = $grid.closest('.k-content'); // ★ 추가: 탭 content 체크
				let gridOffsetTop = $grid.offset().top;

				// 탭 안에 있거나 숨겨진 요소인 경우 offsetTop이 0일 수 있음
				if (gridOffsetTop === 0 && $gridContainer.length > 0) {
					// 가시적인 조상 요소로부터 계산 시도
					const $visibleParent = $grid.parents(':visible').first();
					if ($visibleParent.length > 0) {
						gridOffsetTop = $grid.offset().top || ($gridContainer.offset().top + ($gridContainer.outerHeight() - $gridContainer.height()) / 2);
					}
				}

				const windowHeight = $(window).height();
				let bottomPadding = 50;

				$grid.nextAll(':visible').each(function() {
					bottomPadding += $(this).outerHeight(true);
				});

				if ($gridContainer.length > 0) {
					bottomPadding += parseInt($gridContainer.css('padding-bottom')) || 0;
				}

				// ★ 개선: 탭 content 높이도 고려
				if ($tabContent.length > 0) {
					const tabContentHeight = $tabContent.height() || 0;
					// 탭 내부에서는 탭 content의 높이 기준으로 계산
					const contentPadding = parseInt($tabContent.css('padding-bottom')) || 0;
					gridHeight = Math.max(tabContentHeight - $grid.position().top - contentPadding - 20, 150);
				} else {
					gridHeight = windowHeight - gridOffsetTop - bottomPadding;
				}

                console.log('gridHeight:', gridHeight);

				if (gridHeight < 200) gridHeight = 200;
			}
			
			const gridInstance = $grid.data("kendoGrid");
			if (gridInstance && gridInstance.element && gridInstance.element.length > 0) {
				try {
					if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
						const $wrapper = gridInstance.wrapper;
						
						// ★ 수정 1: Kendo의 내부 옵션도 함께 변경
						gridInstance.options.height = gridHeight;
						
						// ★ 수정 2: !important로 강제 적용 (CSS 우선순위 최대화)
						$wrapper.attr('style', 'height: ' + gridHeight + 'px !important; box-sizing: border-box;');
						
						// ★ 수정 3: 내부 요소들의 높이도 명시적으로 계산
						const $toolbar = $wrapper.find('> .k-grid-toolbar');
						const $pager = $wrapper.find('> .k-grid-pager');
						const $header = $wrapper.find('> .k-grid-header');
						
						let toolbarHeight = 0;
						let pagerHeight = 0;
						let headerHeight = 0;
						
						if ($toolbar.length > 0) {
							toolbarHeight = $toolbar.outerHeight(true) || 0;
						}
						if ($pager.length > 0) {
							pagerHeight = $pager.outerHeight(true) || 0;
						}
						if ($header.length > 0) {
							headerHeight = $header.outerHeight(true) || 0;
						}
						
						const contentHeight = Math.max(gridHeight - toolbarHeight - pagerHeight - headerHeight, 150);
						
						// ★ 수정 4: content 높이도 !important로 강제 적용
						const $content = $wrapper.find('> .k-grid-content');
						if ($content.length > 0) {
							$content.attr('style', 'height: ' + contentHeight + 'px !important; max-height: ' + contentHeight + 'px !important; overflow-y: auto !important;');
						}
						
						console.log('[kendoUi] Grid Height Resize:', {
							wrapper: gridHeight,
							content: contentHeight,
							toolbar: toolbarHeight,
							header: headerHeight,
							pager: pagerHeight,
                            id: id
						});
					}
					
					// ★ 수정 5: resize 호출 (Kendo 내부 레이아웃 재계산)
					if (gridInstance.resize) {
						gridInstance.resize();
					}
				} catch (e) {
					console.warn("[kendoUi] gridResize error:", e);
					$(window).off('resize.' + gridId);
				}
			}
		};

		// 윈도우 리사이즈 이벤트 바인딩 (네임스페이스 사용)
		// ★ 개선 3: Debounce 적용하여 성능 최적화 (resize 이벤트 최소화)
        if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
            $(window).off('resize.' + gridId).on('resize.' + gridId, function() {
                // 이전 타이머 제거
                if (gridResizeTimer) {
                    clearTimeout(gridResizeTimer);
                }
                // 200ms 후에 resize 함수 실행
                gridResizeTimer = setTimeout(function() {
                    gridResize();
                    gridResizeTimer = null;
                }, 200);
            });
        }

		$el.kendoGrid({
			autoBind: (gridOptions.autoBind??true),
			dataSource: dataSource,
			columns: gridOptions.columns,
			// rowTemplate / altRowTemplate: 레코드 1건을 <tr> 여러 개(예: 메인행+상세행)로 렌더링해야 할 때 사용
			...(gridOptions.rowTemplate && { rowTemplate: gridOptions.rowTemplate }),
			...(gridOptions.altRowTemplate && { altRowTemplate: gridOptions.altRowTemplate }),
			filterable: gridOptions.filterable !== undefined ? gridOptions.filterable : true,
			sortable: gridOptions.sortable !== undefined ? gridOptions.sortable : true,
			reorderable: gridOptions.reorderable !== undefined ? gridOptions.reorderable : {},
			resizable: true,
			width: '100%',
			height: (function() {
				if (gridOptions.height === false) return null;
				let gridHeight = gridOptions.height;
				if (gridHeight === true || gridHeight === undefined || gridHeight === null) {
					const $gridContainer = $el.closest('.sec, section, .search-area, article, .tab-content');
					let gridOffsetTop = $el.offset().top;

					// 탭 안에 있거나 숨겨진 요소인 경우 offsetTop이 0일 수 있음
					if (gridOffsetTop === 0 && $gridContainer.length > 0) {
						// 가시적인 조상 요소로부터 계산 시도
						const $visibleParent = $el.parents(':visible').first();
						if ($visibleParent.length > 0) {
							gridOffsetTop = $el.offset().top || ($gridContainer.offset().top + ($gridContainer.outerHeight() - $gridContainer.height()) / 2);
						}
					}

					const windowHeight = $(window).height();
					let bottomPadding = 50; // 하단 여백

					// 그리드 뒤에 오는 형제 요소들의 높이를 합산
					$el.nextAll(':visible').each(function() {
						bottomPadding += $(this).outerHeight(true);
					});

					// 부모 컨테이너의 padding-bottom 고려
					if ($gridContainer.length > 0) {
						bottomPadding += parseInt($gridContainer.css('padding-bottom')) || 0;
					}

					// k-grid-toolbar가 있는 경우 높이 계산에 포함
					const $toolbar = $el.find('.k-grid-toolbar');
					if ($toolbar.length > 0) {
						bottomPadding += $toolbar.outerHeight(true);
					}

					gridHeight = windowHeight - gridOffsetTop - bottomPadding;
					if (gridHeight < 200) gridHeight = 200;
				}
				return gridHeight;
			})(),
			...(toolBarArray && { toolbar: toolBarArray }),
			columnMenu: gridOptions.columnMenu !== false ? {
				componentType: "modern",
				columns: true,
				filterable: true,
				sortable: false
			} : false,
			columnMenuInit: function(e) {
				//console.log('columnMenuInit', e);
				if(gridOptions.selectable) {
					// 체크박스는 컬럼보기에서 제외처리
					const columnsMenu = e.container.find(".k-column-list-item");
					//console.log('columnsMenu', columnsMenu);
					// 필드 제거
        			columnsMenu.eq(0).remove();
				}
			},
			...(gridOptions.pageable !== false && {
				pageable: {
					refresh: false,
					pageSizes: (gridOptions.pageSize === 30) ? [30, 50, 100, 300, 500] : ((gridOptions.pageSize === 10) ? [10, 30, 100] : [10, 50, 100, 500]),
					buttonCount: 10,
					previousNext: true,
				}
			}),
			selectable: 'row',
			noRecords: { template: "<div class='no-data-cont'><p>검색 된 결과가 없습니다.</p></div>" },
			// noRecords: {
			// 	template: gridOptions.noRecords
			// 		? `<div class='no-data-cont'><p>${gridOptions.noRecords}</p></div>`
			// 		: "<div class='no-data-cont'><p>검색 된 결과가 없습니다.</p></div>"
			// },
			dataBound: function(e) {
				const self = this;
				//console.log('dataBound event totalId :: ', totalId);
				//console.log('dataBound event :: ', self);
				// 현재페이지의 최대 레코드값 계산
				const total = self.dataSource.total();
				//console.log('dataBound event dataSource :: ', self.dataSource);
				//console.log('dataBound event total :: ', total);
				// 전체검색수
				$(`#${totalId}`).text(total);

				// a 태그 클릭 시 행 선택 효과 추가
				self.tbody.off('click', 'a').on('click', 'a', function(clickEvent) {
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
				
				// ★ 추가: 데이터 바인딩 완료 후 grid resize 실행
				if (gridOptions.height === true || gridOptions.height === undefined || gridOptions.height === null) {
					setTimeout(function() {
						gridResize();
					}, 100);
				}
				
				if (typeof gridOptions.dataBound === "function") {
					gridOptions.dataBound(e);
				}

				// 데이터조회완료 후 이벤트가 있을 경우 처리
				if (typeof gridOptions.onDataBound === 'function') gridOptions.onDataBound(e);
			},
			destroy: function() {
				// 그리드 파괴 시 리사이즈 핸들러 자동 제거
				$(window).off('resize.' + gridId);
				// debounce 타이머도 제거
				if (gridResizeTimer) {
					clearTimeout(gridResizeTimer);
					gridResizeTimer = null;
				}
			}
		});

		const tmpGrid = $(id).data('kendoGrid');
		tmpGrid.bind('columnShow', (e) => {
			const fieldNm = e.column.field;
			const gridHideColumns = window.localStorage.getItem(gridOptions.mid+'_grid');
			let localSaveHideColumns = [];
			if(gridHideColumns != null) {
				const hideColumns = gridHideColumns.split(",");
				localSaveHideColumns = hideColumns.filter((item) => { return item.indexOf(fieldNm) < 0 });
			}
			window.localStorage.setItem(gridOptions.mid+'_grid', localSaveHideColumns.join());
		});
		tmpGrid.bind('columnHide', (e) => {
			const fieldNm = e.column.field;
			const gridHideColumns = window.localStorage.getItem(gridOptions.mid+'_grid');
			let localSaveHideColumns = [];
			if(gridHideColumns != null) {
				localSaveHideColumns = gridHideColumns.split(",");
				if(localSaveHideColumns.indexOf(fieldNm) < 0 ) {
					localSaveHideColumns.push(fieldNm);
				}
			}
			window.localStorage.setItem(gridOptions.mid+'_grid', localSaveHideColumns.join());
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

	// 서버전송을 위해 데이터소스에서 파라메터 추출
	// 추가파라메터 전달이 필요할 경우 return 된 Object 에 추가하여 전송
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
								// 날짜형일경우, yyyy-MM-dd 만 추출하여 toStirng변환
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
							// 날짜형일경우, yyyy-MM-dd 만 추출하여 toStirng변환
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
					console.warn('readParamFun race — using empty params:', e);
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
		// 개별 체크박스가 disabled 인 row 는 전체선택/해제 대상에서 제외한다.
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
			// disabled row 는 선택 강조 상태도 변경하지 않는다.
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
		//console.log($el);

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
			// 검색조건과 필터를 유지해서 재조회
			$(gridId).data("kendoGrid").dataSource.read();
		} else {
			// 필터초기화 및 1페이지로 재조회
			$(gridId).data("kendoGrid").dataSource.query({
				page: 1,
				pageSize: pageSize,
				filter: {},
				sort: []
			});
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

