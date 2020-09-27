学习笔记

# 编程训练

## BFS

- 其他都不扯，原来学校老师傅的口诀

  > BFS made by Queue, DFS made by Stack. Only the fool solve BFS issue recursivly

- BFS 模版代码 (JAVA 版) 。

  ```
    public class BFS {

    public List<List<Integer>> bsf(TreeNode root) {
      if (root == null) return null;

      List<List<Integer>> result = new ArrayList<>();

      Queue<TreeNode> queue = new LinkedList<>();
      queue.add(root);

      while (!queue.isEmpty()) {
          int size = queue.size();
          List<Integer> level = new ArrayList<>();

          for (int i = 0; i < size; i++) {
              TreeNode curNode = queue.poll();
              if (curNode == null) continue;

              level.add(curNode.val);
              queue.add(curNode.left);
              queue.add(curNode.right);
          }

          if (!level.isEmpty()) result.add(level);

      }
      return result;
    }
  }
  ```

## Heap

- 完全二叉树
  - 最后一层向左排列，不向左排列数组就有空白 slot 了
- 每一个节点必须大于或小于子树中的每一个节点
- 主要用来堆排序 nlogn 哦
- 操作堆最重要的步骤就是 Heapify， 根据算法第四版有两种实现方式

  - swim
    从下往上游
    ```
      _swim(i) {
    					const { comparator } = this; // this 真心恶心
    					const data = this.data;
    					const father = i >> 1;
    					if (father >= 1 && comparator(data[i], data[father]) < 0) {
    						this._swap(i, father);
    						//the target element has become the father element
    						this._swim(father);
    					}
    				}
    ```
  - sink
    从上往下降

    ```
    _sink(i) {
    					const { comparator } = this;
    					const data = this.data;
    					const left_child = i << 1;
    					const right_child = i + 1;

    					let small = i;

    					if (
    						left_child < data.length &&
    						comparator(data[small], data[left_child]) > 0
    					) {
    						small = left_child;
    					}

    					if (
    						right_child < data.length &&
    						comparator(data[small], data[right_child]) > 0
    					) {
    						small = right_child;
    					}

    					if (small !== i) {
    						this._swap(small, i);
    						this._sink(small);
    					}
    				}
    ```

    - 插入还有一种简化的办法，直接就叫 heapify

    ```
    let i = data.length;
    data[i] = new_data;
    while(i >> 1 > 0 && data[i] > data[i >> 1]) {
      _swap(i, i >> 1);
      i = i >> 1;
    }
    ```

- 父子关系（array 从 1 开始）
  左子 = 父 _ 2；
  右子 = 父 _ 2 + 1；

## A\* 算法

- 启发式搜索
  - 通俗来说：过滤不必要的元素
  - ```
      f(n) = g(n) + h(n)
    ```
  - g(n)表示起点到任意点的 n 的实际距离
  - h(n)表示任意点到 n 的估算距离，通常用阿基米德距离或曼哈顿距离计算
    而在课上老师就是将 comparator 定义为两点间距离公式计算（残缺版）定义为 h（n）
    从而实现的启发式 search
