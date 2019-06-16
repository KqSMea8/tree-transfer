# HippoLscTreeTransfer

-   category: Components
-   chinese: hippo-lsc-tree-transfer
-   type: 基本

---

## API

### TreeTransfer

| 参数                | 说明                                                                                                                                                            | 类型        | 默认值       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- |
| dataSource        | 数据源                                                                                                                                                           | Array     | \[]       |
| onChange          | （用于非受控）初始值<br><br>**签名**:<br>Function(checkedKeys: Array, extra: Object) => void<br>**参数**:<br>_checkedKeys_: {Array} 勾选复选框节点key的数组<br>_extra_: {Object} 额外参数 | Function  | () => { } |
| disabled          | 是否禁用                                                                                                                                                          | Boolean   | false     |
| disableCheckbox   | 是否禁止勾选节点复选框                                                                                                                                                   | Boolean   | -         |
| autoExpandParent  | 是否展开父节点                                                                                                                                                       | Boolean   | true      |
| value             | （用于受控）当前值                                                                                                                                                     | Array     | -         |
| searchPlaceholder | 搜索框占位符                                                                                                                                                        | String    | -         |
| listStyle         | 自定义样式对象                                                                                                                                                       | Object    | -         |
| extra             | 额外需要展示的内容                                                                                                                                                     | ReactNode | null      |
