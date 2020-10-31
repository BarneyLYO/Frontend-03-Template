学习笔记

# 组件化

主要目标：复用 （扩展 html 标签）
组件的基本概念
组件区别于模块，区别于对象， 组件是一种特殊的模块/对象，并且可以用树形结构进行组合，有一种模版化的配置能力。

- 对象
  - 属性
  - 方法
  - 继承关系
- 组件

  - prop：从属关系，有 xxxx
  - method
  - inherit
  - attr ： 强调描述性，帅，cool
  - config & state
  - event
  - lifecycle
  - children

- Note: attr vs prop

  - 取决于组件体系设计者， attr 和 prop 的意思可能不同，也可能相同
  - 激进的方案， attr/prop/config/state 统一
  - react 方案：prop（attr， prop， config） 与 state
  - html：

    ```
      attr:
      <my-component attribut="v" />
      myComponent.getAttribute('a');
      myComponent.setAttribute('a','value');

      property:
      myComponent.a = 'value'

      <div class='cls1 cls2'> </div>
      <script>
      let div = document.getElementByTagName('div');
      div.className; // js 中class是关键字，so domApi只能用className，es6可以用class
      div.style //对象， div.getAttribute('style') //只有当html中有才能获取
      </script>
      <a href="//m.taobao.com">xxx</a>
      <script>
        let a = document.getElementByTagName('a');
        a.href; //http://m.taobao.com //resolve后的结果
        a.getAttribute('href') // '//m.taobao.com' 与html一致
      </script>

      <input value='cute' />
      <script>
        let input = document.getElementByTagName('input');
        input.value //cute
        input.getAttribute('value') //cute
        input.value = 'a'
        input.value //a
        input.getAttribute('value') //cute
      </script>
    ```

- structure figure
  <image src='./imgs/components.png'/>
- component state
  <table  >
      <tr style="border: 1px solid grey;border-button-width: 0px;">
        <th>type/change type</th>
        <th>Markup</th>
        <th>JS Set</th>
        <th>JS Change</th>
        <th>User Input Change</th>        
      </tr>
      <tr style="border: 1px solid grey;border-button-width: 0px;">
        <th>Prop</th>
        <th>N</th>
        <th>Y</th>
        <th>Y</th>
        <th>M</th>        
      </tr>
      <tr style="border: 1px solid grey;border-button-width: 0px;">
        <th>Attr</th>
        <th>Y</th>
        <th>Y</th>
        <th>Y</th>
        <th>M</th>        
      </tr>
      <tr style="border: 1px solid grey;border-button-width: 0px;">
        <th>State</th>
        <th>N</th>
        <th>N</th>
        <th>N</th>
        <th>Y</th>        
      </tr>
      <tr style="border: 1px solid grey;border-button-width: 1px;">
        <th>Config</th>
        <th>N</th>
        <th>Y</th>
        <th>N</th>
        <th>N</th>        
      </tr>
  </table>
- lifecycle
  <image src='./imgs/lifecycle.png'>
- Children
  - Content
    - 能直接 render 的组件
  - Template
    - 不能直接 render 的 （vue）

# 组件项目

1. @Babel/plugin-transform-react-jex

   - 转换 jsx 成为 React.createElement
   - 自定义：{pragma:}

2. Babel:
   1. preset: pre-defined plugins collection
   2. plugin: extended function
