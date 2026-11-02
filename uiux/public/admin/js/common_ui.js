const commonUi = {
    /**
     * 페이지 로딩
     * */
    subLoadingShow() {
        $("#sub_loading-window").show();
    },
    subLoadingHide() {
        $("#sub_loading-window").hide();
    },

    /**
     * 바이트 계산: 한글 2byte, 영문·숫자·특수문자 1byte
     */
    _getByteLength(str) {
        let byte = 0;
        for (let i = 0; i < str.length; i++) {
            byte += str.charCodeAt(i) > 127 ? 2 : 1;
        }
        return byte;
    },

    /**
     * 최대 바이트 초과 시 입력 차단
     */
    _truncateByByte(str, maxByte) {
        let byte = 0;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const charByte = str.charCodeAt(i) > 127 ? 2 : 1;
            if (byte + charByte > maxByte) break;
            byte += charByte;
            result += str[i];
        }
        return result;
    },

    /**
     * @param {string} selector  - textarea CSS 셀렉터 (예: '#textarea')
     * @param {number} maxLength - 최대 글자 수 (기본 200)
     * @param {number} height - 높이 (기본 150)
     */
    createTextarea(selector, maxLength = 200, height = 150) {
        const el = document.querySelector(selector);

        if (!el) {
            console.warn(`[commonUi] "${selector}" 요소를 찾을 수 없습니다.`);
            return;
        }

        // 기존 maxlength 속성이 있으면 사용, 없으면 옵션값 사용
        const finalMaxLength = el.getAttribute('maxlength')
            ? parseInt(el.getAttribute('maxlength'), 10)
            : maxLength;

        el.setAttribute('maxlength', finalMaxLength);
        el.style.height = `${height}px`;

        // 카운터 마크업 삽입
        const counter = document.createElement('div');
        counter.className = 'textarea_count';
        counter.innerHTML = `<span class="count">0</span>/<strong class="maxCount">${finalMaxLength}</strong>`;
        el.insertAdjacentElement('afterend', counter);

        const countEl = counter.querySelector('.count');

        const update = () => {
            // 초과 시 잘라내기
            const truncated = this._truncateByByte(el.value, maxLength);
            if (el.value !== truncated) el.value = truncated;

            const currentByte = this._getByteLength(el.value);
            countEl.textContent = currentByte;
            counter.classList.toggle('is-warn', currentByte >= maxLength * 0.8);
            counter.classList.toggle('is-full', currentByte >= maxLength);
        };

        el.addEventListener('input', update);
        update(); // 초기값 반영

        el.dataset.counterInit = 'true';
    },

    /**
     * 숫자만 입력 가능한 input 컴포넌트
     * @param {string} selector - input CSS 셀렉터
     * @param {number} maxLength - 최대 글자 수 (선택)
     */
    createNumericInput(selector, maxLength) {
        const el = document.querySelector(selector);

        if (!el) {
            console.warn(`[commonUi] "${selector}" 요소를 찾을 수 없습니다.`);
            return;
        }

        // inputmode 설정 (모바일 숫자 키패드 유도)
        el.setAttribute('inputmode', 'numeric');

        // maxLength 설정
        if (maxLength) {
            el.setAttribute('maxlength', maxLength);
        }

        const formatValue = (val) => {
            // 숫자가 아닌 문자 제거
            let numericValue = val.replace(/[^0-9]/g, '');
            // 3자리마다 콤마 추가
            return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        const handleInput = (e) => {
            let value = e.target.value;
            let formattedValue = formatValue(value);

            if (value !== formattedValue) {
                e.target.value = formattedValue;
            }
        };

        el.addEventListener('input', handleInput);

        // 초기값 정제 및 콤마 추가
        const initialValue = formatValue(el.value);
        if (el.value !== initialValue) {
            el.value = initialValue;
        }
    },

    /**
     * 입력된 값에서 콤마를 제거하고 숫자만 반환
     * @param {string} selector - input CSS 셀렉터
     * @returns {string} 콤마가 제거된 숫자 문자열
     */
    getRawValue(selector) {
        const el = document.querySelector(selector);
        if (!el) return "";
        return el.value.replace(/,/g, '');
    },

    /**
     * 클래스 기반 입력 제한 초기화 (en: 영문/숫자/기호, ko: 한글 전용)
     */
    initInputRestriction() {
        // 영문 전용 (en 클래스): 영문, 공백만 허용 (숫자, 특수문자 허용 안함)
        $(document).on('input', 'input.en', function() {
            const originalValue = this.value;
            // 영문 대소문자와 공백을 제외한 모든 문자 제거
            const cleanValue = originalValue.replace(/[^a-zA-Z\s]/g, '');
            if (originalValue !== cleanValue) {
                this.value = cleanValue;
            }
        });

        // 한글 전용 (ko 클래스): 한글, 공백만 허용
        $(document).on('input', 'input.ko', function() {
            const originalValue = this.value;
            // 한글과 공백을 제외한 문자 제거
            const cleanValue = originalValue.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]/g, '');
            if (originalValue !== cleanValue) {
                this.value = cleanValue;
            }
        });
    },

    /**
     * 추가/제거 테이블
     * 공통, 일반, 스크롤
     * */
    // ── 공통 내부 로직 ─────────────────────────────────────────────────────
    _createAddDelTableCore(id, tableOptions) {
        const $el = $(id);
        const tableId = $el.attr("id");

        if (!$el.length) {
            console.warn(`"${id}" 요소를 찾을 수 없습니다.`);
            return;
        }
        if ($el.data('addDelTable')) return;
        $el.data('addDelTable', true);

        const isScroll = tableOptions.scroll ?? false;
        const scrollHeight = tableOptions.scrollHeight ?? '300px';
        const hideAddBtn = tableOptions.hideAddBtn ?? false;
        const hideDelBtn = tableOptions.hideDelBtn ?? false;

        let rowCounter = 0;
        let rows = (tableOptions.data ?? []).map(row => ({
            ...row,
            _uid: `${tableId}_${rowCounter++}`
        }));

        // ── init ────────────────────────────────────────────────────────────
        function init() {
            $el.empty();

            // 툴바
            const $toolbar = $('<div class="grid-toolbar btn-group"></div>');
            const $addBtn = $(`<button type="button" class="btn btn-add"><i class="icon-plus"></i>추가</button>`);
            $el.on('click', '.btn-add', function () {
                $el.data('addRow')();
            });

            if (!hideAddBtn) $toolbar.append($addBtn);
            if (tableOptions.topButton) $toolbar.append(tableOptions.topButton);

            if ($toolbar.children().length > 0) {
                $el.append($toolbar);
            }

            if (isScroll) {
                // thead / tbody 분리 구조
                const $wrap = $(`
                <div class="in-table-wrap">
                    <div class="in-table-head">
                        <table class="table in-table">
                            <thead><tr></tr></thead>
                        </table>
                    </div>
                    <div class="in-table-body" style="max-height:${scrollHeight}; overflow-y:auto; overflow-x:hidden;">
                        <table class="table in-table">
                            <colgroup></colgroup>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `);

                const $trHead = $wrap.find('thead tr');
                const $colgroup = $wrap.find('colgroup');

                tableOptions.columns.forEach((col, idx) => {
                    const width = col.width ?? 'auto';
                    let titleHtml = col.title ?? '';
                    if (col.headerTemplate) {
                        titleHtml = typeof col.headerTemplate === 'function' ? col.headerTemplate() : col.headerTemplate;
                    }
                    const $th = $(`<th style="width:${width}; min-width:${width}">${titleHtml}</th>`);
                    if (col.attributes && col.attributes.style) {
                        $th.attr('style', $th.attr('style') + ';' + col.attributes.style);
                    }
                    $trHead.append($th);
                    $colgroup.append(`<col style="width:${width}; min-width:${width}">`);
                });

                // 제거 버튼 컬럼
                if (!hideDelBtn) {
                    $trHead.append('<th style="width:70px; min-width:70px"></th>');
                    $colgroup.append('<col style="width:70px; min-width:70px">');
                }

                $el.append($wrap);

                // 스크롤바 너비 보정
                const $bodyWrap = $el.find('.in-table-body');
                if ($bodyWrap.length) {
                    syncScrollbarWidth();
                    new ResizeObserver(() => syncScrollbarWidth()).observe($bodyWrap[0]);
                }

            } else {
                // 일반 단일 테이블 구조
                const $table = $('<table class="table in-table"></table>');
                const $thead = $('<thead><tr></tr></thead>');
                tableOptions.columns.forEach(col => {
                    let titleHtml = col.title ?? '';
                    if (col.headerTemplate) {
                        titleHtml = typeof col.headerTemplate === 'function' ? col.headerTemplate() : col.headerTemplate;
                    }
                    $thead.find('tr').append(`<th style="width:${col.width ?? 'auto'}">${titleHtml}</th>`);
                });
                if (!hideDelBtn) $thead.find('tr').append('<th style="width:70px"></th>');
                $table.append($thead);
                $table.append($('<tbody></tbody>'));
                $el.append($table);
            }

            renderEmptyOrRows();
        }

        // ── 스크롤바 너비 보정 ───────────────────────────────────────────────
        function syncScrollbarWidth() {
            const $bodyWrap = $el.find('.in-table-body');
            if (!$bodyWrap.length) return;
            const scrollbarWidth = $bodyWrap[0].offsetWidth - $bodyWrap[0].clientWidth;
            $el.find('.in-table-head').css('padding-right', scrollbarWidth);

            // 가로 스크롤 시에도 width 맞추기 위해 head/body width 동기화
            const $table = $el.find('.in-table-body table');
            const tableWidth = $table.outerWidth();
            $el.find('.in-table-head, .in-table-body').css('min-width', '100%').css('width', tableWidth + scrollbarWidth);
        }

        // ── 빈 데이터 or 전체 렌더 ──────────────────────────────────────────
        function renderEmptyOrRows() {
            const $tbody = $el.find('tbody');
            $tbody.empty();

            if (rows.length === 0) {
                const colSpan = tableOptions.columns.length + (hideDelBtn ? 0 : 1);
                $tbody.append(`<tr class="no-data-tr">
                <td colspan="${colSpan}" class="no-data-cont">
                    <p>데이터가 없습니다.</p>
                </td></tr>`);
            } else {
                rows.forEach(row => {
                    appendRow(row);
                    initWidgetsForRow(row);
                });
            }
        }

        // ── 행 1개 추가 ─────────────────────────────────────────────────────
        function appendRow(row, atIndex) {
            const $tbody = $el.find('tbody');
            $tbody.find('.no-data-tr').remove();

            const $tr = $('<tr></tr>').attr('data-uid', row._uid);

            tableOptions.columns.forEach(col => {
                const $td = $('<td></td>');
                if (col.attributes && col.attributes.style) {
                    $td.attr('style', col.attributes.style);
                }

                if (col.field === 'rnum') {
                    // 번호 자동 부여 (1부터 시작)
                    const idx = rows.findIndex(r => r._uid === row._uid);
                    row[col.field] = idx + 1;
                    $td.addClass('text-center').append(row[col.field]);
                } else if (col.template) {
                    const templateHtml = typeof col.template === 'function' ? col.template(row, row._uid) : col.template;
                    $td.append(templateHtml);
                } else if (col.inputType) {
                    $td.append(makeCellInput(col, row._uid));
                } else {
                    $td.append(row[col.field] ?? '');
                }
                $tr.append($td);
            });

            // 제거 버튼
            if (!hideDelBtn) {
                const $tdDel = $('<td style="text-align:center"></td>');
                const delBtnText = tableOptions.delBtnText ?? '삭제';
                const $delBtn = $(`<button type="button" class="btn btn-del02"><i class="icon-minus"></i>${delBtnText}</button>`);

                $delBtn.on('click', function () {
                    if (typeof tableOptions.onBeforeDelete === 'function') {
                        if (tableOptions.onBeforeDelete(row) === false) return;
                    }
                    rows = rows.filter(r => r._uid !== row._uid);
                    $tr.remove();

                    if (rows.length === 0) {
                        const colSpan = tableOptions.columns.length + (hideDelBtn ? 0 : 1);
                        $el.find('tbody').append(`<tr class="no-data-tr">
                        <td colspan="${colSpan}" class="no-data-cont">
                            <p>데이터가 없습니다.</p>
                        </td></tr>`);
                    } else {
                        refreshRnum();
                    }

                    if (typeof tableOptions.onDelete === 'function') tableOptions.onDelete(row);
                });
                $tdDel.append($delBtn);
                $tr.append($tdDel);
            }

            if (typeof atIndex === 'number') {
                if (atIndex === 0) {
                    $tbody.prepend($tr);
                } else {
                    $tbody.find('tr').eq(atIndex - 1).after($tr);
                }
                refreshRnum();
            } else {
                $tbody.append($tr);
            }
        }

        // ── 번호 재정렬 ─────────────────────────────────────────────────────
        function refreshRnum() {
            const rnumColIdx = tableOptions.columns.findIndex(col => col.field === 'rnum');
            if (rnumColIdx === -1) return;

            rows.forEach((row, idx) => {
                row.rnum = idx + 1;
                const $tr = $el.find(`tr[data-uid="${row._uid}"]`);
                if ($tr.length) {
                    $tr.find('td').eq(rnumColIdx).text(row.rnum);
                }
            });
        }


        // ── 셀 input 마크업 ─────────────────────────────────────────────────
        function makeCellInput(col, uid) {
            const elId = `${col.field}_${uid}`;
            const maxLength = col.maxLength ? `maxlength="${col.maxLength}"` : '';
            const className = col.className ? `${col.className}` : '';

            switch (col.inputType) {
                case 'text':
                    return `<input type="text" id="${elId}" name="${col.field}" class="form-control ${className}" ${maxLength}>`;
                case 'date':
                    return `<input type="text" id="${elId}" name="${col.field}" class="form-control" ${maxLength}>`;
                case 'time':
                    return `<input type="text" id="${elId}" name="${col.field}" class="form-control" ${maxLength}>`;
                case 'number':
                    return `<input type="text" id="${elId}" name="${col.field}" class="form-control pd-text-center number" ${maxLength}>`;
                case 'dropdownlist':
                    return `<select id="${elId}" name="${col.field}"></select>`;
                case 'datetime':
                    return `<div class="input-group datetime-wrap">
                            <input type="text" id="${elId}D" class="form-control">
                            <input type="text" id="${elId}T" class="form-control">
                        </div>`;
                case 'dateRange':
                case 'monthRange':
                    return `<div class="input-group-prepend start-end-date">
                            <input type="text" id="${col.startField}_${uid}" name="${col.startField}" class="form-control">
                            <span>~</span>
                            <input type="text" id="${col.endField}_${uid}" name="${col.endField}" class="form-control">
                        </div>`;
                case 'datetimeRange':
                    return `<div class="input-group-prepend start-end-date">
                            <input type="text" id="${col.startField}D_${uid}" class="form-control">
                            <input type="text" id="${col.startField}T_${uid}" class="form-control">
                            <span>~</span>
                            <input type="text" id="${col.endField}D_${uid}" class="form-control">
                            <input type="text" id="${col.endField}T_${uid}" class="form-control">
                        </div>`;
            }
        }

        // ── 위젯 초기화 (행 단위) ────────────────────────────────────────────
        function initWidgetsForRow(row) {
            const uid = row._uid;
            const inputCols = tableOptions.columns.filter(col => !!col.inputType);

            inputCols.forEach(col => {
                const baseId = `#${col.field}_${uid}`;

                switch (col.inputType) {
                    case 'date': {
                        kendoUi.createDatePicker(baseId, {
                            value: row[col.field] ?? null,
                            onChange: function (e) {
                                const val = e.sender.value();
                                row[col.field] = val ? kendo.toString(val, 'yyyy-MM-dd') : null;
                                if (col.onChange) col.onChange(e);
                            }
                        });
                        const initVal = $(baseId).data('kendoDatePicker')?.value();
                        row[col.field] = initVal ? kendo.toString(initVal, 'yyyy-MM-dd') : null;
                        break;
                    }
                    case 'time': {
                        kendoUi.createTimePicker(baseId, {
                            value: row[col.field] ?? null,
                            onChange: function (e) {
                                const val = e.sender.value();
                                row[col.field] = val ? kendo.toString(val, 'HH:mm') : null;
                                if (col.onChange) col.onChange(e);
                            }
                        });
                        const initVal = $(baseId).data('kendoTimePicker')?.value();
                        row[col.field] = initVal ? kendo.toString(initVal, 'HH:mm') : null;
                        break;
                    }
                    case 'datetime': {
                        const dateId = `${baseId}D`;
                        const timeId = `${baseId}T`;
                        const syncToRow = () => {
                            const d = $(dateId).data('kendoDatePicker')?.value();
                            const t = $(timeId).data('kendoTimePicker')?.value();
                            row[col.field] = d && t ? `${kendo.toString(d, 'yyyy-MM-dd')} ${kendo.toString(t, 'HH:mm')}` : null;
                        };
                        kendoUi.createDatePicker(dateId, {
                            value: row[col.field] ?? null,
                            onChange: function (e) {
                                syncToRow();
                                if (col.onDateChange) col.onDateChange(e);
                            }
                        });
                        kendoUi.createTimePicker(timeId, {
                            value: row[col.field] ?? null,
                            onChange: function (e) {
                                syncToRow();
                                if (col.onTimeChange) col.onTimeChange(e);
                            }
                        });
                        syncToRow();
                        break;
                    }
                    case 'dateRange': {
                        const startId = `#${col.startField}_${uid}`;
                        const endId = `#${col.endField}_${uid}`;
                        kendoUi.createDatePickerStartEnd(startId, endId, {});
                        if (row[col.startField]) $(startId).data('kendoDatePicker').value(row[col.startField]);
                        if (row[col.endField]) $(endId).data('kendoDatePicker').value(row[col.endField]);
                        const initStart = $(startId).data('kendoDatePicker')?.value();
                        const initEnd = $(endId).data('kendoDatePicker')?.value();
                        row[col.startField] = initStart ? kendo.toString(initStart, 'yyyy-MM-dd') : null;
                        row[col.endField] = initEnd ? kendo.toString(initEnd, 'yyyy-MM-dd') : null;
                        $(startId).data('kendoDatePicker').bind('change', function (e) {
                            const val = e.sender.value();
                            row[col.startField] = val ? kendo.toString(val, 'yyyy-MM-dd') : null;
                        });
                        $(endId).data('kendoDatePicker').bind('change', function (e) {
                            const val = e.sender.value();
                            row[col.endField] = val ? kendo.toString(val, 'yyyy-MM-dd') : null;
                        });
                        break;
                    }
                    case 'monthRange': {
                        const startId = `#${col.startField}_${uid}`;
                        const endId = `#${col.endField}_${uid}`;
                        kendoUi.createMonthPickerStartEnd(startId, endId, {});
                        if (row[col.startField]) $(startId).data('kendoDatePicker').value(row[col.startField]);
                        if (row[col.endField]) $(endId).data('kendoDatePicker').value(row[col.endField]);
                        const initStart = $(startId).data('kendoDatePicker')?.value();
                        const initEnd = $(endId).data('kendoDatePicker')?.value();
                        row[col.startField] = initStart ? kendo.toString(initStart, 'yyyy-MM') : null;
                        row[col.endField] = initEnd ? kendo.toString(initEnd, 'yyyy-MM') : null;
                        $(startId).data('kendoDatePicker').bind('change', function (e) {
                            const val = e.sender.value();
                            row[col.startField] = val ? kendo.toString(val, 'yyyy-MM') : null;
                        });
                        $(endId).data('kendoDatePicker').bind('change', function (e) {
                            const val = e.sender.value();
                            row[col.endField] = val ? kendo.toString(val, 'yyyy-MM') : null;
                        });
                        break;
                    }
                    case 'datetimeRange': {
                        const sDId = `#${col.startField}D_${uid}`;
                        const sTId = `#${col.startField}T_${uid}`;
                        const eDId = `#${col.endField}D_${uid}`;
                        const eTId = `#${col.endField}T_${uid}`;
                        const syncStart = () => {
                            const d = $(sDId).data('kendoDatePicker')?.value();
                            const t = $(sTId).data('kendoTimePicker')?.value();
                            row[col.startField] = d && t ? `${kendo.toString(d, 'yyyy-MM-dd')} ${kendo.toString(t, 'HH:mm')}` : null;
                        };
                        const syncEnd = () => {
                            const d = $(eDId).data('kendoDatePicker')?.value();
                            const t = $(eTId).data('kendoTimePicker')?.value();
                            row[col.endField] = d && t ? `${kendo.toString(d, 'yyyy-MM-dd')} ${kendo.toString(t, 'HH:mm')}` : null;
                        };
                        kendoUi.createDatePicker(sDId, {
                            value: row[col.startField] ?? null,
                            onChange: function (e) {
                                syncStart();
                            }
                        });
                        kendoUi.createTimePicker(sTId, {
                            value: row[col.startField] ?? null,
                            onChange: function (e) {
                                syncStart();
                            }
                        });
                        kendoUi.createDatePicker(eDId, {
                            value: row[col.endField] ?? null,
                            onChange: function (e) {
                                syncEnd();
                            }
                        });
                        kendoUi.createTimePicker(eTId, {
                            value: row[col.endField] ?? null,
                            onChange: function (e) {
                                syncEnd();
                            }
                        });
                        syncStart();
                        syncEnd();
                        break;
                    }
                    case 'number': {
                        const $numInput = $(baseId);
                        $numInput.val(row[col.field] ?? '');
                        $numInput.on('input', function () {
                            const val = $(this).val();
                            row[col.field] = val;
                        });
                        break;
                    }
                    case 'text': {
                        const $textInput = $(baseId);
                        $textInput.val(row[col.field] ?? '');
                        $textInput.on('input', function () {
                            const val = $(this).val();
                            row[col.field] = val;
                            if (typeof col.onInput === 'function') col.onInput(val, row, uid);
                        });
                        break;
                    }
                    case 'dropdownlist': {
                        const ds = typeof col.dataSource === 'string' ? (window[col.dataSource] ?? []) : (col.dataSource ?? col.data ?? []);
                        kendoUi.createDropDownList(baseId, {
                            data: ds,
                            optionLabel: col.optionLabel ?? null,
                            filter: col.filter ?? false,
                            value: row[col.field] ?? null,
                            onChange: function (e) {
                                row[col.field] = e.sender.value();
                                if (col.onChange) col.onChange(e);
                            }
                        });
                        // 초기값 동기화 및 디폴트 선택 처리
                        const ddl = $(baseId).data('kendoDropDownList');
                        if (ddl) {
                            if (row[col.field]) {
                                ddl.value(row[col.field]);
                            } else {
                                if (!col.optionLabel && ddl.dataSource.data().length > 0) {
                                    ddl.select(0);
                                } else {
                                    ddl.select(0);
                                }
                            }
                            // 현재 드롭다운의 값을 데이터 모델(row)에 반영
                            row[col.field] = ddl.value();
                        }
                        break;
                    }

                }
            });
        }

        // ── 외부에서 데이터가 채워진 행을 추가 (복사/팝업선택 등) ──────────────
        function addRowWithData(data, atIndex) {
            const emptyRow = tableOptions.columns.reduce((acc, col) => {
                acc[col.field] = col.defaultValue ?? '';
                return acc;
            }, {});

            const mergedData = {...emptyRow, ...data};

            if (typeof tableOptions.onBeforeAdd === 'function') {
                if (tableOptions.onBeforeAdd(mergedData) === false) return;
            }

            mergedData._uid = `${tableId}_${rowCounter++}`;

            if (typeof atIndex === 'number') {
                rows.splice(atIndex, 0, mergedData);
                appendRow(mergedData, atIndex);
                initWidgetsForRow(mergedData);
            } else {
                rows.push(mergedData);
                appendRow(mergedData);
                initWidgetsForRow(mergedData);
            }

            // 스크롤 시 추가 후 맨 아래로 (신규 추가 시에만)
            if (isScroll && typeof atIndex !== 'number') {
                const $bodyWrap = $el.find('.in-table-body');
                $bodyWrap.scrollTop($bodyWrap[0].scrollHeight);
            }

            if (typeof tableOptions.onAdd === 'function') tableOptions.onAdd(mergedData);
            return mergedData;
        }

        // ── 데이터 수집 및 기능 노출 ─────────────────────────────────────────────────────
        $el.data('getTableData', function () {
            return rows.map(({_uid, ...data}) => data);
        });

        $el.data('addRow', function (data, atIndex) {
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                return addRowWithData(data, atIndex);
            }
            const emptyRow = tableOptions.columns.reduce((acc, col) => {
                acc[col.field] = col.defaultValue ?? '';
                return acc;
            }, {});

            if (typeof tableOptions.onBeforeAdd === 'function') {
                if (tableOptions.onBeforeAdd(emptyRow) === false) return;
            }

            emptyRow._uid = `${tableId}_${rowCounter++}`;
            rows.push(emptyRow);
            appendRow(emptyRow);
            initWidgetsForRow(emptyRow);

            // 스크롤 시 추가 후 맨 아래로
            if (isScroll) {
                const $bodyWrap = $el.find('.in-table-body');
                $bodyWrap.scrollTop($bodyWrap[0].scrollHeight);
            }

            if (typeof tableOptions.onAdd === 'function') tableOptions.onAdd(emptyRow);
        });

        // ── 로우 객체 찾기 ──
        $el.data('getRowByUid', function(uid) {
            return rows.find(r => r._uid === uid);
        });
        // 특정 위치에 삽입
        $el.data('insertRow', function (atIndex, data) {
            return addRowWithData(data, atIndex);
        });
        // _uid 포함 원본 행 배열 접근 (조회/순서 변경용)
        $el.data('getRows', function () {
            return rows;
        });
        // 전체 데이터 교체 후 재렌더
        $el.data('setRows', function (newData) {
            rowCounter = 0;
            rows = (newData ?? []).map(row => ({...row, _uid: `${tableId}_${rowCounter++}`}));
            renderEmptyOrRows();
        });
        // 전체 재렌더 (외부에서 rows 를 직접 조작한 뒤 호출)
        $el.data('refresh', function () {
            renderEmptyOrRows();
        });

        // ── 시작 ────────────────────────────────────────────────────────────
        init();
    },

    createAddDelTable(id, tableOptions) {
        this._createAddDelTableCore(id, {...tableOptions, scroll: false});
    },

    createAddDelScrollTable(id, tableOptions) {
        this._createAddDelTableCore(id, {...tableOptions, scroll: true});
    },

    /**
     * 체크박스 양이 많을 경우 넓이 계산해서 떨어뜨린 후 class 명 추가
     *
     * */
    markWrappedItems($wrap) {
        const $items = $wrap.find(".checkbox-tab-item");
        if ($items.length === 0) return;

        $items.removeClass("is-wrapped");

        let prevTop = $items.first()[0].offsetTop;

        $items.each(function (index) {
            if (index === 0) return;

            const currentTop = this.offsetTop;

            if (currentTop > prevTop) {
                $(this).addClass("is-wrapped");
            }

            prevTop = currentTop;
        });
    },

    /**
     * 검색영역의 운영연도+과정분류 를 생성한다
     * type  이 "srch" 경우 elId 내에 태그가 생성되고 "form" 일 경우 해당 id에 해당하는 태그 다음에 추가된다
     * type 이 "srch" 일 경우 ID 는 운영년도(srchCrsYr_"elId"), 대분류(srchCrsSe1_"elId"), 중분류(srchCrsSe2_"elId"), 소분류(srchCrsSe3_"elId"), 세부분류(srchCrsSe4_"elId")
     * type 이 "form" 일 경우 ID 는 운영년도(formCrsYr_"elId"), 대분류(formCrsSe1_"elId"), 중분류(formCrsSe2_"elId"), 소분류(formCrsSe3_"elId"), 세부분류(formCrsSe4_"elId")
     * @param {elId} 과정분류를 생성할 태그ID, #없이작성
     * @param {type} 생성유형, srch(검색영역), form(상세영역)
     * @param {oprYr} 운영년도 목록, [{value:'2026', text: '2026'}]
     * @param {nowYear} 운영년도 default
     * @param {crsSe} 과정구분, 1(이러닝교육), 3(집합교육), 4(국제교육)
     * @param {type2} 운영연도, 교육연도 텍스트 분기
     */
    makeCourseCategory(elId, type, optYrArr, nowYear, crsSe, type2) {
        const $divEl = $('#' + elId);

        if (!$divEl) return;

        const crsYrId = type + "CrsYr_" + elId;
        const crsSeId = type + "CrsSe_" + elId;
        const crsSe1Id = type + "CrsSe1_" + elId;
        const crsSe2Id = type + "CrsSe2_" + elId;
        const crsSe3Id = type + "CrsSe3_" + elId;
        const crsSe4Id = type + "CrsSe4_" + elId;

        type2 = type2 ?? 2;
        const typeMap = {1: "운영연도", 2: "교육연도"};
        const text = typeMap[type2] || "운영연도";
        const isSrchEduYear = type === 'srch' && type2 === 2;

        let crsYrDS = [];
        for (var i of optYrArr) {
            crsYrDS.push({"text": i.text, "value": i.value});
        }

        /* 과정분류생성용 데이터 객체 */
        let crsSe1OptionLabel = '';
        if (type == 'srch') {
            const template = `
                <div class="col">
                    <div class="label">${text}</div>
                    <div class="input-group">
                        <select id="${crsYrId}" class="form-control"></select>
                    </div>
                </div>
                <div class="col">
                    <div class="label">과정분류</div>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <select id="${crsSe1Id}" class="form-control"></select>
                            <select id="${crsSe2Id}" class="form-control"></select>
                            <select id="${crsSe3Id}" class="form-control"></select>
                            <select id="${crsSe4Id}" class="form-control" </select>
                        </div>
                    </div>
                </div>
            `;
            $divEl.html(template);

            crsSe1OptionLabel = '== 전체 ==';
        } else {
            const template = `
                <tr>
                    <th>${text} <span class="required">*</span></th>
                    <td>
                        <select id="${crsYrId}" class="form-control" data-bind="value: clsfMapping.crsYr" style="width: 200px;" required></select>
                    </td>
                </tr>
                <tr>
                    <th>과목분류 <span class="required">*</span></th>
                    <td>
                        <div class="input-group-prepend">
                            <select id="${crsSe1Id}" class="form-control" data-bind="value: clsfMapping.crsSe1No" required></select>
                            <select id="${crsSe2Id}" class="form-control" data-bind="value: clsfMapping.crsSe2No" ></select>
                            <select id="${crsSe3Id}" class="form-control" data-bind="value: clsfMapping.crsSe3No" ></select>
                            <select id="${crsSe4Id}" class="form-control" data-bind="value: clsfMapping.crsSe4No" ></select>
                            <button type="button" class="btn btn-primary dtl" onclick="events.openHstryInq();">이력조회</button>
                        </div>
                    </td>
                </tr>
            `;
            $divEl.after(template);

            crsSe1OptionLabel = '== 선택 ==';
        }

        // 운영연도
        kendoUi.createDropDownList(`#${crsYrId}`, {
            data: crsYrDS,
            optionLabel: isSrchEduYear ? "== 전체 ==" : "== 선택 ==",
            value: isSrchEduYear ? null : nowYear,
            onChange: function (e) {
                const crntValue = this.value();
                commonUi.getCrsClsfList(elId, type, crntValue, crsSe);
            }
        });

        components[`${crsSeId}_data`] = [];
        components[`${crsSe1Id}_data`] = [];
        components[`${crsSe2Id}_data`] = [];
        components[`${crsSe3Id}_data`] = [];
        components[`${crsSe4Id}_data`] = [];

        // 과정분류 - 대분류
        kendoUi.createDropDownList(`#${crsSe1Id}`, {
            data: [],
            optionLabel: crsSe1OptionLabel,
            dataParentField: "upValue",
            onChange: function (e) {
                const crntValue = this.value();

                // 필터링
                const items = components[`${crsSe1Id}_data`].filter((item, idx) => {
                    return item.value === crntValue;
                });
                components[`${crsSe2Id}_data`] = items[0] ? items[0].subItems ?? [] : [];

                // 중분류 초기화
                const mdList = $(`#${crsSe2Id}`).data("kendoDropDownList");
                mdList.dataSource.data(components[`${crsSe2Id}_data`]);
                mdList.value("");
                mdList.refresh();
                // 소분류 초기화
                const smlList = $(`#${crsSe3Id}`).data("kendoDropDownList");
                smlList.dataSource.data(components[`${crsSe3Id}_data`]);
                smlList.value("");
                smlList.refresh();
                // 세분류 초기화
                const dclsfList = $(`#${crsSe4Id}`).data("kendoDropDownList");
                dclsfList.dataSource.data(components[`${crsSe4Id}_data`]);
                dclsfList.value("");
                dclsfList.refresh();
            },
            index: 0
        });

        // 과정분류 - 중분류
        kendoUi.createDropDownList(`#${crsSe2Id}`, {
            data: [],
            optionLabel: crsSe1OptionLabel,
            dataParentField: "upValue",
            onChange: function (e) {
                const crntValue = this.value();

                // 필터링
                const items = components[`${crsSe2Id}_data`].filter((item, idx) => {
                    return item.value === crntValue;
                });
                components[`${crsSe3Id}_data`] = items[0] ? items[0].subItems ?? [] : [];

                // 소분류 초기화
                const smlList = $(`#${crsSe3Id}`).data("kendoDropDownList");
                smlList.dataSource.data(components[`${crsSe3Id}_data`]);
                smlList.value("");
                smlList.refresh();
                // 세분류 초기화
                const dclsfList = $(`#${crsSe4Id}`).data("kendoDropDownList");
                dclsfList.dataSource.data([]);
                dclsfList.value("");
                dclsfList.refresh();
            }
        });

        // 과정분류 - 소분류
        kendoUi.createDropDownList(`#${crsSe3Id}`, {
            data: [],
            optionLabel: crsSe1OptionLabel,
            dataParentField: "upValue",
            onChange: function (e) {
                const crntValue = this.value();

                // 필터링
                const items = components[`${crsSe3Id}_data`].filter((item, idx) => {
                    return item.value === crntValue;
                });
                console.log('11sadgfas', items);
                components[`${crsSe4Id}_data`] = items[0] ? items[0].subItems ?? [] : [];

                // 세분류 초기화
                const dclsfList = $(`#${crsSe4Id}`).data("kendoDropDownList");
                dclsfList.dataSource.data(components[`${crsSe4Id}_data`]);
                dclsfList.value("");
                dclsfList.refresh();
            }
        });

        // 과정분류 - 세분류
        kendoUi.createDropDownList(`#${crsSe4Id}`, {
            data: [],
            optionLabel: crsSe1OptionLabel,
            dataParentField: "upValue"
        });

        // 과정분류 조회
        commonUi.getCrsClsfList(elId, type, nowYear, crsSe);
    },

    /**
     * 과정분류 조회
     * @param {elId} 과정분류 영역ID, 해당 ID를 기준으로 각 모듈의 ID가 결정됨
     * @param {type} 조회영역, search(검색영역) form(상세영역)
     * @param {crsYr} 조회년도
     * @param {crsSe} 과정구분, 1(이러닝교육), 3(집합교육), 4(국제교육)
     */
    getCrsClsfList(elId, type, crsYr, crsSe) {
        const crsYrId = type + "CrsYr_" + elId;
        const crsSeId = type + "CrsSe_" + elId;
        const crsSe1Id = type + "CrsSe1_" + elId;
        const crsSe2Id = type + "CrsSe2_" + elId;
        const crsSe3Id = type + "CrsSe3_" + elId;
        const crsSe4Id = type + "CrsSe4_" + elId;

        // 초기화
        components[`${crsSeId}_data`] = [];
        components[`${crsSe1Id}_data`] = [];
        components[`${crsSe2Id}_data`] = [];
        components[`${crsSe3Id}_data`] = [];
        components[`${crsSe4Id}_data`] = [];

        if (parseInt(crsYr) > 0) {
            // 분류조회
            $.ajax({
                type: 'POST',
                url: `${ctx}/data/comm/selectCrsClsfList.do`,
                data: {crsYr: crsYr, crsSe: crsSe},
                async: false,
                dataType: 'json',
                success: function (response) {
                    if (response.error) {
                        alert(response.message);
                    } else {
                        if (response.data && response.data.subItems && response.data.subItems.length > 0) {
                            components[`${crsSeId}_data`] = response.data.subItems[0];
                            components[`${crsSe1Id}_data`] = response.data.subItems[0].subItems;
                        }
                    }
                },
                error: kbrainc.ui.handleAjaxError
            });
        }
        const kddl1 = $(`#${crsSe1Id}`).data('kendoDropDownList');
        const kddl2 = $(`#${crsSe2Id}`).data('kendoDropDownList');
        const kddl3 = $(`#${crsSe3Id}`).data('kendoDropDownList');
        const kddl4 = $(`#${crsSe4Id}`).data('kendoDropDownList');
        kddl1.dataSource.data(components[`${crsSe1Id}_data`]);
        kddl2.dataSource.data(components[`${crsSe2Id}_data`]);
        kddl3.dataSource.data(components[`${crsSe3Id}_data`]);
        kddl4.dataSource.data(components[`${crsSe4Id}_data`]);
        kddl1.select(0);
        kddl1.refresh();
        kddl2.refresh();
        kddl3.refresh();
        kddl4.refresh();
    },
    /**
     * 검색영역 용 선택된 과정분류 값 조회
     * 
     * @param {elId} 과정분류 영역ID, 해당 ID를 기준으로 각 모듈의 ID가 결정되어 조회되게됨
     */
    getSrchCrsClsfValue(elId) {
        const crsSe1Id = "#srchCrsSe1_" + elId;
        const crsSe2Id = "#srchCrsSe2_" + elId;
        const crsSe3Id = "#srchCrsSe3_" + elId;
        const crsSe4Id = "#srchCrsSe4_" + elId;

        let srchCrsClsfNoArr = [];
        const crsClsfLvl1Value = kendoUi.getDropDownListValue(crsSe1Id);
        const crsClsfLvl2Value = kendoUi.getDropDownListValue(crsSe2Id);
        const crsClsfLvl3Value = kendoUi.getDropDownListValue(crsSe3Id);
        const crsClsfLvl4Value = kendoUi.getDropDownListValue(crsSe4Id);
        if(crsClsfLvl1Value != '') srchCrsClsfNoArr.push(crsClsfLvl1Value);
        if(crsClsfLvl2Value != '') srchCrsClsfNoArr.push(crsClsfLvl2Value);
        if(crsClsfLvl3Value != '') srchCrsClsfNoArr.push(crsClsfLvl3Value);
        if(crsClsfLvl4Value != '') srchCrsClsfNoArr.push(crsClsfLvl4Value);
        
        return srchCrsClsfNoArr.join('_');
    },
     /**
     * 검색영역 용 과정분류 초기화
     * 
     * @param {elId} 과정분류 영역ID, 해당 ID를 기준으로 각 모듈의 ID가 결정되어 조회되게됨
     * @param {nowYear} 초기화년도
     * @param {crsSe}  과정구분, 1(이러닝교육), 3(집합교육), 4(국제교육)
     */
    initSrchCrsClsf(elId, nowYear, crsSe) {
        const crsYrId = "#srchCrsYr_" + elId;
        const crsSe1Id = "#srchCrsSe1_" + elId;
        const crsSe2Id = "#srchCrsSe2_" + elId;
        const crsSe3Id = "#srchCrsSe3_" + elId;
        const crsSe4Id = "#srchCrsSe4_" + elId;

        kendoUi.setDropDownListValue(crsYrId, nowYear);

        // 과정분류 조회
        commonUi.getCrsClsfList(elId, "srch", nowYear, crsSe);
    },

    /**
     * 기관 cascading 드롭다운 초기화
     *
     * 기관구분(ogdpSeCdProvider) → 대분류(lv1Id) → 중분류(lv2Id) → 소분류(lv3Id) 순으로
     * 상위 선택 시 하위를 자동 갱신한다. lv3Id 는 생략 가능.
     *
     * @param {Object} options
     * @param {string}   options.lv1Id           - 대분류 드롭다운 selector
     * @param {string}   options.lv2Id           - 중분류 드롭다운 selector
     * @param {string}   [options.lv3Id]         - 소분류 드롭다운 selector (선택)
     * @param {Function} options.ogdpSeCdProvider - 현재 기관구분 값을 반환하는 함수
     * @param {Function} [options.onLv1Change]   - 대분류 선택 후 추가 처리 콜백
     * @param {Function} [options.onLv2Change]   - 중분류 선택 후 추가 처리 콜백
     * @param {Function} [options.onLv3Change]   - 소분류 선택 후 추가 처리 콜백
     *
     * @example
     * // 기관구분 드롭다운이 이미 초기화된 후 호출
     * commonUi.createOrgCascade({
     *     lv1Id: '#dept1',
     *     lv2Id: '#dept2',
     *     lv3Id: '#dept3',
     *     ogdpSeCdProvider: function() {
     *         return $('#orgnzGubun').data('kendoDropDownList').value();
     *     }
     * });
     *
     * // 기관구분 change 이벤트에서 호출
     * kendoUi.createDropDownList('#orgnzGubun', {
     *     data: userTypeCdData,
     *     optionLabel: '== 전체 ==',
     *     onChange: function() {
     *         commonUi.refreshOrgCascade('#dept1', '#dept2', '#dept3',
     *             $('#orgnzGubun').data('kendoDropDownList').value());
     *     }
     * });
     */
    createOrgCascade(options) {
        var OPT_URL = ctx + '/data/cm/deptCd/selectOptList.do';
        var EMPTY   = [{ value: '', text: '== 전체 ==' }];

        var lv1Id            = options.lv1Id;
        var lv2Id            = options.lv2Id;
        var lv3Id            = options.lv3Id  || null;
        var ogdpSeCdProvider = options.ogdpSeCdProvider;
        var onLv1Change      = options.onLv1Change || null;
        var onLv2Change      = options.onLv2Change || null;
        var onLv3Change      = options.onLv3Change || null;
        // ── 신규 옵션 — 기관구분(orgnzGubun) 까지 같이 셋업 ──
        var orgnzGubunId     = options.orgnzGubunId     || null;
        var orgnzGubunCdId   = options.orgnzGubunCdId   || '941';
        var orgnzGubunFixed  = options.orgnzGubunFixed  || null;  // 권한별 고정값

        // orgnzGubunId 명시 시 ogdpSeCdProvider 자동 생성
        if (!ogdpSeCdProvider && orgnzGubunId) {
            ogdpSeCdProvider = function() {
                return kendoUi.getDropDownListValue(orgnzGubunId);
            };
        }

        // ── 드롭다운 초기 생성 헬퍼 ──
        function _initDdl(id, onChange) {
            kendoUi.resetDropDown(id);
            kendoUi.createDropDownList(id, {
                data: EMPTY,
                optionLabel: false,
                onChange: onChange
            });
        }

        // ── 데이터 로드 후 드롭다운 갱신 ──
        function _load(id, params, callback) {
            $.post(OPT_URL, params)
                .done(function(res) {
                    var list = (res.success && res.data && res.data.length > 0)
                        ? EMPTY.concat(res.data)
                        : EMPTY;
                    kendoUi.setDropDownListData(id, list);
                    kendoUi.setDropDownListValue(id, '');
                })
                .always(function() {
                    if (typeof callback === 'function') callback();
                });
        }

        // ── lv3 표시/숨김 ──
        function _toggleLv3(show) {
            if (!lv3Id) return;
            var ddl = $(lv3Id).data('kendoDropDownList');
            if (ddl) ddl.wrapper.toggle(show);
        }

        // ── 소분류 초기화 ──
        function _resetLv3() {
            if (!lv3Id) return;
            kendoUi.setDropDownListData(lv3Id, EMPTY);
            kendoUi.setDropDownListValue(lv3Id, '');
            _toggleLv3(false);
        }

        // ── 중분류 초기화 ──
        function _resetLv2() {
            kendoUi.setDropDownListData(lv2Id, EMPTY);
            kendoUi.setDropDownListValue(lv2Id, '');
            _resetLv3();
        }

        // ── 대분류 change → 중분류 로드 ──
        function _onLv1Change() {
            var lv1Val = kendoUi.getDropDownListValue(lv1Id);
            if (!lv1Val) {
                _resetLv2();
                if (typeof onLv1Change === 'function') onLv1Change('');
                return;
            }
            _load(lv2Id, { upOgdpId: lv1Val }, function() {
                _resetLv3();
                if (typeof onLv1Change === 'function') onLv1Change(lv1Val);
            });
        }

        // ── 중분류 change → 소분류 로드 (데이터 있을 때만 표시) ──
        function _onLv2Change() {
            var lv2Val = kendoUi.getDropDownListValue(lv2Id);
            if (!lv3Id) {
                if (typeof onLv2Change === 'function') onLv2Change(lv2Val);
                return;
            }
            if (!lv2Val) {
                _resetLv3();
                if (typeof onLv2Change === 'function') onLv2Change('');
                return;
            }
            $.post(OPT_URL, { upOgdpId: lv2Val })
                .done(function(res) {
                    if (res.success && res.data && res.data.length > 0) {
                        kendoUi.setDropDownListData(lv3Id, EMPTY.concat(res.data));
                        kendoUi.setDropDownListValue(lv3Id, '');
                        _toggleLv3(true);
                    } else {
                        _resetLv3();
                    }
                })
                .always(function() {
                    if (typeof onLv2Change === 'function') onLv2Change(lv2Val);
                });
        }

        // ── 소분류 change 콜백 ──
        function _onLv3Change() {
            var lv3Val = kendoUi.getDropDownListValue(lv3Id);
            if (typeof onLv3Change === 'function') onLv3Change(lv3Val);
        }

        // ── 드롭다운 초기 생성 (lv3는 숨김 상태로 시작) ──
        _initDdl(lv1Id, _onLv1Change);
        _initDdl(lv2Id, _onLv2Change);
        if (lv3Id) {
            _initDdl(lv3Id, _onLv3Change);
            _toggleLv3(false);
        }

        // ── 공개: 기관구분 변경 시 대분류 갱신 / 전체 초기화 ──
        var cascade = {
            refresh: function() {
                var seCd = (typeof ogdpSeCdProvider === 'function') ? ogdpSeCdProvider() : '';
                _resetLv2();
                if (!seCd) return;
                _load(lv1Id, { ogdpSeCd: seCd }, null);
            },
            reset: function() {
                kendoUi.setDropDownListData(lv1Id, EMPTY);
                kendoUi.setDropDownListValue(lv1Id, '');
                _resetLv2();
            }
        };

        // ── 신규: 기관구분 드롭다운 자동 셋업 (목록 ajax 응답 후 렌더링) ──
        if (orgnzGubunId) {
            $.post(ctx + '/data/cm/comCd/selectCdOptList.do', { cdId: orgnzGubunCdId })
                .done(function(res) {
                    var data = (res.success && res.data) ? res.data : [];
                    kendoUi.createDropDownList(orgnzGubunId, {
                        data: data,
                        optionLabel: '== 전체 ==',
                        onChange: function() {
                            var val = kendoUi.getDropDownListValue(orgnzGubunId);
                            val ? cascade.refresh() : cascade.reset();
                        }
                    });
                    // 권한별 고정값 — 자동 선택 + 비활성화 + cascade refresh
                    if (orgnzGubunFixed) {
                        kendoUi.setDropDownListValue(orgnzGubunId, orgnzGubunFixed);
                        var ddl = $(orgnzGubunId).data('kendoDropDownList');
                        if (ddl) ddl.enable(false);
                        cascade.refresh();
                    }
                });
        }

        return cascade;
    },

    /**
     * 직급명 자동완성 입력 초기화
     * /data/cm/jbgdCd/selectList.do 응답을 모듈 스코프 캐시 → 페이지 내 첫 호출만 ajax
     * @param {string} selector - input element selector (예: '#xxx_jbgd')
     * @param {Object} [options] - placeholder/minLength/filter 오버라이드
     */
    createJbgdAutoComplete(selector, options) {
        options = options || {};
        var placeholder = options.placeholder || '검색어를 입력해주세요.';
        var minLength   = options.minLength != null ? options.minLength : 1;
        var filter      = options.filter || 'contains';

        kendoUi.createAutoComplete(selector, {
            data: [],
            field: 'jbgdNm',
            placeholder: placeholder,
            filter: filter,
            minLength: minLength
        });

        var applyData = function(data) {
            var ac = $(selector).data('kendoAutoComplete');
            if (ac) ac.setDataSource(data);
        };

        if (commonUi._jbgdNmDataCache) {
            applyData(commonUi._jbgdNmDataCache);
        } else {
            $.post(ctx + '/data/cm/jbgdCd/selectList.do', { take: 9999, skip: 0 })
                .done(function(res) {
                    if (!res.success || !res.data) return;
                    commonUi._jbgdNmDataCache = res.data;
                    applyData(res.data);
                });
        }
    }
};
