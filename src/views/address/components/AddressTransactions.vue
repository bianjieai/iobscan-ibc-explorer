<template>
    <InfoCard
        icon="icon-transactions"
        title="Transactions"
        tip-msg="Display ICS-20 related transactions"
        :sub-title="subTitle"
        download-tip="The latest 1,000 records will be exported"
        @export-address-txs="exportAddressTxs(currentChain, currentAddress)"
    >
        <TableCommon
            class="txs_table"
            :has-padding-lr="false"
            :data="addressTxsList"
            :columns="ADDRESS_TXS_COLUMN"
            :table-loading="addressTxsLoading"
            :no-data-type="loadingCondition"
            :need-custom-headers="needCustomHeaders"
            :need-custom-columns="needCustomColumns"
            :is-launch-timer="!showUtc"
            :real-time-key="[
                {
                    scKey: AddressTxsKey.time,
                    dcKey: 'txs_tx_time'
                }
            ]"
            :page-loading="addressPageisDisabled"
            :current="pagination.current"
            :page-size="5"
            :total="pagination.total"
            row-key="tx_hash"
            @on-page-change="onPaginationChange"
        >
            <template #Time>
                <TimeUTCAge
                    :tooltip-text="
                        showUtc ? 'Click to show Age Format' : 'Click to show UTC0 Format'
                    "
                    :show-utc="showUtc"
                    :column-name="'Time'"
                    @change-show-utc-age="changeShowUtcAge"
                />
            </template>
            <template #tx_hash="{ record }">
                <div class="txs_table__tx_hash flex items-center">
                    <i
                        class="iconfont"
                        :class="
                            record.tx_status
                                ? 'icon-chenggong txs_table__success'
                                : 'icon-shibai txs_table__failed'
                        "
                    ></i>
                    <a-popover placement="topLeft" destroy-tooltip-on-hide>
                        <template #content>
                            <span class="popover_c">{{ record.tx_hash }}</span>
                        </template>
                        <router-link
                            class="txs_table__hash cursor"
                            :to="`/transfers/details?txhash=${record.tx_hash}`"
                        >
                            <span>{{ getRestString(record.tx_hash, 4, 4) }}</span>
                        </router-link>
                    </a-popover>
                </div>
            </template>
            <template #tx_type="{ record }">
                <span>{{ formatTransferType(record.tx_type) }}</span>
            </template>
            <template #port="{ record }">
                <span>{{ record.port }}</span>
            </template>
            <template #sender="{ record }">
                <address-diff
                    :current-chain="currentChain"
                    :current-address="currentAddress"
                    :tx-address="record.sender"
                />
            </template>
            <template #receiver="{ record }">
                <div class="flex items-center">
                    <span
                        v-if="record.tag"
                        class="txs_table__tag flex justify-center items-center"
                        :class="{
                            txs_table__in_style: record.tag === IN_OUT_TAG.in,
                            txs_table__out_style: record.tag === IN_OUT_TAG.out
                        }"
                        >{{ record.tag }}</span
                    >
                    <address-diff
                        :current-chain="currentChain"
                        :current-address="currentAddress"
                        :tx-address="record.receiver"
                    />
                </div>
            </template>
            <template #denom_info="{ record, column }">
                <div v-if="showMoreIcon(record.ibc_version)">
                    <router-link :to="`/address/${currentAddress}?chain=${currentChain}`">
                        <i class="iconfont icon-more"></i>
                        <span>More</span>
                    </router-link>
                </div>
                <TokenInfo v-else :token-info="record.denom_info" :type="column.title" />
            </template>
            <template #fee_info="{ record, column }">
                <TokenInfo :token-info="record.fee_info" :type="column.title" />
            </template>
            <template #tx_time="{ record }">
                <span>{{ showUtc ? record.format_tx_time : record.txs_tx_time }}</span>
            </template>
        </TableCommon>
    </InfoCard>
</template>

<script setup lang="ts">
    import AddressDiff from './AddressDiff.vue';
    import {
        useNeedCustomColumns,
        usePagination,
        useTimeUtcAge,
        formatTransferType
    } from '@/composables';
    import { PAGE_PARAMETERS } from '@/constants';
    import { AddressTxsKey, ADDRESS_TXS_COLUMN, IN_OUT_TAG } from '@/constants/address';
    import { getRestString } from '@/helper/parseStringHelper';
    import { useExportAddressTxs, useGetAddressTxs } from '../composable';
    const { pagination } = usePagination();
    const { showUtc, changeShowUtcAge } = useTimeUtcAge();
    const { needCustomHeaders, needCustomColumns } = useNeedCustomColumns(
        PAGE_PARAMETERS.addressDetailsTxs
    );
    const {
        currentChain,
        currentAddress,
        addressTxsLoading,
        addressPageisDisabled,
        loadingCondition,
        addressTxsList,
        onPaginationChange,
        subTitle,
        showMoreIcon
    } = useGetAddressTxs(pagination);
    const { exportAddressTxs } = useExportAddressTxs();
</script>

<style lang="less" scoped>
    .txs_table {
        &__tx_hash {
            .iconfont {
                display: inline-block;
                margin-right: 4px;
                font-size: var(--bj-font-size-sub-title);
            }
        }
        &__hash {
            color: var(--bj-text-second);
            &:hover {
                color: var(--bj-primary-color);
            }
        }
        &__success {
            color: var(--bj-success);
        }
        &__failed {
            color: var(--bj-failed);
        }
        &__tag {
            margin-right: 4px;
            min-width: 28px;
            min-height: 16px;
            font-size: var(--bj-font-size-small);
            font-family: GolosUI_Medium;
            border-radius: 8px;
        }
        &__in_style {
            color: var(--bj-in-color);
            background: var(--bj-in-color-o-10);
        }
        &__out_style {
            color: var(--bj-out-color);
            background: var(--bj-out-color-o-10);
        }
        &__icon {
            width: 16px;
            height: 16px;
            line-height: 16px;
            color: #fff;
            background: var(--bj-primary-color);
            border-radius: 50%;
        }
        :deep(.ant-table-thead) {
            tr {
                .ant-table-cell {
                    background: #f8fafd !important;
                }
            }
        }
        :deep(.ant-table-cell) {
            &:first-child {
                padding-left: 16px;
            }
            &:last-child {
                padding-right: 16px;
            }
        }
    }
</style>
