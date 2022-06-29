import { CompareOrder } from "@/components/responsive/component.interface";
import { TableColumnsType } from "ant-design-vue";

export const COLUMNS:TableColumnsType = [
  {
    dataIndex: 'chain_id',
    key: 'chain_id',
    title: 'Chain', // todo clippers => 确认字段
    width: 180
  },
  {
    dataIndex: 'connected_chains',
    key: 'connected_chains',
    title: 'Connected Chains',
    align: 'right',
    sorter: (a, b) => a.connected_chains - b.connected_chains,
    width: 190
  },
  {
    dataIndex: 'channels',
    key: 'channels',
    title: 'Channels',
    sorter: (a, b) => a.channels - b.channels,
    align: 'right',
    width: 100
  },
  {
    dataIndex: 'relayers',
    key: 'relayers',
    title: 'Relayers',
    sorter: (a, b) => a.relayers - b.relayers,
    align: 'right',
    width: 110
  },
  {
    dataIndex: 'ibc_tokens',
    key: 'ibc_tokens',
    title: 'IBC Tokens',
    sorter: (a, b) => a.ibc_tokens - b.ibc_tokens,
    align: 'right',
    width: 150,
    defaultSortOrder: CompareOrder.DESCEND
  },
  {
    dataIndex: 'ibc_tokens_value',
    key: 'ibc_tokens_value',
    title: 'IBC Tokens Value',
    sorter: (a, b) => a.ibc_tokens_value - b.ibc_tokens_value,
    align: 'right',
    width: 180
  },
  {
    dataIndex: 'transfer_txs',
    key: 'transfer_txs',
    title: 'IBC Transfer Txs',
    sorter: (a, b) => a.transfer_txs - b.transfer_txs,
    align: 'right',
    width: 180
  }
]