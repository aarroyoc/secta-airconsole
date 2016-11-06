var gulp = require("gulp");
var ts = require("gulp-typescript");
var webpack = require("gulp-webpack");

// TypeScript, Browserify, Uglify
// Web Server

gulp.task("compile",function(){
	return gulp.src("./src/**/*.ts")
		.pipe(ts({
			out: "main.js"
		}))
		.pipe(gulp.dest("./build/"));
});

gulp.task("pack",["compile"],function(){
	return gulp.src("./build/main.js")
		.pipe(webpack({
			output: {
				filename: "main.js"
			}
		}))
		.pipe(gulp.dest("./www/"));
});

gulp.task("default",["pack"],function(){


});
