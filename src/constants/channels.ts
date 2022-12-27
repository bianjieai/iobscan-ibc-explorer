import { CompareOrder } from '@/types/interface/components/table.interface';
import { TableColumnsType } from 'ant-design-vue';

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
        sortDirections: ['descend', 'ascend'],
        align: 'right'
    },
    {
        dataIndex: 'last_updated',
        key: 'last_updated',
        title: 'Last Updated',
        sorter: (a, b) => a.last_updated - b.last_updated,
        sortDirections: ['descend', 'ascend'],
        align: 'right'
    },
    {
        dataIndex: 'pending_txs',
        key: 'pending_txs',
        title: 'Pending Tx',
        sorter: (a, b) => a.pending_txs - b.pending_txs,
        sortDirections: ['descend', 'ascend'],
        align: 'right'
    },
    {
        dataIndex: 'ibc_transfer_txs',
        key: 'ibc_transfer_txs',
        title: 'IBC Transfer Txs',
        sorter: (a, b) => a.ibc_transfer_txs - b.ibc_transfer_txs,
        sortDirections: ['descend', 'ascend'],
        align: 'right',
        defaultSortOrder: CompareOrder.DESCEND
    }
];

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
];

export const CHANNEL_STATUS = {
    OPEN: 'Open',
    CLOSED: 'Closed'
};
