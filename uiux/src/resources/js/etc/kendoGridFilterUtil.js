/**
 * KendoGridFilter — Kendo Grid 헤더 필터 UI 공통 유틸리티
 *
 * 화면명   : (공통) Kendo Grid 헤더 필터 팩토리
 * 설명     : 기관 다중선택·텍스트·Y/N 버튼·진도율 버튼 등 반복되는
 *            헤더 필터 UI 함수를 페이지에서 분리해 재사용한다.
 * 의존성   : jQuery, Kendo UI
 * 로드순서 : kendoComponentUtil.js 이후
 *
 * ────────────────────────────────────────────────────────────────
 * [사용 예시]
 *
 *  // 1. 페이지 상단에 필터 상태 객체 선언
 *  var myPage_filter = {
 *      cdInstcList:   [],  // 전체 기관 목록 (API 로드 후 in-place 채움)
 *      cdInstcVlList: [],  // 선택된 기관 값 목록
 *      prgrsRtList:   []   // 선택된 진도율 값 목록 (정수)
 *  };
 *
 *  // 2. Kendo Grid 컬럼 filterable.ui 에 팩토리 함수를 사용
 *  columns = [
 *      { field: 'cdInstcNm',  filterable: { extra: false, ui: KendoGridFilter.instcUi(myPage_filter) } },
 *      { field: 'jbgdNm',     filterable: { extra: false, ui: KendoGridFilter.textUi(),
 *                                           operators: { string: { contains: "포함" } } } },
 *      { field: 'mailSndngYn', filterable: { extra: false, ui: KendoGridFilter.ynUi('sndng') } },
 *      { field: 'evalYn',     filterable: { extra: false, ui: KendoGridFilter.ynUi('yn') } },
 *      { field: 'prgrsRt',    filterable: { extra: false, ui: KendoGridFilter.prgrsRtUi(myPage_filter) } },
 *  ];
 *
 *  // 3. 그리드 생성 후 filterMenuOpen 이벤트 일괄 바인딩
 *  KendoGridFilter.bindFilterMenuOpen('#myGrid', myPage_filter, {
 *      instcField:    'cdInstcNm',
 *      textFields:    ['jbgdNm', 'userNm'],
 *      ynSndngFields: ['mailSndngYn', 'pushSndngYn', 'talkSndngYn'],
 *      ynValueFields: ['evalYn', 'srvyYn'],
 *      prgrsRtField:  'prgrsRt'
 *      // 사용하지 않는 항목은 생략 가능
 *  });
 *
 *  // 4. 검색 초기화 시
 *  myPage_filter.cdInstcVlList.splice(0);
 *  myPage_filter.prgrsRtList.splice(0);
 * ────────────────────────────────────────────────────────────────
 */
