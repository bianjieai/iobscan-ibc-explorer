import { CompareOrder } from '@/types/interface/components/table.interface';
import { TableColumnsType } from 'ant-design-vue';

export const COLUMNS: TableColumnsType = [
    {
        title: 'Relayer Name',
        dataIndex: 'relayer_name',
        key: 'relayer_name',
        width: 110
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
        dataIndex: 'last_updated',
        key: 'update_time',
        align: 'right',
        sorter: (a, b) => a.update_time - b.update_time,
        sortDirections: ['descend', 'ascend'],
        width: 70
    },
    {
        title: 'Txs Success Rate',
        dataIndex: 'txs_success_rate',
        key: 'txs_success_rate',
        align: 'right',
        sorter: (a, b) => a.txs_success_rate - b.txs_success_rate,
        sortDirections: ['descend', 'ascend'],
        width: 100
    },
    {
        title: 'IBC Transfer Txs',
        dataIndex: 'transfer_total_txs',
        key: 'transfer_total_txs',
        align: 'right',
        sorter: (a, b) => a.transfer_total_txs - b.transfer_total_txs,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: CompareOrder.DESCEND,
        width: 120
    }
];

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
];
export const RELAYER_STATUS = {
    RUNNING: 'Running',
    UNKNOWN: 'Unknown'
};

// Todo 渲染到界面时，需要添加 no_link: true，用来标识没有跳转，移入鼠标不需要 pointer，字色不需要变为主题色
export const RELAYER_DETAILS_INFO = {
    total_relayed_value: {
        statistics_name: 'total_relayed_value',
        count: 0
    },
    total_txs: {
        statistics_name: 'total_txs',
        count: 0
    },
    served_channel_pairs: {
        statistics_name: 'served_channel_pairs',
        count: 0
    },
    total_fee_cost: {
        statistics_name: 'total_fee_cost',
        count: 0
    }
};

export const RELAYER_REGISTE_ADDRESS = 'https://github.com/irisnet/iob-registry/tree/main/relayers';
// prettier-ignore
export const RELAYER_REGISTE_TEXT = 'Haven\'t found your relayer? Complete the info!'
