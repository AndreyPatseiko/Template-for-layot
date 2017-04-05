var gulp        = require('gulp'), 
    stylus      = require('gulp-stylus'), 
    sourcemaps  = require('gulp-sourcemaps'),
    jade        = require('gulp-jade'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    uglifyCss   = require('gulp-uglifycss'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'), 
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    replace     = require('gulp-replace'); // заменяем пути для продакшена

var baseUrlProd = './Prodaction/html';

gulp.task('stylus', function(){ 
    return gulp.src(['app/styl/**/*.styl','!app/styl/**/_*.styl'])        
        .pipe(sourcemaps.init())
        .pipe(stylus())        
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('jade', function() {
  return gulp.src('app/jade/*.jade')
    .pipe(jade({        
        pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true})) 
});

gulp.task('scripts', function() {
    return gulp.src([ 
        // 'app/js/libs/jquery/jquery.min.js',
        // 'app/js/libs/scrolly/jquery.scroolly.min.js',
        // 'app/js/libs/slick-carousel/slick/slick.min.js',
        // 'app/js/libs/jquery-validation/dist/jquery.validate.min.js',
        // 'app/js/libs/nanoScrollerJS/bin/javascripts/jquery.nanoscroller.min.js',
        // 'app/js/libs/jquery-confirm2/dist/jquery-confirm.min.js'
        ])
        // .pipe(concat('libs.min.js')) 
        // .pipe(uglify()) 
        // .pipe(gulp.dest('app/js')); 
});

gulp.task('libsCss', function() {
    return gulp.src([
        // 'app/js/libs/slick-carousel/slick/*.css',
        // 'app/js/libs/nanoScrollerJS/bin/css/nanoscroller.css',
        // 'app/js/libs/jquery-confirm2/dist/jquery-confirm.min.css'
        ])
        // .pipe(concat('libs.min.css'))
        // .pipe(uglifyCss())
        // .pipe(replace('./fonts/', '../fonts/'))
        // .pipe(replace('./ajax-', '../img/ajax-'))
        // .pipe(gulp.dest('app/css')); 
});

gulp.task('libsfonts', function() {
    return gulp.src([
        // 'app/js/libs/slick-carousel/slick/fonts/*',
        ])     
        .pipe(gulp.dest('app/fonts')); 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

gulp.task('watch', ['browser-sync', 'jade', 'stylus', 'scripts', 'libsfonts', 'libsCss' ], function() {
    gulp.watch('app/styl/**/*.styl', ['stylus']);
    gulp.watch('app/jade/**/*.jade', ['jade']);
    gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('default', ['watch']);

gulp.task('clear', function () {
    return cache.clearAll();
})

// ====     PRODACTION      ====

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(baseUrlProd+'/img')); // Выгружаем на продакшен
});

gulp.task('clean', function() {
    return del.sync(baseUrlProd, {force:true}); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'img', 'stylus', 'scripts', 'libsfonts', 'libsCss'], function() {
    

    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/*.css'
        ])
    .pipe(gulp.dest(baseUrlProd+'/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest(baseUrlProd+'/fonts'))

    var buildJs = gulp.src(['app/js/**/*']) // Переносим скрипты в продакшен
    .pipe(gulp.dest(baseUrlProd+'/js'))

    var buildHtml = gulp.src(['app/*.html','!app/test.html']) // Переносим HTML в продакшен
    // .pipe(replace('../img', './img')) // Переименовать адреса для картинок
    .pipe(gulp.dest(baseUrlProd))
});
