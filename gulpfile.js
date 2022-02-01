const project_folder = "dist";
const source_folder = "src";

const fs = require('fs');

const path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        fontsIcon: project_folder + "/fonts/fonts-icon/"
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
        fonts: source_folder + "/fonts/*.ttf",
        fontsIcon: source_folder + "/fonts/fonts-icon/*",
        favicon: source_folder + '/favicon.+(png|ico)'
    },
    watch: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.jpg"
    },
    clean: project_folder + "/"
};

const { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'), // Подключение внешних файлов саец синтаксисом
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'), // группирует медиа запросы
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'), // позволяет переименовывать файлы
    uglify = require('gulp-uglify-es').default, // сжимает и оптимизирует js
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'), // сжимает картинки без птери качества
    webp = require('gulp-webp'), // конвертирует в webp
    webphtml = require('gulp-webp-html'), // оборачивает img в тег picture c добавлением webp
    webpcss = require('gulp-webpcss'), // делает грамотную подстановку webp в css (совместно с testWebp.js)
    svg_sprite = require('gulp-svg-sprite'), // собирает sprite из svg
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter') // используем для преобразования шрифтов в ttf

function browserSync(){
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port:3030,
        notify: false // уведомление что страница обновилась
    });
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css(){
    return src(path.src.css)
        .pipe(
            scss({ outputStyle: 'expanded' }).on('error', scss.logError)
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp'})
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images(){
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function favicon(){
    return src(path.src.favicon)
        .pipe(dest(path.build.html));
}

function fonts(){
    src(path.src.fontsIcon)
        .pipe(dest(path.build.fontsIcon));
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
            .pipe(ttf2woff2())
            .pipe(dest(path.build.fonts));
}

function createSvgSprite(){
    return src([source_folder + '/iconsprite/*.svg'])
        .pipe(svg_sprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", // sprite file name
                    example: true // создаст html файл с примерами иконок
                }
            }
        }))
        .pipe(dest(path.build.img));
}

function otf2ttf(){
    return src([source_folder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(source_folder + '/fonts/'));
}

function watchFiles(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(){
    return del([`${path.clean}**`,
                `!${path.clean}`,
                `!${path.clean}img/`,
                `!${path.clean}img/icons`,
                `!${path.clean}img/icons/icons.svg`]);
}

function cleanSvgSprite(){
    return del([`${path.clean}img/icons/*`, `${path.clean}img/stack`]);
}

const svgSprite = gulp.series(cleanSvgSprite, createSvgSprite);
const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, favicon));
const watch = gulp.parallel(build, watchFiles, browserSync); // сценарий исполнения

exports.otf2ttf = otf2ttf; // отдельный скрипт для конвертации шрифта в src
exports.svgSprite = svgSprite; // отдельный скрипт для создания svg sprite

exports.favicon = favicon;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
