学习笔记
组件 children 有两种类型：

1. 普通 child:


    ```
      <Parent>
        <Child>
        <Child>
      </Parent>
    ```

2. 模版 child


    ```
      <Parent>
       {
         item => <span>{item.aaa}<span>
       }
      </Parent>
    ```

分别在于不同的 render child 的逻辑处理

而 winter 的组件设计使用 Symbol 来达成类 field 的 protect 修饰符继承。
而 react 中大量使用 Symbol 来保护内部的 api。
而 React 中的 Symbol(react/packages/shared/ReactSymbols.js 文件中). 使用一种 Functioncal 的方式来创建 Symbol， react 团队对 FP 情有独钟

- ```
    const symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor('react.element');
    REACT_PORTAL_TYPE = symbolFor('react.portal');
    REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
    REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
    REACT_PROFILER_TYPE = symbolFor('react.profiler');
    REACT_PROVIDER_TYPE = symbolFor('react.provider');
    REACT_CONTEXT_TYPE = symbolFor('react.context');
    REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
    REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
    REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
    REACT_MEMO_TYPE = symbolFor('react.memo');
    REACT_LAZY_TYPE = symbolFor('react.lazy');
    REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
    REACT_SCOPE_TYPE = symbolFor('react.scope');
    REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
    REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
    REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
    REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
  ```
  而上述定义的 Symbol 会在 ReactElement 中作为一个定位符的存在

而 React 中 接收的 attribute（props） 会在可能的情况下被 Object.freeze 一下， 让该对象无法被更改。

- ```
  Object.freeze(element.props);
  Object.freeze(element);
  ```
