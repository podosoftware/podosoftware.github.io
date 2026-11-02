/**
 * 관리자 CSS 토큰화 스크립트
 *
 * 실행: npm run tokens
 *
 * 하는 일
 *  1. 원본(저장소 루트 css/admin/*.css)을 읽는다. 원본은 수정하지 않는다.
 *  2. 선언 값 안의 하드코딩 HEX 색상을 같은 값의 "기본(primitive) 컬러 토큰"으로 바꾼다.
 *       color: #5c61d4;          →  color: var(--color-primary-500);
 *  3. 옛 변수명을 새 토큰명으로 바꾼다.
 *       var(--primary-500)        →  var(--color-primary-500)
 *  4. 결과를 public/admin/css/ 에 쓰고, docs/admin-css-tokenize-report.md 에 리포트를 남긴다.
 *
 * 동작 변경 없음을 지키기 위한 규칙
 *  - 값이 "정확히 같은" HEX 만 바꾼다. (비슷한 색을 묶지 않는다)
 *  - 선택자(#id), url(), 주석 안의 문자열은 건드리지 않는다. (선언 값만 대상)
 *  - 어디에도 정의되지 않은 변수는 이름을 바꾸지도, 새로 정의하지도 않는다. (리포트에만 기록)
 *  - url() 의 이미지 경로는 그대로 둔다. → 원본과 같은 위치(css/admin/)에 두면 그대로 동작한다.
 *
 * 매핑 기준은 public/admin/css/tokens.css 하나뿐이다. (별도 매핑 표를 두지 않는다)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UIUX_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(UIUX_DIR, '..');

const SOURCE_DIR = path.join(REPO_ROOT, 'css', 'admin');
const OUTPUT_DIR = path.join(UIUX_DIR, 'public', 'admin', 'css');
const TOKENS_FILE = path.join(OUTPUT_DIR, 'tokens.css');
const REPORT_FILE = path.join(UIUX_DIR, 'docs', 'admin-css-tokenize-report.md');

const TARGET_FILES = ['common.css', 'admin.css', 'sub.css'];

// 시맨틱/용도 토큰은 문맥을 알아야 하므로 자동 치환 대상에서 제외한다.
const NON_PRIMITIVE_PATTERN = /--color-(text|bg|btn|disabled|progress|success|danger|warning|info)/;

/* ------------------------------------------------------------------ */
/* 1. tokens.css 에서 매핑 만들기                                       */
/* ------------------------------------------------------------------ */

function normalizeHex(hex) {
    let value = hex.replace('#', '').toLowerCase();

    if (value.length === 3) {
        value = value.split('').map((ch) => ch + ch).join('');
    }

    return '#' + value;
}

function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function buildMaps(tokensCss) {
    const css = stripComments(tokensCss);

    // --color-xxx: #HEX;  (기본 컬러만, 먼저 선언된 이름 우선)
    const hexToToken = new Map();
    for (const match of css.matchAll(/(--color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
        const [, name, hex] = match;

        if (NON_PRIMITIVE_PATTERN.test(name)) {
            continue;
        }

        const key = normalizeHex(hex);
        if (!hexToToken.has(key)) {
            hexToToken.set(key, name);
        }
    }

    // --old: var(--new);  (Legacy Alias 블록)
    const legacyToToken = new Map();
    for (const match of css.matchAll(/(--[\w-]+)\s*:\s*var\(\s*(--[\w-]+)\s*\)\s*;/g)) {
        const [, oldName, newName] = match;

        if (!oldName.startsWith('--color-') && !oldName.startsWith('--font-')) {
            legacyToToken.set(oldName, newName);
        }
    }

    // 정의된 전체 변수 (미정의 변수 검출용)
    const definedNames = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

    return { hexToToken, legacyToToken, definedNames };
}

/* ------------------------------------------------------------------ */
/* 2. CSS 변환                                                          */
/* ------------------------------------------------------------------ */

/**
 * 주석을 자리표시자로 빼 두고 변환한 뒤 되돌린다.
 * (주석 안의 #fff, 예시 코드 등이 바뀌지 않게 하기 위함)
 */
function protectComments(css) {
    const comments = [];
    const body = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => {
        comments.push(comment);
        return `__PODO_COMMENT_${comments.length - 1}__`;
    });

    const restore = (text) => text.replace(/__PODO_COMMENT_(\d+)__/g, (_, index) => comments[Number(index)]);

    return { body, restore };
}

/**
 * url(...) 도 자리표시자로 보호한다. (data:image/svg+xml 안의 %23 색상 등 보호)
 */
function protectUrls(text) {
    const urls = [];
    const body = text.replace(/url\([^)]*\)/gi, (url) => {
        urls.push(url);
        return `__PODO_URL_${urls.length - 1}__`;
    });

    const restore = (value) => value.replace(/__PODO_URL_(\d+)__/g, (_, index) => urls[Number(index)]);

    return { body, restore };
}

