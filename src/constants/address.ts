import { TableColumnsType } from 'ant-design-vue';

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
        align: 'left',
        width: 80
    },
    {
        title: 'Amount',
        dataIndex: AddressTokensTableKey.amount,
        key: AddressTokensTableKey.amount,
        align: 'right',
        width: 160
    },
    {
        title: 'Price',
        dataIndex: AddressTokensTableKey.price,
        key: AddressTokensTableKey.price,
        align: 'right',
        width: 120
    },
    {
        title: 'Total Value',
        dataIndex: AddressTokensTableKey.totalValue,
        key: AddressTokensTableKey.totalValue,
        align: 'right',
        width: 160
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
