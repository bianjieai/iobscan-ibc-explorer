<template>
    <InfoCard icon="icon-transactions" title="Transactions" :sub-title="rtTableSubTitle">
        <div class="relayer_transfer">
            <div class="relayer_transfer__search">
                <BjSelect
                    ref="relayerChainDropdown"
                    :placeholder="defaultChain?.title || DEFAULT_TITLE.defaultChains"
                    :hide-icon="true"
                    :data="relayerChainData"
                    :value="searchChain || defaultChain?.id"
                    :dropdown-props="{
                        getPopupContainer: getPopupContainer
                    }"
                    :is-disabled="isShowModal || relayerChainNoSupport"
                    :default-value="defaultChain"
                    @on-change="onSelectedChain"
                />
                <div class="relayer_transfer__search_wrap">
                    <RangePicker
                        :date-range="dateRange"
                        :disabled-date="disabledDate"
                        :is-show-modal="isShowModal || relayerChainNoSupport"
                        @change="onChangeRangePicker"
                    ></RangePicker>
                    <TypeButton
                        class="relayer_transfer__reset_btn"
                        :is-disabled="isShowModal || relayerChainNoSupport"
                        @on-reset="onClickReset"
                    />
                </div>
            </div>
            <div class="relayer_transfer__table">
                <!-- todo shan 表格无数据、加载错误、加载中状态修改，在表格内部完成 -->
                <loading-component
                    v-if="rtTableLoading && !relayerTransferTableData"
                    :type="LoadingType.container"
                    :height="300"
                />
                <no-datas
                    v-else-if="isShowModal || rtNoDataType"
                    class="relayer_transfer__table__nodatas"
                    :type="rtNoDataType"
                />
                <TableCommon
                    v-else
                    class="relayer_transfer__table__content"
                    :has-padding-lr="false"
                    :table-loading="rtTableLoading"
                    :page-loading="rtPageLoading"
                    :data="relayerTransferTableData"
                    row-key="record_id"
                    :need-custom-headers="needCustomHeaders"
                    :need-custom-columns="needCustomColumns"
                    :columns="RELAYER_TRANSFER_COLUMN"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    :total="pagination.total"
                    :is-launch-timer="!showUtc"
                    :real-time-key="[
                        {
                            scKey: 'tx_time',
                            dcKey: 'relayers_tx_time'
                        }
                    ]"
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
                        <a-popover placement="topLeft" destroy-tooltip-on-hide>
                            <template #content>
                                <span class="popover_c">{{ record.tx_hash }}</span>
                            </template>
                            <router-link
                                class="relayer_transfer__table__tx_hash cursor"
                                :to="`/transfers/details?txhash=${record.tx_hash}`"
                                >{{ getRestString(record.tx_hash, 4, 4) }}</router-link
                            >
                        </a-popover>
                    </template>
                    <template #tx_type="{ record }">
                        <span>{{ formatTransferType(record.tx_type) }}</span>
                    </template>
                    <template #chain="{ record, column }">
                        <ChainIcon :chain="record[column.key]" icon-size="small" />
                    </template>
                    <template #denom_info="{ record, column }">
                        <TokenInfo :token-info="record.denom_info" :type="column.title" />
                    </template>
                    <template #fee_info="{ record, column }">
                        <TokenInfo :token-info="record.fee_info" :type="column.title" />
                    </template>
                    <template #tx_status="{ record }">
                        <span
                            class="relayer_transfer__table__tx_status"
                            :class="changeColor(record.tx_status)"
                        >
                            {{ formatTxStatus(record.tx_status) }}
                        </span>
                    </template>
                    <template #signer="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.signer }}</p>
                                </div>
                            </template>
                            <span
                                :class="{ cursor: judgeIsAddressCursor(record.signer) }"
                                @click="goAddressDetails(record.signer)"
                                >{{ getRestString(record.signer, 6, 6) }}</span
                            >
                        </a-popover>
                    </template>
                    <template #tx_time="{ record }">
                        <span v-if="showUtc">{{ record.format_tx_time }}</span>
                        <span v-else>{{ record.relayers_tx_time }}</span>
                    </template>
                </TableCommon>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { RELAYER_TRANSFER_COLUMN } from '@/constants/relayers';
    import { getRestString } from '@/helper/parseStringHelper';
    import { formatTxStatus, changeColor } from '@/helper/tableCellHelper';
    import {
        useGoAddressDetail,
        useNeedCustomColumns,
        usePagination,
        useTimeUtcAge,
        formatTransferType
    } from '@/composables';
    import { useSelectedSearch } from '../composable';
    import { DEFAULT_TITLE, LoadingType, PAGE_PARAMETERS } from '@/constants';
    interface IRelayerTransfer {
        servedChainsInfo: string[];
        isShowModal: boolean;
    }
    const props = defineProps<IRelayerTransfer>();
    const { servedChainsInfo } = toRefs(props);
    const { pagination } = usePagination();
    const {
        defaultChain,
        relayerChainData,
        relayerChainNoSupport,
        searchChain,
        onSelectedChain,
        relayerTransferTableData,
        onPaginationChange,
        onClickReset,
        dateRange,
        disabledDate,
        onChangeRangePicker,
        rtTableLoading,
        rtPageLoading,
        rtTableSubTitle,
        rtNoDataType
    } = useSelectedSearch(servedChainsInfo, pagination);
    const getPopupContainer = (): HTMLElement =>
        document.querySelector('.relayer_transfer__search')!;
    const { needCustomHeaders, needCustomColumns } = useNeedCustomColumns(
        PAGE_PARAMETERS.relayerDetails
    );
    const { goAddressDetails, judgeIsAddressCursor } = useGoAddressDetail();
    const { showUtc, changeShowUtcAge } = useTimeUtcAge();
</script>

<style lang="less" scoped>
    .relayer_transfer {
        &__search {
            .flex(row, nowrap, flex-start, center);
            :deep(.overlay) {
                padding-right: 12px;
                min-height: 100px !important;
            }
        }
        &__search_wrap {
            .flex(row, nowrap, flex-start, center);
            margin-left: 8px;
        }
        :deep(.ant-picker-disabled) {
            background: #fff;
            &:hover {
                border-color: var(--bj-border-color);
            }
        }
        &__reset_btn {
            margin-left: 8px;
        }
        &__table {
            &__content {
                :deep(.ant-table-thead) {
                    tr {
                        th {
                            background: #f8fafd !important;
                        }
                    }
                }
                :deep(.ant-table-cell) {
                    &:nth-of-type(1) {
                        padding-left: 16px;
                    }
                    &:last-child {
                        padding-right: 16px;
                    }
                }
                :deep(.ant-table-container) {
                    min-height: 300px;
                }
            }
            &__tx_hash {
                color: var(--bj-text-second);
                &:hover {
                    color: var(--bj-primary-color);
                }
            }
        }
    }
    .success_color {
        font-family: GolosUI_Medium;
        color: var(--bj-success);
    }
    .failed_color {
        font-family: GolosUI_Medium;
        color: var(--bj-failed);
    }
    @media screen and (max-width: 500px) {
        .relayer_transfer {
            &__search {
                flex-wrap: wrap;
            }
            &__search_wrap {
                margin-top: 8px;
                margin-left: 0;
                width: 100%;
            }
            &__range_picker {
            }
            &__reset_btn {
            }
            &__table {
                &__content {
                }
                &__tx_hash {
                }
            }
        }
    }
</style>
