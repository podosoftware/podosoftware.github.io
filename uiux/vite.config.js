import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const UIUX_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(UIUX_DIR, '..');

/**
 * 저장소 루트의 실사용 리소스(/css, /js, /images)를 개발 서버에서 그대로 제공한다.
 *
 * 왜 필요한가:
 *  - 실시간 미리보기(LivePreview)는 실제 관리자 화면과 같은 CSS / Kendo 2025 / 이미지를 써야 한다.
 *  - 이 파일들을 uiux 안에 복사하면 "겹치는 파일"이 다시 생기므로 복사 대신 경로만 연결한다.
 *  - 운영(GitHub Pages)에서는 저장소 루트가 곧 사이트 루트라 /css, /js, /images 경로가 그대로 동작한다.
 */
const REPO_ASSET_DIRS = ['css', 'js', 'images'];

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
};

function serveRepoAssets() {
    return {
        name: 'podo-serve-repo-assets',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const urlPath = decodeURIComponent((req.url || '').split('?')[0]);
                const firstSegment = urlPath.split('/')[1];

                if (!REPO_ASSET_DIRS.includes(firstSegment)) {
                    next();
                    return;
                }

                const filePath = path.join(REPO_ROOT, urlPath);

                // 저장소 루트 밖으로 나가는 경로(../ 등)는 차단한다.
                if (!filePath.startsWith(REPO_ROOT)) {
                    res.statusCode = 403;
                    res.end();
                    return;
                }

                if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                    next();
                    return;
                }

                const ext = path.extname(filePath).toLowerCase();
                res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
                fs.createReadStream(filePath).pipe(res);
            });
        },
    };
}

/**
 * 관리자 CSS(public/admin/css) 안의 상대 이미지 경로를 "운영 위치 기준 절대 경로"로 바꾼다.
 *
 * 왜 필요한가:
 *  - 관리자 CSS 는 운영에서 /css/admin/ 에 놓이는 것을 전제로 url(../../images/...) 처럼 상대 경로를 쓴다.
 *  - 가이드에서는 이 파일이 /admin/css/ (개발) 또는 /uiux/dist/admin/css/ (GitHub Pages) 에 있어
 *    상대 경로가 엉뚱한 곳(예: /uiux/dist/images/...)을 가리키고 이미지가 404 가 난다.
 *  - 그래서 가이드에 올리는 사본에서만 /css/admin/ 기준으로 풀어 절대 경로(/images/...)로 바꾼다.
 *    운영에 배포하는 원본(public/admin/css/*.css)은 바꾸지 않는다.
 */
const ADMIN_CSS_PUBLIC_DIR = '/admin/css/';
const ADMIN_CSS_PRODUCTION_DIR = 'https://site.invalid/css/admin/';
const CSS_URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

function rebaseCssUrls(css) {
    return css.replace(CSS_URL_PATTERN, (match, quote, url) => {
        // data:, http(s):, 절대 경로, #id 는 그대로 둔다.
        if (/^(data:|https?:|\/|#)/i.test(url)) {
            return match;
        }
        const absolutePath = new URL(url, ADMIN_CSS_PRODUCTION_DIR).pathname;
        return `url(${quote}${absolutePath}${quote})`;
    });
}

function rebaseAdminCssUrls() {
    let outDir = '';

    return {
        name: 'podo-rebase-admin-css-urls',
        configResolved(config) {
            outDir = path.resolve(config.root, config.build.outDir);
        },
        // 개발 서버: /admin/css/*.css 요청을 가로채 경로를 바꿔서 돌려준다.
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const urlPath = decodeURIComponent((req.url || '').split('?')[0]);
                if (!urlPath.startsWith(ADMIN_CSS_PUBLIC_DIR) || !urlPath.endsWith('.css')) {
                    next();
                    return;
                }

                const filePath = path.join(UIUX_DIR, 'public', urlPath);
                if (!filePath.startsWith(path.join(UIUX_DIR, 'public')) || !fs.existsSync(filePath)) {
                    next();
                    return;
                }

                res.setHeader('Content-Type', MIME_TYPES['.css']);
                res.end(rebaseCssUrls(fs.readFileSync(filePath, 'utf8')));
            });
        },
        // 빌드: dist 로 복사된 사본만 바꾼다.
        closeBundle() {
            const cssDir = path.join(outDir, ADMIN_CSS_PUBLIC_DIR);
            if (!outDir || !fs.existsSync(cssDir)) {
                return;
            }

            for (const fileName of fs.readdirSync(cssDir)) {
                if (!fileName.endsWith('.css')) {
                    continue;
                }
                const filePath = path.join(cssDir, fileName);
                const before = fs.readFileSync(filePath, 'utf8');
                const after = rebaseCssUrls(before);
                if (after !== before) {
                    fs.writeFileSync(filePath, after);
                }
            }
        },
    };
}

export default defineConfig({
    // HashRouter + 상대 경로 → 어느 하위 폴더에 배포해도 동작
    base: './',
    plugins: [react(), serveRepoAssets(), rebaseAdminCssUrls()],
    server: {
        port: 5173,
        open: true,
    },
});
