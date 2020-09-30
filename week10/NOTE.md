学习笔记

# LL 算法构建 AST

## Abstract Syntax Tree (AST)

抽象语法树

- code -> tokenize -> ast -> parse

* 语法分析

  - 算法
    - LL 从左到右分析规约算法 left-left 算法
  - 四则运算词法定义
    - TokenNumber: [1-9.]\*
    - Operator: +,-,\*,/
    - WhiteSpeace: <SP>
    - LineTerminator:<LF><CR>
  - 四则运算语法定义

    ```
    //TERMINAL SYMBOL : <EOF>
    <Expression>::= <AdditiveExpression><EOF>
      //TERMINAL SYMBOL : <+> <->
      <AdditiveExpression>::= <MultiplicativeExpression> | <AdditiveExpression> <+> <MultiplicativeExpression> | <AdditiveExpression> <-> <MultiplicativeExpression>
      //TERMINAL SYMBOL : <NUMBER> <*> </>
      <MultiplicativeExpression> ::= <Number> | <MultiplicativeExpression> <*> <Number>| <MultiplicativeExpression> </> <Number>
    ```

  - REGEX tips

    - 正则表达式在 js 中
      以/([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g 为例
      会以如下的结构展示:
      ```
        [
          whole match result,
          ([0-9\.]+) result, //captured
          ([ \t]+) result,//captured
          ([\r\n]+) result,//captured
          (\*) result,//captured
          (\/) result,//captured
          (\+) result,//captured
          (\-) result,//captured
          index, //last index
          input,
          group
        ]
      ```
      在正则中但凡出现一个（）就会在正则类数组对象（Tuple）中产生一个 capture slot

  - tokenizer 实现

    ```
    function* tokenize(source) {
      let result = null;
      let last_index = 0;
      while (true) {
        last_index = REGEX.lastIndex;
        if ((result = REGEX.exec(source)) === null) break;
        if (REGEX.lastIndex - last_index > result[0].length) break;
        let token = {
          type: null,
          value: null
        };
        for (let i = 1; i <= DICT.length; i++) {
          result[i] && (token.type = DICT[i - 1]);
        }
        token.value = result[0];
        yield token;
      }
      token = {
        type: 'EOF',
        value: void 0
      };
      yield token;
    }
    ```

  - LL 语法分析

    - 每个产生式对应一个函数

      - muliplicativeExpression:

        ```
        function multiplicativeExpression(source) {
          //直接将number打包成为multiplicativeExpression
          if (source[0].type === 'Number') {
            let node = {
              type: 'MultiplicativeExpression',
              children: [source[0]] // 这里我觉得之后会不太好处理吧
            };
            source[0] = node;
            return multiplicativeExpression(source);
          }
          //打包*
          if (
            source[0].type === 'MultiplicativeExpression' &&
            source[1] &&
            source[1].type === '*'
          ) {
            let node = {
              type: 'MultiplicativeExpression',
              operator: '*',
              children: []
            };
            node.children.push(source.shift());
            node.children.push(source.shift());
            node.children.push(source.shift());
            source.unshift(node);
            return multiplicativeExpression(source);
          }
          //打包/
          if (
            source[0].type === 'MultiplicativeExpression' &&
            source[1] &&
            source[1].type === '/'
          ) {
            let node = {
              type: 'MultiplicativeExpression',
              operator: '/',
              children: []
            };
            node.children.push(source.shift());
            node.children.push(source.shift());
            node.children.push(source.shift());
            source.unshift(node);
            return multiplicativeExpression(source);
          }
          //处理完毕
          if (source[0].type === 'MultiplicativeExpression')
            return source[0]；
          //dead code
          return multiplicativeExpression(source);
        }
        ```

      - addtiveExpression

        ```
        function additiveExpression(source) {
          //check mult
          if (source[0].type === 'MultiplicativeExpression') {
            let node = {
            type: 'AdditiveExpression',
            children: [source[0]]
            };
            source[0] = node;
            return additiveExpression(source);
          }
          //check +
          if (
          source[0].type === 'AdditiveExpression' &&
          source[1] &&
          source[1].type === '+'
          ) {
            let node = {
            type: 'AdditiveExpression',
            operator: '+',
            children: []
            };
            node.children.push(source.shift());
            node.children.push(source.shift());
            multiplicativeExpression(source); //process the un-terminated symbol
            node.children.push(source.shift());
            source.unshift(node);
            return additiveExpression(source);
          }
          //check -
          if (
          source[0].type === 'AdditiveExpression' &&
          source[1] &&
          source[1].type === '-'
          ) {
            let node = {
            type: 'AdditiveExpression',
            operator: '-',
            children: []
            };
            node.children.push(source.shift());
            node.children.push(source.shift());
            multiplicativeExpression(source); //process the un-terminated symbol
            node.children.push(source.shift());
            source.unshift(node);
            return additiveExpression(source);
          }
          //return
          if (source[0].type === 'AdditiveExpression') return source[0];
          //unkown stuff, trying to process the terminator
          multiplicativeExpression(source);
          return additiveExpression(source);
        }
        ```

      - expression

        ```
        function expression(tokens) {
          //wrap additive
          if (
            tokens[0].type === 'AdditiveExpression' &&
            tokens[1] &&
            tokens[1].type === 'EOF'
          ) {
            let node = {
              type: 'Expression',
              children: [tokens.shift(), tokens.shift()]
            };
            tokens.unshift(node);
            return node;
          }
          //handling weird token
          additiveExpression(tokens);
          return expression(tokens);
        }
        ```
