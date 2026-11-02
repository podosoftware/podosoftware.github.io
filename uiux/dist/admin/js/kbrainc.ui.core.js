/**
 * KBRAINC UI CORE (Kendo 제외)
 * dependency : jquery
 */
;(function($, undefined) {
    var kbrainc = window.kbrainc = window.kbrainc || { },
        extend = $.extend,
        each = $.each,
        isArray = $.isArray,
        proxy = $.proxy,
        noop = $.noop,
        math = Math,
        FUNCTION = "function",
        STRING = "string",
        OBJECT = "object",
        UNDEFINED = "undefined";

    extend(kbrainc, {
        ui: kbrainc.ui || {}
    });

})(jQuery);

;(function($, undefined) {
    'use strict';

    var ui = kbrainc.ui || {},
        extend = $.extend,
        each = $.each,
        isArray = $.isArray,
        proxy = $.proxy,
        noop = $.noop,
        POST = 'POST',
        JSON = 'json',
        VISIBLE = ":visible",
        DISABLED = "disabled",
        STRING = 'string',
        CLICK = "click",
        CHANGE = "change",
        UNDEFINED = "undefined",

        ERROR_MESSAGES = {
            'Forbidden' : "접근 권한이 없습니다.",
            'timeout': "처리 대기 시간을 초가하였습니다. 잠시 후 다시 시도하여 주십시오.",
            'parsererror' : "데이터 파싱 중에 오류가 발생하였습니다."
        },

        STATUS_ERROR_MESSAGES = {
            '0' : "오프라인 상태입니다.",
            '404' : "요청하신 웹 페이지를 찾을 수 없습니다.",
            '405' : "웹 사이트에서 페이지를 표시할 수 없습니다.",
            '406' : "이 웹 페이지 형식을 읽을 수 없습니다.",
            '408' : "서버에서 웹 페이지를 표시하는 데 시간이 너무 오래 걸리거나 같은 페이지를 요청하는 사용자가 너무 많습니다. 나중에 다시 시도하여 주십시오.",
            '409' : "서버에서 웹 페이지를 표시하는 데 시간이 너무 오래 걸리거나 같은 페이지를 요청하는 사용자가 너무 많습니다. 나중에 다시 시도하여 주십시오.",
            '500' : "오류가 발생하였습니다.",
            '503' : "서비스 이용이 지연되고 있습니다. 잠시 후 다시 시도하여 주십시오.",
            '403' : "접근 권한이 없습니다. 권한이 필요한 경우 관리자에게 문의하십시오."
        };

    function extractAjaxErrorMessage($xhr) {
        var message = "";

        if ($xhr.responseJSON) {
            if ($xhr.responseJSON.message) {
                return $xhr.responseJSON.message;
            }

            if ($xhr.responseJSON.error && $xhr.responseJSON.error.message) {
                return $xhr.responseJSON.error.message;
            }
        }

        if ($xhr.responseText) {
            try {
                var obj = JSON.parse($xhr.responseText);

                if (obj !== null && obj.message) {
                    return obj.message;
                }

                if (obj !== null && obj.error && obj.error.message) {
                    return obj.error.message;
                }

                if (obj !== null && obj.error && obj.error.exceptionMessage) {
                    if (obj.error.exceptionMessage === 'Bad credentials') {
                        return '아이디 또는 비밀번호를 잘못 입력하셨습니다.';
                    }
                }
            } catch(e) {
                message = $xhr.responseText;
            }
        }

        return message;
    }
    function handleAjaxError(xhr) {
        var message = "";

        if (typeof xhr === STRING) {
            message = xhr;
        } else {
            var $xhr = xhr;

            // Kendo DataSource 호환성
            if ($xhr.xhr) {
                $xhr = $xhr.xhr;
            }

            // HTTP 상태 코드별 처리
            if ($xhr.status === 0 || $xhr.status === 404 || $xhr.status === 503 || $xhr.status === 403) {
                message = STATUS_ERROR_MESSAGES[$xhr.status];
            }
            // 500 에러 - 서버 응답 파싱
            else if ($xhr.status === 500) {
                message = extractAjaxErrorMessage($xhr) || STATUS_ERROR_MESSAGES[$xhr.status];
            }
            // 에러 타입별 처리
            else if ($xhr.errorThrown === "Forbidden" || $xhr.errorThrown === 'timeout' || $xhr.errorThrown === 'parsererror') {
                message = ERROR_MESSAGES[$xhr.errorThrown];
            }
            // 기타 에러
            else {
                message = extractAjaxErrorMessage($xhr) || STATUS_ERROR_MESSAGES[String($xhr.status)] || STATUS_ERROR_MESSAGES['500'];
            }
        }

        if (message) {
            alert(message);
        }

        return message;
    }
    function defined(x) {
        return (typeof x != UNDEFINED);
    };

    var DEFAULT_AJAX_SETTING = {
        type : POST,
        data : {},
        dataType : JSON,
        error:handleAjaxError
    };

    function ajax ( url, options ){
        options = options || {};
        var settings = extend(true, {}, DEFAULT_AJAX_SETTING , options );
        if( defined( url) ){
            settings.url = url;
        }
        return $.ajax(settings);
    };


    function exists ( element ){
        if( typeof element === "string")
            element = $(element);

        return  defined( element.data("role") );
    }

    function error(e){
        handleAjaxError(e.xhr);
    }

    function enableBootstrapModalStack() {
        $(document).on('show.bs.modal', '.modal', function () {
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function() {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        });
        $(document).on('hidden.bs.modal', '.modal', function () {
            $('.modal:visible').length && $(document.body).addClass('modal-open');
        });

    }

    function enableStackingBootstrapModal(renderTo, handlers){
        renderTo.on('hidden.bs.modal', function( event ) {
            if( handlers && isFunction(handlers['hidden.bs.modal'] ) ){
                handlers['hidden.bs.modal']();
            }

            $(this).removeClass( 'fv-modal-stack' );
            $('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) - 1 );
        });

        renderTo.on( 'shown.bs.modal', function ( event ) {
            if( handlers && isFunction(handlers['shown.bs.modal'] ) ){
                handlers['shown.bs.modal']();
            }
            // keep track of the number of open modals
            if ( typeof( $('body').data( 'fv_open_modals' ) ) == 'undefined' )
            {
                $('body').data( 'fv_open_modals', 0 );
            }
            // if the z-index of this modal has been set, ignore.
            if ( $(this).hasClass( 'fv-modal-stack' ) )
            {
                return;
            }
            $(this).addClass( 'fv-modal-stack' );
            $('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) + 1 );
            $(this).css('z-index', 2040 + (10 * $('body').data( 'fv_open_modals' )));
            $( '.modal-backdrop' ).not( '.fv-modal-stack' ).css( 'z-index', 1039 + (10 * $('body').data( 'fv_open_modals' )));
            $( '.modal-backdrop' ).not( 'fv-modal-stack' ).addClass( 'fv-modal-stack' );
        });
    }

    function timeStringSeconds(seconds) {
        seconds = parseInt (seconds);
        var hour = parseInt(seconds/3600);
        var min = parseInt((seconds%3600)/60);
        var sec = seconds%60;

        var hour_str = pad(hour, 2);
        var min_str = pad(min, 2);
        var sec_str = pad(sec, 2);

        var timeStr = "";
        if(hour == 0) {
            timeStr = min_str+":"+sec_str;
        } else {
            timeStr = hour_str+":"+min_str+":"+sec_str;
        }

        return timeStr;
    }

    function pad(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }

    extend(ui , {
        handleAjaxError : kbrainc.ui.handleAjaxError || handleAjaxError,
        error : error,
        defined : kbrainc.ui.defined || defined,
        ajax : kbrainc.ui.ajax || ajax,
        exists : exists,
        data : kbrainc.ui.data || {},
        timeStringSeconds : timeStringSeconds
    });



})(jQuery);
