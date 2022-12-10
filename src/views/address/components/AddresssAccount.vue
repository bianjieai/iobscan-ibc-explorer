<template>
    <!-- todo dj icon -->
    <InfoCard
        class="address_accounts_c"
        tip-msg="All addresses found by the same pub key."
        :sub-title="accountsSubTitle"
        icon="icon-a-relayedassets"
        title="Account"
    >
        <div class="address_accounts_c__table">
            <TableCommon
                :has-padding-lr="false"
                :table-loading="addressAccountLoading"
                :no-data-type="addressAccountType"
                :data="accountsList"
                :columns="ADDRESS_ACCOUNT_COLUMNS"
                :page-size="5"
                :need-custom-headers="needCustomHeaders"
                :need-custom-columns="needCustomColumns"
                :is-launch-timer="!showUtc"
                :real-time-key="[
                    {
                        scKey: 'lastUpdatedTimestamp',
                        dcKey: 'lastUpdatedAge'
                    }
                ]"
                row-key="account_id"
            >
                <template #LastUpdated>
                    <TimeUTCAge
                        :tooltip-text="
                            showUtc ? 'Click to show Age Format' : 'Click to show UTC0 Format'
                        "
                        :show-utc="showUtc"
                        column-name="Last Updated"
                        @change-show-utc-age="changeShowUtcAge"
                    />
                </template>
                <template #chain="{ record }">
                    <ChainIcon :chain="record.chain" icon-size="small" />
                </template>
                <template #address="{ record }">
                    <div>{{ getRestString(record.address, 6, 6) }}</div>
                </template>
                <template #tokenDenom="{ record }">
                    <div>{{ record.tokenDenom }}</div>
                </template>
                <template #totalValue="{ record }">
                    <div>{{ record.totalValue }}</div>
                </template>
                <template #lastUpdated="{ record }">
                    <span>{{ showUtc ? record.formatLastUpdated : record.lastUpdatedAge }}</span>
                </template>
            </TableCommon>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { useNeedCustomColumns, useTimeUtcAge } from '@/composables';
    import { DEFAULT_DISPLAY_TEXT, NoDataType, PAGE_PARAMETERS } from '@/constants';
    import { ADDRESS_ACCOUNT_COLUMNS } from '@/constants/address';
    import { UNIT_SIGNS } from '@/constants/relayers';
    import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
    import {
        IAccountListItem,
        IAddressAccountTableItem
    } from '@/types/interface/address.interface';
    import { dayjsFormatDate } from '@/utils/timeTools';

    interface IProps {
        data?: IAccountListItem[];
        addressAccountLoading?: boolean;
        addressAccountType?: NoDataType;
    }
    const props = defineProps<IProps>();
    const { data, addressAccountLoading, addressAccountType } = toRefs(props);

    const { showUtc, changeShowUtcAge } = useTimeUtcAge(false);

    // todo dj 待抽离
    const accountsList = ref<IAddressAccountTableItem[]>([]);
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.addressDetailsAccount
    );
    const accountsSubTitle = computed(() => {
        if (addressAccountLoading?.value)
            return `A total of ${DEFAULT_DISPLAY_TEXT} addresses found`;
        if (addressAccountType?.value === NoDataType.loadFailed) return '';
        const num = accountsList.value.length;
        return `A total of ${num} addresses found`;
    });

    // todo dj 待抽离，逻辑可复用
    const formatPriceAndTotalValue = (value: string, num = 2) => {
        return `${UNIT_SIGNS} ${formatBigNumber(value, num)}`;
    };
    formatPriceAndTotalValue('test', 2);

    watch(
        () => data?.value,
        (newValue) => {
            if (newValue) {
                const temp: IAddressAccountTableItem[] = [];
                newValue.forEach((account) => {
                    temp.push({
                        chain: account.chain,
                        address: account.address,
                        tokenDenom: account.token_denom_num,
                        totalValue: account.token_value,
                        formatLastUpdated: dayjsFormatDate(account.last_update_time),
                        lastUpdatedTimestamp: account.last_update_time
                    });
                });
                accountsList.value = [...temp];
            }
        },
        {
            immediate: true
        }
    );
</script>

<style lang="less" scoped>
    .address_accounts_c {
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
</style>
