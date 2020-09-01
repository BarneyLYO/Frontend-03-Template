学习笔记

# Week 6

```
HTML代码中可以书写开始_标签_，结束_标签_ ，和自封闭_标签_ 。

一对起止_标签_ ，表示一个_元素_ 。

DOM树中存储的是_元素_和其它类型的节点（Node）。

CSS选择器选中的是_元素_ 。

CSS选择器选中的_元素/伪元素_ ，在排版时可能产生多个_盒_ 。

排版和渲染的基本单位是_盒_ 。
```

NOTE：元素是 NODE 的一种 SO: NODE<>- Element

## 盒 BOX

排版最基本的单位是盒

- 盒模型
  排版时使用的基本单位
  <img src="./note-static/box-model.png">

  - padding: 盒内排版， 影响 content 可以排布的区域的大小
  - margin: 盒本身排版， 确定了盒子周围至少存在的空白区域大小
  - box-sizing:盒宽度作用范围也可以被 box-sizing 去设置。
    - content-box：width 作用于 content
      =》 盒区域 = magin + border + padding + width
    - border-box：
      width 作用于 border 范围
      盒区域 = margin + width

- 排版技术

  - 排版：将可见的元素（盒）放在正确的位置上。
    而 CSS 只排版两样的东西。
    1. 盒
    2. text
  - 本能排版：
    从左往右书写，同一行写的文字都是对齐的，一行写满流就换到下一行
  - 正常流

    - 活字印刷术，写字
    - 步骤：

      1. 收集盒/文字进行（hang）
      2. 计算盒在行中的排布
      3. 计算行的排布

      - 感性图：
        <img src='./note-static/box-queue.png' />
        note: 文字/盒对齐规则。
      - 盒类型
        -line-box：

        - 组成：inline-level-box
        - 排布方式： IFC（line-formatting-context）
        - Text：
          - BaseLine: 拉丁字母基线对齐，中文字符偏移对齐
          - text-bottom/text-top: 由 font-size 最大的决定
          - line-top/line-bottom：盒混排的情况下， 会将 line-top/line-bottom 撑开（偏移）
            <img src='./note-static/inline-text-lines.png'/>
        - 盒: 行内盒的基线是根据盒内文字进行变化的，
          - 使用 vertical-align 对盒进行对齐
            1. top -> line-top,
            2. bottom -> line-bottom,
            3. middle -> (line-bottom + line-top) / 2
            4. text-bottom/text-top

        block-level-box：

        - 组成： line-box，block-level-box
        - 排布方式： BFC （block-formating-context)
        - 复杂机制：

          - float 与 clear

            - 浮动元素脱离正常流，但是依附于正常流
            - float 规则：

              1. 将 float 元素排到页面的特定位置

              2. 将有 float 的元素朝 float value 的值去挤一下

              3. 根据 float 的元素的区域，调整行盒的位置

              4. float 元素不光影响自己一行，同时会影响高度范围内的元素

              5. float 元素也会影响 float 元素

              - clear 找一个干净的空间来执行浮动:
                可以在 float 元素的 style 加一个属性 clear 来强制换行 -> clear:right（找到右边的干净空间来执行浮动）

            - 感性图:

              <img src='./note-static/float.png' />

            - 古老 float 排版：

            ```
            <head>
              <style>
                .left {
                  margin:10px;
                  float:left;
                  width:100px;
                  height:100px;
                  backgroud-color:blue;
                }
                .break{
                  clear: left;
                }
              </style>
            </head>
            <body>
              <div class='left'>1</div>
              <div class='left'>2</div>
              <div class='left'>3</div>
              <div class='left'>4</div>
              <div class='left break'>5</div>
              <div class='left'>6</div>
              <div class='left'>7</div>
              <div class='left'>8</div>
              <div class='left'>9</div>
            </body>
            ```

          - margin 堆叠 margin collapse

            - 一个 bfc 内有从上到下排列的元素， 两个上下的元素的 margin 重叠的部分取最大，
            - why： 因为 margin 指代的只是 box 周围的空白范围
            - 只会发生在 bfc 里面，no flex/grid 发生

          - BFC -分类

            1. Block Container： 里面有 BFC，能容纳正常流的盒。
               - 种类：
                 1. display：block
                 2. display：inline-block
                 3. flex item
                 4. table-cell
                 5. grid cell
                 6. table-caption
            2. Block-Level Box： 外面是 bfc

               - Block-level pair with inline-level
                 - display:block : dispaly:inline-block;
                 - display:flex : display:inline-flex;
                 - display:table : display: inline-table;
                 - display:grid : display:inline-grid
                 - display:run-in

            3. Block Box： 里外都有 BFC 的

            - create BFC
              - floats
              - absolutely positioned element
              - block container that are not block box:
                - inline-block
                  - table-cell
                  - table-captions
                  - flex items
                  - grid cell
                - block boxes with overflow other than 'visible'
            - not create BFC:
              - block box && overflow:visible
                - 里外都是 BFC，overflow 还是 visible 的， 额，就没有创建 BFC 来，里外 BFC 就合并了
                  - float 影响 inline
                  - 边距折叠

  - flex
    逻辑：
    1. 收集盒进行
       - 根据主轴的尺寸，把元素分进行
       - 设置了 no-wrap， 强行分配进第一行
    2. 计算盒在主轴的排布
       - 找出所有的 flex 元素
       - 把主轴方向的剩余尺寸按比例分给这些元素
       - 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素
    3. 计算盒在交叉轴方向的排布
       - 根据每一行最大元素尺寸计算行高
       - 根据行高 flex-align 和 item-align 确定元素具体位置
  - grid

