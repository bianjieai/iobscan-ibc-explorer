import type { IDenomStatistic, IRequestPagination } from '@/types/interface/index.interface';
import { TableColumnsType } from 'ant-design-vue';
import { RelayersListKey } from '@/constants/relayers';

export const TOKEN_DEFAULT_ICON = new URL('../assets/token-default.png', import.meta.url).href;
export const CHAIN_DEFAULT_ICON = new URL('../assets/home/chain-default.png', import.meta.url).href;
export const RELAYER_DEFAULT_ICON = new URL('../assets/relayers/default.png', import.meta.url).href;
export const TIP_ICON = new URL('../assets/tip.png', import.meta.url).href;

export const ROUTE_INFO = {
    home: {
        name: 'Home',
        title: 'IOBScan - IOB - Home',
        description: 'IBC transfer Overview Information'
    },
    transfers: {
        name: 'Transfers',
        title: 'IOBScan - IOB - Transfers',
        description: 'IBC Transfer List'
    },
    transferDetails: {
        name: 'Transfer Details',
        title: 'IOBScan - IOB - Transfer Details',
        description: 'IBC Transfer Details Information'
    },
    tokens: {
        name: 'Tokens',
        title: 'IOBScan - IOB - Tokens',
        description: 'IBC Tokens List'
    },
    tokenDetails: {
        name: 'Token Details',
        title: 'IOBScan - IOB - Token Details',
        description: 'IBC Token Details Information'
    },
    chains: {
        name: 'Chains',
        title: 'IOBScan - IOB - Chains',
        description: 'IBC Chains List'
    },
    channels: {
        name: 'Channels',
        title: 'IOBScan - IOB - Channels',
        description: 'IBC Channels List'
    },
    relayers: {
        name: 'Relayers',
        title: 'IOBScan - IOB - Relayers',
        description: 'IBC Relayers List'
    },
    relayerDetails: {
        name: 'Relayer Details',
        title: 'IOBScan - IOB - Relayer Details',
        description: 'IBC Relayer Details Information'
    },
    searchResults: {
        name: 'Search Results',
        title: 'IOBScan - IOB - Search Results',
        description: 'IBC Transfer Search Results'
    },
    '404': {
        name: '404',
        title: 'IOBScan - IOB - 404',
        description: 'IOBScan 404 Info'
    }
};
export const MENUS = [
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
    // home 页跳转参数中判断 包含的是 channel， 非 channels，[IBC_STATISTICS_CHANNELS_DEFAULT]
    channel: 'channel',
    channels: 'channels',
    relayers: 'relayers',
    denom: 'denom'
};

export const MSG_DESC = {
    chains: 'Chains',
    channels_24hr: 'Channel Pairs - Active(24hr)',
    channel_all: 'Channel Pairs - All',
    channel_opened: 'Channel Pairs - Open',
    channel_closed: 'Channel Pairs - Closed',
    base_denom_all: 'IBC Tokens - Tokens by Base Denom',
    tx_24hr_all: 'IBC Token Transfers - Recent(24hr)',
    tx_all: 'IBC Token Transfers - All',
    tx_success: 'IBC Token Transfers - Success',
    tx_failed: 'IBC Token Transfers - Failed'
};

export const DAY_TIME = '24';

