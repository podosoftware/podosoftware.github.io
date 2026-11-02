/**
 * 관리자 SVG 아이콘 빌드 스크립트
 *
 * 실행: npm run icons
 *
 * 입력 : src/icons/adminIcons.js (단일 소스)
 * 출력 :
 *   public/admin/icons/svg/{name}.svg  — 개별 SVG 파일 (디자이너 전달, <img> 사용)
 *   public/admin/icons/sprite.svg      — <symbol> 스프라이트 (<svg><use href="…#ad-icon-name"/></svg>)
 *   public/admin/css/icons.css         — CSS 클래스 (<i class="ad-icon ad-icon--name"></i>)
 *   public/admin/js/admin-icon.js      — JS / jQuery 헬퍼 (PodoIcon.html(), $(el).adIcon())
 *
 * admin-icon.js 는 업무 사이트(jQuery 환경)에 그대로 넣는 파일이라 ES5 문법으로 생성합니다.
 * 아이콘 모양은 icons.css 가 그리고, 이 스크립트는 <i class="ad-icon …"> 태그만 만들어 줍니다.
 *
 * icons.css 는 mask-image 방식이라 아이콘 색이 글자색(color)을 그대로 따라갑니다.
 * → 기존 PNG 처럼 색상별(_on, _gray, _blue) 이미지를 따로 만들 필요가 없습니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ADMIN_ICONS, ICON_VIEWBOX, getIconSvgAttributes } from '../src/icons/adminIcons.js';

const UIUX_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ICON_DIR = path.join(UIUX_DIR, 'public', 'admin', 'icons');
const SVG_DIR = path.join(ICON_DIR, 'svg');
const CSS_FILE = path.join(UIUX_DIR, 'public', 'admin', 'css', 'icons.css');
const JS_FILE = path.join(UIUX_DIR, 'public', 'admin', 'js', 'admin-icon.js');

function toAttributeString(attributes) {
    return Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
}

function buildStandaloneSvg(icon) {
    const attributes = {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: ICON_VIEWBOX,
        width: '24',
        height: '24',
        ...getIconSvgAttributes(icon),
    };

    return `<svg ${toAttributeString(attributes)}>${icon.body}</svg>`;
}

function buildSprite() {
    const symbols = ADMIN_ICONS.map((icon) => {
        const attributes = {
            id: `ad-icon-${icon.name}`,
            viewBox: ICON_VIEWBOX,
            ...getIconSvgAttributes(icon),
        };

        return `    <symbol ${toAttributeString(attributes)}>${icon.body}</symbol>`;
    });

    return [
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">',
        '    <!-- [자동 생성] src/icons/adminIcons.js → npm run icons -->',
        ...symbols,
        '</svg>',
        '',
    ].join('\n');
}

/**
 * CSS url() 안에 넣을 SVG data URI
 * base64 대신 퍼센트 인코딩을 써서 용량이 작고, 개발자도구에서 내용을 읽을 수 있다.
 */
function toDataUri(svg) {
    const encoded = svg
        .replace(/"/g, "'")
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/\s+/g, ' ');

    return `url("data:image/svg+xml,${encoded}")`;
}

function buildCss() {
    const lines = [
        '/*',
        ' * [자동 생성] 관리자 공통 아이콘 — src/icons/adminIcons.js → npm run icons',
        ' *',
        ' * 사용법',
        ' *   <i class="ad-icon ad-icon--search" aria-hidden="true"></i>',
        ' *   크기: font-size 또는 .ad-icon--sm / --md / --lg',
        ' *   색상: color (부모 글자색을 따라감)',
        ' */',
        '.ad-icon {',
        '    display: inline-block;',
        '    flex-shrink: 0;',
        '    width: 1em;',
        '    height: 1em;',
        '    font-size: 16px;',
        '    vertical-align: middle;',
        '    background-color: currentColor;',
        '    -webkit-mask: var(--ad-icon) no-repeat center / contain;',
        '            mask: var(--ad-icon) no-repeat center / contain;',
        '}',
        '',
        '.ad-icon--sm { font-size: 12px; }',
        '.ad-icon--md { font-size: 20px; }',
        '.ad-icon--lg { font-size: 24px; }',
        '',
        '/* <svg><use></svg> 스프라이트 방식용 */',
        '.ad-svg {',
        '    display: inline-block;',
        '    width: 1em;',
        '    height: 1em;',
        '    font-size: 16px;',
        '    vertical-align: middle;',
        '}',
        '',
    ];

    for (const icon of ADMIN_ICONS) {
        lines.push(`.ad-icon--${icon.name} { --ad-icon: ${toDataUri(buildStandaloneSvg(icon))}; }`);
    }

    lines.push('');

    return lines.join('\n');
}

/**
 * 업무 사이트용 JS 헬퍼 (ES5, jQuery 선택)
 * 아이콘 이름 목록만 adminIcons.js 에서 받아 넣고, 나머지는 고정 코드다.
 */
function buildJs() {
    const names = ADMIN_ICONS.map((icon) => `        '${icon.name}'`).join(',\n');

    return `/*
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
${names}
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
`;
}

function checkDuplicateNames() {
    const seen = new Set();

    for (const icon of ADMIN_ICONS) {
        if (seen.has(icon.name)) {
            throw new Error(`[icons] 아이콘 이름이 중복되었습니다: ${icon.name}`);
        }
        seen.add(icon.name);
    }
}

function run() {
    checkDuplicateNames();

    // 이전 빌드에서 지워진 아이콘 파일이 남지 않도록 svg 폴더를 비우고 다시 만든다.
    fs.rmSync(SVG_DIR, { recursive: true, force: true });
    fs.mkdirSync(SVG_DIR, { recursive: true });
    fs.mkdirSync(path.dirname(CSS_FILE), { recursive: true });
    fs.mkdirSync(path.dirname(JS_FILE), { recursive: true });

    for (const icon of ADMIN_ICONS) {
        fs.writeFileSync(path.join(SVG_DIR, `${icon.name}.svg`), buildStandaloneSvg(icon) + '\n', 'utf8');
    }

    fs.writeFileSync(path.join(ICON_DIR, 'sprite.svg'), buildSprite(), 'utf8');
    fs.writeFileSync(CSS_FILE, buildCss(), 'utf8');
    fs.writeFileSync(JS_FILE, buildJs(), 'utf8');

    console.log(`[icons] ${ADMIN_ICONS.length}개 아이콘 → svg/, sprite.svg, icons.css, admin-icon.js 생성 완료`);
}

run();
