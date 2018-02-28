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
    var spriteFile = gulp.src('public/images/' + theme[key] + '/sprite/*.png') // 需要合并的图片地址
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
                for (var i = 0, len = deName.length; i < len; i++) {
                    style += ".icon-" + deName[i].name + " {";
                    style += "background-image: url('../../" + deName[i].escaped_image + "');";
                    style += "background-position: " + deName[i].px.offset_x + " " + deName[i].px.offset_y + ";";
                    style += "width:" + deName[i].px.width + ";";
                    style += "height:" + deName[i].px.height + ";";
                    style += "}\n";
                    if (hName.length) {
                        style += ".icon-" + deName[i].name + ":hover {";
                        style += "background-image: url('../../" + hName[i].escaped_image + "');";
                        style += "background-position: " + hName[i].px.offset_x + " " + hName[i].px.offset_y + ";";
                        style += "}\n";
                    }
                }
                arr.push(style);
                return arr.join("");
            }
        }));
    var imgFile = spriteFile.img.pipe(buffer()).pipe(gulp.dest('./public')); // 图片存放地址
    var cssFile = spriteFile.css.pipe(gulp.dest('./public/scss')); // 样式文件存放地址
    return merge(imgFile, cssFile);
});

// 压缩图片任务
gulp.task('image-watch', function () {
    return gulp.src('public/images/' + theme[key] + '/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest('./public/images'))
});

gulp.task('sass-watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('sprite-watch', ['sprite'], function () {
    console.log('运行成功');
});