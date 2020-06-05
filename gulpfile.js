const gulp = require("gulp");
const postCss = require("gulp-postcss");
const cleanCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const imageMin = require("gulp-imagemin");
const concat = require("gulp-concat");

const browserSync = require("browser-sync").create();

const ghpages = require("gh-pages");

function css() {
  return gulp
    .src(["src/css/reset.css", "src/css/typography.css", "src/css/app.css"])
    .pipe(sourcemaps.init())
    .pipe(
      postCss([
        require("autoprefixer"),
        require("postcss-preset-env")({
          stage: 1,
          browsers: ["IE 11", "last 2 versions"],
        }),
      ])
    )
    .pipe(concat("app.css"))
    .pipe(
      cleanCss({
        compatibility: "ie8",
      })
    )

    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
}

function fonts() {
  return gulp.src("src/fonts/*").pipe(gulp.dest("dist/fonts"));
}

function img() {
  return gulp.src("src/img/*").pipe(imageMin()).pipe(gulp.dest("dist/img"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    notify: false, // Turn off banner
  });
  gulp.watch("src/*.html", html).on("change", browserSync.reload);
  gulp.watch("src/css/**/*.css", css);
  gulp.watch("src/fonts/*", fonts);
  gulp.watch("src/img/*", img);
}

function deploy() {
  return ghpages.publish("dist");
}

exports.default = gulp.series(html, css, fonts, img, watch);
exports.deploy = deploy;

// Gulp V4.0

// const gulp = require("gulp");
// const sass = require("gulp-sass");
// const browserSync = require("browser-sync").create();

// sass.compiler = require("node-sass");

// // Complile scss into css
// function style() {
//   // Where is my css file
//   return (
//     gulp
//       .src("css/app.scss")
//       // pass file into css complier
//       .pipe(sass().on("error", sass.logError))
//       // where do i save the compiled css
//       .pipe(gulp.dest("."))
//       // Stream changes to browser
//       .pipe(browserSync.stream())
//   );
// }

// function watch() {
//   browserSync.init({
//     server: {
//       baseDir: "./",
//     },
//     notify: false, // Turn off banner
//   });
//   gulp.watch("./css/**/*.scss", style);
//   gulp.watch("./*.html").on("change", browserSync.reload);
//   gulp.watch("./js/**/*.js").on("change", browserSync.reload);
// }

// exports.style = style;
// exports.watch = watch;
