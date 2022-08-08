import { IRequestPagination } from '@/types/interface/index.interface';
import { TableColumnsType } from 'ant-design-vue';

export const testChains = {
    active: [
        {
            chain_id: 'a1',
            chain_name: 'a1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'b1',
            chain_name: 'b1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'b2',
            chain_name: 'b2',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'c1',
            chain_name: 'c1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'f1',
            chain_name: 'f1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'f2',
            chain_name: 'f2',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'g1',
            chain_name: 'g1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'k1',
            chain_name: 'k1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'l1',
            chain_name: 'l1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'm1',
            chain_name: 'm1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'p1',
            chain_name: 'p1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'p2',
            chain_name: 'p2',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'r1',
            chain_name: 'r1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 's1',
            chain_name: 's1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'x1',
            chain_name: 'x1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: 'z1',
            chain_name: 'z1',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        },
        {
            chain_id: '11',
            chain_name: '11',
            icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto'
        }
    ]
};

export const ibcStatisticsTxsTest = {
    tx_all: { statistics_name: 'tx_all', count: 114 },
    tx_success: { statistics_name: 'tx_success', count: 74 },
    tx_process: { statistics_name: 'tx_process', count: 74 },
    tx_failed: { statistics_name: 'tx_failed', count: 12 }
};

export const menus = [
    {
        label: 'Home',
        value: 'Home'
    },
    {
        label: 'Transfers',
        value: 'Transfers'
    },
    {
        label: 'Tokens',
        value: 'Tokens'
    },
    {
        label: 'Chains',
        value: 'Chains'
    },
    {
        label: 'Channels',
        value: 'Channels'
    },
    {
        label: 'Relayers',
        value: 'Relayers'
    }
];

export const PAGE_PARAMETERS = {
    tx: 'tx',
    chains: 'chains',
    transfers: 'transfers',
    tokens: 'tokens',
    ibcToken: 'ibcToken',
    // home 页跳转参数中判断 包含的是 channel， 非 channels，[ibcStatisticsChannelsDefault]
    channel: 'channel',
    channels: 'channels',
    relayers: 'relayers',
    denom: 'denom'
};

export const txStatusNumber = {
    defaultStatus: '1,2,3,4',
    successStatus: '1',
    failedStatus: '2,4'
};
export const dayTime = '24';

export const anchorsDatas = [
    {
        title: 'A-E',
        collection: ['A', 'B', 'C', 'D', 'E']
    },
    {
        title: 'F-J',
        collection: ['F', 'G', 'H', 'I', 'J']
    },
    {
        title: 'K-O',
        collection: ['K', 'L', 'M', 'N', 'O']
    },
    {
        title: 'P-T',
        collection: ['P', 'Q', 'R', 'S', 'T']
    },
    {
        title: 'U-Z',
        collection: ['U', 'V', 'W', 'X', 'Y', 'Z']
    },
    {
        title: '#',
        collection: ['#']
    }
];
export const chainIDs = {
    irishub: 'irishub_1',
    cosmoshub: 'cosmoshub_4'
};
export const tableChainIDs = {
    irishub: 'irishub-1',
    cosmoshub: 'cosmoshub-4'
};
export const chainAddressPrefix = {
    irishubPrefix: 'iaa',
    cosmoshubPrefix: 'cos'
};
export const statisticsName = {
    chains_24hr: 'Active IBC Chains',
    chain_all: 'All IBC Chains',
    channels_24hr: 'Active',
    channel_all: 'All',
    channel_opened: 'Open',
    channel_closed: 'Closed',
    denom_all: 'Tokens by Denom',
    base_denom_all: 'Tokens by Base Denom',
    tx_24hr_all: 'Recent',
    tx_all: 'All',
    tx_success: 'Success',
    tx_failed: 'Failed'
};

export const ibcStatisticsChainsDefault = {
    chains_24hr: {
        statistics_name: 'chains_24hr',
        count: 0
    },
    chain_all: {
        statistics_name: 'chain_all',
        count: 0
    }
};

export const ibcStatisticsChannelsDefault = {
    channels_24hr: {
        statistics_name: 'channels_24hr',
        count: 0
    },
    channel_all: {
        statistics_name: 'channel_all',
        count: 0
    },
    channel_opened: {
        statistics_name: 'channel_opened',
        count: 0
    },
    channel_closed: {
        statistics_name: 'channel_closed',
        count: 0
    }
};

export const ibcStatisticsDenomsDefault = {
    denom_all: {
        statistics_name: 'denom_all',
        count: 0
    },
    base_denom_all: {
        statistics_name: 'base_denom_all',
        count: 0
    }
};

export const ibcStatisticsTxsDefault = {
    tx_24hr_all: {
        statistics_name: 'tx_24hr_all',
        count: 0
    },
    tx_all: {
        statistics_name: 'tx_all',
        count: 0
    },
    tx_success: {
        statistics_name: 'tx_success',
        count: 0
    },
    tx_failed: {
        statistics_name: 'tx_failed',
        count: 0
    }
};

