<template>
  <div class="table-warpper">
    <a-table :rowKey="rowKey" :columns="columnsSource" :data-source="dataSource" :pagination="false"
      :showSorterTooltip="false"  @change="onTableChange" :scroll="scroll">
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="isKeyInNeedCustomColumns(column.key)">
          <slot :name="column.key" :column="column" :record="record" :text="text" :index="index"></slot>
        </template>
      </template>
    </a-table>
    <div class="thead-border-bottom"></div>
    <div :class="['flex', 'justify-between', 'pt-16', !noPagination ? 'pb-16' : '', 'items-center', 'bottom']"
      v-if="hasData || $slots.table_bottom_status">
      <slot name="table_bottom_status">
        <div></div>
      </slot>
      <a-pagination v-if="hasData && !noPagination" v-model:current="pageInfo.current" :pageSize="pageInfo.pageSize"
        :total="pageInfo.total" @change="onPageChange" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { TableColumnsType } from 'ant-design-vue';
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { compareValues } from './utils'
import { useTimeInterval } from '@/composables'
import { formatLastUpdated } from '@/helper/time-helper';

interface IProps {
  columns: TableColumnsType
  data: any[]
  needCustomColumns: string[]
  needCount?: boolean
  pageSize?: number
  current?: number
  noPagination?: boolean
  scroll?: { x?: number, y?: number }
  rowKey?: string,
  realTimeKey?:{scKey:string, dcKey:string}[]
}

let backUpDataSource: any[] = []

const props = withDefaults(defineProps<IProps>(), {
  rowKey: 'record_id'
})

const pageInfo = reactive({
  pageSize: props.pageSize || 10,
  current: props.current || 1,
  total: props.data?.length
})

const { data, columns } = props

const columnsSource = ref(columns)
const dataSource = ref<any[]>(data)

onMounted(() => {
  backUpData()
})

watch(() => props.data, (_new, _old) => {
  backUpData()
  pageInfo.total = _new?.length
  needPagination.value && onPageChange(1, 10)
  if (_new?.length === 0) {
    columnsSource.value = columnsSource.value.filter(item => item.key !== '_count')
  }else{
    columnsSource.value = columns;
  }
})


const needPagination = computed(() => !props.noPagination && !(props.current && props.pageSize)) // 需要前端分页
const isKeyInNeedCustomColumns = computed(() => (key: string) => props.needCustomColumns.includes(key)) // 判断key
const hasData = computed(() => props.data?.length > 0)
const backUpData = () => {
  const { columns, data, needCount } = props

  if (needCount && columns.filter(item => item.key === '_count').length === 0) {
    columns.unshift({
      dataIndex: '_count',
      key: '_count',
      title: ''
    })
    props.noPagination && (columns[0].width = 50)
  }
  backUpDataSource = data?.map((item: any, index: number) => ({
    _count: index + 1,
    ...item
  }))
  let defaultSort = props.columns.find((item)=>{
    return item.defaultSortOrder != undefined;
  });

  if (defaultSort) {
    onTableChange({},{},{ columnKey: defaultSort.key, order:defaultSort.defaultSortOrder });
  }
  if (props.noPagination) {
      dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
    }
}

const emits = defineEmits<{
  (e: 'onPageChange', current: number, pageSize: number): void
}>()

const formatDataSourceWithRealTime = (data:any[])=>{
  if (data.length && props.realTimeKey && props.realTimeKey.length) {
    data.forEach((item:any)=>{
      props.realTimeKey?.forEach((key)=>{
        item[key.dcKey] = formatLastUpdated(item[key.scKey]);
      });
    });
  }
  return data;
}

const onPageChange = (page: number, pageSize: number) => {
  pageInfo.current = page
  pageInfo.pageSize = pageSize
  const p = (page - 1) * pageSize
  const pSize = page * pageSize
  dataSource.value = formatDataSourceWithRealTime(backUpDataSource.slice(p, pSize));
}

