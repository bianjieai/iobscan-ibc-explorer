import { TableColumnsType } from "ant-design-vue";

export const COLUMNS: TableColumnsType= [
  {
    title: 'Relayer Name',
    dataIndex: 'relayer_name',
    key: 'relayer_name'
  },
  {
    title: 'Connected Channel',
    dataIndex: 'chain_a', // todo clippers => 确认字段
    key: 'chain_a'
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
    key: 'chain_b'
  },
  {
    title: 'Last Updated',
    dataIndex: 'update_time',
    key: 'update_time',
    align:'right',
    sorter: (a, b) => a.update_time - b.update_time
  },
  {
    title: 'Txs Success rate',
    dataIndex: 'ibc_success_transfer_txs',
    key: 'ibc_success_transfer_txs',
    align:'right',
    sorter: (a, b) => a.ibc_success_transfer_txs - b.ibc_success_transfer_txs
  },
  {
    title: 'IBC Transfer Txs',
    dataIndex: 'ibc_transfer_txs',
    key: 'ibc_transfer_txs',
    align: 'right',
    sorter: (a, b) => a.ibc_transfer_txs - b.ibc_transfer_txs
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
    key: 'Stopped'
  }
]