学习笔记

# Week 05 CSS the grand introduction

> I perfer to study the Grammer system of any Language that I have first encountered. Says By Winter

## Lets start with CSS 2.1

Why? : Once a standard marked as snapshot means this standard are existing as an independent instance with self contained infomation

CONS: Since the recent version is css3 therefore some of content is outdated.

- Grammer:
  1. Symbol notations:
  - \*: 0 or more
  - +: 1 or more
  - ?: 0 or 1
  - |: seperates alternatives
  - []: grouping
  2. production:
  ```
  /*
    The RULE_SET => SELECTOR : {}
    The MEDIA TAG WAS DEFINE IN CSS 2.1
    The PAGE use for define the html print
  */
  SPACE_AND_COMMENT = SPACE|CDO|CDC // history shit
  STYLE_SHEET :
    [CHARSET_SYM STRING ';' ]?  // char set of system
    [SPACE_AND_COMMENT]*
    [IMPORT [SPACE_AND_COMMENT]*]*
    [[RULE_SET | MEDIA | PAGE]
    [SPACE_AND_COMMENT]*]*
    ;
  ```
  3. summary
  - @charset //UTF-8 In general
  - @import
  - rules // Repeatable
    - at-rule //@media/@page
    - rule

### AT-RULES

- @charset //define the charset with will be used //defined in both css2 and 3
- @import // defined in css-cascade-4
- @media // defined in css3-conditional, not the implementation media query but related
- @page // not important
- @counter-style // not important
- @keyframes // animation
- @fontface // web font use to define font(icon font)
- @supports // capability check function but defined in css3 useless for pre-css3
- @namespace // not important

### RULES

- Selector // defined in selectors-3

  - Grammer

  ```
  *: 0 or more
  +: 1 or more
  ?: 0 or 1
  |: separates alternatives
  []: grouping

  SELECTORS_GROUP :
    SELECTOR [COMMA S* SELECTOR]*
    ;

  SELECTOR :
    SIMPLE_SELECTOR_SEQUENCE
    [
      COMBINATOR
      SIMPLE_SELECTOR_SEQUENCE
    ]*
    ;

  COMBINATOR :
    /*combinator can be surrounded by whitespace*/
    PLUS S* | // adjacent sibling selector
    GREATER S* | // child selector
    TILDE S* | //~ general sibling selector
    S+ // descendant selector
    ;

  SIMPLE_SELECTOR_SEQUENCE :
    [
      TYPE_SELECTOR | // eg: div, p
      UNIVERSAL // *
    ]
    {
      HASH | // #id
      CLASS | // class
      ATTRIB |  // [aria-lalal]
      PSEUDO | // : & ::
      NEGATION // :NOT
    }* |
    [
      HASH |
      CLASS |
      ATTRIB |
      PSEUDO |
      NEGATION
    ]+
    ;
    //.....
  ```

- Declaration
  - key
    - Properties
    - Variables
  - value
    - Functions:
      1. calc
      2. max/min

#### Variables

- Example

```
      :root {
        --main-color:white //global variable
      }
      div {
        backgroud-color:var(--main-color);
        --a:100px;
      }
      div h1 {
        height: var(--a,10px);
        --side:margin-top;
      }
      div h1 .a {
        var(--side):10px;//variable can be key
      }
```

#### Selector

- Simple Selector

  1. Universal : \*
  2. Type Selector : div svg|a(select a from svg namespace(need to pre-define by @namespace))
  3. Class Selector : .xxx
  4. Id Selector : #id
  5. Attribute Selector: [attr]
  6. Psedo Class Selector: :hover
  7. Psedo Element Selector: ::before

- Combound Selector

  1. <Simple_Selector> <Simple_Selector> <Simple_Selector> <Simple_Selector>
  2. \* and div must go first

- Complex Selector

  1. <Combound_Selector> <sp> <Combound_Selector>
  2. <Combound_Selector> ">" <Combound_Selector>
  3. <Combound_Selector> "~" <Combound_Selector>
  4. <Combound_Selector> "+" <Combound_Selector>
  5. <Combound_Selector> "||" <Combound_Selector>

  NOTE: <Combound_Selector> ',' <Combound_Selector> Means or

#### Selector Specificity

- Specificity is a weight that is applied to a given CSS declaration, determined by the number of each selector type in the matching selector.
- Algorithm:
  - [inline, id, class, element and pseudo-element]
  - S = inline _ N^3 + id _ N^2 + class \* N + element and pseudo-element
  - N = real huge number like 2^16

#### Psedo-class

- Link/Behavior

  - :any-link
  - :link, :visited (link + visited = any-link)
    - > whenever you use link/visited you are not able to change anything else than text-color
  - :hover
  - :active
  - :focus
  - :target

- Tree structure
  - :empty
  - :nth-child()
    - The Grammer of this psedo class is extremely complex for instance: even/odd 2n+1 2n-1
  - :nth-last-child() // better dont use
  - :first-child
  - :last-child :only-child // also broken the timing

Note: empty and nth-last-child will affect to the timeing of calculating the computed css with html dom element, because you will have to be able to observe the children

- logical
  - :not // only support the simple selector
  - :where //css level 4
  - :has //css level 4

#### Psedo-element

- content not defined 无中生有
  - ::before // with content can generate box and join the later rendering process
  - ::after // with content can generate box and join the later rendering process
- use for contain the content those already on screen 选择存在

  - ::first-line // content already defined, and the first-line is selected after the layout, therefore will make no sence to allow user to assign props those will cause the layout change.
    -- configurable props:
    [
    font, color, backgroud,
    word-spacing, letter-spacing,
    text-decoration, text-transform,
    line-height
    ]
  - ::first-letter // content already defined
    -- configurable props:
    [
    font,color,backgroud,
    text-decoration,text-transform,
    letter-spacing, word-spacing,
    line-height,
    float, vertical-align,
    margin, padding, border
    ]

##### 为什么 first-line 不能设置 float 之类的 props 恁？

- 个人猜想：
  1. first-line 选择器选择的是已经排版好的内容的第一行， 如果 first-line 可以支持 float 的话，那不就又要重新 layout？ infinity loop.
  2. MDN: first-line 选择器选中的内容不是块级元素（The first line of this text will not receive special styling because it is not a block-level element. ）

##### match selector 位于 match/match.js

-
