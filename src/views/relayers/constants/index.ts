import { CompareOrder } from "@/components/responsive/component.interface";
import { TableColumnsType } from "ant-design-vue";

export const COLUMNS: TableColumnsType= [
  {
    title: 'Relayer Name',
    dataIndex: 'relayer_name',
    key: 'relayer_name',
    width: 120
  },
  {
    title: 'Connected Channel',
    dataIndex: 'chain_a', 
    key: 'chain_a',
    width: 180
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  {
    title: 'Connected Channel',
    dataIndex: 'chain_b',
    key: 'chain_b',
    width: 180
  },
  {
    title: 'Last Updated',
    dataIndex: 'update_time',
    key: 'update_time',
    align:'right',
    sorter: (a, b) => a.update_time - b.update_time,
    width: 80
  },
  {
    title: 'Txs Success rate',
    dataIndex: 'transfer_success_txs',
    key: 'transfer_success_txs',
    align:'right',
    sorter: (a, b) => a.transfer_success_txs - b.transfer_success_txs,
    width: 100
  },
  {
    title: 'IBC Transfer Txs',
    dataIndex: 'transfer_total_txs',
    key: 'transfer_total_txs',
    align: 'right',
    sorter: (a, b) => a.transfer_total_txs - b.transfer_total_txs,
    defaultSortOrder: CompareOrder.DESCEND,
    width: 120
  }
]

export const STATUS_OPTIONS = [
  {
    value: undefined,
    key: 'All Status'
  },
  {
    value: 1,
    key: 'Running'
  },
  {
    value: 2,
    key: 'Unknown'
  }
]