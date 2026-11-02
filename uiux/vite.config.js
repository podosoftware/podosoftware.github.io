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

export default defineConfig({
    // HashRouter + 상대 경로 → 어느 하위 폴더에 배포해도 동작
    base: './',
    plugins: [react(), serveRepoAssets()],
    server: {
        port: 5173,
        open: true,
    },
});
