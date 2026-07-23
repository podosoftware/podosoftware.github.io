var CommonUtil = (function() {

    /**
     * 검색영역/상세영역 초기화
     * RaonkEditor와 RaonkUpload는 form 내우의 별도 iframe 구조로 만들어져 공통 초기화 안됨
     * @param {String} formId 초기화 영역의 ID, 해당ID 영역내의 객체에 대해 초기화 진행
     * @param {Object} defaultValues 초기화 시 입력 객체별 초기값이 있을 경우 사용 {formId:value,formId:value} 구조로 전달
     *                               raido/checkbox 일 경우 formId 를 formName 으로 전달필요
     *                               checkbox 는 복수의 선택이 가능하므로 값은 "," 를 구분으로 복수전달 가능
     * @param gridId        검색과 연결된 gridId 불러와서 read
     */
    function initForm(formId, defaultValues, gridId) {
        const parentEl = document.getElementById(formId);
        if(parentEl) {
            // checkbox.reset(); // 기본초기화

            // 기본 초기화가 불가능한 hidden, kendoUi 를 찾아 초기화 진행
            const inputTextEls = parentEl.querySelectorAll('input[type="text"]');
            const radioEls = parentEl.querySelectorAll('input[type="radio"]');
            const checkboxEls = parentEl.querySelectorAll('input[type="checkbox"]');
            const selectEls = parentEl.querySelectorAll('select');

            if(inputTextEls && inputTextEls.length > 0) {
                inputTextEls.forEach((el, idx) => {
                    const elTp = el.type;
                    const elId = el.id;

                    if (!elId) return;

                    let defaultValue = defaultValues?defaultValues[elId]??'':'';

                    if(elTp == 'text' && isKendoWidget(elId)) {
                        const kendoUiNm = getKendoWidgetType(elId);
                        $('#'+elId).data(kendoUiNm).value(defaultValue);
                    } else {
                        $('#'+elId).val(defaultValue);
                    }
                });
                
            }

            if(radioEls && radioEls.length > 0) {
                radioEls.forEach((el, idx) => {
                    const elTp = el.type;
                    const elNm = el.name;
                    if (!elNm) return;
                    let defaultValue = defaultValues?defaultValues[elNm]??'':'';
                    console.log("초기화 라디오 defaultValue", defaultValue);
                    if (defaultValue === '' || defaultValue === undefined || defaultValue === null) {
                        $('input:radio[name="'+elNm+'"]').prop('checked',false);
                    } else {
                        $('input:radio[name="'+elNm+'"][value="'+defaultValue+'"]').prop('checked',true);
                    }
                });
            }

            if(checkboxEls && checkboxEls.length > 0) {
                checkboxEls.forEach((el, idx) => {
                    const elTp = el.type;
                    const elNm = el.name;
                    if (!elNm) return;
                    let defaultValue = defaultValues?defaultValues[elNm]??'':'';
                    console.log("초기화 체크박스 defaultValue", defaultValue);
                    if (defaultValue === '' || defaultValue === undefined || defaultValue === null || defaultValue === false) {
                        $('input:checkbox[name="'+elNm+'"]').prop('checked',false);
                    } else {
                        $('input:checkbox[name="'+elNm+'"][value="'+defaultValue+'"]').prop('checked',true);
                    }
                });
            }
            
            if(selectEls && selectEls.length > 0) {
                selectEls.forEach((el, idx) => {
                    const elId = el.id;
                    if (!elId) return;
                    const defaultValue = defaultValues?defaultValues[elId]??'':'';

                    if(isKendoWidget(elId)) {
                        $('#'+elId).data('kendoDropDownList').value(defaultValue);
                    } else {
                        $('#'+elId).val(defaultValue);
                    }
                });
            }
        }

        if (gridId) {
            kendoUi.readGridData('#' + gridId);
        }
    }

    /**
     * 요소ID가 KendoUI 모듈인지 확인
     * @param {Stirng} elementId 
     * @returns 
     */
    function isKendoWidget(elementId) {
        const data = $('#'+elementId).data();
        for(var key in data) {
            if(key.indexOf("kendo") === 0) return true;
        }
        return false;
    }

    /**
     * 요소ID가 KendoUI 모듈일 경우 모듈의 종류명을 리턴
     * @param {String} elementId 
     * @returns 
     */
    function getKendoWidgetType(elementId) {
        if(isKendoWidget(elementId)) {
            const data = $('#'+elementId).data();
            for(var key in data) {
                if(key.indexOf("kendo") === 0) return key;
            }
        }
        return null;
    }
    
    let treeMenuItems = []; // 메뉴바생성용 객체
    let allMenuItems = []; // 전체메뉴조회용 객체

    /**
     * 메뉴ID 를 이용해서 메뉴정보를 조회
     * null 또는 menu정보를 리턴
     */
    function getMenuItem(mid) {
        let item = null;
        if(allMenuItems != null && allMenuItems.length > 0) {
            const tmpItem = allMenuItems.find(d => d.menuNo === mid);
            if (tmpItem) {
                item = {
                    mid: tmpItem.menuNo, url: tmpItem.menuUrl, mName: tmpItem.menuNm
                };
            }
        }
        return item;
    }

    function getAllMenuItems() {
        return Array.isArray(allMenuItems) ? [...allMenuItems] : [];
    }

    let scrollbarInstances = {}; // mCustomScrollbar 인스턴스 관리
    /**
     * 관리자 메뉴 조회
     * TODO 1. 추후 호출URL 의 메뉴번호 수정필요
     *      2. 메뉴필드명이 결정되면 수정필요, 구조는 동일
     */
    function getBackMenu() {
        return (async () => {
            try {
                const response = await fetch(`${ctx}/data/comm/menuView`);
                const data = await response.json();
                if(data.error) {
                    console.log('Menu Read Server Error ::', data.timestamp, data.status, data.error);
                    return null;
                } else if(!data.success) {
                    console.log('Menu Read Server Fails ::', data.message);
                    return null;
                } else  {
                    const menuItems = data.data?.menuTree?.menuItems;
                    treeMenuItems = [...menuItems];
                    allMenuItems = data.data?.menuItems;

                    // HEAD MENU TAG
                    let menuHeadTag = '';
                    menuItems.forEach((d, idx) => {
                        // depth1
                        const depth1Active = (idx == 0 ? 'active' : '');
                        menuHeadTag += `<li class="${depth1Active}">`;

                        if(d.menuUrl && d.menuUrl != null && d.menuUrl != '') {
                            // 소메뉴가 없으며 바로 이동
                            menuHeadTag += `<a href="#" data-idx="`+idx+`" data-menu-no="${d.menuNo}" 
                                onclick="CommonUtil.activateTopMenu(this); loadPage(this, '${d.menuNo}','${d.menuNm}','${d.menuUrl}'); return false;">`;
                        } else {
                            // 소메뉴가 있을 경우
                            menuHeadTag += `<a href="#" data-idx="`+idx+`" data-menu-no="${d.menuNo}" onclick="CommonUtil.activateTopMenu(this); return false;">`;
                        }
                        menuHeadTag += `${d.menuNm}</a></li>`;
                    });

                    // ALL MENU TAG
                    let menuAllTag = '';   	
                    menuItems.forEach(d => {
                        menuAllTag += `<div class="menu-item">
                            <div class="title">${d.menuNm}</div>
                        `;
                        if(d.menuItems && d.menuItems.length > 0) {
                            d.menuItems.forEach(d2 => {
                                menuAllTag += `<div class="item item-lg"><a href="#"><span>${d2.menuNm}</span><i class="fas fa-angle-right"></i></a></div>`;
                                if(d2.menuItems && d2.menuItems.length > 0) {
                                    menuAllTag += '<ul>';
                                    d2.menuItems.forEach(d3 => {
                                        menuAllTag += `<li class="item"><a href="#"><span>${d3.menuNm}</span><i class="fas fa-angle-right"></i></a></li>`;
                                    });
                                    menuAllTag += '</ul>';
                                }
                                    
                                menuAllTag += '';
                            });
                            menuAllTag += '';
                        }
                        menuAllTag += '</div>';
                    });

                    // console.log('## menuAllTag', menuAllTag);

                    return {menuAllTag: menuAllTag, menuHeadTag: menuHeadTag};
                }
            } catch(e) {
                console.log('Menu Read Server Error ::', e);
                return {menuAllTag: null, menuHeadTag: null};
            }
        })();
    }

    /**
     * mCustomScrollbar 초기화 - 안전하게 처리
     */
    function initializeMainMenuScrollbar() {
        try {
            const $menu = $(".main-menu");

            // 기존 스크롤바 인스턴스 제거
            if ($menu.data('mcs')) {
                $menu.mCustomScrollbar("destroy");
                delete scrollbarInstances['mainMenu'];
            }

            // 새로운 스크롤바 초기화
            $menu.mCustomScrollbar({
                setTop: "10px",
                setHeight: "calc(100% - 140px)",
                scrollInertia: 300,
                mouseWheel: {
                    scrollAmount: 120,
                    normalizeDelta: true,
                },
                scrollEasing: "easeInOut",
            });

            scrollbarInstances['mainMenu'] = $menu;
            // console.log("Main menu scrollbar initialized");
        } catch(e) {
            console.error("Error initializing main menu scrollbar:", e);
        }
    }

    /**
     * 탭 영역 mCustomScrollbar 초기화
     */
    function initializeTabScrollbar() {
        try {
            const $tabContainer = $("#tab_mCSB_2_container");

            if($tabContainer.length === 0) {
                console.warn("Tab container not found");
                return;
            }

            // 기존 스크롤바 인스턴스 제거
            if ($tabContainer.data('mcs')) {
                $tabContainer.mCustomScrollbar("destroy");
                delete scrollbarInstances['tabMenu'];
            }

            // 새로운 스크롤바 초기화
            $tabContainer.mCustomScrollbar({
                axis: "x",
                theme: "dark-thin",
                scrollInertia: 300,
                mouseWheel: {
                    scrollAmount: 120,
                    normalizeDelta: true,
                },
            });

            scrollbarInstances['tabMenu'] = $tabContainer;
            // console.log("Tab scrollbar initialized");
        } catch(e) {
            console.error("Error initializing tab scrollbar:", e);
        }
    }

    // 상단 메뉴 활성화 + 사이드 메뉴 렌더링
    function activateTopMenu(el) {
        // 상단 메뉴 active 이동
        document.querySelectorAll('#gnbMenu li').forEach(li => li.classList.remove('active'));
        el.closest('li').classList.add('active');

        // 사이드 메뉴 렌더링
        const idx = el.getAttribute('data-idx');
        CommonUtil.renderSideMenu(idx);

        // 메뉴 DOM 완성 후 스크롤바 초기화
        setTimeout(() => {
            CommonUtil.initializeMainMenuScrollbar();
        }, 100);

        // setMainMenuEvent();

    }

    /**
     * 사이드 메뉴 렌더링
     */
    function renderSideMenu(idx) {
        const selectedMenu = treeMenuItems[idx];
        const subItems = selectedMenu.menuItems || [];

        console.log("selectedMenu", selectedMenu);

        let sideTag = '';
        // depth1
        sideTag += `<div class="side-menu-header">
                        <h2>${selectedMenu.menuNm}</h2>
                    </div><div class="pcoded-inner-navbar main-menu">`;
        if(subItems && subItems.length > 0) {
            // depth2
            subItems.forEach((d2, idx2) => {
                const depth2Active = (( idx == 0 && idx2 == 0) ? 'active' : '');
                sideTag += `<div class="pcoded-navigatio-lavel ${depth2Active}" data-depth2-idx="${idx2}">`;
                if(d2.menuUrl && d2.menuUrl != null && d2.menuUrl != '') {
                    sideTag += `<span onclick="loadPage(this, '${d2.menuNo}','${d2.menuNm}','${d2.menuUrl}');">`;
                } else {
                    sideTag += '<span>';
                }
                sideTag += `${d2.menuNm}</span></a></div>`;

                // depth3
                if(d2.menuItems && d2.menuItems.length > 0) {
                    sideTag += '<ul class="pcoded-item pcoded-left-item">';
                    d2.menuItems.forEach((d3, idx3) => {
                        const depth3Active = (( idx2 == 0 && idx3 == 0) ? 'active' : '');
                        sideTag += `<li class="pcoded-hasmenu ${depth3Active}" data-depth3-idx="${idx3}">`;
                        if(d3.menuUrl && d3.menuUrl != null && d3.menuUrl != '') {
                            sideTag += `<a href="javascript:void(0);" onclick="loadPage(this, '${d3.menuNo}','${d3.menuNm}','${d3.menuUrl}');">`;
                        } else {
                            sideTag += '<a href="javascript:void(0);">';
                        }
                        sideTag += `<span class="pcoded-micon"></span><span class="pcoded-mtext">${d3.menuNm}</span></a></li>`;
                    });
                    sideTag += '</ul>';
                }
            });
        }
        sideTag += '</div>'; // depth2 닫힘 태그

        $('#tab-1').html(sideTag); // LEFT MENU 생성

        // 메뉴 렌더링 후 이벤트 재바인딩
        setMainMenuEvent();
    }


    /**
     * JS를 동적으로 로드
     * @param {String} src JS파일경로
     * @returns 
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(src + " load Error"));

            document.head.appendChild(script);
        });
    }

    /**
     * 중복되지않는 키를 생성
     */
    function generateKey() {
        const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford Base32
        
        let time = Date.now();
        let timeChars = '';
        for (let i = 0; i < 10; i++) {
            timeChars = ENCODING[time % 32] + timeChars;
            time = Math.floor(time / 32);
        }

        // 2. randomness (80bit → 16 chars)
        const randomBytes = new Uint8Array(10);
        window.crypto.getRandomValues(randomBytes);

        let randChars = '';
        for (let i = 0; i < randomBytes.length; i++) {
            randChars += ENCODING[randomBytes[i] % 32];
        }

        // 5. 최종 키
        return `${timeChars}${randChars}`;
    }

    /** 이메일 유효성 체크 */
    function isValidEmail(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /** 랜덤 값 */
    function secureRandom(len) {
        if (len < 1) len = 1;
        if (len > 10) len = 10;

        var randomVal = '';

        if(window.crypto && window.crypto.getRandomValues) {
            var uArray = new Uint32Array(1);
            randomVal = String(window.crypto.getRandomValues(uArray)[0]);
            randomVal = randomVal.substr(0,len);
        }

        return randomVal;
    }

    /** html 엔티티코드에 대한 문자표현식을 unescape 한다 */
    function unescapeHtml(str) {
        if (str === null || str === undefined) {
            return str;
        }

        var map = {
            '&quot;': '"',
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#39;': "'",
            '&apos;': "'",
            '&nbsp;': '\u00A0',
            '&copy;': '©',
            '&reg;': '®',
            '&trade;': '™',
            '&euro;': '€'
        };

        // 기본 HTML Entity 치환
        str = str.replace(
            /&quot;|&amp;|&lt;|&gt;|&#39;|&apos;|&nbsp;|&copy;|&reg;|&trade;|&euro;/g,
            function(match) {
                return map[match];
            }
        );

        // 10진수 숫자 엔티티 처리
        str = str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });

        // 16진수 숫자 엔티티 처리
        str = str.replace(/&#x([0-9a-fA-F]+);/g, function(match, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });

        return str;
    }

    /**
     * 숫자 외 문자 입력 시 비숫자를 제거하고 인라인 피드백 메시지를 표시합니다.
     *
     * 사용법:
     *   <input type="text" onkeydown="chkNum(this)" />
     *
     * 동작 방식:
     *   - 비숫자 입력 시 해당 문자를 제거하고 input 바로 아래에 안내 문구 표시
     *   - 메시지는 1.5초 후 자동으로 사라짐
     *   - 메시지 요소가 없으면 자동 생성, 있으면 재사용
     *
     * @param {HTMLInputElement} obj - 입력 필드 요소
     */
    function chkNum(obj) {
        var pos = obj.selectionStart;
        var prev = obj.value;
        var next = prev.replace(/[^0-9]/g, '');

        if (prev !== next) {
            // 비숫자 제거 후 커서 위치 보정
            var removed = prev.slice(0, pos).replace(/[^0-9]/g, '').length;
            obj.value = next;
            obj.setSelectionRange(removed, removed);

            // 인라인 피드백 메시지 표시
            _showInpError(obj, '⚠ 숫자만 입력해주세요.');
        }
    }

    /** 첫글자 공백 불가 처리 */
    function chkNull(obj){
        var word = obj.value ;
        var str = /[\s]/g ;
        if(word.length>0){
            if( str.test( word.substring(0, 1) ) === true ){
                obj.value = '';
                _showInpError(obj, '⚠ 첫 글자는 공백을 입력할 수 없습니다.');
                return false;
            }
        }
        return true;
    }

    /**
     * 특정 컨테이너 내의 모든 input text, number 요소의 첫 문자 공백을 제거합니다.
     * @param {string|HTMLElement} containerId - 컨테이너 ID 또는 요소
     */
    function trimStartInputs(containerId) {
        const $container = typeof containerId === 'string' ? $('#' + containerId.replace(/^#/, '')) : $(containerId);
        if ($container.length === 0) return;

        $container.find('input[type="text"], input[type="number"], textarea').each(function() {
            const $this = $(this);
            const val = $this.val();
            if (typeof val === 'string' && val.length > 0 && /^\s/.test(val)) {
                $this.val(val.trimStart());
            }
        });
    }

    /**
     * input 바로 아래에 안내 메시지를 표시하고 1.5초 후 자동 제거합니다.
     * @param {HTMLInputElement} obj
     * @param {string} message - 표시할 메시지
     */
    function _showInpError(obj, message) {
        var MSG_ID = '__chkNum_msg__' + (obj.id || obj.name || '');
        var msgEl = document.getElementById(MSG_ID);

        if (!msgEl) {
            msgEl = document.createElement('span');
            msgEl.id = MSG_ID;
            msgEl.className = 'pd-inp-error';
            obj.parentNode.insertBefore(msgEl, obj.nextSibling);
        }

        msgEl.textContent = message;
        msgEl.style.visibility = 'visible';
        msgEl.style.opacity = '1';

        // 기존 타이머 초기화 후 재설정 (연속 입력 시 중복 방지)
        clearTimeout(msgEl._hideTimer);
        msgEl._hideTimer = setTimeout(function () {
            msgEl.style.opacity = '0';
            setTimeout(function () { msgEl.style.visibility = 'hidden'; }, 400);
        }, 1500);
    }

    /** 천단위 콤마 */
    function commaStr(num) {
        // 빈 값 체크
        if (!num || num === "") {
            return "";
        }

        // 문자열인지 숫자인지 체크 후, 숫자로 변환 가능한지 확인
        const number = parseFloat(num);

        // 숫자로 변환되지 않으면 그대로 반환
        if (isNaN(number)) {
            return value;
        }

        // 숫자에 콤마를 추가하여 반환
        return number.toLocaleString();
    }

    /** KendoGrid 검색 
     * 호출 시 그리드 필터/정렬 정보는 초기화됨
     * @param {string} id 켄도그리드ID [필수]
     * @param {number|null} page 이동할페이지번호 [선택]
     *                           없을 경우 현재 페이지 기준으로 다시 읽어들임
     *                           검색영역의 검색에서 사용할 경우 0 으로 입력필요  
    */
    function searchGrid(id, page) {
        const grid = $(id).data('kendoGrid').dataSource;
        grid.sort([]); // 정렬초기화
        grid.filter([]); // 필터초기화

        if(page && typeof page === 'number') {
            grid.page(page);
        } else {
            grid.read();
        }
    }

    /* 검색영역 접기/열기 */
    function searchAreaToggle(btn) {
        const searchArea = btn.closest('.search-area');
        const content = searchArea.querySelector('.search-area-content');
        const isCollapsed = searchArea.classList.toggle('close');

        content.style.display = isCollapsed ? 'none' : '';
        btn.innerHTML = isCollapsed ? '검색영역 펴기 <i></i>' : '검색영역 접기 <i></i>';

        // 그리드 리사이즈 트리거
        setTimeout(() => {
            $(window).trigger('resize');
        }, 300); // 애니메이션 시간을 고려하여 지연 호출
    }

    // input on keyup keydown
    function initEnvironment() {
        // 텍스트 입력 숫자만 입력 기능
        $('body').on('input', 'input[type=text].number, input[type=tel].number', function (event) {
            var $this = $(this);
            var value = $this.val();
            var cleanValue = value.replace(/[^0-9]/g, "");

            if (value !== cleanValue) {
                $this.val(cleanValue);
            }
        });

        // 텍스트 입력 숫자만 입력 기능 (0이 앞에 오지 않게)
        $('body').on('input', 'input[type=text].number2', function (event) {
            var $this = $(this);
            var value = $this.val();

            var cleanValue = value.replace(/[^0-9]/g, "");

            cleanValue = cleanValue.replace(/^0+/, "");

            if (value !== cleanValue) {
                $this.val(cleanValue);
            }
        });

        // 텍스트 입력 영어+숫자만 입력 기능
        $('body').on('input', 'input[type=text].eng-num', function (event) {
            var $this = $(this);
            var value = $this.val();
            var cleanValue = value.replace(/[^A-Za-z0-9]/g, "");

            if (value !== cleanValue) {
                $this.val(cleanValue);
            }
        });

        // 텍스트 입력 영어+숫자만 입력 기능
        $('body').on('input', 'input[type=text].en', function (event) {
            var $this = $(this);
            var value = $this.val();
            var cleanValue = value.replace(/[^A-Za-z0-9]/g, "");

            if (value !== cleanValue) {
                $this.val(cleanValue);
            }
        });

        // .phone 클래스 input 자동 커서 이동
        $('body').on('input', 'input.phone', function() {
            var $this = $(this);
            var maxLength = parseInt($this.attr('maxlength'));
            var currentLength = $this.val().length;

            if (currentLength >= maxLength) {
                var name = $this.attr('name');
                var $phoneInputs = $this.closest('.input-group-prepend').find('input.phone[name="' + name + '"]');
                if ($phoneInputs.length === 0) {
                    $phoneInputs = $this.closest('td').find('input.phone[name="' + name + '"]');
                }
                if ($phoneInputs.length === 0) {
                    $phoneInputs = $('input.phone[name="' + name + '"]');
                }

                var index = $phoneInputs.index(this);
                if (index >= 0 && index < $phoneInputs.length - 1) {
                    $phoneInputs.eq(index + 1).focus();
                }
            }
        });

    }

    // 상세페이지 전화번호들 처리
    function populatePhoneData(id, data) {
        if (data.phnNo) {
            const phnParts = data.phnNo.split('-');
            if (phnParts.length === 3) {
                $("#"+id+"_phnNo1").val(phnParts[0]);
                $("#"+id+"_phnNo2").val(phnParts[1]);
                $("#"+id+"_phnNo3").val(phnParts[2]);
            }
        }
        if (data.mblPhn) {
            const mblParts = data.mblPhn.split('-');
            if (mblParts.length === 3) {
                $("#"+id+"_mblPhn1").val(mblParts[0]);
                $("#"+id+"_mblPhn2").val(mblParts[1]);
                $("#"+id+"_mblPhn3").val(mblParts[2]);
            }
        }
        if (data.faxNo) {
            const faxParts = data.faxNo.split('-');
            if (faxParts.length === 3) {
                $("#"+id+"_faxNo1").val(faxParts[0]);
                $("#"+id+"_faxNo2").val(faxParts[1]);
                $("#"+id+"_faxNo3").val(faxParts[2]);
            }
        }
    }

    // 툴팁
    function initTooltip() {
        // 마우스 오버 시 툴팁 표시 (이벤트 위임 사용 - 동적 생성 요소도 처리)
        $(document).on('mouseenter', '.tooltip-box', function() {
            const $box = $(this);
            const $bubble = $box.find('.tooltip-bubble');
            
            if ($bubble.length === 0) return;

            // 이미 body에 생성된 툴팁이 있다면 제거 (중복 방지)
            $('#dynamic-tooltip-bubble').remove();

            // 툴팁 내용을 복제하여 body에 추가
            const $dynamicBubble = $bubble.clone().attr('id', 'dynamic-tooltip-bubble').appendTo('body');
            
            // 위치 계산
            const boxRect = $box[0].getBoundingClientRect();
            const $icon = $box.find('i[class*="icon-"]');
            let targetCenterX;
            
            if ($icon.length > 0) {
                const iconRect = $icon[0].getBoundingClientRect();
                targetCenterX = iconRect.left + (iconRect.width / 2);
            } else {
                targetCenterX = boxRect.left + (boxRect.width / 2);
            }
            
            const bubbleWidth = $bubble.outerWidth();
            const bubbleHeight = $bubble.outerHeight();
            
            // 기본 위치 (아이콘 위쪽 중앙)
            let top = boxRect.top - bubbleHeight - 10 + window.scrollY;
            let left = targetCenterX - (bubbleWidth / 2);
            let arrowDirection = 'bottom';

            // 화면 상단을 벗어나는 경우 하단으로 표시
            if (top < window.scrollY) {
                top = boxRect.bottom + 10 + window.scrollY;
                arrowDirection = 'top';
            }

            // 화면 좌우를 벗어나는 경우 보정
            if (left < 10) left = 10;
            if (left + bubbleWidth > $(window).width() - 10) {
                left = $(window).width() - bubbleWidth - 20;
            }

            // 스타일 적용
            $dynamicBubble.css({
                'position': 'absolute',
                'top': top + 'px',
                'left': left + 'px',
                'z-index': '9999',
                'display': 'inline-flex',
                'opacity': '1',
                'pointer-events': 'none',
                'transform': 'none', // 인라인 transform 제거
                'margin': '0'
            });

            // 화살표 위치 및 방향 조정
            const $arrow = $dynamicBubble.find('.arrow');
            const arrowLeft = targetCenterX - left;
            
            if (arrowDirection === 'top') {
                $arrow.css({
                    'bottom': 'auto',
                    'top': '-7px',
                    'left': arrowLeft + 'px',
                    'border-top': 'none',
                    'border-bottom': '7px solid #aaa'
                }).addClass('arrow-top');
                
                // 화살표 내부 색상 처리를 위한 가상요소 스타일은 CSS에서 처리됨 (arrow-top 클래스 이용)
            } else {
                $arrow.css({
                    'bottom': '-7px',
                    'top': 'auto',
                    'left': arrowLeft + 'px',
                    'border-bottom': 'none',
                    'border-top': '7px solid #aaa'
                }).removeClass('arrow-top');
            }

            $dynamicBubble.addClass('active');
        });

        // 마우스 아웃 시 툴팁 제거
        $(document).on('mouseleave', '.tooltip-box', function() {
            $('#dynamic-tooltip-bubble').remove();
        });

        // 스크롤 시 툴팁 제거 (위치 틀어짐 방지)
        $(window).on('scroll.tooltip', function() {
            $('#dynamic-tooltip-bubble').remove();
        });
    }

    /**
     * 엑셀다운로드 시 사용
     * @param {*} url 서버호출URL
     * @param {*} params 검색 파라메터, {key:value}
     */
    function excelDown(url, params) {
        const form = document.createElement("form");
        form.method = 'POST';
        form.action = url;
        form.style.display = "none";
        form.target = "_self";
        Object.keys(params).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = params[key] ?? "";
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    function setCookie(name, value, maxAgeSeconds) {
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`;
        if (typeof maxAgeSeconds === 'number') {
            cookie += `; max-age=${maxAgeSeconds}`;
        }
        document.cookie = cookie;
    }

    function getCookie(name) {
        const prefix = `${encodeURIComponent(name)}=`;
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf(prefix) === 0) {
                return decodeURIComponent(cookies[i].substring(prefix.length));
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0`;
    }

    function downloadWithLoading(url, params, options) {
        const opts = options || {};
        const method = (opts.method || 'POST').toUpperCase();
        const timeoutMs = opts.timeoutMs || 120000;
        const pollMs = opts.pollMs || 500;
        const cookieName = opts.cookieName || 'fileDownloadToken';
        const timeoutMessage = opts.timeoutMessage || '파일 다운로드가 지연되고 있습니다. 다시 시도해 주세요.';
        const token = `${generateKey()}_${Date.now()}`;
        const requestParams = Object.assign({}, params || {}, { downloadToken: token });

        deleteCookie(cookieName);

        const form = document.createElement('form');
        form.method = method;
        form.action = url;
        form.style.display = 'none';
        form.target = '_self';

        Object.keys(requestParams).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = requestParams[key] ?? '';
            form.appendChild(input);
        });

        document.body.appendChild(form);

        let completed = false;
        const finish = (timedOut) => {
            if (completed) {
                return;
            }
            completed = true;
            clearInterval(pollingTimer);
            clearTimeout(timeoutTimer);
            deleteCookie(cookieName);
            commonUi.subLoadingHide();
            if (timedOut) {
                alert(timeoutMessage);
            }
        };

        const pollingTimer = window.setInterval(() => {
            if (getCookie(cookieName) === token) {
                finish(false);
            }
        }, pollMs);

        const timeoutTimer = window.setTimeout(() => {
            finish(true);
        }, timeoutMs);

        commonUi.subLoadingShow();
        form.submit();

        window.setTimeout(() => {
            if (form.parentNode) {
                form.parentNode.removeChild(form);
            }
        }, 1000);
    }

    /**
     * fetch 기반 탬플릿 파일 다운로드 공통 처리
     * 성공 시 파일 다운로드를 실행하고, 실패 시 서버 메시지를 alert로 표시한다.
     * @param {*} params 요청 파라메터, {key:value}
     * @param {*} method HTTP Method, 기본 GET
     * @returns {Promise<boolean>} 다운로드 성공 여부
     */
    async function fetchFileDown(params, method) {
        const requestMethod = (method || 'GET').toUpperCase();
        const requestParams = params || {};
        let requestUrl = `${ctx}/data/comm/downloadTemplate.do`;
        const fetchOptions = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        if (requestMethod === 'GET') {
            const searchParams = new URLSearchParams();
            Object.keys(requestParams).forEach((key) => {
                const value = requestParams[key];
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value);
                }
            });

            const queryString = searchParams.toString();
            if (queryString) {
                requestUrl += (requestUrl.indexOf('?') > -1 ? '&' : '?') + queryString;
            }
        } else {
            const formData = new URLSearchParams();
            Object.keys(requestParams).forEach((key) => {
                const value = requestParams[key];
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            fetchOptions.body = formData.toString();
        }

        try {
            const response = await fetch(requestUrl, fetchOptions);
            const contentType = response.headers.get('content-type') || '';

            if (contentType.indexOf('application/json') > -1) {
                const result = await response.json();
                alert(result && result.message ? result.message : '다운로드 중 오류가 발생했습니다.');
                return false;
            }

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText || '다운로드 중 오류가 발생했습니다.');
                return false;
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition') || '';
            let fileName = 'download';
            let match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

            if (match && match[1]) {
                fileName = decodeURIComponent(match[1]);
            } else {
                match = disposition.match(/filename=\"?([^\";]+)\"?/i);
                if (match && match[1]) {
                    fileName = match[1];
                }
            }

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
            return true;
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            alert('다운로드 중 오류가 발생했습니다.');
            return false;
        }
    }

    /**
     * fetch 기반 파일 다운로드 공통 처리
     * 성공 시 파일 다운로드를 실행하고, 실패 시 서버 메시지를 alert로 표시한다.
     * @param {*} params 요청 파라메터, {key:value}
     * @param {*} method HTTP Method, 기본 GET
     * @returns {Promise<boolean>} 다운로드 성공 여부
     */
    async function fetchAtchFileDown(fileId) {
        let requestUrl = `${ctx}/data/files/${fileId}/download.do`;
        const fetchOptions = {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        try {
            const response = await fetch(requestUrl, fetchOptions);
            const contentType = response.headers.get('content-type') || '';

            if (contentType.indexOf('application/json') > -1) {
                const result = await response.json();
                alert(result && result.message ? result.message : '다운로드 중 오류가 발생했습니다.');
                return false;
            }

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText || '다운로드 중 오류가 발생했습니다.');
                return false;
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition') || '';
            let fileName = 'download';
            let match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

            if (match && match[1]) {
                fileName = decodeURIComponent(match[1]);
            } else {
                match = disposition.match(/filename=\"?([^\";]+)\"?/i);
                if (match && match[1]) {
                    fileName = match[1];
                }
            }

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
            return true;
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            alert('다운로드 중 오류가 발생했습니다.');
            return false;
        }
    }

    /**
     * kendoGrid의 내용에 대한 엑셀다운로드 시 사용
     * 그리드와 연결된 검색조건과 필터 정보를 모두 추출하여 서버에 전송하여 엑셀다운로드를 실행한다
     * @param {*} url 서버호출URL
     * @param {*} gridId Grid ID
     */
    function filterExcelDown(url, gridId) {
        var ds = $(gridId).data("kendoGrid").dataSource;
        var options = { page: 1, pageSize: 0, sort: ds.sort(), filter: ds.filter() };
        var params = ds.transport.parameterMap(options, "read");

        const form = document.createElement("form");
        form.method = 'POST';
        form.action = url;
        form.style.display = "none";
        form.target = "_self";

        var inputPage = document.createElement("input");
        inputPage.type = "hidden";
        inputPage.name = "pgae";
        inputPage.value = "1";
        form.appendChild(inputPage);

        var inputPageSize = document.createElement("input");
        inputPageSize.type = "hidden";
        inputPageSize.name = "pageSize";
        inputPageSize.value = "0";
        form.appendChild(inputPageSize);

        var inputFilter = document.createElement("input");
        inputFilter.type = "hidden";
        inputFilter.name = "filter";
        inputFilter.value = params.filter;
        form.appendChild(inputFilter);

        var inputItem = document.createElement("input");
        inputItem.type = "hidden";
        inputItem.name = "item";
        inputItem.value = params.item;
        form.appendChild(inputItem);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    // ── Dirty Check (수정 변경 감지) ─────────────────────────────────────────

    var dirty = false;

    /**
     * 변경 감지 초기화 — 데이터 바인딩 완료 후 호출
     * 텍스트/textarea 필드에 change 이벤트를 바인딩하고 dirty 상태를 초기화한다.
     * @param {string} selectors jQuery 선택자 (쉼표 구분 복수 가능)
     */
    function initDirtyCheck(selectors) {
        dirty = false;
        if (selectors) {
            $(selectors).off('change.dirtyCheck').on('change.dirtyCheck', function() {
                dirty = true;
            });
        }
    }

    /** Kendo 드롭다운·라디오 등 change 이벤트가 없는 요소에서 수동으로 dirty 처리 */
    function markDirty() {
        dirty = true;
    }

    /** 저장 성공·loadDetail 완료 후 dirty 초기화 */
    function resetDirty() {
        dirty = false;
    }

    /**
     * dirty 상태이면 confirm 후 콜백 실행, 아니면 바로 실행
     * @param {Function} onConfirm 이동·실행할 콜백
     * @param {string}   [message] confirm 메시지 (기본값 제공)
     */
    function confirmIfDirty(onConfirm, message) {
        if (!dirty) {
            onConfirm();
            return;
        }
        var msg = message || '입력한 내용이 저장되지 않습니다.\n정말 목록으로 이동하시겠습니까?';
        KendoDialog.confirm(msg, { title: '확인' }).then(function(ok) {
            if (ok) onConfirm();
        });
    }

    /**
     * 클립보드 복사
     * @param {string} text 복사할 텍스트
     */
    function copyToClipboard(text) {
        if (!text) return;

        // 임시 textarea 생성
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);

        // 선택 및 복사
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('fallback 클립보드 복사 실패:', err);
        }

        // 제거
        document.body.removeChild(textarea);
    }

    /**
     * Date객체를 받아 yyyy-mm-dd 형식의 문자열로 반환
     * @param {*} date Date객체
     */
    function formatDate(date) {
        let year = date.getFullYear();
        // 월은 0부터 시작하므로 +1, 1자리 수는 앞에 0 추가
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }

    /**
     * yyyy-MM-dd HH:mm 문자열을 Date 객체로 변환
     * 형식이 틀리거나 유효하지 않은 날짜이면 null 반환
    */
    function parseDateTime(dateTimeStr) {
        if (typeof dateTimeStr !== "string") {
            return null;
        }

        const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
        const match = dateTimeStr.match(regex);

        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const hour = Number(match[4]);
        const minute = Number(match[5]);

        // 범위 검사
        if (
            month < 1 || month > 12 ||
            day < 1 || day > 31 ||
            hour < 0 || hour > 23 ||
            minute < 0 || minute > 59
        ) {
            return null;
        }

        const date = new Date(year, month - 1, day, hour, minute);

        // 실제 날짜 검증 (자동 보정 방지)
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day ||
            date.getHours() !== hour ||
            date.getMinutes() !== minute
        ) {
            return null;
        }

        return date;
    }

    return {
        initForm: initForm,
        isKendoWidget: isKendoWidget,
        getKendoWidgetType: getKendoWidgetType,
        getBackMenu: getBackMenu,
        loadScript: loadScript,
        generateKey: generateKey,
        isValidEmail: isValidEmail,
        secureRandom: secureRandom,
        unescapeHtml: unescapeHtml,
        chkNum: chkNum,
        chkNull: chkNull,
        commaStr: commaStr,
        searchGrid: searchGrid,
        searchAreaToggle: searchAreaToggle,
        trimStartInputs: trimStartInputs,
        activateTopMenu: activateTopMenu,
        renderSideMenu: renderSideMenu,
        initializeMainMenuScrollbar: initializeMainMenuScrollbar,
        initializeTabScrollbar: initializeTabScrollbar,
        initEnvironment: initEnvironment,
        populatePhoneData: populatePhoneData,
        initTooltip: initTooltip,
        excelDown: excelDown,
        downloadWithLoading: downloadWithLoading,
        fetchFileDown: fetchFileDown,
        fetchAtchFileDown: fetchAtchFileDown,
        filterExcelDown: filterExcelDown,
        getMenuItem: getMenuItem,
        getAllMenuItems: getAllMenuItems,
        initDirtyCheck: initDirtyCheck,
        markDirty: markDirty,
        resetDirty: resetDirty,
        confirmIfDirty: confirmIfDirty,
        copyToClipboard: copyToClipboard,
        formatDate: formatDate,
        parseDateTime: parseDateTime
    }
})();
