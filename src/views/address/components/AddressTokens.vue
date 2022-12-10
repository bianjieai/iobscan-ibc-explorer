<template>
    <InfoCard
        class="address_tokens_c"
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
    import { useNeedCustomColumns } from '@/composables';
    import {
        DEFAULT_DISPLAY_TEXT,
        NoDataType,
        PAGE_PARAMETERS,
        TOKEN_DEFAULT_ICON,
        UNKNOWN
    } from '@/constants';
    import { ADDRESS_TOKENS_COLUMNS } from '@/constants/address';
    import { UNIT_SIGNS } from '@/constants/relayers';
    import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
    import { IAddressTokenTableItem, ITokenListItem } from '@/types/interface/address.interface';

    interface IProps {
        data?: ITokenListItem[];
        addressTokensLoading?: boolean;
        addressTokensType?: NoDataType;
    }
    const props = defineProps<IProps>();
    const { data, addressTokensLoading, addressTokensType } = toRefs(props);

    // todo dj 待抽离
    const tokensList = ref<IAddressTokenTableItem[]>([]);
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.addressDetailsToken);
    const tokensSubTitle = computed(() => {
        if (addressTokensLoading?.value) return `A total of ${DEFAULT_DISPLAY_TEXT} tokens found`;
        if (addressTokensType?.value === NoDataType.loadFailed) return '';
        const num = tokensList.value.length;
        return `A total of ${num} tokens found`;
    });
    const formatPriceAndTotalValue = (value: string, num = 2) => {
        return `${UNIT_SIGNS} ${formatBigNumber(value, num)}`;
    };
    watch(
        () => data?.value,
        (newValue) => {
            if (newValue) {
                const temp: IAddressTokenTableItem[] = [];
                newValue.forEach((token) => {
                    const chainInfo = token.tokenInfo;
                    const tokenInfo = chainInfo
                        ? {
                              defaultTitle: token.denom,
                              title: getRestString(chainInfo.symbol, 6, 0),
                              subtitle: token.denom_type,
                              imgSrc: chainInfo?.icon || TOKEN_DEFAULT_ICON
                          }
                        : {
                              defaultTitle: token.denom,
                              title: UNKNOWN,
                              subtitle: token.denom_type,
                              imgSrc: TOKEN_DEFAULT_ICON
                          };
                    temp.push({
                        tokenId: token.chain + token.denom,
                        tokenInfo,
                        displayAmount: token.displayAmount,
                        displayAvaliable: token.displayAvaliableAmount,
                        price: formatPriceAndTotalValue(String(token.price)),
                        totalValue: formatPriceAndTotalValue(token.denom_amount)
                    });
                });
                tokensList.value = [...temp];
            }
        },
        {
            immediate: true
        }
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