function tokenizeCss(sourceCss, maps, stats) {
    const comments = protectComments(sourceCss);
    const urls = protectUrls(comments.body);

    // "속성: 값" 다음에 ; 또는 } 가 오는 경우만 선언으로 본다.
    // (a:hover { … } 처럼 { 로 끝나는 선택자는 제외된다)
    const DECLARATION = /([\w-]+)(\s*:\s*)([^;{}]+?)(\s*)(?=[;}])/g;

    const converted = urls.body.replace(DECLARATION, (whole, property, colon, value, trailing) => {
        let nextValue = value;

        // (1) 옛 변수명 → 새 토큰명
        nextValue = nextValue.replace(/var\(\s*(--[\w-]+)/g, (match, name) => {
            if (maps.legacyToToken.has(name)) {
                stats.varRenamed += 1;
                return `var(${maps.legacyToToken.get(name)}`;
            }

            if (!maps.definedNames.has(name)) {
                stats.undefinedVars.set(name, (stats.undefinedVars.get(name) || 0) + 1);
            }

            return match;
        });

        // (2) HEX → 기본 컬러 토큰
        nextValue = nextValue.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g, (hex) => {
            const key = normalizeHex(hex);
            const token = maps.hexToToken.get(key);

            if (token) {
                stats.hexReplaced += 1;
                return `var(${token})`;
            }

            stats.unmatchedHex.set(key, (stats.unmatchedHex.get(key) || 0) + 1);
            return hex;
        });

        return property + colon + nextValue + trailing;
    });

    return comments.restore(urls.restore(converted));
}

/* ------------------------------------------------------------------ */
/* 3. 실행                                                              */
/* ------------------------------------------------------------------ */

function createStats() {
    return {
        hexReplaced: 0,
        varRenamed: 0,
        unmatchedHex: new Map(),
        undefinedVars: new Map(),
    };
}

function sortByCount(map) {
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function buildReport(results, maps) {
    const lines = [];
    const now = new Date().toISOString().slice(0, 10);

    lines.push('# 관리자 CSS 토큰화 리포트');
    lines.push('');
    lines.push(`- 생성일: ${now} (\`npm run tokens\` 실행 시 자동 갱신)`);
    lines.push('- 원본: `css/admin/*.css` (수정하지 않음) → 결과: `uiux/public/admin/css/*.css`');
    lines.push(`- 매핑 기준: \`tokens.css\` (HEX 매핑 ${maps.hexToToken.size}개, 옛 변수명 매핑 ${maps.legacyToToken.size}개)`);
    lines.push('');
    lines.push('## 파일별 결과');
    lines.push('');
    lines.push('| 파일 | HEX → 토큰 | 옛 변수명 → 새 이름 | 토큰 없는 HEX(남김) | 미정의 변수 참조 |');
    lines.push('|------|-----------:|--------------------:|--------------------:|----------------:|');

    for (const { file, stats } of results) {
        const unmatchedTotal = [...stats.unmatchedHex.values()].reduce((sum, n) => sum + n, 0);
        const undefinedTotal = [...stats.undefinedVars.values()].reduce((sum, n) => sum + n, 0);
        lines.push(`| ${file} | ${stats.hexReplaced} | ${stats.varRenamed} | ${unmatchedTotal} | ${undefinedTotal} |`);
    }

    lines.push('');
    lines.push('## 토큰이 없어 그대로 둔 HEX (사용 빈도순)');
    lines.push('');
    lines.push('자주 쓰이는 값은 tokens.css 에 토큰을 추가한 뒤 `npm run tokens` 를 다시 실행하면 자동으로 치환됩니다.');
    lines.push('');
    lines.push('| 파일 | 값 (사용 횟수) |');
    lines.push('|------|----------------|');

    for (const { file, stats } of results) {
        const top = sortByCount(stats.unmatchedHex).map(([hex, count]) => `\`${hex}\` (${count})`);
        lines.push(`| ${file} | ${top.join(', ') || '-'} |`);
    }

    lines.push('');
    lines.push('## 어디에도 정의되지 않은 변수 (확인 필요)');
    lines.push('');
    lines.push('현재 브라우저에서는 해당 속성이 무시(초기값)되고 있습니다. 동작 변경을 막기 위해 이름 변경·신규 정의를 하지 않았습니다.');
    lines.push('');
    lines.push('| 파일 | 변수 (참조 횟수) |');
    lines.push('|------|------------------|');

    for (const { file, stats } of results) {
        const list = sortByCount(stats.undefinedVars).map(([name, count]) => `\`${name}\` (${count})`);
        lines.push(`| ${file} | ${list.join(', ') || '-'} |`);
    }

    lines.push('');

    return lines.join('\n');
}

function run() {
    if (!fs.existsSync(TOKENS_FILE)) {
        console.error(`[tokens] tokens.css 를 찾을 수 없습니다: ${TOKENS_FILE}`);
        process.exit(1);
    }

    const maps = buildMaps(fs.readFileSync(TOKENS_FILE, 'utf8'));
    const results = [];

    for (const file of TARGET_FILES) {
        const sourcePath = path.join(SOURCE_DIR, file);

        if (!fs.existsSync(sourcePath)) {
            console.warn(`[tokens] 원본 없음, 건너뜀: ${sourcePath}`);
            continue;
        }

        const stats = createStats();
        const source = fs.readFileSync(sourcePath, 'utf8');
        const header =
            '/*\n' +
            ` * [자동 생성] 원본: css/admin/${file}\n` +
            ' * 이 파일을 직접 수정하지 말고, 원본 수정 후 `npm run tokens` 를 실행하세요.\n' +
            ' * 반드시 tokens.css 다음에 로드합니다.\n' +
            ' */\n';

        const output = header + tokenizeCss(source, maps, stats);

        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        fs.writeFileSync(path.join(OUTPUT_DIR, file), output, 'utf8');

        results.push({ file, stats });
        console.log(`[tokens] ${file}: HEX ${stats.hexReplaced}개, 변수명 ${stats.varRenamed}개 치환`);
    }

    fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
    fs.writeFileSync(REPORT_FILE, buildReport(results, maps), 'utf8');
    console.log(`[tokens] 리포트: ${path.relative(UIUX_DIR, REPORT_FILE)}`);
}

run();
