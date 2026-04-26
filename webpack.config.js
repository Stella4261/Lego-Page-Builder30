const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. 模式：告诉 Webpack 这是开发环境，打包速度快，代码不压缩
  mode: 'development',

  // 2. 入口：项目从哪里开始运行？
  entry: './src/index.js',

 // 什么时候能看到  dist ？
 //只有你执行打包命令才会出现：npm run build
 // 你平时开发  npm start  
 //dist 是在内存里运行的，不会生成真实文件夹，所以你看不到。

// 3. 出口：打包后的文件叫什么？放在哪？
  output: {
    path: path.resolve(__dirname, 'dist'),//放到项目根目录的  dist  文件夹
    filename: 'bundle.js',//打包后的文件叫 bundle.js
    clean: true, // 每次打包前先清理 dist 文件夹
  },

  // 4. 解析：告诉 Webpack 引入模块时可以省略哪些后缀 例如：import App from './App'可以不用写  .jsx ，webpack 自动帮你找。
  resolve: {
    extensions: ['.tsx','.ts','.js', '.jsx', '.json'],
  },

  // 5. 模块规则：Webpack 默认只懂 JS，Webpack 不会自动翻译 JS 里的新语法，需要我们自己配置“翻译官”（Loader）翻译成 JS
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,         // 匹配 .js 或 .jsx 文件
        exclude: /node_modules/,     
        // 打包编译 JS/JSX 时，跳过 node_modules 文件夹，不去翻译第三方包里的代码。在 JS 里，
        // 正则就是  /内容/  这么写的，node_modules = 专门放第三方库的文件夹，exclude = 排除、不包含、跳过
        use: {
          loader: 'babel-loader',    // 使用 Babel 把 ES6/React 转成浏览器认识的 JS
        },
      },
      {
        test: /\.css$/,              // 匹配 CSS 文件
        use: [
          'style-loader',            
// 将 JS 中的样式注入到 DOM 中， 把解析好的 CSS 变成页面里的  <style>  标签
 //这个页面指的是谁？ 就是  HtmlWebpackPlugin  生成的那个页面:pbic/index.html  → 最终变成  dist/index.html
          'css-loader',              // 解析 CSS 文件里的 @import 和 url()
        ],
      },
    ],
  },

  // 6. 插件：Loader 是翻译官，插件则是“全能助手”
  plugins: [
//  new HtmlWebpackPlugin(...) 
//webpack 会复制一份这个 HTML,并自动在里面插入打包好的  bundle.js ,最后把生成好的页面放到  dist  文件夹里
    new HtmlWebpackPlugin({
 //template: './public/index.html' 
//这个文件是你自己写的原始 HTML 文件，会自动把  bundle.js  插进去，生成最终可以打开的网页
      template: './public/index.html', 
    }),
  ],

  // 7. 开发服务器：改完代码自动刷新浏览器
  devServer: {
    static: './dist',//要把  dist  文件夹当作网页根目录来访问。
    port: 3000,
    hot: true,    // 开启热更新
    open: true,   // 启动后自动打开浏览器
    historyApiFallback:true, //路由跳转后刷新页面会 404，需要告诉 webpack devServer 所有路径都返回 index.html。
  },
};