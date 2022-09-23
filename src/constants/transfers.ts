import type { IInfoList, IProgress, ITxInfo } from '@/types/interface/transfers.interface';
export enum IBC_TX_STATUS {
    'default' = 1000, // web custom staus
    'success' = 1,
    'failed' = 2,
    'processing' = 3,
    'refund' = 4,
    'setting' = 5
}

export const PROGRESS_STEP = {
    1: 'Transfer',
    2: 'Receive',
    3: 'Acknowledge',
    4: 'Timeout'
};
export const TRANSFER_DETAILS_STATUS = {
    FAILED: {
        value: 0,
        label: 'Failed'
    },
    SUCCESS: {
        value: 1,
        label: 'Success'
    }
};

// 交易详情判断是否超出最大宽度所需
export const ICON_MARGIN_RIGHT_WIDTH = 28;
export const MAX_ALLOW_WIDTH = 152;
export const CHAIN_ID_LABEL = 'Chain ID';
export const RELAYER_LABEL = 'Name';

// 新的 TokenInfo
export const TOKEN_INFO_LIST: IInfoList = {
    label: 'Amount',
    value: '--'
};
export const TOKEN_INFO_LIST_EXPAND: IInfoList[] = [
    {
        label: 'Send Token Path',
        dataKey: 'send_token.denom_path',
        value: '--'
    },
    {
        label: 'Send Token Hash',
        dataKey: 'send_token.denom',
        value: '--'
    },
    {
        label: 'Received Token Path',
        dataKey: 'recv_token.denom_path',
        value: '--'
    },
    {
        label: 'Received Token Hash',
        dataKey: 'recv_token.denom',
        value: '--'
    }
];

// sc_info
export const CHAIN_ADDRESS: IInfoList = {
    label: 'Address',
    value: '--'
};
export const CHAIN_INFO_LIST: IInfoList = {
    label: 'Chain ID',
    value: '--'
};
export const CHAIN_INFO_LIST_EXPAND: IInfoList[] = [
    {
        label: 'Port',
        dataKey: 'port_id',
        value: '--'
    },
    {
        label: 'Channel ID',
        dataKey: 'channel_id',
        value: '--'
    },
    {
        label: 'Connection ID',
        dataKey: 'connection_id',
        value: '--'
    },
    {
        label: 'Client ID',
        dataKey: 'client_id',
        value: '--'
    }
];

export const RELAYER_INFO: IInfoList = {
    label: 'Name',
    value: '--'
};
export const SEQUENCE_INFO: IInfoList = {
    label: 'Number',
    value: '--'
};

export const CHAIN_INFO: ITxInfo = {
    address: '--',
    chain_id: '--',
    channel_id: '--',
    port_id: '--',
    connection_id: '--',
    client_id: '--'
};

export const IBC_TX_INFO_STATUS = {
    success: 'success',
    failed: 'failed',
    proccessing: 'proccessing',
    unknown: 'unknown'
};

// 定义 TxProgress 所需源数据
export const SUCCESS_ARRIVE: IProgress[] = [
    {
        progress: 'Transfer',
        badge: 'From',
        step: PROGRESS_STEP[1]
    },
    {
        progress: 'Receive',
        badge: 'To',
        step: PROGRESS_STEP[2]
    },
    {
        progress: 'Acknowledge',
        badge: 'Result',
        step: PROGRESS_STEP[3]
    }
];
export const SUCCESS_NO_ACK: IProgress[] = [
    {
        progress: 'Transfer',
        badge: 'From',
        step: PROGRESS_STEP[1]
    },
    {
        progress: 'Receive',
        badge: 'To',
        step: PROGRESS_STEP[2]
    }
];
export const PROCCESSING_FIRST_ERROR: IProgress[] = [
    {
        progress: 'Transfer',
        badge: 'From',
        step: PROGRESS_STEP[1]
    }
];
export const SECOND_ERROR: IProgress[] = [
    {
        progress: 'Transfer',
        badge: 'From',
        step: PROGRESS_STEP[1]
    },
    {
        progress: 'Receive',
        badge: 'To',
        step: PROGRESS_STEP[2]
    },
    {
        progress: 'Timeout',
        badge: 'Result',
        step: PROGRESS_STEP[4]
    }
];
export const NO_SECOND: IProgress[] = [
    {
        progress: 'Transfer',
        badge: 'From',
        step: PROGRESS_STEP[1]
    },
    {
        progress: 'Timeout',
        badge: 'Result',
        step: PROGRESS_STEP[4]
    }
];

// Progress List
export const PROGRESS_LIST: IInfoList[] = [
    {
        label: 'TxHash',
        dataKey: 'tx_hash',
        value: '--'
    },
    {
        label: 'Status',
        dataKey: 'status',
        value: '--',
        isFormatStatus: true
    },
    {
        label: 'Fee',
        dataKey: 'fee.amount',
        value: '--',
        isFormatFee: true
    },
    {
        label: 'Signer',
        dataKey: 'signers',
        value: '--',
        isFormatSigner: true
    },
    {
        label: 'Memo',
        dataKey: 'memo',
        value: '--'
    },
    {
        label: 'Block',
        dataKey: 'height',
        value: '--'
    },
    {
        label: 'Timestamp',
        dataKey: 'time',
        value: '--',
        isFormatTimestamp: true
    }
];

export const PROGRESS_TRANSFER_LIST: IInfoList[] = [
    {
        label: 'Timeout Height',
        dataKey: 'timeout_height',
        value: '--'
    },
    {
        label: 'Timeout Timestamp',
        dataKey: 'timeout_timestamp',
        value: '--',
        isFormatTimeoutTimestamp: true
    }
];
export const PROGRESS_RECEIVE_LIST: IInfoList[] = [
    {
        label: 'Packet Ack',
        dataKey: 'ack',
        value: '--'
    },
    {
        label: 'Proof Height',
        dataKey: 'proof_height',
        value: '--'
    }
];
export const PROGRESS_ACKNOWLEDGE_LIST: IInfoList[] = [
    {
        label: 'Acknowledgement',
        dataKey: 'ack',
        value: '--'
    },
    {
        label: 'Proof Height',
        dataKey: 'proof_height',
        value: '--'
    }
];
export const PROGRESS_TIMEOUT_LIST: IInfoList[] = [
    {
        label: 'Next Sequence Recv',
        dataKey: 'next_sequence_recv',
        value: '--'
    },
    {
        label: 'Proof Height',
        dataKey: 'proof_height',
        value: '--'
    }
];

export const TRANSFER_DETAILS_TABLE = [
    {
        title: 'Data Name',
        dataIndex: 'name',
        key: 'name'
        // width: '35%'
    },
    {
        title: 'Content',
        dataIndex: 'value',
        key: 'value'
    }
];

export const REFUND_TX_TYPE = {
    acknowledge_packet: 'acknowledge_packet',
    timeout_packet: 'acknowledge_packet'
};
