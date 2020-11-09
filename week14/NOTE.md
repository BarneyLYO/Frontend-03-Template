学习笔记

# Frame

> 视为随时间连续变换的许多张画面，其中帧是指每一张画面。

- RAF: 通知瀏覽器我們想要產生動畫，並且要求瀏覽器在下次重繪畫面前呼叫特定函數更新動畫。
  - broswer：16ms 刷新 <== 1000ms / 16ms = 60frames/sec
  - cancelAnimationFrame(handler)
- setInternal/setTimeout: 宏任务循环生成(积压可能)
  ```
   let tick = (animation_logic) => (animation_logic,setTimeout(tick,16))
  ```

# Animation

> 一种通过定时拍摄一系列多个静止的固态图像（帧）以一定频率连续变化、运动（播放）的速度（如每秒 16 张）而导致肉眼的视觉残象产生的错觉——而误以为图画或物体（画面）活动的作品及其视频技术。

- 前端技术栈里面主要通过操作`DomElement`的`style`在不同的时间所得到的值而达成效果
- 前端领域通过 cubic-bezier 函数描述属性改变的轨迹

# Timeline

> Frame 抽象容器，动画的每一瞬间视为 Frame

- Timeline 通过使用 RequestAnimationFrame 以及 CancelAnimationFrame 来处理动画逻辑
