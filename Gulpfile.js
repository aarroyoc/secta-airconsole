var gulp = require("gulp");
var ts = require("gulp-typescript");
var webpack = require("gulp-webpack");

// Uglify

gulp.task("compile", function () {
	return gulp.src("./src/**/*.ts")
		.pipe(ts({
			out: "main.js",
			module: "system"
		}))
		.pipe(gulp.dest("./build/"));
});

gulp.task("pack", ["compile"], function () {
	return gulp.src("./build/main.js")
		.pipe(webpack({
			output: {
				filename: "main.js"
			}
		}))
		.pipe(gulp.dest("./www/"));
});

gulp.task("html", function () {
	return gulp.src("./*.html")
		.pipe(gulp.dest("./www/"));
});

gulp.task("css", function () {
	return gulp.src("./main.css")
		.pipe(gulp.dest("./www/"));
});

gulp.task("babylon", function () {
	return gulp.src("./node_modules/babylonjs/babylon.js")
		.pipe(gulp.dest("./www/"));
});

gulp.task("phaser", function () {
	return gulp.src("./node_modules/phaser/build/phaser.min.js")
		.pipe(gulp.dest("./www/"));
});

gulp.task("default", ["pack", "html", "css", "babylon", "phaser"], function () {


});
