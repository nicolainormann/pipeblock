var gulp = require('gulp');
var gulputil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var prompt = require('gulp-prompt');
var jade = require('gulp-jade');

var browsersync = require('browser-sync').create();
var fs = require('fs-extra');

/* SETTINGS START - DO NOT CHANGE - IF YOU HAVE TO CHANGE THESE DO IT IN THE SETTINGS.JSON AND FTP.JSON */
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var design = settings.design;
var assets = design + '/' + settings.assets + '/';
var master = design + '/' + settings.master;

/* SETTINGS END - DO NOT CHANGE - IF YOU HAVE TO CHANGE THESE DO IT IN THE SETTINGS.JSON AND FTP.JSON */

/* FILE MASKS START */
var allfiles = [
    design + '/**'
];

var watchFiles = [
    design + '/**/*.html',
    design + '/**/*.cshtml',
    design + '/**/*.png',
    design + '/**/*.min.css',
    design + '/**/*.min.js'
];

var watchScss = [
    design + '/**/*.scss',
];

var watchJs = [
    design + '/**/js/*.js'
];

var watchJade = [
    design + '/**/*.jade'
];
/* FILE MASKS END */

gulp.task('default', ['browsersync', 'watchSync', 'watchScss', 'watchJs', 'watchJade']);

gulp.task('browsersync', function(){
    browsersync.init({
        server: {
            baseDir: "C:/Users/Nicolai/GIT/pipeblock/pipe/"
        } 
    });
});

gulp.task('watchSync', function(){
    gulp.watch(watchFiles).on('change', function(file) {
        return gulp.src(file.path)
            .pipe(browsersync.stream())
    });
});

gulp.task('watchScss', function(){
    gulp.watch(watchScss, ['sass']).on('change', function(file) {        
        return gulp.src(file.path)
            .pipe(browsersync.stream())
    });
});

gulp.task('watchJs', function(){
    gulp.watch(watchJs, ['uglify']).on('change', function(file) {
        return gulp.src(file.path)
            .pipe(browsersync.stream())
    });
});

gulp.task('watchJade', function(){
    gulp.watch(watchJade, ['jade']).on('change', function(file) {
        return gulp.src(file.path)
            .pipe(browsersync.stream())
    });
});

gulp.task('sass', function(){
    return gulp.src(assets + 'scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('uglify', function(){
    return gulp.src(assets + 'js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('jade', function(){
    return gulp.src('**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(''))
});

gulp.task('setup', function(){
    return gulp.src('')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'design',
            message: 'Please enter the path to your design folder (example: Templates/Designs/Website)'
        },
        {
            type: 'input',
            name: 'assets',
            message: 'Please enter your assets folder name (example: assets)'
        },
        {
            type: 'input',
            name: 'master',
            message: 'Please enter your master file name with extension (example: index.html)'
        },
        ], function(res){
            var jsonRes = JSON.stringify(res);
            fs.writeFile('settings.json', jsonRes, function(err){
            });
        }))
});
/* GULP SETUP END */