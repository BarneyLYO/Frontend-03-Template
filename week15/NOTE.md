学习笔记

# Gesture

- Tap: start -> end
- pan: 摄影术语，移动摄影机
  - 步骤：start -> move 10px(based on screen) -> pan start -> move -> pan - end or flick(扫 end 且速度大于)
- press: (长按)
  - 步骤：
    1.start -> press end
    2.start -> move >>>> pan
    > Retina screen 10px, 1x screen 5px, 3x screen 15px
- flick：pan end 的同时达到一定速度。

# Eventlistener

新的 Eventlistener 的第三个 parameter 参数接收了一个对象，该对象接收三个 flag properties:

- once: 执行完后自动注销 handler
- useCapture:事件捕获机制
- passive: 事件 handler 不会调用 preventDefault，事件可以并发的进行

# dispatcher 实现

1. mouse event 拖拽的模版代码

- ```
  let el = document.querySelector('xxx')
  el.addEventListener('mousedown', e=>{
    let mouseMove = e => mouseMoveLogic;
    let mouseUp = e => {
      {
        //mouse up listener

      }
      document.removeEventListener('mousemove',mouseMove);
      document.removeEventLostener('mouseup',mouseUp);
    }
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  })
  ```

  - 将 mouseMove 和 mouseUp 的逻辑加在 document 上可以使动作监听更加具有灵活性
  - 坑：当监听 mouseMove 时，event.buttons 表示的是获取那些键，但是是用掩码表示，其中中键和右键的顺序是反的，需要特殊处理。
    - ```
      function getButtonKey(e,consumer){
        let button = 1;
        while(button <= e.buttons){
          if(button & e.buttons){
            let key;
            switch(button){
              case 2:
                key = 4;
                break;
              case 4:
                key = 2;
                break;
              default:
                key = button;
                break;
            }
            consumer(key);
          }
          button = button << 1;
        }
      }
      ```

2. touch 实现：

- touch 相对于 mouse 的 event 要清晰许多， 监听方式为：touchstart -> touchmove -> touchend 以及 touchcancel, 分开实现即可。
- 由于现在手机支持多点触摸，所以 domApi 的 touch event 将不同点的监听封装进入 event.changedTouches
  - changedTouch 封装数据：
    ```
    {
      clientX:number,
      clientY:number,
      force:number,
      identifier:number,
      pageX:number,
      pageY:number,
      radiusX:number,
      radiusY:number,
      rotatinAngle:number,
      screenX:number,
      screenY:number,
      target:body
    }
    ```
    我们最需要的是 identifier 属性。

# Recognizer 实现：

1. 状态：

- ```
  static TAP = Symbol('TAP');
  static PAN = Symbol('PAN');
  static PRESS = Symbol('PRESS');
  static FLICK = Symbol('FLICK');
  ```

2. apis： 通过 api 的调用会改变 recognizer 内部的状态，达到手势的识别。

- start （point，context）
- move （point，context）
- end （point，context）
- cancel（point，context）

# dispatcher

dispatcher 负责将 recognizer 识别的事件分发到对于的 element 上。

- ```
  dispatch(type, properties) {
  //CustomEvent(type,{})
    let event = new Event(type);
    Object.keys(properties).forEach(p => (event[p] = properties[p]));
    console.log(type, properties);
    this.element.dispatchEvent(event);
  }
  ```
