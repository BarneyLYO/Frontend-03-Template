学习笔记

# Week 4

## Layout

Layout === 排版， 取自于活字印刷术。
而 toy broswer 实现的是 flex 排版实现。

css 有三代排版技术：

1. 正常流： position， display，float 古典排版策略
2. Flex： 二维排版空间， 弹性式布局
3. Grid： 二维排版空间， 栅格式布局

### Flex

Flex 可分纵排和横排两种方式，由 flex-direction 决定， 而 flex 布局分为 Main Axis，与 Cross Axis(交叉轴，与主轴相交)

1. flex-direction：row => Main Axis： width x left right； Cross Axis： height y top bottom
2. flex-direction：column => Main: height y top bottom, Cross Axios: width x left right

layout 发生在标签的结束标签之前， before stack pop ，

### 收集元素进行（hang）

收集元素进行是为了之后收集元素的一个准备工作

- 分行：
  - 根据主轴尺寸， 把元素分进 row
  - 若设置来 no-wrap， 则强行分配到第一行
  - Flex 的分行算法与正常流相似， 如果子元素的在一行的尺寸超过父元素主轴的长度，则会产生换行（！no-wrap）

### 计算主轴方向

将元素收集入行之后就开始计算主轴

- 计算主轴
  - 找出所有 Flex 元素
  - 把主轴方向的剩余尺寸按比例分配（flex：value）给这些 flex 元素
  - 若剩余空间为负数， （no-wrap 情况下）所有 flex 元素为 0，等比压缩剩余元素

### 计算交叉轴

- 计算交叉轴
  - 根据每一行中最大元素尺寸计算行高
  - 根据行高 flex-align 和 item-align，确定元素具体位置

## render

由于是 toy broswer， 用图片替代 browser

```
 yarn add images
```

但是我的 node 跑不起来， 过分

```
Assertion failed: (status == napi_ok), function New, file ../src/Image.cc, line 282.
```
