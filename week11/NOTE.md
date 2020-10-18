学习笔记

# 11 周 字符串分析算法

1. 字典树

- 大量高重复字符串的存储与分析
- 根据输入的 strings 产生树形结构
  - root 为（-）
  - 分支只出现在不同的 char 上
  - ```
    class Trie: // we can add iterator on it
      Field   root default Object.create(null)
      Method  insert(str)
      Method  most() // find the max len word
    ```

2. KMP

- 在长字符串里寻找模式
  - O(m + n) leetcode 28
  - solve the problem if pattern in str
  - <b>max matched prefix: 查找 pattern 串的自重复行为</b>
    - 构建最长公共前缀串 跳转表格构建
      - <table>
          <tr>
            <th>
              a
            </th>
            <th>
              b
            </th>
            <th>
              a
            </th>
            <th>
              b
            </th>
            <th>
              x
            </th>
            <th>
              z
            </th>
          </tr>
          <tr>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              1
            </td>
            <td>
              2 (check if second a matchs)
            </td>
            <td>
              2 (check if second a matches)
            </td>
          </tr>
        </table>

3. Wildcard

- 带通配符的字符串模式

  - kmp + wildcard: ab\*c?d\*abc\*a?a
  - O(m + n)
  - 最后一个\* 尽量匹配得多， 之前的尽量匹配少
  - 一个星好代表一组， 分组 kmp 算法

4. 正则

- 字符串通用模式匹配

5. 状态机

- 通用字符串分析

6. LL LR

- 字符串多层级结构分析
