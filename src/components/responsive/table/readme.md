## table

### IconAndTitle

> 表格内部组件。一个 tablecell 显示 icon 和文字

-   接受参数

1. title 必须
2. subtitle 非必需
3. subtitleIsTag 非必需 表示是否以 tag 的形式展示
4. iconSize 非必需 small => 32px / normal（默认）=> 40px

### BottomStatus

> 表格底部状态说明

-   接受参数

1. type 必须 Channel / Relayer

-   slot 名称

1. table_bottom_status

### TableCommon

> 表格组件

-   接受参数

1. columns 必须
2. data 必须
3. current 非必需
4. pageSize 非必需
5. 事件 @onPageChange
6. needCount 非必需 表示是否需要计数
7. needCustomColumns 必须 表示需要自定义 tablecell 的字段(例如`['name', 'age']`)
8. noPagination 非需要 表示无需分页器
9. scroll 非需要 设置滚动方式

-   说明

1. 当 current 和 pageSize 都不传的时候，表示开启前端分页

#### ChainsDropDown

> chains 筛选框

-   接受参数

1. selectedDouble 非必需 支持双选
2. needBadge 非必需 支持角标 transfer / receive
