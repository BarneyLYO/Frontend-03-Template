学习笔记

# 持续集成

1. Daily Build
   - 前端 build 时间少 提交时 build 验证
2. BVT build verification test 冒烟测试
   - 轻量级的检查方式：lint， phantomJS 无头浏览器

# githook

client-side hook 存在于 repo 下的 hooks 里面。
hooks：现在大家都用 husky

- commit-msg
- post-update
- pre-applypathc
- pre-commit \* lint
- pre-push \*
- pre-rebase
- pre-achieve
- update
- pre-receive \* be
  ......
- Note: 可以在 executable 文件头更改<em>Shebang line</em>(#!)来告诉操作系统以什么方式来执行该脚本文件
  ```
    #!/usr/bin/env node
    let process = require("process");
    console.log("hello hooks");
    process.exit(1); // git will check return value of hook and decide if they want to execute
  ```
  - 在 demo 中 我实现了一个 copy.js 利用 fs module 将 workspace 的 pre-commit 自动复制到 git hook 文件夹下面， 然后更改其的权限为 777（因为我懒啊）

# eslint

ESlint， 轻量代码风格检查工具，市面上有大量的 pre-set 存在， 其中 airbnb 的规范流传最广， 但是也是我觉得最烦人的一种， google 的要好一点

- 整合

  - 在 pre-commit hook 里面调用 eslint

  ```

    (async function main() {
  	  const eslint = new ESLint({ fix: false });
      const result = await eslint.lintFiles(['lib/**/*.js']);
      const formatter = await eslint.loadFormatter('stylish');
      const resultText = formatter.format(result);
    	return resultText;}
    )().then(console.log)
       .catch(e => {
         process.exitCode = 1;
         console.error(error);
    });

  ```

  - 冲突整合
    - git stash（手动）： 让用户自行的去执行 git stash save/push 和 git stash pop
    - child process 执行 git stash
    ```
      await exec('git stash push -k');
      const result = await eslint.lintFiles(['index.js']);
      await exec('git stash pop');
    ```

# chrome headless

phantojs 过于老旧， headless 取而代之

1. 利用 alias 添加命令行使用 chrome： alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
2. 使用 chrome --headless 【启动无头浏览器】 --dump-dom 【打印 dom】
3. 使用 puppeteer 命令行封装

- ```
    (async () => {
        const broswer = await puppeteer.launch();
        const page = await broswer.newPage();
        await page.goto(
  	      'http://127.0.0.1:5500/Geekbang_homework/Frontend-03-Template/week16/project/jsx/dist/main.html'
        );
        const el = await page.$('div');
        const element = await el.asElement().boxModel();
        console.log(element);
    })();
  ```
