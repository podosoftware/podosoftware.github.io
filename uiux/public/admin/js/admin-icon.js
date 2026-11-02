/*
 * [자동 생성] 관리자 공통 아이콘 JS 헬퍼 — src/icons/adminIcons.js → npm run icons
 * 이 파일을 직접 수정하지 마세요.
 *
 * 필요: icons.css (아이콘 모양), jQuery 는 선택 ($.fn.adIcon 을 쓸 때만)
 *
 *   PodoIcon.html('search')                     → '<i class="ad-icon ad-icon--search" aria-hidden="true"></i>'
 *   PodoIcon.create('trash', { size: 'sm' })    → <i> 요소
 *   $('#btnDelete').adIcon('trash')              → 버튼 맨 앞에 아이콘 추가
 *
 * options
 *   size      : 'sm' | 'md' | 'lg'   (생략 시 16px)
 *   className : 추가할 클래스
 *   label     : 스크린리더용 이름 (없으면 aria-hidden 처리 — 장식용 아이콘)
 *   position  : 'prepend'(기본) | 'append'   ($.fn.adIcon 전용)
 */
(function (window) {
    'use strict';

    var ICON_NAMES = [
        'search',
        'close',
        'plus',
        'minus',
        'edit',
        'trash',
        'copy',
        'link',
        'send',
        'refresh',
        'download',
        'upload',
        'filter',
        'more',
        'menu',
        'arrow-up',
        'arrow-down',
        'chevron-up',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevrons-left',
        'chevrons-right',
        'caret-up',
        'caret-down',
        'caret-left',
        'caret-right',
        'next-circle',
        'info',
        'info-filled',
        'help',
        'alert',
        'check',
        'check-circle',
        'home',
        'user',
        'user-square',
        'users',
        'building',
        'lock',
        'logout',
        'mail',
        'phone',
        'message',
        'document',
        'paperclip',
        'folder',
        'folder-open',
        'grid',
        'video',
        'play-circle',
        'image-off',
        'calendar',
        'clock',
        'chart-bar',
        'chart-line',
        'settings'
    ];

    var SIZES = ['sm', 'md', 'lg'];

    function has(name) {
        return ICON_NAMES.indexOf(name) > -1;
    }

    function escapeAttr(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function buildClassName(name, options) {
        var classNames = ['ad-icon', 'ad-icon--' + name];

        if (options.size && SIZES.indexOf(options.size) > -1) {
            classNames.push('ad-icon--' + options.size);
        }
        if (options.className) {
            classNames.push(options.className);
        }

        return classNames.join(' ');
    }

    function warnUnknown(name) {
        if (window.console && window.console.warn) {
            window.console.warn('[PodoIcon] 등록되지 않은 아이콘입니다: "' + name + '"');
        }
    }

    /** 아이콘 태그 문자열 (HTML 문자열을 조립할 때) */
    function html(name, options) {
        options = options || {};

        if (!has(name)) {
            warnUnknown(name);
            return '';
        }

        var accessibility = options.label
            ? ' role="img" aria-label="' + escapeAttr(options.label) + '"'
            : ' aria-hidden="true"';

        return '<i class="' + escapeAttr(buildClassName(name, options)) + '"' + accessibility + '></i>';
    }

    /** 아이콘 요소 (DOM 에 바로 붙일 때) */
    function create(name, options) {
        options = options || {};

        if (!has(name)) {
            warnUnknown(name);
            return null;
        }

        var element = window.document.createElement('i');
        element.className = buildClassName(name, options);

        if (options.label) {
            element.setAttribute('role', 'img');
            element.setAttribute('aria-label', options.label);
        } else {
            element.setAttribute('aria-hidden', 'true');
        }

        return element;
    }

    window.PodoIcon = {
        names: ICON_NAMES.slice(),
        has: has,
        html: html,
        create: create
    };

    /* jQuery 가 있으면 $(selector).adIcon(name, options) 도 쓸 수 있게 등록 */
    if (window.jQuery) {
        window.jQuery.fn.adIcon = function (name, options) {
            options = options || {};

            return this.each(function () {
                var icon = create(name, options);
                if (!icon) {
                    return;
                }

                if (options.position === 'append') {
                    this.appendChild(icon);
                } else {
                    this.insertBefore(icon, this.firstChild);
                }
            });
        };
    }
})(window);
