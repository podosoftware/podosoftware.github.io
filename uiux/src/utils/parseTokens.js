/**
 * tokens.css 문자열 → 화면용 데이터
 *
 * tokens.css 의 작성 규칙을 그대로 읽습니다.
 *   섹션 제목 :  " * 3. Color — Primary"   (주석 블록 안)
 *   토큰      :  "--color-primary-500: #5C61D4;   /* 기준 브랜드 컬러 *\/"
 *
 * 결과 예)
 * {
 *   sections: [{ number: 3, title: 'Color — Primary', tokens: [{ name, value, comment }] }],
 *   legacy:   [{ name: '--primary-500', target: '--color-primary-500' }],
 *   byName:   { '--color-primary-500': { … } }
 * }
 */
const SECTION_PATTERN = /^\s*\*\s*(\d+)\.\s*(.+?)\s*$/;
const TOKEN_PATTERN = /^\s*(--[\w-]+)\s*:\s*(.+?);\s*(?:\/\*\s*(.*?)\s*\*\/)?\s*$/;

export function parseTokens(cssText) {
    const result = { sections: [], legacy: [], byName: {} };

    if (!cssText) {
        return result;
    }

    // 첫 번째 :root 는 정식 토큰, 두 번째 :root 는 Legacy Alias
    const [mainBlock = '', legacyBlock = ''] = cssText.split(/:root\s*\{/).slice(1);

    let currentSection = null;

    mainBlock.split('\n').forEach((line) => {
        const sectionMatch = line.match(SECTION_PATTERN);
        if (sectionMatch) {
            currentSection = {
                number: Number(sectionMatch[1]),
                title: sectionMatch[2],
                tokens: [],
            };
            result.sections.push(currentSection);
            return;
        }

        const tokenMatch = line.match(TOKEN_PATTERN);
        if (tokenMatch && currentSection) {
            const token = {
                name: tokenMatch[1],
                value: tokenMatch[2].trim(),
                comment: tokenMatch[3] || '',
            };
            currentSection.tokens.push(token);
            result.byName[token.name] = token;
        }
    });

    legacyBlock.split('\n').forEach((line) => {
        const match = line.match(/^\s*(--[\w-]+)\s*:\s*var\(\s*(--[\w-]+)\s*\)\s*;/);
        if (match) {
            result.legacy.push({ name: match[1], target: match[2] });
        }
    });

    return result;
}

/**
 * var(--x) 를 따라가 실제 HEX 값을 찾는다. (팔레트/스와치 표시용)
 */
export function resolveTokenValue(value, byName, depth = 0) {
    const match = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);

    if (!match || depth > 5) {
        return value;
    }

    const target = byName[match[1]];
    return target ? resolveTokenValue(target.value, byName, depth + 1) : value;
}

/**
 * 배경색 위에 올릴 글자색(검정/흰색) 결정 — 팔레트 라벨 가독성용
 */
export function getReadableTextColor(hex) {
    const value = hex.replace('#', '');

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        return '#1A1714';
    }

    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.6 ? '#4A4540' : '#FFFFFF';
}

export function findSection(tokens, keyword) {
    return tokens.sections.find((section) => section.title.includes(keyword)) || null;
}
