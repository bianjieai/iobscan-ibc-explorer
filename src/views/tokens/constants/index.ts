import { TableColumnsType } from "ant-design-vue";

export const COLUMNS: TableColumnsType = [{
  dataIndex: 'base_denom',
  key: 'base_denom',
  title: 'Name',
  sorter: (a, b) => a.base_denom - b.base_denom
}, {
  dataIndex: 'price',
  key: 'price',
  title: 'Price',
  sorter: (a, b) => a.price - b.price,
  align: 'right'
}, {
  dataIndex: 'supply',
  key: 'supply',
  title: 'Supply',
  sorter: (a, b) => a.supply - b.supply,
  align: 'right'

}, {
  dataIndex: 'ibc_transfer_amount',
  key: 'ibc_transfer_amount',
  title: 'IBC Transfer Amount',
  sorter: (a, b) => a.ibc_transfer_amount - b.ibc_transfer_amount,
  align: 'right'
}, {
  dataIndex: 'ibc_transfer_txs',
  key: 'ibc_transfer_txs',
  title: 'IBC Transfer Txs',
  sorter: (a, b) => a.ibc_transfer_txs - b.ibc_transfer_txs,
  align: 'right'

}, {
  dataIndex: 'chains_involved',
  key: 'chains_involved',
  title: 'Chains Involved',
  sorter: (a, b) => a.chains_involved - b.chains_involved,
  align: 'right'

}, {
  dataIndex: 'chain_id',
  key: 'chain_id',
  title: 'Origional Chain',
  sorter: (a, b) => a.chain_id - b.chain_id
}
]



export const IBC_COLUMNS: TableColumnsType = [
  {
    dataIndex: 'denom',
    key: 'denom',
    title: 'Name',
  },
  {
    dataIndex: 'chain_id',
    key: 'chain_id',
    title: 'Current Chain',
    sorter: (a, b) => a.chain_id - b.chain_id, 
  },
  {
    dataIndex: 'token_type',
    key: 'token_type',
    title: 'Token Type',
  },
  {
    dataIndex: 'ibc_hops',
    key: 'ibc_hops',
    title: 'IBC Hops',
    sorter: (a, b) => a.ibc_hops - b.ibc_hops,
    align: 'right'
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    title: 'Amount',
    sorter: (a, b) => a.amount - b.amount,
    align: 'right'
  },
  {
    dataIndex: 'receive_txs',
    key: 'receive_txs',
    title: 'Receive Txs',
    sorter: (a, b) => a.receive_txs - b.receive_txs,
    align: 'right'
  }
]

export const STATUS_OPTIONS = [
  {
    value: undefined,
    key: 'All Token Type'
  },
  {
    value: 'Authed',
    key: 'Authed'
  },
  {
    value: 'Other',
    key: 'Other'
  }
]

export const IBC_STATUS_OPTIONS = [
  {
    value: undefined,
    key: 'All Token Type'
  },
  {
    value: 'Authed',
    key: 'Authed'
  },
  {
    value: 'Other',
    key: 'Other'
  },
  {
    value: 'Genesis',
    key: 'Genesis'
  }
]