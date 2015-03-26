var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')

var codes = 'lib/**/*.js'

gulp.task('hint', function() {
    return gulp.src(codes)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
})

gulp.task('test', function () {
    return gulp.src('test.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
})

gulp.task('watch', function() {
    gulp.watch(codes, ['hint', 'test'])
    gulp.watch('test.js', ['test'])
})

gulp.task('default', ['hint', 'test', 'watch'])