//console.log('[KendoGridFilter] 파일 로드됨 v2');
const KendoGridFilter = (function () {
	'use strict';

	// ── 내부 헬퍼 ────────────────────────────────────────────────────────────

	/**
	 * 배열을 in-place 로 비운다.
	 * = [] 로 재할당하면 외부에서 캡처된 참조가 끊어지므로 반드시 splice 사용.
	 * @param {Array} arr
	 */
	function clearArray(arr) {
		arr.splice(0, arr.length);
	}

	/**
	 * 배열을 in-place 로 새 값으로 대체한다.
	 * @param {Array} arr       대상 배열
	 * @param {Array} newValues 새 값 배열
	 */
	function replaceArray(arr, newValues) {
		clearArray(arr);
		for (var i = 0; i < newValues.length; i++) {
			arr.push(newValues[i]);
		}
	}

	// ── 1. 기관 다중선택 필터 UI ─────────────────────────────────────────────

	/**
	 * 기관 다중선택 체크박스 필터 UI 팩토리.
	 * Kendo filterable.ui 콜백으로 사용한다.
	 *
	 * @param {Object} state                  페이지 스코프 필터 상태 객체
	 * @param {Array}  state.cdInstcList      전체 기관 목록 [{text, value}, ...]
	 * @param {Array}  state.cdInstcVlList    현재 선택된 기관 value 목록
	 * @returns {Function} Kendo filterable.ui 콜백 함수
	 */
	function instcUi(state) {
		return function (element) {
			element.hide();

			var list     = state.cdInstcList   || [];
			var selVl    = state.cdInstcVlList || [];
			var total    = list.length;
			var selCnt   = selVl.length;
			var allChked = selCnt === total && total > 0;

			/* 전체 컨테이너 */
			var $wrap = $('<div class="instc-filter-wrap"></div>');

			/* 전체 선택 행 (프로젝트 표준 .check-box 컴포넌트) */
			var $allRow = $('<span class="check-box instc-filter-all"></span>').css({
				display: 'block', padding: '6px 0',
				borderBottom: '1px solid #ddd'
			});
			var $allChk = $('<input type="checkbox" id="instcChkAll" class="instc-chk-all">')
				.prop('checked', allChked);
			var $allLbl = $('<label for="instcChkAll"></label>')
				.append('<span class="check"></span>')
				.append($('<span style="font-weight:bold;"></span>').text('전체 선택'));
			$allRow.append($allChk).append($allLbl);
			$wrap.append($allRow);

			/* 항목 목록 (스크롤) */
			var $list = $('<div class="instc-filter-list"></div>').css({
				maxHeight: '200px', overflowY: 'auto', padding: '4px 0'
			});
			list.forEach(function (item) {
				var checked = selVl.indexOf(item.value) !== -1;
				var cid     = 'instcChk_' + item.value;
				var $row    = $('<span class="check-box"></span>').css({
					display: 'block', padding: '4px 0'
				});
				var $chk = $('<input type="checkbox" class="instc-chk">')
					.attr('id', cid).val(item.value).prop('checked', checked);
				var $lbl = $('<label></label>').attr('for', cid)
					.append('<span class="check"></span>')
					.append($('<span></span>').text(item.text));
				$row.append($chk).append($lbl);
				$list.append($row);
			});
			$wrap.append($list);

			/* 선택 카운터 */
			var $count = $('<div class="instc-filter-count"></div>').css({
				padding: '6px 0 2px', fontSize: '12px',
				color: '#666', borderTop: '1px solid #ddd'
			}).text(selCnt + '개 선택');
			$wrap.append($count);

			/* 전체선택 체크박스 이벤트 */
			$allChk.on('change', function () {
				var isAll = $(this).is(':checked');
				$list.find('.instc-chk').prop('checked', isAll);
				$count.text((isAll ? total : 0) + '개 선택');
			});
			/* 개별 체크박스 이벤트 */
			$wrap.on('change', '.instc-chk', function () {
				var cnt = $list.find('.instc-chk:checked').length;
				$allChk.prop('checked', cnt === total && total > 0);
				$count.text(cnt + '개 선택');
			});

			$wrap.insertAfter(element);
		};
	}

	// ── 2. 범용 목록 다중선택 필터 UI ───────────────────────────────────────

	/**
	 * 범용 목록 체크박스 다중선택 필터 UI 팩토리.
	 * instcUi 와 동일한 구조이나 상태 키를 호출 측에서 지정한다.
	 * data-vlkey 속성으로 같은 그리드에 복수의 list 필터 공존 가능.
	 *
	 * @param {Object} state    페이지 스코프 필터 상태 객체
	 * @param {string} listKey  state 에서 전체 목록을 가리키는 키 [{text, value}, ...]
	 * @param {string} vlKey    state 에서 선택된 값 배열을 가리키는 키
	 * @returns {Function} Kendo filterable.ui 콜백 함수
	 */
	function listUi(state, listKey, vlKey) {
		return function (element) {
			element.hide();
			var list   = state[listKey] || [];
			var selVl  = state[vlKey]   || [];
			var total  = list.length;
			var selCnt = selVl.length;

			var $wrap = $('<div class="list-filter-wrap"></div>');

			/* 전체 선택 행 */
			var $allRow = $('<span class="check-box list-filter-all"></span>').css({
				display: 'block', padding: '6px 0', borderBottom: '1px solid #ddd'
			});
			var $allChk = $('<input type="checkbox" class="list-chk-all">')
				.attr('data-vlkey', vlKey)
				.prop('checked', selCnt === 0 || selCnt === total);
			var $allLbl = $('<label></label>')
				.append('<span class="check"></span>')
				.append($('<span style="font-weight:bold;"></span>').text('전체 선택'));
			$allRow.append($allChk).append($allLbl);
			$wrap.append($allRow);

			/* 항목 목록 (스크롤) */
			var $list = $('<div class="list-filter-list"></div>').css({
				maxHeight: '200px', overflowY: 'auto', padding: '4px 0'
			});
			list.forEach(function (item) {
				var checked = selVl.length === 0 || selVl.indexOf(item.value) !== -1;
				var cid     = 'listChk_' + vlKey + '_' + item.value;
				var $row    = $('<span class="check-box"></span>').css({ display: 'block', padding: '4px 0' });
				var $chk    = $('<input type="checkbox" class="list-filter-chk">')
					.attr({ id: cid, 'data-vlkey': vlKey })
					.val(item.value).prop('checked', checked);
				var $lbl    = $('<label></label>').attr('for', cid)
					.append('<span class="check"></span>')
					.append($('<span></span>').text(item.text));
				$row.append($chk).append($lbl);
				$list.append($row);
			});
			$wrap.append($list);

			/* 선택 카운터 */
			var $count = $('<div class="list-filter-count"></div>').css({
				padding: '6px 0 2px', fontSize: '12px', color: '#666', borderTop: '1px solid #ddd'
			}).text(selCnt + '개 선택');
			$wrap.append($count);

			/* 전체선택 체크박스 이벤트 */
			$allChk.on('change', function () {
				var isAll = $(this).is(':checked');
				$list.find('.list-filter-chk[data-vlkey="' + vlKey + '"]').prop('checked', isAll);
				$count.text((isAll ? total : 0) + '개 선택');
			});
			/* 개별 체크박스 이벤트 */
			$wrap.on('change', '.list-filter-chk[data-vlkey="' + vlKey + '"]', function () {
				var cnt = $list.find('.list-filter-chk[data-vlkey="' + vlKey + '"]:checked').length;
				$allChk.prop('checked', cnt === total && total > 0);
				$count.text(cnt + '개 선택');
			});

			$wrap.insertAfter(element);
		};
	}

	// ── 3. 범용 목록 단일선택(라디오) 필터 UI ──────────────────────────────

	/**
	 * 범용 목록 라디오버튼 단일선택 필터 UI 팩토리.
	 * instcUi 와 동일한 구조이나 checkbox → radio 로 단일선택을 강제한다.
	 *
	 * @param {Object} state    페이지 스코프 필터 상태 객체
	 * @param {string} listKey  state 에서 전체 목록을 가리키는 키 [{text, value}, ...]
	 * @param {string} vlKey    state 에서 선택된 단일 값 문자열을 가리키는 키
	 * @returns {Function} Kendo filterable.ui 콜백 함수
	 */
	function singleUi(state, listKey, vlKey) {
		return function (element) {
			element.hide();

			var list  = state[listKey] || [];
			var curVl = state[vlKey]   || '';
			var rdoNm = 'singleRdo_' + vlKey;

			var $wrap = $('<div class="single-filter-wrap"></div>');

			/* 전체(초기화) 라디오 행 */
			var $allRow = $('<span class="radio-box single-filter-all"></span>').css({
				display: 'block', padding: '6px 0', borderBottom: '1px solid #ddd'
			});
			var allId   = rdoNm + '_all';
			var $allRdo = $('<input type="radio" class="single-rdo">').attr({ name: rdoNm, id: allId }).val('').prop('checked', curVl === '');
			var $allLbl = $('<label></label>').attr('for', allId)
				.append('<span class="check"></span>')
				.append($('<span style="font-weight:bold;"></span>').text('전체'));
			$allRow.append($allRdo).append($allLbl);
			$wrap.append($allRow);

			/* 항목 목록 (스크롤) */
			var $list = $('<div class="single-filter-list"></div>').css({
				maxHeight: '200px', overflowY: 'auto', padding: '4px 0'
			});
			list.forEach(function (item) {
				var rId  = rdoNm + '_' + item.value;
				var $row = $('<span class="radio-box"></span>').css({ display: 'block', padding: '4px 0' });
				var $rdo = $('<input type="radio" class="single-rdo">').attr({ name: rdoNm, id: rId }).val(item.value).prop('checked', item.value === curVl);
				var $lbl = $('<label></label>').attr('for', rId)
					.append('<span class="check"></span>')
					.append($('<span></span>').text(item.text));
				$row.append($rdo).append($lbl);
				$list.append($row);
			});
			$wrap.append($list);

			$wrap.insertAfter(element);
		};
	}

	// ── 4. 텍스트 입력 필터 UI ──────────────────────────────────────────────

	/**
	 * 텍스트 입력 필터 UI 팩토리 (직급명·성명 등 contains 검색에 사용).
	 * @returns {Function} Kendo filterable.ui 콜백 함수
	 */
	function textUi() {
		return function (element) {
			element.css({
				border: '1px solid #ccc', borderRadius: '2px',
				padding: '4px 6px', width: '100%', boxSizing: 'border-box'
			});
			element.after(
				'<span style="color:red;font-size:11px;display:block;margin-top:2px;">※ 필수항목입니다.</span>'
			);
		};
	}

	// ── 4. Y/N 드롭다운 + 버튼 그룹 필터 UI ────────────────────────────────

	/**
	 * Y/N 드롭다운 필터 UI 팩토리.
	 * filterMenuOpen 핸들러가 이 드롭다운 값을 읽어 버튼 그룹으로 교체한다.
	 *
	 * @param {string} mode  'sndng' → 가능/불가 레이블 | 'yn' → Y/N 레이블
	 * @returns {Function}   Kendo filterable.ui 콜백 함수
	 */
	function ynUi(mode) {
		var isSndng = (mode === 'sndng');
		var options = isSndng
			? [{ text: '가능', value: 'Y' }, { text: '불가', value: 'N' }]
			: [{ text: 'Y',    value: 'Y' }, { text: 'N',   value: 'N' }];

		return function (element) {
			element.addClass('yn-filter-input');
			element.kendoDropDownList({
				dataSource:     options,
				dataTextField:  'text',
				dataValueField: 'value',
				optionLabel:    '전체'
			});
		};
	}

	// ── 5. 진도율 다중선택 버튼 그룹 필터 UI ───────────────────────────────

	/**
	 * 진도율 10%~100% 그리드 버튼 필터 UI 팩토리.
	 * @param {Object}         state              페이지 스코프 필터 상태 객체
	 * @param {Array<number>}  state.prgrsRtList  현재 선택된 진도율 값 목록 (정수)
	 * @returns {Function}  Kendo filterable.ui 콜백 함수
	 */
	function prgrsRtUi(state) {
		return function (element) {
			element.hide();

			var selected = state.prgrsRtList || [];
			var $btnWrap = $('<div class="prgrs-filter-wrap"></div>').css({
				display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
				gap: '4px', padding: '4px 0 8px 0', width: '100%'
			});

			for (var v = 10; v <= 100; v += 10) {
				var active = selected.indexOf(v) !== -1;
				$('<button type="button" class="prgrs-btn' + (active ? ' active' : '') + '">')
					.text(v + '%').val(v)
					.css({
						padding: '4px 0', fontSize: '12px', border: '1px solid #ccc',
						cursor: 'pointer', textAlign: 'center',
						background: active ? '#333' : '#fff',
						color:      active ? '#fff' : ''
					})
					.appendTo($btnWrap);
			}

			$btnWrap.on('click', '.prgrs-btn', function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active').css({ background: '#fff', color: '' });
				} else {
					$(this).addClass('active').css({ background: '#333', color: '#fff' });
				}
			});

			$btnWrap.insertAfter(element);
		};
	}

	// ── 6. filterMenuOpen 일괄 바인딩 ───────────────────────────────────────

	/**
	 * Y/N 버튼 그룹을 필터 팝업 컨테이너에 주입하는 내부 함수.
	 * @param {jQuery} $container   Kendo 필터 팝업 컨테이너
	 * @param {Array}  options      [{t: 표시텍스트, v: 값}, ...]
	 * @param {string} [initialValue] 팝업 재오픈 시 복원할 선택값 (state[field] 전달)
	 */
	function _buildYnButtonGroup($container, options, initialValue) {
		$container.find('.k-filter-help-text').hide();
		$container.find('.k-dropdownlist').eq(0).hide();
		$container.find('.k-dropdownlist').eq(1).hide();

		var curVal = (initialValue !== undefined) ? initialValue : '';
		$container.find('.yn-btn-group').remove();

		var $group = $('<div class="yn-btn-group"></div>').css({
			display: 'flex', gap: '4px', padding: '4px 0 8px 0', width: '100%'
		});
		// 선택된 값을 $group.data 에 직접 보관 (DDL 의존 제거)
		$group.data('ynValue', curVal);

		options.forEach(function (o) {
			var active = (o.v === curVal) || (o.v === '' && curVal === '');
			$('<button type="button" class="yn-btn">').text(o.t).data('v', o.v)
				.css({
					padding: '5px 0', fontSize: '12px', border: '1px solid #ccc',
					cursor: 'pointer', flex: '1', textAlign: 'center',
					background: active ? '#333' : '#fff',
					color:      active ? '#fff' : ''
				})
				.appendTo($group);
		});

		$group.on('click', '.yn-btn', function () {
			$group.find('.yn-btn').css({ background: '#fff', color: '' });
			$(this).css({ background: '#333', color: '#fff' });
			$group.data('ynValue', $(this).data('v')); // 선택값 직접 저장
		});

		var $actions = $container.find('.k-actions').first();
		if ($actions.length) { $actions.before($group); } else { $container.append($group); }
	}

	/**
	 * Y/N 필터 팝업의 [필터 적용] / [초기화] 버튼에 커스텀 mousedown 핸들러를 바인딩한다.
	 * Kendo 표준 filter() 메커니즘을 우회하여 filterSql 생성을 막고,
	 * 선택값을 state[field] 에 저장한 뒤 grid.dataSource.read() 를 직접 호출한다.
	 *
	 * state 객체에 field 프로퍼티가 선언되어 있을 때만 동작한다 (옵트인).
	 *
	 * @param {jQuery} $container  Kendo 필터 팝업 컨테이너
	 * @param {string} field       필드명 (e.field)
	 * @param {Object} state       페이지 스코프 필터 상태 객체
	 * @param {Object} grid        Kendo Grid 위젯
	 */
	function _bindYnFilterMenuButtons($container, field, state, grid) {
		if (!Object.prototype.hasOwnProperty.call(state, field)) { return; }

		/* [필터 적용] — $group.data('ynValue') 에서 직접 읽음 */
		$container.find('.k-button-solid-primary')
			.off('mousedown.yn')
			.on('mousedown.yn', function () {
				var val = $container.find('.yn-btn-group').data('ynValue');
				state[field] = (val !== undefined) ? val : '';
				setTimeout(function () { grid.dataSource.read(); }, 0);
			});

		/* [초기화] — k-rounded-md 로 드롭다운 화살표 버튼 제외 */
		$container.find('.k-button-solid-base.k-rounded-md')
			.off('mousedown.yn')
			.on('mousedown.yn', function () {
				state[field] = '';
				setTimeout(function () { grid.dataSource.read(); }, 0);
			});
	}

	/**
	 * 그리드에 filterMenuOpen 이벤트 핸들러를 일괄 바인딩한다.
	 *
	 * @param {string} gridSelector   Kendo Grid jQuery 선택자 (예: '#myGrid')
	 * @param {Object} state          페이지 스코프 필터 상태 객체
	 * @param {Object} fieldMap       필드명 매핑 (사용하지 않는 항목은 생략 가능)
	 * @param {string}         [fieldMap.instcField]      기관 다중선택 필드명
	 * @param {Array<string>}  [fieldMap.textFields]      텍스트 입력 필터 필드명 목록
	 * @param {Array<string>}  [fieldMap.ynSndngFields]   가능/불가 YN 버튼 필드명 목록
	 * @param {Array<string>}  [fieldMap.ynValueFields]   Y/N 버튼 필터 필드명 목록
	 * @param {string}         [fieldMap.prgrsRtField]    진도율 다중선택 필드명
	 */
	function bindFilterMenuOpen(gridSelector, state, fieldMap) {
		var grid = $(gridSelector).data('kendoGrid');
		if (!grid) {
			console.warn('[KendoGridFilter] 그리드를 찾을 수 없습니다: ' + gridSelector);
			return;
		}

		var instcField        = fieldMap.instcField        || '';
		var textFields        = fieldMap.textFields        || [];
		var ynSndngFields     = fieldMap.ynSndngFields     || [];
		var ynValueFields     = fieldMap.ynValueFields     || [];
		var prgrsRtField      = fieldMap.prgrsRtField      || '';
		var listFilterFields  = fieldMap.listFilterFields  || [];
		var singleListFields  = fieldMap.singleListFields  || [];

		grid.bind('filterMenuOpen', function (e) {

			/* ── 기관 다중선택 ──────────────────────────────────────── */
			if (instcField && e.field === instcField) {
				e.container.find('.k-filter-help-text').hide();
				e.container.find('span.k-dropdownlist').eq(0).hide();

				/* [필터 적용] 버튼 */
				var $applyBtn = e.container.find('.k-button-solid-primary');
				console.log('[KendoGridFilter] instc - .k-button-solid-primary count:', $applyBtn.length);
				$applyBtn
					.off('mousedown.instc')
					.on('mousedown.instc', function () {
						console.log('[KendoGridFilter] instc mousedown FIRED');
						var newVl = e.container.find('.instc-chk:checked')
							.map(function () { return $(this).val(); })
							.get();
						replaceArray(state.cdInstcVlList, newVl);
						// 기관 필드는 Kendo 필터식이 비어 apply 만으로는 read 미트리거 → 명시 재조회
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});

				/* [초기화] 버튼 — k-rounded-md 로 드롭다운 화살표 버튼 제외 */
				e.container.find('.k-button-solid-base.k-rounded-md')
					.off('mousedown.instc')
					.on('mousedown.instc', function () {
						clearArray(state.cdInstcVlList);
						e.container.find('.instc-filter-all input[type="checkbox"]').prop('checked', false);
						e.container.find('.instc-chk').prop('checked', false);
						e.container.find('.instc-filter-count').text('0개 선택');
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});
			}

			/* ── 범용 목록 다중선택 ─────────────────────────────────── */
			var lf = listFilterFields.filter(function (x) { return x.field === e.field; })[0];
			if (lf) {
				e.container.find('.k-filter-help-text').hide();
				e.container.find('span.k-dropdownlist').eq(0).hide();

				e.container.find('.k-button-solid-primary')
					.off('mousedown.lf')
					.on('mousedown.lf', function () {
						var checked = e.container
							.find('.list-filter-chk[data-vlkey="' + lf.vlKey + '"]:checked')
							.map(function () { return $(this).val(); }).get();
						replaceArray(state[lf.vlKey], checked);
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});

				e.container.find('.k-button-solid-base.k-rounded-md')
					.off('mousedown.lf')
					.on('mousedown.lf', function () {
						clearArray(state[lf.vlKey]);
						e.container.find('.list-filter-chk[data-vlkey="' + lf.vlKey + '"]').prop('checked', false);
						e.container.find('.list-chk-all[data-vlkey="' + lf.vlKey + '"]').prop('checked', true);
						e.container.find('.list-filter-count').text('0개 선택');
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});
			}

			/* ── 범용 목록 단일선택(라디오) ────────────────────────── */
			var sf = singleListFields.filter(function (x) { return x.field === e.field; })[0];
			if (sf) {
				e.container.find('.k-filter-help-text').hide();
				e.container.find('span.k-dropdownlist').eq(0).hide();

				var rdoNm = 'singleRdo_' + sf.vlKey;
				e.container.find('.k-button-solid-primary')
					.off('mousedown.sf')
					.on('mousedown.sf', function () {
						var val = e.container.find('input[name="' + rdoNm + '"]:checked').val();
						state[sf.vlKey] = (val !== undefined) ? val : '';
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});

				e.container.find('.k-button-solid-base.k-rounded-md')
					.off('mousedown.sf')
					.on('mousedown.sf', function () {
						state[sf.vlKey] = '';
						e.container.find('input[name="' + rdoNm + '"][value=""]').prop('checked', true);
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});
			}

			/* ── 텍스트 입력 (연산자 드롭다운 숨김) ────────────────── */
			if (textFields.length && textFields.indexOf(e.field) !== -1) {
				e.container.find('.k-filter-help-text').hide();
				e.container.find('span.k-dropdownlist').first().hide();
			}

			/* ── 가능/불가 YN 버튼 그룹 ────────────────────────────── */
			if (ynSndngFields.length && ynSndngFields.indexOf(e.field) !== -1) {
				// state[field] 값을 initialValue 로 전달해 팝업 재오픈 시 선택 상태 복원
				_buildYnButtonGroup(e.container, [
					{ t: '전체', v: '' }, { t: '가능', v: 'Y' }, { t: '불가', v: 'N' }
				], state[e.field]);
				// Kendo filterSql 우회 + state 저장 + read() 직접 호출
				_bindYnFilterMenuButtons(e.container, e.field, state, grid);
			}

			/* ── Y/N 버튼 그룹 ──────────────────────────────────────── */
			if (ynValueFields.length && ynValueFields.indexOf(e.field) !== -1) {
				_buildYnButtonGroup(e.container, [
					{ t: '전체', v: '' }, { t: 'Y', v: 'Y' }, { t: 'N', v: 'N' }
				], state[e.field]);
				_bindYnFilterMenuButtons(e.container, e.field, state, grid);
			}

			/* ── 진도율 다중선택 ────────────────────────────────────── */
			if (prgrsRtField && e.field === prgrsRtField) {
				e.container.find('.k-filter-help-text').hide();
				e.container.find('span.k-dropdownlist').eq(0).hide();

				/* [필터 적용] 버튼 */
				e.container.find('.k-button-solid-primary')
					.off('mousedown.prgrs')
					.on('mousedown.prgrs', function () {
						var newRt = e.container.find('.prgrs-btn.active')
							.map(function () { return parseInt($(this).val(), 10); })
							.get();
						replaceArray(state.prgrsRtList, newRt);
						// 진도율도 Kendo 필터식 미포함 → 명시 재조회
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});

				/* [초기화] 버튼 — k-rounded-md 로 드롭다운 화살표 버튼 제외 */
				e.container.find('.k-button-solid-base.k-rounded-md')
					.off('mousedown.prgrs')
					.on('mousedown.prgrs', function () {
						clearArray(state.prgrsRtList);
						e.container.find('.prgrs-btn').removeClass('active')
							.css({ background: '#fff', color: '' });
						setTimeout(function () { grid.dataSource.read(); }, 0);
					});
			}
		});
	}

	// ── 공개 API ─────────────────────────────────────────────────────────────
	return {
		/** 기관 다중선택 filterable.ui 팩토리 */
		instcUi:            instcUi,
		/** 범용 목록 체크박스 다중선택 filterable.ui 팩토리 */
		listUi:             listUi,
		/** 범용 목록 라디오버튼 단일선택 filterable.ui 팩토리 */
		singleUi:           singleUi,
		/** 텍스트 입력 filterable.ui 팩토리 */
		textUi:             textUi,
		/** Y/N 드롭다운+버튼 그룹 filterable.ui 팩토리 ('sndng' | 'yn') */
		ynUi:               ynUi,
		/** 진도율 버튼 그룹 filterable.ui 팩토리 */
		prgrsRtUi:          prgrsRtUi,
		/** 그리드 filterMenuOpen 이벤트 일괄 바인딩 */
		bindFilterMenuOpen: bindFilterMenuOpen
	};

})();
