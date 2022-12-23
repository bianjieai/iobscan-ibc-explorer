<template>
    <InfoCard
        class="address_accounts_c"
        :class="{ failed: isFailed }"
        tip-msg="All addresses found by the same pub key."
        :sub-title="accountsSubTitle"
        icon="icon-account"
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
                        :show-utc-icon="showUtcIcon"
                        :show-utc="showUtc"
                        column-name="Last Updated"
                        @change-show-utc-age="changeShowUtcAge"
                    />
                </template>
                <template #chain="{ record }">
                    <ChainIcon :chain="record.chain" icon-size="small" />
                </template>
                <template #address="{ record }">
                    <AddressDiff
                        :current-chain="record.chain"
                        :current-address="currentAddress"
                        :tx-address="record.address"
                    />
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
    import { useTimeUtcAge } from '@/composables';
    import { NoDataType } from '@/constants';
    import { ADDRESS_ACCOUNT_COLUMNS } from '@/constants/address';
    import { IAccountListItem } from '@/types/interface/address.interface';
    import { usAddressAccount } from '../composable';
    import AddressDiff from './AddressDiff.vue';

    interface IProps {
        data?: IAccountListItem[];
        addressAccountLoading: boolean;
        addressAccountType: NoDataType | undefined;
    }
    const props = defineProps<IProps>();
    const { data, addressAccountLoading, addressAccountType } = toRefs(props);
    const {
        accountsSubTitle,
        needCustomColumns,
        needCustomHeaders,
        accountsList,
        currentAddress,
        isFailed,
        showUtcIcon
    } = usAddressAccount(data, addressAccountLoading, addressAccountType);
    const { showUtc, changeShowUtcAge } = useTimeUtcAge(false);
</script>

<style lang="less" scoped>
    .address_accounts_c {
        min-width: 806px;
        :deep(.info_card__primary) {
            padding: 16px 24px 0;
        }
        :deep(.ant-table-container) {
            width: 100%;
            min-height: 400px;
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
                    min-width: 758px;
                }
            }
        }
    }
    .failed {
        :deep(.ant-table-container) {
            min-height: 334px;
        }
    }
    @media screen and (max-width: 1247px) {
        .address_accounts_c {
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
                    :deep(table) {
                    }
                }
            }
        }
    }
</style>
