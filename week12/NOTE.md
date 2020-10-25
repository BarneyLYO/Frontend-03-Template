学习笔记

# Meta Programming 元数据编程

Wiki:

> Metaprogramming is a programming technique in which computer programs have the ability to treat other programs as their data.
> 简而言之： 代码对代码进行处理

Reflection：反射，是元数据编程的简称，有如下三种反射分类

1. Introspection：Code is able to inspect itself（自省）
2. Self-Modification：Code is able to modify it self （自改）
3. Intercession： Acting behalf of somebody else by wrapping， trapping， intercepting（自介入，就是装饰者）

# Proxy - Intercession

Wiki:

> Proxy wraps onjects and intercepts their behavior through traps
> 在 js 中，每一个 proxy 对象会对放入的对象进行包装，每当外界通过 proxy 对象调用内部方法时就会陷入 trap 调用中。
> 3 个最主要概念：

1. target： 被代理的对象
2. handler： 代理对象， 包含 trap 重写
3. trap： 重写的对象访问方法
   基础用法：

- creation:

```
 new Proxy(target, handler)
```

- handler:

```
let handler = {
  get(obj, prop) { //get trap
    console.log(prop,obj[prop]);
    return obj[prop];
  }
}
```

- traps:

  - apply
  - construct
  - defineProperty

  - deleteProperty
  - get
  - getOwnPropertyDescriptor

  - getPrototypeOf
  - has
  - isExtensible

  - ownKeys
  - preventExtensions
  - set

  - setPrototypeOf

usecases：

- data binding
- data hiding
- AOP

in java:

- java.lang.reflect.proxy

```
  ClassLoader classLoader = clazz.class.getClassLoader();
  Class[] interfaces = clazz.class.getInterfaces();
  InvocationHandler invocationHandler= (proxy, method, args) -> {
    if(method.getName().equals('methoda')) {
      System.out.println('methoda')
    }
    return method.invoke(null, args); // null is the original obj
  };
  Proxy.newProxyInstance(classLoader, interfaces, invocationHandler)

```

Data Binding in vue3:

- data structure:
  <br>
  <image src='images/reactivity.png'>
  - targetMap: WeakMap -> weak reference container: 现在叫 reactiveMap
    key:Wrapped Object
    value: DependenceMap
  - depsMap: Map(hashMap)：现在放到 baseHandler.ts 里面去做了
    key:Reactive Object Property name
    value: depSet
  - dep: Set(hashSet) ： 现在放到 effect.ts 里面的 track 去做了
    value:function
- Algorithm：
  1.  通过 reactive.ts/createReactiveObject 往 reactiveMap 里面插入 key：proxy， value： targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  2.  在 baseHandlers 上的 CreateGetter 上返回 Link depsMap 通过 effect.ts/track 方法。
  3.  在 baseHandlers 上的 CreateSetter 上调用状态更新方法， 通过 effect.ts/trigger 方法
- 这种三重缓存结构很常见啊， Spring-context 的 Application context 用三重缓存来记录各个对象之间的关系， Webpack 貌似也在用。

# Reflect - Introspection

- Reflect 是 ES6 新定义的 Global 对象， 提供一系列的 Util introspection function。 许多 Util function 是在 pre-ES6 就定义好了的。
  - Example: Object.keys <-> Object.ownKeys
- why:

  1. All in One Namespace: 之前的自省方法全散落在不同的 Object 上， 现在全在一个 namespace 中
  2. Simplicity in use：

  ```
    try {
      Object.defineProperty(obj,name,desc);
    }
    catch(e) {

    }

    //vs
    /* boolean 永远比exception看着舒服 */
    if(Reflect.defineProperty(obj,name,desc)) {

    }
    else {

    }
  ```

  3. Feeling of First-Class Operations:

  - ES5 判断 object 包含某个 prop， 用 （prop in obj），看着很怪异
  - ES6 Reflect.has(obj,prop)

  4. Reliability in function apply

  - ES5 Function.prototype.apply.call(func,obj,arr) or
    func.apply(obj,arr)
    如果 func 对象上有自己实现的 apply 就懵逼了
  - ES6 Reflect.appy(func, obj,arr)

  5. Proxy Trap Forwarding

  - 保证 Intercession 之后的 normal
  - Reflect API 和 Proxy API 都是一一对应的

  ```
    const aaa = {
      name:'a'
    };

    const logHandler = (log) => ({
      get:function(target,fieldName) {
        log('log:', target[fieldName])
        //Ensure the normal operation
        return Reflect.get(target,fieldName);
      }
    })(console.log);

    let p = new Proxy(aaa, logHandler);
    p.name
  ```

# Range and CSSOM

- 拖拽架子代码

```
  function createDragableElement(dragable,container) {
    /* record current transform x,y */
    let base_x = 0,base_y = 0;
    dragable.addEventListener('mousedown', e => {
      let start_x = e.clientX, start_y = e.clientY;

      let move_listener = e => {
        //move logic
        dragable.style.transform = `
          translate(${base_x + e.clientX - start_x}px, ${base_y + e.clientY - start_y}px)
        `
      }

      let up_listener = e => {
        base_x = base_x + e.clientX - start_x;
				base_y = base_y + e.clientY - start_y;
				document.removeEventListener('mousemove', move_listener);
				document.removeEventListener('mouseup', up_listener);
      }
    })
  }
```

- Range
  - Range interface represents <em>a fragment of document</em> that can contain nodes and parts of text nodes.
    - document.createRange(); create range
    - document.setStart(el, startOffset); set start of range base on the el with offset, if el is text node, the startOffset is the text else is the num of children
    - document.setEnd(el, endOffset); set end of range base on the el with offset, same as above, if the end is precedent of start node will result in a collapsed range with the start and end points both set to the specified end position
- CSSOM
  - getBoundingClientRect