export const ageTimerInterval = 1000;

export const ibcTxStatus = {
    SUCCESS: 1,
    FAILED: 2,
    PROCESSING: 3,
    REFUNDED: 4,
    SETTING: 5
};

export const ibcTxStatusDesc = [
    {
        label: 'Success',
        status: 1
    },
    {
        label: 'Processing',
        status: 3
    },
    {
        label: 'Failed',
        status: 2
    }
];
export const transfersDetailStatus = {
    FAILED: {
        value: 0,
        label: 'Failed'
    },
    SUCCESS: {
        value: 1,
        label: 'Success'
    }
};
export const ackConnectStatus = {
    CORRECT: 'correct',
    ERROR: 'error'
};
export const channelsStatus = {
    channelOpenedStatus: '1',
    channelClosedStatus: '2'
};

export enum currentMenuType {
    active = 'active',
    inactive = 'inactive',
    all = 'all'
}

export const chainMenus: { label: string; value: currentMenuType }[] = [
    {
        label: 'Active',
        value: currentMenuType.active
    },
    {
        label: 'Inactive',
        value: currentMenuType.inactive
    },
    {
        label: 'All',
        value: currentMenuType.all
    }
];

export const ibcTxStatusSelectOptions = [
    {
        title: 'All Status',
        value: JSON.stringify(['1', '2', '3', '4'])
    },
    {
        title: 'Success',
        value: JSON.stringify(['1'])
    },
    {
        title: 'Processing',
        value: JSON.stringify(['3'])
    },
    {
        title: 'Failed',
        value: JSON.stringify(['2', '4'])
    }
];
export const transfersStatusOptions = {
    DEFAULT_OPTIONS: ['1', '2', '3', '4'],
    SUCCESS_OPTIONS: ['1'],
    FAILED_OPTIONS: ['2', '4'],
    PROCESSING_OPTIONS: ['3']
};

export const transferTableColumn: TableColumnsType = [
    {
        dataIndex: 'token',
        slots: { customRender: 'token', title: 'customTitle' },
        width: 200
        // ellipsis: true,
    },
    {
        title: 'From TxHash',
        dataIndex: 'hashOut',
        slots: { customRender: 'hashOut' },
        width: 160
    },
    {
        title: 'From',
        dataIndex: 'out',
        slots: { customRender: 'out' }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        slots: { customRender: 'status' },
        width: 180,
        align: 'center'
    },
    {
        title: 'To',
        dataIndex: 'in',
        slots: { customRender: 'in' }
    },
    {
        title: 'To TxHash',
        dataIndex: 'hashIn',
        slots: { customRender: 'hashIn' },
        width: 160
    },
    {
        title: 'Create Time',
        dataIndex: 'time',
        slots: { customRender: 'time' },
        width: 180
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        slots: { customRender: 'endTime' },
        width: 180
    }
];

export const unAuthed = 'Others';

export const defaultTitle = {
    defaultStatus: 'All Status',
    defaultChains: 'All Chains',
    defaultTokens: 'All Tokens'
};

export const selectedType = {
    chain: 'chain'
};
export const unknownSymbol = 'unknown';

export const CHAINNAME = {
    COSMOSHUB: 'Cosmos Hub',
    IRISHUB: 'IRIS Hub'
};

export const UNKNOWN = 'Unknown';
export const thousandDecimal = 0.0001;

export const SYMBOL = {
    ATOM: 'ATOM',
    IRIS: 'IRIS'
};

export const COPYRIGHT = 'Copyright © 2022 IRIS Foundation Ltd. All Rights Reserved.';
export const ICON_LINK = [
    {
        iconName: 'icon-github',
        iconLink: 'https://github.com/irisnet'
    },
    {
        iconName: 'icon-telegram',
        iconLink: 'https://t.me/irisnetwork'
    },
    {
        iconName: 'icon-medium',
        iconLink: 'https://medium.com/irisnet-blog'
    },
    {
        iconName: 'icon-tweeter',
        iconLink: 'https://twitter.com/irisnetwork'
    }
];

export const NEED_CUSTOM_COLUMN = {
    tokens: [
        'base_denom',
        'price',
        'chain_id',
        'supply',
        'ibc_transfer_amount',
        'ibc_transfer_txs',
        'chains_involved'
    ],
    ibcToken: ['denom', 'chain_id', 'ibc_hops', 'amount', 'receive_txs'],
    chains: ['chain_id', 'channels', 'relayers', 'ibc_tokens', 'ibc_tokens_value', 'transfer_txs'],
    channels: [
        'chain_a',
        'status',
        'chain_b',
        'operating_period',
        'last_updated',
        'ibc_transfer_txs'
    ],
    relayers: [
        'relayer_name',
        'chain_a',
        'status',
        'chain_b',
        'update_time',
        'txs_success_rate',
        'transfer_total_txs'
    ]
};

export const BASE_PARAMS: IRequestPagination = {
    use_count: false,
    page_num: 1,
    page_size: 3000
};

export const AxiosTimeout = 15000;
