学习笔记
编程训练

# Tic Tac Toe

- 棋盘：3x3 方格
- 双方分别持有圆圈和叉两种棋子
- 双方交替落子
- 率先连成三子的直线的一方获胜
- 实现： ./tic-tac-toc/index.html

# 异步

- Callback
  nodejs 编程环境中很多 API 都是以 callback 的形式实现的：
  譬如

  ```
    fs.open('./xxx-file', 'wx', (err, fd) => {
      //logic
    })
    //当你要连续处理文件时
    fs.open('./xxx-file', 'wx', (err, fd) => {
      fs.open('./xxx-file', 'wx', (err, fd) => {
        fs.open('./xxx-file', 'wx', (err, fd) => {
          fs.open('./xxx-file', 'wx', (err, fd) => {
             fs.open('./xxx-file', 'wx', (err, fd) => {
               console.log(1+1)
            })
          })
        })
      })
    })
  ```

  callback hell 的问题不光是在 node 里面有， java8 支持 Functional interface 和 aio 之后同样也有一样的问题， 回调地狱的问题是函数是第一公民所带来的直接结果。
  针对这种情况最火的方案的是 Q.js

  ```
  Q.fcall(promisedStep1)
  .then(promisedStep2)
  .then(promisedStep3)
  .then(promisedStep4)
  .then(function (value4) {
    // Do something with value4
  })
  .catch(function (error) {
    // Handle any error from all above steps
  })
  .done();
  ```

  而 Q.js 的作者是 Functional Javascript 的倡导者 Kris Kowal， 而 Q.js 的编写形式就是 Functional Programming 的 Monad。
  Monad 是一个容器对象， 该对象实现了一个 flatMap 的接口用于处理数据的副作用。 而在 Q.js 中， flatMap 被另外命名为 then 和 catch。

  最早期处理 callback 被称为 promisify

  ```
  const promisify = fn => (...args) => new Promise (
    (resolve,reject) => fn(...args, (err,data) => err ? reject(err) : resolve(data))
  );
  ```

- Promise (A+ standard)
  随着 es5 的推出， Promise 被收入规范中。而收入的 Promise 规范为 A+。在 Q.js 的基础上删除了一些难以理解的 api 以及引入了 state machine
- co (generator based)
  由于 promise 的兴起，以及 TJ 大大对自己的 express 开始臃肿变得不满意， 所以实现了一套基于 generator 函数实现的异步转同步的框架。 同时利用 co 框架实现了一套基于洋葱模型的 http 应用框架 Koa， 但是社区不是很买账，因为实在是太轻量了。

  ```
  function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
      return null;
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
  }
  ```

- Async/Await (advanced co)
  其实就是语法糖， promise 好用，严格实现了 Functional Programming 的 Railway Oriented Programming pattern， 但是很多人发现这种链式写法仍旧让他们很崩溃， 但反在 then 函数中没有 return 值， 链式调用就挂掉了， 所以基于 co 的思想，Async/Await 入住 ES6+（其他语言也有， 但不是拿 generator 的方式实现的，java 里面是 Future 实现）从此大家就用写那么多 then 了， 虽然我还是很喜欢这种 Railway Oriented Programming pattern，代码能对得很齐（强迫症啊强迫症）

- async generator
  这个就屌了, for await 真的是方便到爆， generator 加 async 感觉 js 版的 goroutine 就在眼前。
