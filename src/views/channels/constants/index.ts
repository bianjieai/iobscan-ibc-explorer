import { CompareOrder } from "@/components/responsive/component.interface";
import { TableColumnsType } from "ant-design-vue";

export const COLUMNS: TableColumnsType = [
  {
    dataIndex: 'chain_a',
    key: 'chain_a',
    title: 'Connected Chain'
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: 'Status',
    align: 'center'
  },
  {
    dataIndex: 'chain_b',
    key: 'chain_b',
    title: 'Connected Chain' 
  },
  {
    dataIndex: 'operating_period',
    key: 'operating_period',
    title: 'Operating Period',
    sorter: (a, b) => a.operating_period - b.operating_period,
    align: 'right'
  },
  {
    dataIndex: 'last_updated',
    key: 'last_updated',
    title: 'Last Updated',
    sorter: (a, b) => b.last_updated - a.last_updated,
    align: 'right'
  },
  {
    dataIndex: 'relayers',
    key: 'relayers',
    title: 'Relayers',
    sorter: (a, b) => a.relayers - b.relayers,
    align: 'right'
  },
  {
    dataIndex: 'ibc_transfer_txs',
    key: 'ibc_transfer_txs',
    title: 'IBC Transfer Txs',
    sorter: (a, b) => a.ibc_transfer_txs - b.ibc_transfer_txs,
    align: 'right',
    defaultSortOrder: CompareOrder.DESCEND
  }
]

export const STATUS_OPTIONS = [
  {
    value: undefined,
    key: 'All Status'
  },
  {
    value: 1,
    key: 'Open'
  },
  {
    value: 2,
    key: 'Closed'
  }
]