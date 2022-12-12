import { TableColumnsType } from 'ant-design-vue';

export enum AddressTxsKey {
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
        dataIndex: AddressTxsKey.txHash,
        key: AddressTxsKey.txHash,
        width: 150
    },
    {
        title: 'Type',
        dataIndex: AddressTxsKey.type,
        key: AddressTxsKey.type
    },
    {
        title: 'Port',
        dataIndex: AddressTxsKey.port,
        key: AddressTxsKey.port
    },
    {
        title: 'From',
        dataIndex: AddressTxsKey.from,
        key: AddressTxsKey.from
    },
    {
        title: 'To',
        dataIndex: AddressTxsKey.to,
        key: AddressTxsKey.to
    },
    {
        title: 'Amount',
        dataIndex: AddressTxsKey.amount,
        key: AddressTxsKey.amount
    },
    {
        title: 'Fee',
        dataIndex: AddressTxsKey.fee,
        key: AddressTxsKey.fee
    },
    {
        title: 'Time',
        dataIndex: AddressTxsKey.time,
        key: AddressTxsKey.time,
        width: 152,
        align: 'right'
    }
];

export enum AddressTokensTableKey {
    total = 'token',
    amount = 'amount',
    price = 'price',
    totalValue = 'totalValue'
}

export const ADDRESS_TOKENS_COLUMNS: TableColumnsType = [
    {
        title: 'Token',
        dataIndex: AddressTokensTableKey.total,
        key: AddressTokensTableKey.total,
        align: 'left'
    },
    {
        title: 'Amount',
        dataIndex: AddressTokensTableKey.amount,
        key: AddressTokensTableKey.amount,
        align: 'right',
        width: 200
    },
    {
        title: 'Price',
        dataIndex: AddressTokensTableKey.price,
        key: AddressTokensTableKey.price,
        align: 'right'
    },
    {
        title: 'Total Value',
        dataIndex: AddressTokensTableKey.totalValue,
        key: AddressTokensTableKey.totalValue,
        align: 'right'
    }
];

export enum AddressAccountTableKey {
    chain = 'chain',
    address = 'address',
    tokenDenom = 'tokenDenom',
    totalValue = 'totalValue',
    lastUpdated = 'lastUpdated'
}

export const ADDRESS_ACCOUNT_COLUMNS: TableColumnsType = [
    {
        title: 'Chain',
        dataIndex: AddressAccountTableKey.chain,
        key: AddressAccountTableKey.chain,
        align: 'left'
    },
    {
        title: 'Address',
        dataIndex: AddressAccountTableKey.address,
        key: AddressAccountTableKey.address,
        align: 'left',
        width: 200
    },
    {
        title: 'Token Denom',
        dataIndex: AddressAccountTableKey.tokenDenom,
        key: AddressAccountTableKey.tokenDenom,
        align: 'right'
    },
    {
        title: 'Total Value',
        dataIndex: AddressAccountTableKey.totalValue,
        key: AddressAccountTableKey.totalValue,
        align: 'right'
    },
    {
        title: 'LastUpdated',
        dataIndex: AddressAccountTableKey.lastUpdated,
        key: AddressAccountTableKey.lastUpdated,
        width: 152,
        align: 'right'
    }
];

export enum IN_OUT_TAG {
    in = 'In',
    out = 'Out'
}
