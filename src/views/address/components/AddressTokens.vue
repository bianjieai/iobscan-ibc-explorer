<template>
    <InfoCard
        class="address_tokens_c"
        sub-title="A total of -- tokens found"
        icon="icon-a-relayedassets"
        title="Tokens"
    >
        <div class="address_tokens_c__table">
            <TableCommon
                :has-padding-lr="false"
                :table-loading="loading"
                :data="tokensList"
                :columns="COLUMNS"
                :page-size="5"
                :need-custom-columns="needCustomColumns"
                row-key="token_id"
            >
                <!-- <template #token="{ record, column }">
                    <div>token</div>
                </template>
                <template #amount="{ record, column }">
                    <a-popover placement="right" destroy-tooltip-on-hide>
                        <template #content>
                            <div class="address_token_amount_popover">
                                <div class="address_token_amount_popover__item">
                                    <span class="address_token_amount_popover__item__key"
                                        >Avaliable:</span
                                    >
                                    <span class="address_token_amount_popover__item__value"
                                        >232,323.123323</span
                                    >
                                </div>
                                <div class="address_token_amount_popover__item">
                                    <span class="address_token_amount_popover__item__key"
                                        >Amount:</span
                                    >
                                    <span class="address_token_amount_popover__item__value"
                                        >2,323.123323</span
                                    >
                                </div>
                            </div>
                        </template>
                        <div>amount</div>
                    </a-popover>
                </template>
                <template #price="{ record, column }">
                    <div>price</div>
                </template>
                <template #totalValue="{ record, column }">
                    <div>totalValue</div>
                </template> -->
            </TableCommon>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { useNeedCustomColumns } from '@/composables';
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS } from '@/constants/address';
    // todo dj logic
    const loading = ref(false);
    const tokensList = ref<any>([]);
    setTimeout(() => {
        tokensList.value = [
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            },
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            },
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            },
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            },
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            },
            {
                token: 'token',
                amount: '113,177,023,289.1234',
                price: '$0.09',
                totalValue: '$ 25,959.12',
                token_id: 'to'
            }
        ];
    });
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.addressDetailsToken);
</script>

<style lang="less" scoped>
    .address_tokens_c {
        min-width: 650px;
        :deep(.ant-table-container) {
            width: 100%;
            // min-height: 300px;
            .ant-table-thead {
                tr {
                    th {
                        background: #f8fafd !important;
                    }
                }
            }
            .ant-table-cell {
                padding-right: 16px;
                &:nth-of-type(1) {
                    padding-left: 16px;
                }
            }
        }
        &__table {
            .table_wrapper {
                margin-top: 0;
            }
        }
    }
    .address_token_amount_popover {
        padding: 4px 0;
        &__item {
            &__key {
                margin-right: 8px;
                font-size: 14px;
                font-family: GolosUI_Medium;
                font-weight: 500;
                color: #000000;
                line-height: 18px;
            }
            &__value {
                font-size: 14px;
                color: #000000;
                line-height: 18px;
            }
        }
    }
</style>
