学习笔记

# Mocha

运行在 nodejs 中的测试框架

- 基本使用：
  - 例子
  ```
  var assert = require('assert');
  describe('Array', function() {
    describe('#indexOf()', function() {
      it(
        'should return -1 when the value is not present',
        function() {
          assert.equal([1,2,3].indexOf(4), -1);
          });
        });
    });
  ```
  - describe: 测试描述
  - it：测试用例，其实就是打印好看
- 异步代码测试, done 只能调用一次
  ```
    it('done', done => setImmediate(done));
    it('done 2', done => {
      const a = Math.random() * 10 > 5
      if(a)
        Promise.resolve().then(done)
      else
        Promise.reject(new Error('aaaa')).catch(done)
    })
  ```
- 断言：mocha 支持：should.js, better-assert, expect.js, assert, chai, unexpected
- hook: mocha 和 junit 一样有各种各样的钩子函数， 这里可以看出 native 支持反射的 js 要比 java 灵活百倍。

  ```
    descrbe('hooks',() => {
      before('descrbe',(done) => console.log('before all tests in block'));

      after('descrbe',(done) => console.log('after all test'));

      beforeEach('descrbe',(done) => console.log('before each')); //按照定义的顺序

      afterEach('descrbe',(done) => console.log('after each'))
    })
  ```

  - mocha 还可以在 describe 之外定义 root 级别的钩子，可以异步哦亲
  - mocha 同时支持排他性测试（only），包容性测试（skip），重复测试（retry）

- 兼容 es6 module： 如果 mocha 中想使用 es6 module 的话需要导入一个@babel/register 的插件

  - 用法： 通过 node 的 require hook 将@babel/register 绑定在 node 的 require 模块上， node 后续运行时所需要 require 进来的扩展名为 .es6、.es、.jsx、 .mjs 和 .js 的文件将由 Babel 自动转换。
  - 但是： Polyfill 不会被引入进来，需逐个引入。
  - 结论： 我还是 mjs 走起吧

- 吐槽：除非我写框架或基本库， 要不然我绝壁不搞 mocha， 时间成本太高， 测试代码真的让人想杀人

# istanbul

- 官网原话，数行数的工具
  > Istanbul instruments your ES5 and ES2015+ JavaScript code with line counters, so that you can track how well your unit-tests exercise your codebase.
- nyc Istanbuljs 的命令行工具
  - 使用：放在 mocha 前调用即可
  - 配合 babel 的话需要 babel 设置 sourceMap， 同时定义.nycrc 文件并且声明 extends：@istanbuljs/nyc-config-babel

# folders

- build-test： yo toytool 生成的文件
- generator-toytool 实战
- test-demo： mocha
