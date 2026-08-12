const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const path = require('path');

// 빌드 경로
const SRC = './src/main';
const DIST = './dist';
const INCLUDES = './src/includes';

// 공통 요소 포함하여 HTML 빌드
gulp.task('build:html', function() {
  return gulp.src([
    SRC + '/**/*.html',
    '!' + SRC + '/sample/**/*.html'  // sample 폴더 제외 (필요시)
  ])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: INCLUDES,
      indent: true
    }))
    .pipe(gulp.dest(DIST));
});

// CSS 복사
gulp.task('copy:css', function() {
  return gulp.src('./src/resources/css/**/*')
    .pipe(gulp.dest(DIST + '/resources/css'));
});

// JS 복사
gulp.task('copy:js', function() {
  return gulp.src('./src/resources/js/**/*')
    .pipe(gulp.dest(DIST + '/resources/js'));
});

// Fonts 복사
gulp.task('copy:fonts', function() {
  return gulp.src('./src/resources/fonts/**/*')
    .pipe(gulp.dest(DIST + '/resources/fonts'));
});

// Images 복사
gulp.task('copy:images', function() {
  return gulp.src('./src/resources/images/**/*')
    .pipe(gulp.dest(DIST + '/resources/images'));
});

// 파일 복사
gulp.task('copy:files', function() {
  return gulp.src('./src/resources/files/**/*')
    .pipe(gulp.dest(DIST + '/resources/files'));
});

// 전체 빌드
gulp.task('build', gulp.series(
  'build:html',
  'copy:css',
  'copy:js',
  'copy:fonts',
  'copy:images',
  'copy:files'
));

// Watch 모드
gulp.task('watch', function() {
  gulp.watch(SRC + '/**/*.html', gulp.series('build:html'));
  gulp.watch('./src/resources/**/*', gulp.series('copy:css', 'copy:js', 'copy:fonts', 'copy:images', 'copy:files'));
});

// 기본 작업
gulp.task('default', gulp.series('build'));
