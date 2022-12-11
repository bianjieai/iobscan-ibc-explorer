import { TableColumnsType } from 'ant-design-vue';

export enum ADDRESS_TXS_KEY {
    txHash = 'tx_hash',
    type = 'tx_type',
    port = 'port',
    from = 'sender',
    to = 'receiver',
    amount = 'denom_info',
    fee = 'fee_info',
    time = 'tx_time'
}

export const ADDRESS_TXS_COLUMN: TableColumnsType = [
    {
        title: 'TxHash',
        dataIndex: ADDRESS_TXS_KEY.txHash,
        key: ADDRESS_TXS_KEY.txHash,
        width: 150
    },
    {
        title: 'Type',
        dataIndex: ADDRESS_TXS_KEY.type,
        key: ADDRESS_TXS_KEY.type
    },
    {
        title: 'Port',
        dataIndex: ADDRESS_TXS_KEY.port,
        key: ADDRESS_TXS_KEY.port
    },
    {
        title: 'From',
        dataIndex: ADDRESS_TXS_KEY.from,
        key: ADDRESS_TXS_KEY.from
    },
    {
        title: 'To',
        dataIndex: ADDRESS_TXS_KEY.to,
        key: ADDRESS_TXS_KEY.to
    },
    {
        title: 'Amount',
        dataIndex: ADDRESS_TXS_KEY.amount,
        key: ADDRESS_TXS_KEY.amount
    },
    {
        title: 'Fee',
        dataIndex: ADDRESS_TXS_KEY.fee,
        key: ADDRESS_TXS_KEY.fee
    },
    {
        title: 'Time',
        dataIndex: ADDRESS_TXS_KEY.time,
        key: ADDRESS_TXS_KEY.time,
        width: 152,
        align: 'right'
    }
];

export enum IN_OUT_TAG {
    in = 'In',
    out = 'Out'
}
