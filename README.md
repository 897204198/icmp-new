iCooperation Management Platform App
====================================

环境准备
-------
### 必备软件

* [git](http://www.git-scm.com/) - 版本控制及与 GitHub 交互
* [Node.js](https://nodejs.org/) - 前端开发环境所需工具的包管理器，以及运行代理服务器必备环境
* [ruby](http://www.ruby-lang.org/) - [SASS/SCSS](http://sass-lang.com/) 编译工具的运行环境（mac系统自带该软件不用安装）
* [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) - 在Android上运行需要java编译环境，必须1.8
* [SDK](https://developer.android.com/studio/index.html?hl=zh-cn) - 需要在Android上运行时安装

> Windows 环境下安装时需注意添加环境变量，以方便在命令行下使用

##### 设置npm全局安装路径和缓存路径

```
$ npm config set prefix "C:\Program Files\nodejs"
$ npm config set cache "C:\Program Files\nodejs\node_cache"
```

运行方式
-------

* 因ionic自动编译拷贝有bug，windows环境需要在目录[src]下新建两个文件[manifest.json][service-worker.js]，并在[package.json]文件的dependencies下添加["sw-toolbox": "3.6.0"]。
#### 注意：windows一定不要把自己添加的这三个文件提交到代码库

```
# 安装全局命令行组件
$ npm install grunt-cli -g
$ npm install -g cordova ionic
$ npm install -g cordova-hot-code-push-cli

# 在windows下安装的编译环境插件
$ npm install --global --production windows-build-tools
$ npm config set msvs_version 2015 --global

# 安装 SCSS 编译环境
$ gem install sass
$ gem install compass

# Unix 环境下可使用 pm2 组件作为任务管理器，方便开发时自动更新后台代理服务器
# Windows 环境暂未找到替代方案，需手动重启代理服务器以便修改生效，手动启动方式见下
$ npm install pm2 -g

# 安装项目依赖的组件
$ npm install

# 发布静态资源，通过浏览器访问，自动更新变化(可使用pm2时)
$ npm run serve
# 也可连接实际后端服务器运行
$ npm run serve:real
# windows因不能使用pm2，启动命令不同
$ npm run serve:win
# 当需要启动后端代理服务器时，需手动启动，修改后也需手动重启
$ node proxy/proxy-server.js

# 通过 pm2 查看后端代理服务器的日志
$ pm2 logs

# 进行ts代码检查
$ npm run lint

# 发布版
# 会按照 ionic.config.json 中的 currentProject 替换 custom_contents/customs.json 相应项目配置参数
# 安卓
$ npm run build:releaseAndroid
# 苹果
$ npm run build:releaseIOS
# 只生成热部署资源
$ npm run build:hcp

# 产品版本升级
# 按照 ionic.config.json 中的 version 自动更改相关文件
$ npm run bumpVer

# 在Android上运行APP，参数--prod会对代码进行压缩
$ ionic cordova run android [--prod]
# 在IOS虚拟机上运行APP
$ ionic cordova run ios [--prod]

```

### android及ios程序调试方法

- [Chrome调试Android应用](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/69)
- [Safari调试iOS应用](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/143)
