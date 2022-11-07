import { UNIT_SIGNS } from '@/constants';
import { CompareOrder } from '@/types/interface/components/table.interface';
import { IDenomStatistic } from '@/types/interface/index.interface';
import { TableColumnsType } from 'ant-design-vue';

export enum RelayersListKey {
    relayersRelayerName = 'relayers_relayer_name',
    relayersServedChains = 'relayers_served_chains',
    relayersSuccessRate = 'relayers_success_rate',
    relayersIbcTransferTxs = 'relayers_ibc_transfer_txs',
    relayersTotalRelayedValue = 'relayers_total_relayed_value',
    relayersTotalFeeCost = 'relayers_total_fee_cost',
    relayersLastUpdated = 'relayers_last_updated'
}

export const COLUMNS: TableColumnsType = [
    {
        title: 'Relayer Name',
        dataIndex: RelayersListKey.relayersRelayerName,
        key: RelayersListKey.relayersRelayerName,
        width: 150
    },
    {
        title: 'Served Chains',
        dataIndex: RelayersListKey.relayersServedChains,
        key: RelayersListKey.relayersServedChains,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: 100
    },
    {
        title: 'Success rate',
        dataIndex: RelayersListKey.relayersSuccessRate,
        key: RelayersListKey.relayersSuccessRate,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: 100
    },
    {
        title: 'IBC Transfer Txs',
        dataIndex: RelayersListKey.relayersIbcTransferTxs,
        key: RelayersListKey.relayersIbcTransferTxs,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: CompareOrder.DESCEND,
        sorter: true,
        width: 100
    },
    {
        title: 'Total Relayed Value',
        dataIndex: RelayersListKey.relayersTotalRelayedValue,
        key: RelayersListKey.relayersTotalRelayedValue,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: 100
    },
    {
        title: 'Total Fee Cost',
        dataIndex: RelayersListKey.relayersTotalFeeCost,
        key: RelayersListKey.relayersTotalFeeCost,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: 100
    },
    {
        title: 'Last Updated',
        dataIndex: RelayersListKey.relayersLastUpdated,
        key: RelayersListKey.relayersLastUpdated,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: 100
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

export const RELAYER_DETAILS_INFO: IDenomStatistic = {
    total_relayed_value: {
        statistics_name: 'total_relayed_value',
        count: 0,
        no_link: true,
        unit: UNIT_SIGNS
    },
    total_txs: {
        statistics_name: 'total_txs',
        count: 0,
        no_link: true
    },
    served_channel_pairs: {
        statistics_name: 'served_channel_pairs',
        count: 0,
        no_link: true
    },
    total_fee_cost: {
        statistics_name: 'total_fee_cost',
        count: 0,
        no_link: true,
        unit: UNIT_SIGNS
    }
};

export const SINGLE_ADDRESS_HEIGHT = 34;
