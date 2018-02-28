var gulp = require('gulp'); // 引入gulp插件
var concat = require('gulp-concat'); // 文件合并插件
var sass = require('gulp-sass'); // sass编辑插件
var rename = require('gulp-rename'); // 重命名插件
var uglify = require('gulp-uglify'); // 样式压缩插件
var minStyle = require('gulp-clean-css'); // 清除css插件
var imageMin = require('gulp-imagemin'); // 压缩图片插件
var spritesmith = require('gulp.spritesmith'); // 雪碧图插件
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

var theme = ['base', 'dark']; // 主题名称
var key = 0; // 修改key的值，监听不同的主题

var paths = {
    sass: [
        'public/scss/normalize.scss',
        'public/scss/theme/' + theme[key] + '.scss',
        'public/scss/*.scss',
        'public/js/modules/**/*.scss'
    ]
};

// 预处理样式文件任务
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(concat(theme[key] + '.css'))
        .pipe(minStyle())
        .pipe(rename(theme[key] + '.min.css'))
        .pipe(gulp.dest('./public/css/theme'))
});

// 生成雪碧图任务
gulp.task('sprite', function () {
    var spriteFile = gulp.src('public/images/' + theme[key] + '/*.png') // 需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'images/' + theme[key] + '-sprite.png', // 保存合并后图片的地址
            cssName: 'sprite.scss', // 保存合并后对于css样式的地址
            cssFormat: 'SCSS',
            padding: 10, // 合并时两个图片的间距
            algorithm: 'binary-tree',
            cssTemplate: function (data) {
                var arr = [], deName = [], hName = [], style = "";
                data.sprites.forEach(function (sprite) {
                    if (sprite.name.indexOf('-h') < 0) {
                        deName.push(sprite);
                    } else {
                        hName.push(sprite);
                    }
                });
                deName.forEach(function (sprite, i) {
                    style = ".icon-" + sprite.name + " {" +
                        "background-image: url('../../" + sprite.escaped_image + "');" +
                        "background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
                        "width:" + sprite.px.width + ";" +
                        "height:" + sprite.px.height + ";" +
                        "}\n" +
                        ".icon-" + sprite.name + ":hover {" +
                        "background-image: url('../../" + hName[i].escaped_image + "');" +
                        "background-position: " + hName[i].px.offset_x + " " + hName[i].px.offset_y + ";" +
                        "}\n";
                    arr.push(style);
                })
                return arr.join("");
            }
        }));
    var imgFile = spriteFile.img.pipe(buffer()).pipe(gulp.dest('./public')); // 图片存放地址
    var cssFile = spriteFile.css.pipe(gulp.dest('./public/scss')); // 样式文件存放地址
    return merge(imgFile, cssFile);
});

gulp.task('sass-watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sprite'], function () {
    console.log('运行成功');
});