import { TableColumnsType } from 'ant-design-vue';

export enum AddressTokensListKey {
    total = 'token',
    amount = 'amount',
    price = 'price',
    totalValue = 'totalValue'
}

export const COLUMNS: TableColumnsType = [
    {
        title: 'Token',
        dataIndex: AddressTokensListKey.total,
        key: AddressTokensListKey.total,
        align: 'left'
    },
    {
        title: 'Amount',
        dataIndex: AddressTokensListKey.amount,
        key: AddressTokensListKey.amount,
        align: 'right',
        width: 200
    },
    {
        title: 'Price',
        dataIndex: AddressTokensListKey.price,
        key: AddressTokensListKey.price,
        align: 'right'
    },
    {
        title: 'Total Value',
        dataIndex: AddressTokensListKey.totalValue,
        key: AddressTokensListKey.totalValue,
        align: 'right'
    }
];
