# uni-app 埋点

## 安装

下载`src`内的文件，并放到`common/tracker`文件夹内。

在`main.js`内添加如下代码：

```js
// main.js

// 导入tracker代码
import Tracker from './common/tracker';

// 使用埋点
new Tracker({
  fns: ['tracker'], // 埋点的函数
  reportFn(res) {
    // 埋点的信息
    console.log(res);
  }
});
```

## 参数选项

- `fns`：需要埋点的函数，类型是`数组`，`必填`
- `pages`：需要埋点的页面，类型是`数组`，`选填`
- `reportFn`：埋点信息，类型是`函数`，`必填`
- `dataKey`：观察埋点的数据，类型是`数组`，`选填`


## 许可证

[MIT](https://opensource.org/licenses/MIT)
