const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

// prettier 모듈을 동적으로 import
// HTML 파일 병합 작업
async function fileIncludeTask() {
    const prettier = (await import('gulp-prettier')).default;

    return gulp.src(['src/kendo/*.html', '!src/partials/**']) // header.html 제외
        .pipe(fileInclude({
            prefix: '@@', // 인클루드 명령어의 접두사 설정
            basepath: '@file' // 인클루드 파일의 경로 설정
        }))
        .pipe(prettier({ // HTML 코드 포맷팅 설정
            parser: 'html', // HTML 파서 사용
            tabWidth: 4, // 들여쓰기 크기 (2칸)
            useTabs: false, // 탭 대신 스페이스 사용
            singleQuote: true, // 속성값을 single quote로 사용
            htmlWhitespaceSensitivity: 'ignore', // 공백 민감도 무시
            endOfLine: 'auto', // 운영체제에 맞는 줄바꿈 설정
            printWidth: 200 // 줄 바꿈 할 폭 길이
        }))
        .pipe(gulp.dest('kendo')); // 병합된 파일을 dist 폴더에 저장
}

// 기본 작업 설정
exports.default = gulp.series(fileIncludeTask);