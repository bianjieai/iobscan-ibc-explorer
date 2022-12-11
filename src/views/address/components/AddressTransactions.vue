<template>
    <InfoCard
        icon="icon-transactions"
        title="Transactions"
        tip-msg="Display ICS-20 related transactions"
        :sub-title="subTitle"
        download-tip="The latest 1,000 records will be exported"
    >
        <!-- todo shan 需要传递加载的结果状态 -->
        <TableCommon
            class="txs_table"
            :has-padding-lr="false"
            :data="addressTxsList"
            :columns="ADDRESS_TXS_COLUMN"
            :table-loading="addressTxsLoading"
            :need-custom-headers="needCustomHeaders"
            :need-custom-columns="needCustomColumns"
            :is-launch-timer="!showUtc"
            :real-time-key="[
                {
                    scKey: ADDRESS_TXS_KEY.time,
                    dcKey: 'txs_tx_time'
                }
            ]"
            :page-loading="addressPageisDisabled"
            :current="pagination.current"
            :page-size="pagination.pageSize"
            row-key="tx_hash"
            @on-page-change="onPaginationChange"
        >
            <!-- 
                todo shan 需看下传递 total 的问题:
                :total="pagination.total"
            -->
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
                            <!-- todo shan 确认 tx_hash 的前几后几展示方案 -->
                            <span>{{ getRestString(record.tx_hash, 3, 8) }}</span>
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
                        class="txs_table__tag"
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
                <TokenInfo :token-info="record.denom_info" :type="column.title" />
            </template>
            <template #fee_info="{ record, column }">
                <TokenInfo :token-info="record.fee_info" :type="column.title" />
            </template>
            <template #tx_time="{ record }">
                <span v-if="showUtc">{{ record.format_tx_time }}</span>
                <span v-else>{{ record.txs_tx_time }}</span>
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
    import { ADDRESS_TXS_KEY, ADDRESS_TXS_COLUMN, IN_OUT_TAG } from '@/constants/address';
    import { getRestString } from '@/helper/parseStringHelper';
    import { useGetAddressTxs } from '../composable';
    const { pagination } = usePagination();
    const { showUtc, changeShowUtcAge } = useTimeUtcAge();
    const { needCustomHeaders, needCustomColumns } = useNeedCustomColumns(
        PAGE_PARAMETERS.addressDetails
    );
    const {
        currentChain,
        currentAddress,
        addressTxsLoading,
        addressPageisDisabled,
        // loadingCondition,
        addressTxsList,
        onPaginationChange,
        subTitle
    } = useGetAddressTxs(pagination);
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
        &__success {
            color: var(--bj-success);
        }
        &__failed {
            color: var(--bj-failed);
        }
        :deep(.ant-table-thead) {
            tr {
                .ant-table-cell {
                    background: #f8fafd !important;
                }
            }
        }
        :deep(.ant-table-cell) {
            &:last-child {
                padding-right: 16px;
            }
        }
    }
</style>
