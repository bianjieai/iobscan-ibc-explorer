<template>
    <InfoCard
        class="address_tokens_c"
        :class="{ failed: isFailed }"
        :sub-title="tokensSubTitle"
        icon="icon-a-relayedassets"
        title="Tokens"
    >
        <div class="address_tokens_c__table">
            <TableCommon
                :has-padding-lr="false"
                :table-loading="addressTokensLoading"
                :no-data-type="addressTokensType"
                :data="tokensList"
                :columns="ADDRESS_TOKENS_COLUMNS"
                :page-size="5"
                :need-custom-columns="needCustomColumns"
                row-key="token_id"
            >
                <template #token="{ record }">
                    <BaseTokenIcon :token-info="record.tokenInfo" :title-can-popover="true" />
                </template>
                <template #amount="{ record }">
                    <a-popover placement="right" destroy-tooltip-on-hide>
                        <template #content>
                            <div class="address_token_amount_popover">
                                <div class="address_token_amount_popover__item">
                                    <span class="address_token_amount_popover__item__key"
                                        >Avaliable:</span
                                    >
                                    <span class="address_token_amount_popover__item__value">{{
                                        record.displayAvaliable
                                    }}</span>
                                </div>
                                <div class="address_token_amount_popover__item">
                                    <span class="address_token_amount_popover__item__key"
                                        >Amount:</span
                                    >
                                    <span class="address_token_amount_popover__item__value">{{
                                        record.displayAmount
                                    }}</span>
                                </div>
                            </div>
                        </template>
                        <div>{{ record.displayAmount }}</div>
                    </a-popover>
                </template>
                <template #price="{ record }">
                    <div>{{ record.price }}</div>
                </template>
                <template #totalValue="{ record }">
                    <div>{{ record.totalValue }}</div>
                </template>
            </TableCommon>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { NoDataType } from '@/constants';
    import { ADDRESS_TOKENS_COLUMNS } from '@/constants/address';
    import { ITokenListItem } from '@/types/interface/address.interface';
    import { useAddressTokens } from '../composable';

    interface IProps {
        data?: ITokenListItem[];
        addressTokensLoading: boolean;
        addressTokensType: NoDataType | undefined;
    }
    const props = defineProps<IProps>();
    const { data, addressTokensLoading, addressTokensType } = toRefs(props);
    const { tokensSubTitle, tokensList, needCustomColumns, isFailed } = useAddressTokens(
        data,
        addressTokensLoading,
        addressTokensType
    );
</script>

<style lang="less" scoped>
    .address_tokens_c {
        min-width: 650px;
        :deep(.info_card__primary) {
            padding: 16px 24px 0;
        }
        :deep(.ant-table-container) {
            width: 100%;
            min-height: 408px;
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
                :deep(table) {
                    min-width: 602px;
                }
            }
        }
    }
    .failed {
        :deep(.ant-table-container) {
            min-height: 334px;
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
    @media screen and (max-width: 1091px) {
        .address_tokens_c {
            min-width: auto;
            :deep(.info_card__primary) {
            }
            :deep(.ant-table-container) {
                .ant-table-thead {
                    tr {
                        th {
                        }
                    }
                }
                .ant-table-cell {
                    &:nth-of-type(1) {
                    }
                }
            }
            &__table {
                .table_wrapper {
                }
            }
        }
        .address_token_amount_popover {
            &__item {
                &__key {
                }
                &__value {
                }
            }
        }
    }
</style>
