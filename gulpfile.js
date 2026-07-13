import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import cssbeautify from "gulp-cssbeautify";
import rename from "gulp-rename";
import browserSync from "browser-sync";
import { deleteAsync } from "del";

const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  scss: {
    entry: "src/scss/style.scss",
    src: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  js: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
};

export function clean() {
  return deleteAsync(["dist"]);
}

export function styles() {
  return gulp
    .src(paths.scss.entry)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(
      cssbeautify({
        indent: "  ",
        openbrace: "separate-line",
      }),
    )
    .pipe(rename("style.css"))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(
      cleanCSS({
        level: 2,
      }),
    )
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(bs.stream());
}

export function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());
}

export function scripts() {
  return gulp
    .src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest))
    .pipe(bs.stream());
}

export function serve() {
  bs.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
    open: true,
  });

  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.js.src, scripts);
}

export const build = gulp.series(clean, gulp.parallel(styles, html, scripts));

export default gulp.series(build, serve);
