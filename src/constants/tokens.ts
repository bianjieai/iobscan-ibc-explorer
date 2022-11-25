import { CompareOrder } from '@/types/interface/components/table.interface';
import { TableColumnsType } from 'ant-design-vue';

export const COLUMNS: TableColumnsType = [
    {
        dataIndex: 'base_denom',
        key: 'base_denom',
        title: 'Name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 100
    },
    {
        dataIndex: 'price',
        key: 'price',
        title: 'Price',
        sorter: (a, b) => a.price - b.price,
        align: 'right',
        sortDirections: ['descend', 'ascend']
    },
    {
        dataIndex: 'supply',
        key: 'supply',
        title: 'Supply',
        sorter: true, // =>  new BigNumber(a.supply).comparedTo(new BigNumber(b.supply)),
        align: 'right',
        sortDirections: ['descend', 'ascend']
    },
    {
        dataIndex: 'ibc_transfer_amount',
        key: 'ibc_transfer_amount',
        title: 'IBC Transfer Amount',
        sorter: true, // (a, b) => new BigNumber(a.ibc_transfer_amount).comparedTo(new BigNumber(b.ibc_transfer_amount)),
        align: 'right',
        sortDirections: ['descend', 'ascend']
    },
    {
        dataIndex: 'ibc_transfer_txs',
        key: 'ibc_transfer_txs',
        title: 'IBC Transfer Txs',
        sorter: (a, b) => a.ibc_transfer_txs - b.ibc_transfer_txs,
        align: 'right',
        sortDirections: ['descend', 'ascend']
    },
    {
        dataIndex: 'chains_involved',
        key: 'chains_involved',
        title: 'Chains Involved',
        sorter: (a, b) => a.chains_involved - b.chains_involved,
        align: 'right',
        defaultSortOrder: CompareOrder.DESCEND,
        sortDirections: ['descend', 'ascend']
    },
    {
        dataIndex: 'chain',
        key: 'chain',
        title: 'Original Chain',
        sorter: (a, b) => a.chain.localeCompare(b.chain)
    }
];

export const IBC_COLUMNS: TableColumnsType = [
    {
        dataIndex: 'denom',
        key: 'denom',
        title: 'Name'
    },
    {
        dataIndex: 'chain',
        key: 'chain',
        title: 'Current Chain',
        sorter: (a, b) => a.chain.localeCompare(b.chain)
    },
    {
        dataIndex: 'token_type',
        key: 'token_type',
        title: 'Token Type'
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
        align: 'right',
        defaultSortOrder: CompareOrder.DESCEND
    },
    {
        dataIndex: 'receive_txs',
        key: 'receive_txs',
        title: 'Receive Txs',
        sorter: (a, b) => a.receive_txs - b.receive_txs,
        align: 'right'
    }
];

export const STATUS_OPTIONS = [
    {
        value: undefined,
        key: 'All Token Types'
    },
    {
        value: 'Authed',
        key: 'Authed'
    },
    {
        value: 'Other',
        key: 'Other'
    }
];

export const IBC_STATUS_OPTIONS = [
    {
        value: undefined,
        key: 'All Token Types'
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
];

export const SPECIAL_TOKEN_TYPE = {
    GENESIS: 'Genesis'
};

export const TOKEN_DEFAULT_VALUE = '';

export const CHAIN_DEFAULT_VALUE = '';