// todo clippers => 后端分页序号处理
const onTableChange = (pagination: any, filters: any, sorter: any) => {
  const { columnKey, order } = sorter
  if (order) {
    backUpDataSource = backUpDataSource
      .sort(compareValues(columnKey, order))
      .map((item: any, index: number) => ({
        ...item,
        _count: index + 1
      })) // reset backup
    if (props.noPagination) {
      dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
    }else{
      needPagination.value && onPageChange(1, 10) // reset去第一页
    }
  }
}

if (props.realTimeKey && props.realTimeKey.length) {
  useTimeInterval(()=>{
    dataSource.value =  formatDataSourceWithRealTime(dataSource.value);
  });
}

</script>

<style lang="less" scoped>
:deep(.ant-table) {
  overflow-x: auto;
  font-size: 14px;

  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    height: 4px;
  }

  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 2px;
    height: 6px;
    background: rgba(61, 80, 255, 0.1);
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
    background: rgba(61, 80, 255, 0.5);
  }

  &::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(61, 80, 255, 0.9);
  }
}

:deep(.ant-table-container) {
  width: 1150px; // TODO clippers => 宽度待定
  min-height: 300px;
}

:deep(div.ant-table-body) {
    overflow-y: auto !important;
    max-height: 690px !important;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 2px;
    width: 8px;
    background: rgba(61, 80, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
    background: rgba(61, 80, 255, 0.5);
  }

  &::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(61, 80, 255, 0.9);
  }
}

:deep(.ant-table-thead .ant-table-cell) {
  font-size: var(--bj-font-size-sub-title);
  padding: 14px 16px 14px 0;
  height: 48px;
  line-height: 1;
  background-color: #fff;
}

:deep(.ant-table-tbody .ant-table-cell) {
    padding-right: 35px;
  color: var(--bj-text-second);
  line-height: 1;
  vertical-align: middle;
  &:first-child {
    padding-right: 16px;
    width: 24px;
    text-align: left;
  }
}

:deep(.ant-table-thead > tr > th) {
    white-space: nowrap;
  border-bottom: none;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--bj-border-color);
  padding: 15px 16px;
  padding-left: 0;

  &:only-child {
    border-bottom: none;
  }
}

:deep(.ant-table-cell) {
  padding-left: 0;
  white-space: nowrap;
}

:deep(.ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before) {
  width: 0;
}

:deep(.ant-table-column-sorter) {
  margin-left: 8px;
}

:deep(.ant-table-column-has-sorters) {
  cursor: url("/src/assets/mouse/shiftlight_mouse.png"), default !important;
}

:deep(.ant-pagination) {
  // margin: 16px;
  text-align: right;
}

:deep(.ant-pagination li) {
  width: initial;
  height: 24px;
  min-width: 24px;
  line-height: 24px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-pagination li button) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-pagination-item) {
  border: none;
}

:deep(.ant-pagination-item-active) {
  border: 1px solid var(--bj-primary-color);
}

:deep(.ant-pagination-options) {
  display: none !important;
}

:deep(.ant-pagination-item-container > span > svg) {
  // margin-bottom: 6px;
}

:deep(td.ant-table-column-sort) {
  background: transparent;
}

.table-warpper {
  padding: 0 24px;
  background-color: #fff;
  border-radius: 4px;
  position: relative;
}

.thead-border-bottom {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  background: var(--bj-border-color);
  height: 1px;
  z-index: 1;
}

// pc
@media screen and (min-width: 768px) {}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {
  .bottom {
    display: block;
  }

  :deep(.ant-pagination) {
    margin: 8px 0;
    text-align: left;
  }
}

// mobile
@media screen and (max-width: 414px) {
  .table-warpper {
    padding: 0 16px;
  }

  .bottom {
    display: block;
  }

  :deep(.ant-pagination) {
    margin-top: 8px;
    text-align: left;
  }
}
</style>