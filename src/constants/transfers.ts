import type {
    ITokenInfoList,
    ITransfersDetails,
    ITransfersExpandDetails
} from '@/types/interface/transfers.interface';
export enum IBC_TX_STATUS {
    'default' = 1000, // web custom staus
    'success' = 1,
    'failed' = 2,
    'processing' = 3,
    'refund' = 4,
    'setting' = 5
}

export enum IBC_SC_AND_DC_TX_STATUS {
    'default' = 1000, // web custom staus
    'success' = 1,
    'failed' = 0
}

// 交易详情判断是否超出最大宽度所需
export const CHAIN_ID_ICON_WIDTH = 28;
export const CHAIN_ID_LABEL = 'Chain ID';

export const TRANSFERS_OUT_DETAILS: ITransfersDetails[] = [
    {
        label: 'MsgType:',
        value: 'IBC Transfer Out'
    },
    {
        label: 'Chain ID:',
        value: '--',
        dataKey: 'sc_chain_id',
        isFormatChainID: true
    },
    {
        label: 'Port:',
        value: '--',
        dataKey: 'sc_port'
    },
    {
        label: 'Channel ID:',
        value: '--',
        dataKey: 'sc_channel',
        isChannelID: true
    },
    {
        label: 'Send Token:',
        value: '--',
        dataKey: 'sc_tx_info.msg_amount',
        isFormatToken: true
    },
    {
        label: 'From Address:',
        value: '--',
        dataKey: 'sc_tx_info.msg.msg.sender',
        isAddress: true
    },
    {
        label: 'Block:',
        value: '--',
        dataKey: 'sc_tx_info.height'
    },
    {
        label: 'Status:',
        value: '--',
        dataKey: 'sc_tx_info.status',
        isFormatStatus: true
    },
    {
        label: 'Timestamp:',
        value: '--',
        dataKey: 'tx_time',
        isFormatDate: true
    },
    {
        label: 'Fee:',
        value: '--',
        dataKey: 'sc_tx_info.fee.amount',
        isFormatFee: true
    },
    {
        label: 'Signer:',
        value: '--',
        dataKey: 'sc_signers',
        isAddress: true,
        isNotLink: true
    }
];
export const TRANSFERS_OUT_EXPAND_DETAILS: ITransfersExpandDetails[] = [
    {
        label: 'Connection:',
        value: '--',
        dataKey: 'sc_connect',
        isExpand: false
    },
    {
        label: 'Time Out Height:',
        value: '--',
        dataKey: 'sc_tx_info.msg.msg.timeout_height',
        isExpand: false,
        isFormatHeight: true
    },
    {
        label: 'Time Out Timestamp:',
        value: '--',
        dataKey: 'sc_tx_info.msg.msg.timeout_timestamp',
        isExpand: false
    }
];
export const TRANSFERS_IN_DETAILS: ITransfersDetails[] = [
    {
        label: 'MsgType:',
        value: 'IBC Transfer In'
    },
    {
        label: 'Chain ID:',
        value: '--',
        dataKey: 'dc_chain_id',
        isFormatChainID: true
    },
    {
        label: 'Port:',
        value: '--',
        dataKey: 'dc_port'
    },
    {
        label: 'Channel ID:',
        value: '--',
        dataKey: 'dc_channel',
        isChannelID: true
    },
    {
        label: 'Received Token:',
        value: '--',
        dataKey: 'dc_tx_info.msg.msg.packet.data',
        isFormatToken: true
    },
    {
        label: 'To Address:',
        value: '--',
        dataKey: 'sc_tx_info.msg.msg.receiver',
        isAddress: true
    },
    {
        label: 'Block:',
        value: '--',
        dataKey: 'dc_tx_info.height'
    },
    {
        label: 'Status:',
        value: '--',
        dataKey: 'dc_tx_info.status',
        isFormatStatus: true
    },
    {
        label: 'Timestamp:',
        value: '--',
        dataKey: 'dc_tx_info.time',
        isFormatDate: true
    },
    {
        label: 'Fee:',
        value: '--',
        dataKey: 'dc_tx_info.fee.amount',
        isFormatFee: true
    },
    {
        label: 'Signer:',
        value: '--',
        dataKey: 'dc_signers',
        isAddress: true
    }
];

export const TRANSFERS_IN_EXPAND_DETAILS: ITransfersExpandDetails[] = [
    {
        label: 'Connection:',
        value: '--',
        dataKey: 'dc_connect',
        isExpand: true
    },
    {
        label: 'Packet Ack:',
        value: '--',
        dataKey: 'ack',
        isExpand: true,
        isAck: true
    },
    {
        label: 'Proof Height:',
        value: '--',
        dataKey: 'dc_tx_info.msg.msg.proof_height',
        isExpand: true,
        isFormatHeight: true
    }
];

// 新的 TokenInfo
export const TOKEN_INFO_LIST: ITokenInfoList[] = [
    {
        label: 'Amount',
        value: ''
    }
];
export const TOKEN_INFO_LIST_EXPAND: ITokenInfoList[] = [
    {
        label: 'Send Token Path',
        dataKey: 'send_token.denom_path',
        value: ''
    },
    {
        label: 'Send Token Hash',
        dataKey: 'send_token.denom',
        value: ''
    },
    {
        label: 'Received Token Path',
        dataKey: 'recv_token.denom_path',
        value: ''
    },
    {
        label: 'Received Token Hash',
        dataKey: 'recv_token.denom',
        value: ''
    }
];