export const ANCHORS_DATAS = [
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
export const STATISTICS_NAME = {
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
    tx_failed: 'Failed',
    total_relayed_value: 'Total Relayed Value',
    total_txs: 'Total Txs',
    served_channel_pairs: 'Served Channel Pairs',
    total_fee_cost: 'Total Fee Cost'
};

export const IBC_STATISTICS_CHAINS_DEFAULT: IDenomStatistic = {
    chains_24hr: {
        statistics_name: 'chains_24hr',
        count: 0
    },
    chain_all: {
        statistics_name: 'chain_all',
        count: 0
    }
};

export const IBC_STATISTICS_CHANNELS_DEFAULT: IDenomStatistic = {
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

export const IBC_STATISTICS_DENOMS_DEFAULT: IDenomStatistic = {
    denom_all: {
        statistics_name: 'denom_all',
        count: 0
    },
    base_denom_all: {
        statistics_name: 'base_denom_all',
        count: 0
    }
};

export const IBC_STATISTICS_TXS_DEFAULT: IDenomStatistic = {
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

export const AGE_TIMER_INTERVAL = 1000;

export const IBC_TX_STATUS = {
    SUCCESS: 1,
    FAILED: 2,
    PROCESSING: 3,
    REFUNDED: 4,
    SETTING: 5
};

export const CHANNELS_STATUS = {
    channelOpenedStatus: '1',
    channelClosedStatus: '2'
};

export enum CURRENT_MENU_TYPE {
    active = 'active',
    inactive = 'inactive',
    all = 'all'
}

export enum CHAIN_STATUS {
    normal = 1,
    offline = 2
}

export const CHAINS_MENUS: { label: string; value: CURRENT_MENU_TYPE }[] = [
    {
        label: 'Active',
        value: CURRENT_MENU_TYPE.active
    },
    {
        label: 'Inactive',
        value: CURRENT_MENU_TYPE.inactive
    },
    {
        label: 'All',
        value: CURRENT_MENU_TYPE.all
    }
];

export const TX_STATUS_NUMBER = {
    defaultStatus: undefined,
    successStatus: '1',
    failedStatus: '2,4'
};

export const TRANSFERS_STATUS_OPTIONS = {
    DEFAULT_OPTIONS: undefined,
    SUCCESS_OPTIONS: ['1'],
    FAILED_OPTIONS: ['2', '4'],
    PROCESSING_OPTIONS: ['3']
};

export const IBC_TX_STATUS_SELECT_OPTIONS = [
    {
        key: 'All Status',
        value: undefined
    },
    {
        key: 'Success',
        value: JSON.stringify(TRANSFERS_STATUS_OPTIONS.SUCCESS_OPTIONS)
    },
    {
        key: 'Processing',
        value: JSON.stringify(TRANSFERS_STATUS_OPTIONS.PROCESSING_OPTIONS)
    },
    {
        key: 'Failed',
        value: JSON.stringify(TRANSFERS_STATUS_OPTIONS.FAILED_OPTIONS)
    }
];

export const TRANSFER_TABLE_COLUMN: TableColumnsType = [
    {
        title: 'Token',
        dataIndex: 'token',
        key: 'token',
        width: 200
    },
    {
        title: 'From TxHash',
        dataIndex: 'fromTxhash',
        key: 'fromTxhash',
        width: 160
    },
    {
        title: 'From',
        dataIndex: 'from',
        key: 'from'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 180,
        align: 'center'
    },
    {
        title: 'To',
        dataIndex: 'to',
        key: 'to'
    },
    {
        title: 'To TxHash',
        dataIndex: 'toTxHash',
        key: 'toTxHash',
        width: 160
    },
    {
        title: 'Create Time',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 180
    }
];

export const DEFAULT_TITLE = {
    defaultStatus: 'All Status',
    defaultChains: 'All Chains',
    defaultTokens: 'All Tokens'
};

export const UNKNOWN_SYMBOL = 'unknown';

export const CHAINNAME = {
    COSMOSHUB: 'Cosmos Hub',
    IRISHUB: 'IRIS Hub'
};

export const CHAINID = {
    cosmoshub: 'cosmoshub_4',
    irishub: 'irishub_1'
};

export const UNKNOWN = 'Unknown';
export const THOUSAND_DECIMAL = 0.0001;

export const SYMBOL = {
    ATOM: 'ATOM',
    IRIS: 'IRIS'
};

export const COPYRIGHT = `Copyright © ${new Date().getFullYear()} IOBScan. All Rights Reserved.`;
export const ICON_LINK = [
    {
        groupName: 'Github',
        iconName: 'icon-github',
        iconLink: 'https://github.com/irisnet'
    },
    {
        groupName: 'Telegram',
        iconName: 'icon-telegram',
        iconLink: 'https://t.me/irisnetwork'
    },
    {
        groupName: 'Medium',
        iconName: 'icon-medium',
        iconLink: 'https://medium.com/irisnet-blog'
    },
    {
        groupName: 'Twitter',
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
        RelayersListKey.relayersRelayerName,
        RelayersListKey.relayersServedChains,
        RelayersListKey.relayersSuccessRate,
        RelayersListKey.relayersIbcTransferTxs,
        RelayersListKey.relayersTotalRelayedValue,
        RelayersListKey.relayersTotalFeeCost,
        RelayersListKey.relayersLastUpdated
    ],
    transfers: ['token', 'fromTxhash', 'from', 'status', 'to', 'toTxHash', 'createTime', 'endTime']
};

export const NEED_CUSTOM_HEADER = {
    transfers: ['Token']
};

export const BASE_PARAMS: IRequestPagination = {
    use_count: false,
    page_num: 1,
    page_size: 1000
};

export const AXIOS_TIMEOUT = 50000;

export const CHAIN_DEFAULT_VALUE = 'allchain';

export const TOTAL_BOUND = 500000;

export const BACK_TOP_NUM = 2064;

// 默认情况下展示的文案
export const DEFAULT_DISPLAY_TEXT = '--';

export const BOTTOM_STATUS_DATA = {
    transferStatusData: [
        {
            status: 'Success',
            statusImg: 'transfer_status1.png'
        },
        {
            status: 'Processing',
            statusImg: 'transfer_status3.png'
        },
        {
            status: 'Failed',
            statusImg: 'transfer_status2.png'
        }
    ],
    channelStatusData: [
        {
            status: 'Open',
            statusImg: 'channel_open.png'
        },
        {
            status: 'Closed',
            statusImg: 'channel_closed.png'
        }
    ],
    relayerStatusData: [
        {
            status: 'Running',
            statusImg: 'relayer_running.png'
        },
        {
            status: 'Unknown',
            statusImg: 'relayer_stopped.png'
        }
    ]
};
export const CHOOSE_BTN_TEXT = ['Value', 'Txs'];

export const TRANSFER_TYPE = {
    receive: {
        label: 'Receive',
        short: 'Receive Txs'
    },
    acknowledge: {
        label: 'Acknowledge',
        short: 'Ack Txs'
    },
    timeout: {
        label: 'Timeout',
        short: 'Timeout Txs'
    }
};

export enum TypeButtonProp {
    reset = 'reset',
    search = 'search'
}
