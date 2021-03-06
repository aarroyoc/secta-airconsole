var gulp = require("gulp");
var ts = require("gulp-typescript");
var webpack = require("gulp-webpack");

//TODO: Uglify

gulp.task("compile", function () {
	return gulp.src("./src/**/*.ts")
		.pipe(ts({
			out: "main.js",
			module: "system",
			target: "es6"
		}))
		.pipe(gulp.dest("./build/"));
});

gulp.task("pack", ["compile"], function () {
	return gulp.src("./build/main.js")
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

gulp.task("fonts", function () {
	return gulp.src("./*tf")
		.pipe(gulp.dest("./www/"));
})

gulp.task("babylon", function () {
	return gulp.src("./node_modules/babylonjs/babylon.js")
		.pipe(gulp.dest("./www/"));
});

gulp.task("phaser", function () {
	return gulp.src("./node_modules/phaser/build/phaser.min.js")
		.pipe(gulp.dest("./www/"));
});

gulp.task("data", function () {
	return gulp.src("./data/*")
		.pipe(gulp.dest("./www/data/"))
});

gulp.task("controller-js", function () {
	return gulp.src("./controller.js")
		.pipe(gulp.dest("./www/"));
});

gulp.task("system-js", function () {
	return gulp.src("./node_modules/systemjs/dist/system.js")
		.pipe(gulp.dest("./www"));
});

gulp.task("default", ["fonts", "pack", "html", "css", "babylon", "phaser", "data", "controller-js", "system-js"], function () {


});
