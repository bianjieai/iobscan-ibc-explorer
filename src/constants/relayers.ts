import { CompareOrder } from '@/types/interface/components/table.interface';
import { IDenomStatistic } from '@/types/interface/index.interface';
import { TableColumnsType } from 'ant-design-vue';

export const UNIT_SIGNS = '$';

export enum RelayersListKey {
    relayersRelayerName = 'relayers_relayer_name',
    relayersServedChains = 'relayers_served_chains',
    relayersSuccessRate = 'relayers_success_rate',
    relayersIbcTransferTxs = 'relayers_ibc_transfer_txs',
    relayersTotalRelayedValue = 'relayers_total_relayed_value',
    relayersTotalFeeCost = 'relayers_total_fee_cost',
    relayersLastUpdated = 'relayers_last_updated'
}

export enum RELAYER_TRANSFER_KEY {
    rtTxHash = 'tx_hash',
    rtType = 'tx_type',
    rtChain = 'chain',
    rtToken = 'denom_info',
    rtFee = 'fee_info',
    rtResult = 'tx_status',
    rtSigner = 'signer',
    rtTimestamp = 'tx_time'
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

export const RELAYER_REGISTE_ADDRESS = 'https://github.com/irisnet/iob-registry/tree/main/relayers';
// prettier-ignore
export const RELAYER_REGISTE_TEXT = 'Haven\'t found your relayer? Complete the info!'
export const SINGLE_ADDRESS_HEIGHT = 34;

export enum RelayersSearchType {
    relayerName = 'relayer_name',
    relayerAddress = 'relayer_address'
}

export const SEARCH_OPTIONS: { key: RelayersSearchType; value: string }[] = [
    {
        key: RelayersSearchType.relayerName,
        value: 'Relayer Name'
    },
    {
        key: RelayersSearchType.relayerAddress,
        value: 'Relayer Address'
    }
];

export const RelayerSearchPlaceholder = {
    relayerName: 'Search by Relayer Name',
    relayerAddress: 'Search by Relayer Address'
};

export const RELAYER_TRANSFER_COLUMN: TableColumnsType = [
    {
        title: 'TxHash',
        dataIndex: RELAYER_TRANSFER_KEY.rtTxHash,
        key: RELAYER_TRANSFER_KEY.rtTxHash,
        width: 150
    },
    {
        title: 'Type',
        dataIndex: RELAYER_TRANSFER_KEY.rtType,
        key: RELAYER_TRANSFER_KEY.rtType
    },
    {
        title: 'Chain',
        dataIndex: RELAYER_TRANSFER_KEY.rtChain,
        key: RELAYER_TRANSFER_KEY.rtChain
    },
    {
        title: 'Token',
        dataIndex: RELAYER_TRANSFER_KEY.rtToken,
        key: RELAYER_TRANSFER_KEY.rtToken
    },
    {
        title: 'Fee',
        dataIndex: RELAYER_TRANSFER_KEY.rtFee,
        key: RELAYER_TRANSFER_KEY.rtFee
    },
    {
        title: 'Result',
        dataIndex: RELAYER_TRANSFER_KEY.rtResult,
        key: RELAYER_TRANSFER_KEY.rtResult
    },
    {
        title: 'Signer',
        dataIndex: RELAYER_TRANSFER_KEY.rtSigner,
        key: RELAYER_TRANSFER_KEY.rtSigner
    },
    {
        title: 'Timestamp',
        dataIndex: RELAYER_TRANSFER_KEY.rtTimestamp,
        key: RELAYER_TRANSFER_KEY.rtTimestamp
    }
];
export const RT_COLUMN_TYPE = {
    token: 'Token',
    fee: 'Fee'
};
