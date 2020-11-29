学习笔记

# 工具链

1. 脚手架（工具链组成部分， generator）

- YEOMAN: Generator of Generator

  ```
    yarn add yeoman-generator
  ```

  - package 名字必须 generator 开头
  - 目录结构（巨坑）
    - 所有的脚手架必须在 generators 之下
    - winter 选用的是 generators/app/\*
  - YEOMAN 的脚手架 app 运行方式

    - main entry 文件必须继承 Generator（巨烦继承， OOP 邪教早日消亡， Long Live FP）
    - 在 constructor 中去定义 yeoman 的配置
      - this.option("xxx") // allow xxx to be configurable
        - 而 YEOMAN 中会定义一个全局的\_options[] 来保存可以配置的命令行参数
          - ```
            {
              type:[Function Boolean],
              description:'xxxx',
              name:'x',
              hide:false
            }
            ```
    - YEOMAN 会通过遍历执行对象（反射实现）上的方法， 这些自定义方法可以用 async 修饰。

    - this.log : 输出
    - this.prompt: 输入
      - data type :
        ```
          {
            type:'input'|'confirm',
            name:name,
            message:"Your project name",
            default?:any,
          }
        ```
    - 文件系统：Yeoman 通过 this.fs 来访问文件系统， 其中封装了许多构建相关的方法,i.e. this.fs.copyTpl.

      - 貌似 Yeoman 的 template 用的是 ejs 的写法来定义 template。 （梦会 JSP 时代，那时我爹天天边写 JSP 边骂人）
      - copyTpl 第三个参数是 ejs 的 context， 从而达到 configurable 的目的
      - js.extendJSON:
        - this.fs.extendJSON(this.destinationPath('package.json'),pkgJSON,overwrite);

    - 依赖系统: 对于 npm 进行封装：
      - this.npmInstall([module_name],{'save-dev':booelan}) or this.npmInstall();

2. NPM Link:
   将本地的模块 link 到 npm 的标准模块里面去

   - YEOMAN 会在标准的 npm 模块中去寻找传入的参数
     > /usr/local/lib/node_modules/toolchain -> /Users/Barney/workspace/advancedJs/Geekbang_homework/Frontend-03-Template/week17/toolchain

3. Webpack:

- Entry: Webpack 打包入口， Webpack 从 entry 的 js 文件开始扫描各个 import 的模块，从而形成一个依赖图， 再递归的进行打包。

```
     entry:__dirname + path.resolve(<path>)
      or
     entry: {
      app:'path of app',
      adminApp: 'path of AdminApp'
    }
```

- Output 配置编译后的文件如何输出到存储介质
  ```
    output: {
      filename: '[name].js', //file signature
      path:'path'
    }
  ```
- Loader Webpack default 只支持 js 和 json，需要 loader 将其他文件转换成为可用的模块， loader 本身是一个函数，接收源文件作为参数，返回转换后的结果

  ```
    module: {
      rules:[
        {
          test:regex,
          use:'xxx'
        }
      ]
    }
  ```

  - 手写 loader 的例子

  ```
    export default function (source_code) {
      console.log('Logic for loader')
      return source_code
    }
  ```

  - Loader 内部属于链式调用，从右往左。 FP 中常见的 compose 的用法

  ```
    const loadedCode = loaders.reduceRight(
      (accu,fn,id) => id === loaders.length - 1 ? fn(source) : fn(accu)
    )
  ```

  - Plugin Bundle 文件优化，资源管理，环境变量注入，作用于整个构建过程

    - webpack 中核心库 Tabable 提供了各种各样的 hook 定义触发方式。

      - types：
        - Basic： 顺序调用
        - Waterfall： compose 调用
        - Bail：当 tapped function 有返回值时，停止调用， 责任链模式
        - Loop：只要没有一个 tabbed function 返回 undefine， loopback
      - classification：
        - Sync： 同步 hook， hook.tap()
        - AsyncSeries: 异步 hook, hook.tap()， hook.tapPromise(callback style)， hook.tapAsync
        - AsyncParallel: 上面两种的集合
      - Best Practice:

        ```
          class Example {
            constructor() {
              this.hooks = {
                syncedHook: new SyncHook(['arg']),
                asyncParallelHook:new AsyncParallelHook(
                  ["arg1","arg2","arg3"]
                )
              }
            }
            method1() {
              this.hooks.syncedHook.call();
            }
            method2() {
              this.hooks.asyncParallelHook.promise(1,2,3).then(() => console.log('async called'))
            }
          }
          const example = new Example();
          example.hooks.syncedHook.tap("Plugin1", () => console.log('sync1'))
          example.hooks.syncedHook.tap("Plugin2", () => console.log('sync2'))
          example.hooks.asyncParallelHook.tap("Plugin3",speed => console.log( 's:',speed))
          example.method1();
          example.method2();
        ```

    - 手写 plugin:
      ```
        class BarneyPlugin {
          apply(compiler) {
            compiler.hooks.done.tab('You touch my tra lala', stats => console.log('my ding ding done'))
          }
        }
      ```

4. Babel:

- config: .babelrc 文件配置 preset 和 plugins
- preset： 编译配置的集合
- plugin： 单一方法
