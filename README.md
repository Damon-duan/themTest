# Gulp 配置
* image-watch 监听压缩图片
* sass-watch 监听SCSS文件编译CSS
* sprite-watch 监听编译精灵图

# SCSS 文件配置
* variable.scss 存放共性变量
* normalize.scss 存放初始化样式
* mixins.scss 存放混合类型
* extends.scss 存放占位选择器
* sprite.scss 存放编译精灵图生成的样式
* theme/xx.scss 存放主题共性样式

# 如何开发不同的样式且互不影响？
| 变量 | 参数说明 |
|:-------:|:------------- |
| theme | 主题名称，新增主题名称，直接在数组尾部追加 |
| key | 键值，修改key值，监听不同的主题 |
| $theme | $theme变量，存放在variable.scss中，当gulpfile.js中的theme变量改变时，同时设置$theme的值，不是很智能，暂时这样处理 |

# 编译微件SCSS注意事项
* 微件样式编译需要在制定条件内编辑
```scss
@import '../../../../scss/common';

// base主题的样式
@if ($theme == 'base') {
  h2 {
    background-color: greenyellow;
  }
  ...
}

// dark主题的样式
@if ($theme == 'dark') {
  h2 {
    background-color: pink;
  }
  ...
}
```
