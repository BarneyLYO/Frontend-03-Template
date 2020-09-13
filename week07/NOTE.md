学习笔记

# Week 7

## HTML

- 源流：XML 与 SGML XML 是一切痛苦的源头，从心底里面对其感觉到深恶痛绝
- SGML： DTD：document type definition, define allowed data description to existing in the xml/sgml
- Entity:
  1. nbsp: no breaking space
  2. lambda:&#955
  3. quot: &#34 “”
  4. amp: &#38 &
  5. lt: &#38 or #60 <
  6. gt: &#39 >
- namespace: 在 html5 中可以选择 xhtml（标签必须闭合）或 html 两种语法
- 语义： html 本来就是一个语义系统，不需要关心长什么样

  - main： 文章的主体部分

    - article：文章
      - p：段落
        - abbr：缩写
        - em：重音 emphasis 句子中强调的重点
        - strong：重要，不改变语言，词很重要
        - dfn：definition 定义
    - div： 独立区域
    - pre： 预先表示好的文本 html lt gt 转移
    - code： 代码
    - samp： 例子
    - hgroup： 标题构成的组标题
      - h1-h7: 标题
    - figure： 形状组
      - figcaption: 描述
      - img：图片
    - ol/ul： 可以用 css counter 改变前标
      - li
    - nav： 导航，页面跳转引导

  - aside：文章的边栏，负责处理文章的辅助导航
  - footer：
  - header：

  - 当没有适合的标签处理的时候，选择 css 替代处理

- 语法
  - 合法元素 NODE
    - Element < tagName > ... < /tagname >
    - Text text
    - Comment < !--comment -- >
    - DocumentType < !Doctype html>
    - ProcessingInstruction < ?a 1? > 预处理语法， 没卵用
    - CDATA <! [ CDATA[] ]> 特殊语法， 文本语法， 不用考虑转义 -字符引用
    - &#161 ascii 161
    - &amp
    - &lt；
    - &quot

## DOM API

### 事件

- EventTarget: 一个 DOM 接口，由可以接收事件，并且可以创建监听器的对象实现。最常见的是 Element，document，window，但其他对象也可以作为 event target 譬如 XMLHttpRequest，AudioNode，AudioContext。

  - 类似于 EventEmitter

  ```
  let EventTarget = function() {
    this.listeners = {};
  };

  EventTarget.prototype.listeners = null;
  EventTarget.prototype.addEventListener = function(type, callback) {
    if(!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  };

  EventTarget.prototype.removeEventListener = function(type, callback) {
    if(!(type in this.listeners)) {
      return;
    }
    let stack = this.listeners[type];
    for(var i = 0, l = stack.length; i < l; i++) {
        if(stack[i] === callback){
          stack.splice(i, 1); //unpure
          return this.removeEventListener(type,   callback);
      }
    }
  };

  EventTarget.prototype.dispatchEvent = function(event) {
    if(!(event.type in this.listeners)) {
      return;
    }
    var stack = this.listeners[event.type];
    event.target = this;
    for(var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
  };
  ```

  - addEventListener
    - Syntax:
      ```
      target.addEventListener(type,listener[,optional]) //一直都不明白为什么MDN的文档用【】来表示可选项
      target.addEventListener(type,listener[,useCapture])
      target.addEventListener(type,listener[,useCapture,wantsUntrusted]);
      ```
    - type: String represent event Type
    - listener: CB
    - options !!!! important:
      1. capture: boolean true 冒泡，false 捕获
      - 不管你监听事件与否，事件都会发生
      - 事件先捕获再冒泡
      - 默认冒泡
      2. once
      3. passive： true 抵消 preventDefault 的作用，移动端默认 false