## 动画和绘制

- Animation

  - @keyframes 定义关键帧
    - duration | timing-function | delay | iteration-count | direction | fill-mode |play-state | name
  - animation 使用关键帧
  - ```
    @keyframe kf {
      from {background:red;}
      to {background:yellow;}
    }

    @keyframe kf2 {
      0% {top:0;transition:top ease}
      50% {top:30px;transition:top ease-in}
      75% {top:10px;transition:top ease-out}
      100% {top:0px;transition:top linear}
    }

    div {
      animation kf 5s infinite;
    }
    ```

  - 属性
    - animation-name：时间曲线
      - 选择@keyframe rules
    - animation-duration 动画时长
    - animation-timing-function 动画的时间曲线
    - animation-delay 动画开始前的延迟
    - animation-iteration-count 动画的播放次数
    - animatio-direction 动画的方向

- transition

  - 属性
    - transition-property 要变换的属性
    - transition-duration 变换的时长
    - transition-timing-function 时间曲线 cubic-bezier ease/linear/ease-in/out
    - transition-delay 延迟

- 颜色

  - 视觉上会有偏差，自然界很少有纯色光
  - 三原色：RGB
  - 印刷行业 CMYK 最大化使用 k
  - HSL and HSV：更加符合人的认知， 虽然我不怎么认为
    - H：Hue 色相 把六种基本颜色拼成一个色盘，Hue 指定角度
    - S：Saturation 纯度， 表示颜色中杂色的数量
    - L：Lightness 光度，
    - V：色值，Brightness
    - 语法：
      ```
        hsl(h%,s%,l%)
      ```

- 绘制

  - 几何图形
    - border
    - box-shadow
    - border-radius
  - 文字
    - font
    - text-decoration
  - 位图

    - background-image

  - 绘制几何图形
    - data uri + svg
      ```
      data：image/svg+xml，
      <svg width="100%" height="100%" version="1.1">
      <ellipse
          cx="150"
          cy="90"
          rx="50"
          ry="50"
          style="fill:rgb(200,100,50);
          stroke:rbg(0,0,100);
          stroke-width:2
          "
        />
      </svg>
      ```
      <svg width="100%" height="100%" version="1.1">
      <ellipse
          cx="150"
          cy="90"
          rx="50"
          ry="50"
          style="fill:rgb(200,100,50);
          stroke:rbg(0,0,100);
          stroke-width:2
          "
        />
      </svg>

  Css Xmind in folder
