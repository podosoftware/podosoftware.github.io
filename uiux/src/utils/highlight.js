/**
 * 가벼운 구문 강조 (html / css / js)
 *
 * 외부 라이브러리(prism 등)를 쓰지 않은 이유
 *  - 가이드에서 필요한 건 "읽기 쉬운 색 구분" 정도라 수십 줄이면 충분합니다.
 *  - 의존성이 줄어 유지보수/업데이트 부담이 없습니다.
 *  더 정교한 강조가 필요해지면 이 파일만 prism 으로 바꾸면 됩니다. (CodeBlock 은 그대로)
 *
 * 안전성: 모든 텍스트는 escapeHtml 을 거친 뒤 <span> 으로만 감싸므로
 *         결과를 innerHTML 로 넣어도 코드가 실행되지 않습니다.
 */

export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function wrap(className, text) {
    return `<span class="${className}">${escapeHtml(text)}</span>`;
}

/**
 * 정규식 규칙 목록을 순서대로 적용하는 공통 토크나이저
 * rules: [{ pattern: RegExp(전역 아님), render: (match) => string }]
 */
function tokenize(source, rules) {
    let result = '';
    let rest = source;

    while (rest.length > 0) {
        let earliest = null;

        for (const rule of rules) {
            const match = rule.pattern.exec(rest);
            if (match && (earliest === null || match.index < earliest.match.index)) {
                earliest = { rule, match };
            }
        }

        if (!earliest || earliest.match[0].length === 0) {
            result += escapeHtml(rest);
            break;
        }

        const { rule, match } = earliest;
        result += escapeHtml(rest.slice(0, match.index));
        result += rule.render(match);
        rest = rest.slice(match.index + match[0].length);
    }

    return result;
}

/* ---------------- HTML ---------------- */

function highlightTag(tagSource) {
    // <tag attr="value"> 내부를 태그명 / 속성명 / 값으로 나눈다.
    return tokenize(tagSource, [
        { pattern: /^<\/?[\w-]+/, render: (m) => wrap('tk-tag', m[0]) },
        { pattern: /"[^"]*"|'[^']*'/, render: (m) => wrap('tk-str', m[0]) },
        { pattern: /[\w:@-]+(?==)/, render: (m) => wrap('tk-attr', m[0]) },
    ]);
}

function highlightHtml(code) {
    return tokenize(code, [
        { pattern: /<!--[\s\S]*?-->/, render: (m) => wrap('tk-cm', m[0]) },
        {
            // <script> 본문은 JS 로 강조
            pattern: /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/,
            render: (m) => highlightTag(m[1]) + highlightJs(m[2]) + highlightTag(m[3]),
        },
        { pattern: /<\/?[\w-]+(?:\s[^<>]*?)?\/?>/, render: (m) => highlightTag(m[0]) },
    ]);
}

/* ---------------- CSS ---------------- */

function highlightCss(code) {
    return tokenize(code, [
        { pattern: /\/\*[\s\S]*?\*\//, render: (m) => wrap('tk-cm', m[0]) },
        { pattern: /"[^"]*"|'[^']*'/, render: (m) => wrap('tk-str', m[0]) },
        { pattern: /--[\w-]+/, render: (m) => wrap('tk-prop', m[0]) },
        { pattern: /#[0-9a-fA-F]{3,8}\b/, render: (m) => wrap('tk-num', m[0]) },
        { pattern: /\b(var|url|calc|rgba?|env)(?=\()/, render: (m) => wrap('tk-fn', m[0]) },
        { pattern: /[\w-]+(?=\s*:[^:])/, render: (m) => wrap('tk-attr', m[0]) },
        { pattern: /-?\b\d+(\.\d+)?(px|em|rem|vw|vh|%|s)?\b/, render: (m) => wrap('tk-num', m[0]) },
    ]);
}

/* ---------------- JS ---------------- */

const JS_KEYWORDS =
    /\b(const|let|var|function|return|if|else|for|while|new|import|from|export|default|true|false|null|undefined|this)\b/;

function highlightJs(code) {
    return tokenize(code, [
        { pattern: /\/\/[^\n]*|\/\*[\s\S]*?\*\//, render: (m) => wrap('tk-cm', m[0]) },
        { pattern: /"[^"\n]*"|'[^'\n]*'|`[^`]*`/, render: (m) => wrap('tk-str', m[0]) },
        { pattern: JS_KEYWORDS, render: (m) => wrap('tk-kw', m[0]) },
        { pattern: /\b[\w$]+(?=\s*\()/, render: (m) => wrap('tk-fn', m[0]) },
        { pattern: /\b\d+(\.\d+)?\b/, render: (m) => wrap('tk-num', m[0]) },
    ]);
}

/* ---------------- Shell ---------------- */

function highlightShell(code) {
    return tokenize(code, [
        { pattern: /#[^\n]*/, render: (m) => wrap('tk-cm', m[0]) },
        { pattern: /^(npm|node|git|cd)\b/m, render: (m) => wrap('tk-kw', m[0]) },
    ]);
}

const HIGHLIGHTERS = {
    html: highlightHtml,
    css: highlightCss,
    js: highlightJs,
    jsx: highlightJs,
    shell: highlightShell,
};

export function highlight(code, language) {
    const highlighter = HIGHLIGHTERS[language];

    if (!highlighter) {
        return escapeHtml(code);
    }

    return highlighter(code);
}
