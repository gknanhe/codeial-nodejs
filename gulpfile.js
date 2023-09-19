const gulp = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
// const pngquant = require('imagemin-pngquant');

const optipng = require('imagemin-optipng');

// const { default: imagemin } = require("gulp-imagemin"); // Use import() for imagemin
const del = require("del");

// npm install gulp-imagemin@7.1.0 gulp-uglify-es@3.0.0 del@6.1.1

gulp.task("js", function (done) {
  console.log("minifying js...");
  gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/"))
    .pipe(
      rev.manifest("public/assets/rev-manifest.json", {
        // cwd: 'public',
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets/"));

  done();
});

gulp.task("css", function (done) {
  console.log("minifying css...");
  gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"));

  gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/"))
    .pipe(
      rev.manifest("public/assets/rev-manifest.json", {
        // cwd: 'public',
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets/"));
  done();
});

gulp.task("images", function (done) {
  console.log("compressing images...");
  gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg|ico)")
    .pipe(imagemin([
      optipng()
     
    ]))
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest("public/assets/rev-manifest.json", {
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

// empty the public/assets directory
gulp.task("clean:assets", function (done) {
  del.sync("./public/assets");
  done();
});

gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets");
    done();
  }
);