- DOM API

  - BOM 不包含 DOM
  - Broswer API = BOM + DOM
  - 4 部分
    - 废物 api traversal 系列 不如不用
    - Node API
    - Event API
    - Range API 精确 DOM 操作，性能好
  - 继承图
    <img src="./doc/xml_dom.gif" />
  - 同时基类 Node 实现了 EventTarget interface，所以任何的 Node 都可以 addEventListener（理论上，不排除一些 Node 子类重写 addEventListener, 譬如在 java collection 框架，所有的 collection 都是 iteratable， 但是一些 collection 不能在遍历的途中做操作）
  - Element
    1. HtmlElement 子类全名命名 HtmlAnchorElement
    2. SVGElement 子类潇洒派命名 SVGAElement
    3. MathElement ？？
  - Node API
    - 节点 Node 导航 API(包含一些文本节点)
      - parentNode （只可能是 element）
      - childNode （只有 element 有）
      - firstChild
      - lastChild
      - nextSibling
      - previousSibling
    - 修改操作
      - appendChild
      - insertBefore
      - removeChild
      - replaceChild
      - #insertAfter 可以用 appendChild + insertBefore 实现
    - 比较操作
      - compareDocumentPosition 比较两个节点关系
      - contains 包含
      - isEqualNode
      - isSameNode ===
      - cloneNode 传入 true，深拷贝
  - Element 导航 API（直接搞 HTML ELEMENT）
    - parentElement
    - children
    - firstElementChild
    - lastElementChild
    - nextElementSibling
    - previousElementSibling
  - Range Api

    - range, 一连串的 dom（不能跳滴）可以包含半个节点

    ```
      let range = new Range();
      range.setStart(element,9/*偏移值*/); //先于end就行， 偏移值相对于node就是node，相对于text就是文字个数
      range.setEnd(element,4);
      let range = document.getSelection().getRangeAt(0);//鼠标选取的元素
    ```

    - range.setStartBefore
    - range.setEndBefore
    - range.setStartAfter
    - range.setEndAfter
    - range.selectNode
    - range.selectNodeContents
    - range.extractContents()//摘取 dom 内容返回 fragment（容器，append 到 dom 上时会将除自己以外的节点挂在上）
    - range.insertNode
    - 被 range 截断的标签会自动补上

  - Dom Collection 是一个 living collection， 变化引起 collection 变化
  - Element 的子元素在 insert 时不需要从原来的位置挪开的，进行 insert 操作会自动将被 insert 的元素从原来的位置 remove
  - Array.prototype.slice.call(element.childNodes), 将 itreatable 变成数组或者[. . .], element.childNode 变身 dead collection

  ```
    //reverse children Nodes
    function reverseChildren(el) {

      // comma operation is made for handle sideEffect
      [...el.childNodes].map(child => (el.removeChild(child), child))
              .reverse()
              .map(child => (el.appendChild(child), child));
    }

    //or

    function reverseChildren(el) {
      let l = el.children.length;
      while(l--) {
        // HtmlCollection is living collection, automatically unbind
        el.appendChild(el.childNodes[l]);
      }
    }

    // or
    function reverseChildren(el) {
      let range = new Range();
      range.selectNodeContents(el);

      let fragment = range.extractContents();
      /* The dom operation has been taked off into fragement */
      let l = fragement.childNodes.length;
      while(l--){
        fragment.appendChild(fragment.childNodes[l]);
      }

      element.appendChild(fragment);
    }

  ```

  - CSSOM API

    - css 文档的抽象
    - document.styleSheets css 代码就是嵌在 dom 中，没有 dom 没有 css
    - ```
      <link rel="stylesheet" title='x' href='data:text/css,p%7Bcolor:blue%7D'> // or style tag
      document.styleSheets < = Stylesheet < = {0:CSSStyleSheet, 1:CSSStyleSheet,length:2}
      /*
      CSSStyleSheet:{
        cssRules:CSSRuleList,
        disabled:false,
        href:'data:text/css,p%7Bcolor:blue%7D',
        media:MediaList,
        ownerNode:Link,
        .....
        rules:CSSRuleList < = {0:CSSStyleRule,length:1} **
        type:'text/css'
      }
      */

      document.styleSheets[0].cssRules
      document.styleSheets[0].insertRule("p{color:pink;}",0)//css,position
      document.styleSheets[0].removeRule(0)
      /*
        Rule:
          CSSStyleRule:
            selectorText String
            style K-V

          //@Rule
          CSSCharsetRuleRule,
          CSSImportRule,
          CSSMediaRule,
          CSSFontFaceRule,
          CSSPageRule,
          CSSNamespaceRule,
          CSSKeyframeRule,
          CSSKeyframesRule,
          CSSSupportsRule
      */
      document.styleSheets[0].cssRules[0].style.color = "red";

      //window.getComputedStyle(element,pseudoElt);
      // element: dom element
      // pseudoElement: optional, pseudo Element
      getComputedStyle(document.querySelector('a'),"::after")
      ```

    - view api (视图相关)

      - apis

      ```
      /*
      window.innerHeight, *
      window.innerWidth, *

      window.outerWidth, no
      window.outerHeight no

      window.devicePixelRatio **
        像素比
      window.screen
        window.screen.width
        window.screen.height
        window.screen.availWidth
        window.screen.availHeight
      */
      let new_window = window.open('url','','width=?,height=?,left=?,right=?)
      new_window.moveTo(x,y)
      new_window.moveBy(x,y)
      new_window.resizeTo(x,y)
      new_window.resizeBy(x,y)

      /*
        scroll
        scrollTop/scrollLeft/scrollWidth/scrollHeight
        scroll(x,y)/scrollBy(x,y)/scrollIntoView()
        window
          scrollX/scrollY/scroll(x,y)/scrollBy(x,y)
      */

      /*
        layout
          getClientRects()
          getBoundingClientRect() 只获取一个
      */
      let x = document.querySelector('x')
      x.getClientRects();
      //DOMRectList{0:DOMRect,1:DOMRect,2:DOMRect.....length:x}
      //DOMRect {
        x:number,y:number,width:number,height:number,top:number,bottom:number
      }
      ```

- API Collection under ./doc/APIs.xminds
