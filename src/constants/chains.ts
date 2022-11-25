import { CompareOrder } from '@/types/interface/components/table.interface';
import { TableColumnsType } from 'ant-design-vue';

export const COLUMNS: TableColumnsType = [
    {
        dataIndex: 'chain',
        key: 'chain',
        title: 'Chain',
        width: 180,
        sorter: (a, b) => a.prettyName.localeCompare(b.prettyName)
    },
    {
        dataIndex: 'connected_chains',
        key: 'connected_chains',
        title: 'Connected Chains',
        align: 'right',
        sorter: (a, b) => a.connected_chains - b.connected_chains,
        sortDirections: ['descend', 'ascend'],
        width: 190
    },
    {
        dataIndex: 'channels',
        key: 'channels',
        title: 'Channels',
        sorter: (a, b) => a.channels - b.channels,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        width: 100
    },
    {
        dataIndex: 'relayers',
        key: 'relayers',
        title: 'Relayers',
        sorter: (a, b) => a.relayers - b.relayers,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        width: 110
    },
    {
        dataIndex: 'ibc_tokens',
        key: 'ibc_tokens',
        title: 'IBC Tokens',
        sorter: (a, b) => a.ibc_tokens - b.ibc_tokens,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        width: 120,
        defaultSortOrder: CompareOrder.DESCEND
    },
    {
        dataIndex: 'ibc_tokens_value',
        key: 'ibc_tokens_value',
        title: 'IBC Tokens Value',
        sorter: (a, b) => a.ibc_tokens_value - b.ibc_tokens_value,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        width: 200
    },
    {
        dataIndex: 'transfer_txs',
        key: 'transfer_txs',
        title: 'IBC Transfer Txs',
        sorter: (a, b) => a.transfer_txs - b.transfer_txs,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        width: 180
    }
];
