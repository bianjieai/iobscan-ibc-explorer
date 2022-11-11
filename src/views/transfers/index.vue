<template>
    <PageContainer class="transfer">
        <PageTitle title="IBC Token Transfers" :subtitle="isIbcTxTotalAndHashFilter" />
        <div class="transfer__middle relative">
            <div class="transfer__middle__top">
                <div class="transfer__middle__left">
                    <BjSelect
                        :data="tokenData"
                        :value="searchToken"
                        :input-flag="inputFlag"
                        :change-input-flag="changeInputFlag"
                        placeholder="All Tokens"
                        :input-ctn="{
                            title: 'Custom IBC Tokens',
                            toolTip: 'Hash (in hex format) of the denomination trace information.',
                            placeholder: 'Search by ibc/hash',
                            btnTxt: 'Confirm',
                            icon: TIP_ICON
                        }"
                        :select-color-default-val="TRANSFERS_TOKEN_DEFAULT_VALUE"
                        :dropdown-props="{
                            getPopupContainer: chainGetPopupContainer
                        }"
                        @on-change="onSelectedToken"
                    />
                    <BjSelect
                        ref="chainDropdown"
                        :data="chainData"
                        :value="chainIds"
                        :placeholders="['All Chains', 'All Chains']"
                        :hide-icon="true"
                        :badges="['Transfer', 'Receive']"
                        :mode="MODES.double"
                        associate-id="allchain"
                        :input-ctn="{
                            placeholder: 'Search by Chain ID,Chain ID',
                            btnTxt: 'Confirm'
                        }"
                        :select-color-default-val="[CHAIN_DEFAULT_VALUE, CHAIN_DEFAULT_VALUE]"
                        :dropdown-props="{
                            getPopupContainer: chainGetPopupContainer
                        }"
                        @on-change="onSelectedChain"
                    />
                    <BaseDropdown
                        :status="JSON.stringify(queryParams.status)"
                        :options="IBC_TX_STATUS_SELECT_OPTIONS"
                        @on-selected-change="handleSelectChange"
                    />
                </div>
                <div class="transfer__middle__right">
                    <a-range-picker
                        :value="(dateRange.value as any)"
                        :disabled-date="disabledDate"
                        class="date_range cursor"
                        :allow-clear="false"
                        format="YYYY-MM-DD"
                        separator="-"
                        :placeholder="['Start Date', 'End Date']"
                        @change="onChangeRangePicker"
                        @open-change="onOpenChangeRangePicker"
                    >
                        <template #suffixIcon>
                            <svg
                                style="
                                    positon: absolute;
                                    left: 10px;
                                    top: 13px;
                                    width: 18px;
                                    height: 18px;
                                "
                                t="1635216291915"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1016"
                                width="200"
                                height="200"
                            >
                                <path
                                    d="M291.584 633.7024h438.0672c26.2144 0 47.2576-21.504 47.2576-47.9744a47.6672 47.6672 0 0 0-47.2576-48.0256H291.584a47.616 47.616 0 0 0-47.1552 48.0256 47.616 47.616 0 0 0 47.1552 48.0256z m438.0672 74.0864H291.584a45.568 45.568 0 0 0-33.1264 13.824 49.664 49.664 0 0 0-14.0288 34.304 47.616 47.616 0 0 0 47.1552 47.9744h438.0672a45.568 45.568 0 0 0 33.1776-13.7728 49.664 49.664 0 0 0 14.08-34.2016 49.664 49.664 0 0 0-14.08-34.304 45.568 45.568 0 0 0-33.1776-13.824z m-385.536-503.7568a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.136-20.5824-49.3568-45.9264-49.3568-25.3952 0-45.9776 22.2208-45.9776 49.3568V154.624a49.8176 49.8176 0 0 0 13.2096 34.6112c8.6016 9.2672 20.3776 14.592 32.768 14.7456z m333.312 0a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.1872-20.5824-49.3568-45.9776-49.3568-25.344 0-45.9264 22.2208-45.9264 49.3568V154.624a49.8176 49.8176 0 0 0 13.1584 34.6112c8.6016 9.2672 20.4288 14.592 32.768 14.7456zM475.4944 150.0672h70.1952a47.616 47.616 0 0 0 47.2576-47.9744 47.6672 47.6672 0 0 0-47.2576-48.0256H475.5456a47.616 47.616 0 0 0-47.2064 48.0256 47.616 47.616 0 0 0 47.2064 47.9744z"
                                    p-id="1017"
                                    fill="#A4ABC0"
                                ></path>
                                <path
                                    d="M970.3424 102.0928a47.2064 47.2064 0 0 0-11.5712-30.4128c-0.8704-1.0752-1.2288-2.4064-2.2528-3.3792-0.8704-0.9728-2.1504-1.4336-3.1232-2.304a43.7248 43.7248 0 0 0-29.1328-12.032l-0.6144 0.1024-0.7168-0.1024H806.912a47.5648 47.5648 0 0 0-47.2064 47.9744 47.616 47.616 0 0 0 47.2064 48.0256h71.3216v157.0304H143.1552V150.0672H214.528a47.616 47.616 0 0 0 47.2576-47.9744 47.616 47.616 0 0 0-47.2576-48.0256H98.5088l-0.8192 0.1536-0.6144-0.1536a43.1104 43.1104 0 0 0-29.0816 12.032c-0.7168 0.768-2.1504 1.3312-2.8672 2.2528-1.024 0.9728-1.536 2.304-2.4064 3.328A47.872 47.872 0 0 0 51.2 102.0928l0.1024 0.6144L51.2 103.424v871.1168l0.1024 0.768L51.2 975.872c0.2048 11.264 4.3008 22.016 11.52 30.4128 0.8704 1.1264 1.28 2.3552 2.2528 3.3792 0.8704 1.024 2.0992 1.3312 3.1232 2.3552A44.6464 44.6464 0 0 0 97.28 1024l0.6656-0.1536 0.6656 0.1536h824.32c0.3072 0 0.512-0.256 0.768-0.256 0.256 0 0.512 0.256 0.768 0.256a44.288 44.288 0 0 0 37.6832-22.8352c1.536-2.3552 3.328-4.352 4.4032-6.9632 1.3824-3.584 1.6384-7.68 2.2528-11.5712 0.3584-2.2016 1.28-4.1984 1.28-6.656v-0.256c0-0.3584 0.256-0.7168 0.256-1.1264V103.3728l-0.1024-0.6656c0-0.1536 0.1536-0.3584 0.1536-0.6144zM143.1552 403.0464h735.232v524.8H143.2064V403.0464z"
                                    p-id="1018"
                                    fill="#A4ABC0"
                                ></path>
                            </svg>
                        </template>
                    </a-range-picker>
                    <a-popover destroy-tooltip-on-hide>
                        <template #content>
                            <div>
                                <p class="popover_c">
                                    Date selection range from the first IBC Transfer to the latest
                                    IBC Transfer
                                </p>
                            </div>
                        </template>
                        <img class="tip cursor" :src="TIP_ICON" />
                    </a-popover>
                    <TypeButton @on-reset="onClickReset" />
                </div>
            </div>
            <div class="transfer__middle__bottom">
                <TableCommon
                    class="transfer__table"
                    :loading="showTransferLoading"
                    :data="tableDatas"
                    row-key="record_id"
                    :need-custom-headers="needCustomHeaders"
                    :need-custom-columns="needCustomColumns"
                    :columns="tableColumns"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    :total="pagination.total"
                    :custom-row="handleClickRow"
                    @on-page-change="onPaginationChange"
                >
                    <template #Token>
                        <div class="flex items-center">
                            <span class="cell_name">Token</span>
                            <a-popover destroy-tooltip-on-hide>
                                <template #content>
                                    <p class="popover_c">Sent Token</p>
                                </template>
                                <img
                                    class="tip cursor"
                                    style="margin-left: 8px"
                                    src="../../assets/tip.png"
                                />
                            </a-popover>
                        </div>
                    </template>
                    <template #token="{ record }">
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">
                                        <span class="tip_label">Sent Token:</span>
                                        <span class="tip_value">{{
                                            record.denoms.sc_denom || '--'
                                        }}</span>
                                    </p>
                                    <p class="popover_c">
                                        <span class="tip_label">Received Token:</span>
                                        <span class="tip_value">{{
                                            record.denoms.dc_denom || '--'
                                        }}</span>
                                    </p>
                                </div>
                            </template>
                            <router-link
                                class="token__link hover"
                                :to="
                                    record.status === IBC_TX_STATUS.SUCCESS
                                        ? `/tokens/details?denom=${record.base_denom}&denomChainId=${record.base_denom_chain_id}&chain=${record.dc_chain_id}`
                                        : `/tokens/details?denom=${record.base_denom}&denomChainId=${record.base_denom_chain_id}&chain=${record.sc_chain_id}`
                                "
                                @click.stop=""
                            >
                                <img
                                    class="token__icon"
                                    :src="record.symbolIcon || TOKEN_DEFAULT_ICON"
                                />
                                <span class="token__info">
                                    <span class="token__info__num">{{
                                        formatNum(record.symbolNum)
                                    }}</span>
                                    <span class="token__info__denom">{{
                                        getRestString(record.symbolDenom, 6, 0)
                                    }}</span>
                                </span>
                            </router-link>
                        </a-popover>
                    </template>
                    <template #fromTxhash="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.sc_tx_info.hash }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.sc_tx_info.hash, 4, 4)
                            }}</span>
                        </a-popover>
                    </template>
                    <template #from="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.sc_addr }}</p>
                                </div>
                            </template>
                            <span>{{ getRestString(record.sc_addr, 3, 8) || '--' }}</span>
                        </a-popover>
                    </template>
                    <template #status="{ record }">
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">
                                        <span class="tip_label">Chain ID:</span>
                                        <span class="tip_value">{{
                                            ChainHelper.formatChainId(record.sc_chain_id)
                                        }}</span>
                                    </p>
                                    <p class="popover_c">
                                        <span class="tip_label">Channel ID:</span>
                                        <span class="tip_value">{{
                                            record.sc_channel || '--'
                                        }}</span>
                                    </p>
                                    <p class="popover_c">
                                        <span class="tip_label">Sequence:</span>
                                        <span class="tip_value">{{ record.sequence || '--' }}</span>
                                    </p>
                                </div>
                            </template>
                            <router-link :to="`/chains`" @click.stop="">
                                <img
                                    class="status_icon"
                                    :src="findIbcChainIcon(record.sc_chain_id)"
                                />
                            </router-link>
                        </a-popover>
                        <img
                            class="status_icon"
                            style="margin: 0 20px; width: 18px"
                            :src="getImageUrl(record.status)"
                        />
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">
                                        <span class="tip_label">Chain ID:</span>
                                        <span class="tip_value">{{
                                            ChainHelper.formatChainId(record.dc_chain_id)
                                        }}</span>
                                    </p>
                                    <p class="popover_c">
                                        <span class="tip_label">Channel ID:</span>
                                        <span class="tip_value">{{
                                            record.dc_channel || '--'
                                        }}</span>
                                    </p>
                                    <p class="popover_c">
                                        <span class="tip_label">Sequence:</span>
                                        <span class="tip_value">{{ record.sequence || '--' }}</span>
                                    </p>
                                </div>
                            </template>
                            <router-link :to="`/chains`" @click.stop="">
                                <img
                                    class="status_icon"
                                    :src="findIbcChainIcon(record.dc_chain_id)"
                                />
                            </router-link>
                        </a-popover>
                    </template>
                    <template #to="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.dc_addr || '--' }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.dc_addr, 3, 8) || '--'
                            }}</span>
                        </a-popover>
                    </template>
                    <template #toTxHash="{ record }">
                        <a-popover v-if="record.dc_tx_info.hash" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.dc_tx_info.hash || '--' }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.dc_tx_info.hash, 4, 4) || '--'
                            }}</span>
                        </a-popover>
                        <span v-else>--</span>
                    </template>
                    <template #createTime="{ record }">
                        <span>{{ dayjsFormatDate(record.tx_time * 1000) }}</span>
                    </template>
                    <template #endTime="{ record }">
                        <span>{{
                            record.end_time ? dayjsFormatDate(record.end_time * 1000) : '--'
                        }}</span>
                    </template>
                    <template v-if="tableDatas?.length !== 0" #table_bottom_status>
                        <div class="transfer__bottom">
                            <BottomStatus
                                :status-data="BOTTOM_STATUS_DATA.transferStatusData"
                                :height="8"
                            />
                        </div>
                    </template>
                </TableCommon>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    // Todo shan merge master
    import {
        IBC_TX_STATUS_SELECT_OPTIONS,
        IBC_TX_STATUS,
        CHAIN_DEFAULT_VALUE,
        TOKEN_DEFAULT_ICON,
        TIP_ICON,
        PAGE_PARAMETERS,
        BOTTOM_STATUS_DATA
    } from '@/constants';
    import { getRestString, formatNum } from '@/helper/parseStringHelper';
    import ChainHelper from '@/helper/chainHelper';
    import { dayjsFormatDate } from '@/utils/timeTools';
    import {
        usePagination,
        useGetTableColumns,
        useSubTitleFilter,
        useSelectedParams,
        useTransfersTable,
        useQueryDatas,
        useRouteParams,
        useSortIbcChains
    } from './composable';
    import { useIbcStatistics } from '@/composables/home';
    import { useIbcChains, useNeedCustomColumns, usePickerPlaceholder } from '@/composables';
    import { MODES } from '@/components/BjSelect/constants';
    import { TRANSFERS_TOKEN_DEFAULT_VALUE } from '@/constants/transfers';

    const { ibcStatisticsTxs, getIbcStatistics } = useIbcStatistics();
    const { pagination } = usePagination();
    const { ibcChains } = useIbcChains();
    const { tableColumns, showTransferLoading, tableDatas, getIbcTxs } = useGetTableColumns();
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.transfers
    );
    getIbcStatistics();
    const { pickerPlaceholderColor, onOpenChangeRangePicker } = usePickerPlaceholder();
    useSortIbcChains(ibcChains);
    const { url, searchToken, inputFlag, dateRange, chainId, queryParams } = useRouteParams();
    const { isHashFilterParams, isIbcTxTotalAndHashFilter } = useSubTitleFilter(
        pagination,
        ibcStatisticsTxs
    );
    const { queryDatas, getIbcTxsData } = useQueryDatas(
        showTransferLoading,
        pagination,
        getIbcTxs,
        isHashFilterParams,
        tableDatas,
        queryParams
    );
    const {
        chainDropdown,
        chainIds,
        chainGetPopupContainer,
        tokenData,
        chainData,
        changeInputFlag,
        disabledDate,
        onSelectedToken,
        onSelectedChain,
        handleSelectChange,
        onChangeRangePicker,
        onClickReset
    } = useSelectedParams(
        pagination,
        ibcChains,
        queryParams,
        searchToken,
        chainId,
        url,
        inputFlag,
        dateRange,
        queryDatas
    );
    const { handleClickRow, onPaginationChange, getImageUrl, findIbcChainIcon } = useTransfersTable(
        pagination,
        url,
        getIbcTxsData,
        queryParams,
        ibcChains
    );
</script>

<style lang="less" scoped>
    .transfer {
        &__middle {
            margin-top: 32px;
            &__top {
                .flex(row, nowrap, flex-start, center);
            }
            &__left {
                .flex(row, nowrap, flex-start, center);
                .ant-select {
                    width: 146px;
                }
                :deep(.ant-dropdown-trigger) {
                    margin-right: 8px;
                }
            }
            &__right {
                .flex(row, nowrap, center, center);
                & .tip {
                    margin-left: 7px;
                }
                & button {
                    margin-left: 16px;
                    width: 32px;
                    height: 32px;
                }
            }
            &__bottom {
                position: relative;
                margin-top: 16px;
            }
        }
        &__table {
            font-size: 14px;
            font-weight: 400;
            :deep(.ant-table-thead tr th) {
                border-bottom: 0;
                &:first-child {
                    padding-left: 0;
                }
            }
            :deep(.ant-table-tbody tr td) {
                &:first-child {
                    padding-left: 0;
                }
            }
            :deep(.ant-table-placeholder) {
                min-height: 500px;
            }
            :deep(a, span) {
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: var(--bj-font-color-65);
                line-height: 14px;
            }
            .cell_name {
                font-size: var(--bj-font-size-sub-title);
                line-height: 20px;
            }
            .token {
                background: red;
                &__link {
                    .flex(row, nowrap, flex-start, center);
                    &:hover {
                        .token__info {
                            &__num {
                                color: var(--bj-primary-color);
                            }
                            &__denom {
                                color: var(--bj-primary-color);
                            }
                        }
                    }
                }
                &__icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                &__info {
                    .flex(column, nowrap, center, flex-start);
                    font-family: GolosUI_Medium;
                    &__num {
                        font-size: var(--bj-font-size-sub-title);
                        color: var(--bj-text-normal);
                        line-height: 20px;
                    }

                    &__denom {
                        margin-top: 1px;
                        font-size: var(--bj-font-size-normal);
                        color: var(--bj-text-third);
                        line-height: 18px;
                    }
                }
            }
            .status_icon {
                width: 24px;
            }
        }
        &__bottom {
            .flex(row, nowrap, space-between, center);
            font-family: GolosUI_Medium;
            background: #ffffff;
            border-radius: var(--border-radius-normal);
            & .status_tips {
                .flex(row, nowrap, space-between, center);
                padding: 7px 9px;
                width: 396px;
                font-size: 14px;
                font-weight: 400;
                color: var(--bj-text-third);
                line-height: 14px;
                background: #f8f9fc;
                border-radius: 14px;
                .status_tip {
                    .flex(row, wrap, flex-start, center);
                    img {
                        margin-right: 8px;
                        height: 8px;
                    }
                }
                .status_img {
                    width: 22px;
                    margin: 0 16px;
                }
            }
            & :deep(.table_pagination) {
                li {
                    margin-bottom: 8px;
                }
            }
        }
    }

    .date_range {
        margin-right: 8px;
        width: 250px;
        height: 36px;
        &:hover {
            border-color: var(--bj-primary-color);
        }
        :deep(.ant-picker-input > input) {
            font-family: GolosUIWebRegular;
            color: var(--bj-primary-color);
            text-align: center;
            &::placeholder {
                // color: var(--bj-text-second);
                color: v-bind(pickerPlaceholderColor);
            }
        }
        border: 1px solid var(--bj-border-color);
    }
    .tip {
        width: 20px;
        &_color {
            color: var(--bj-font-color-65);
        }
    }
    :deep(.ant-table-row) {
        &:hover {
            cursor: pointer;
        }
    }
    :deep(tbody) {
        .ant-table-cell {
            vertical-align: middle;
        }
    }
    .tip_label {
        font-family: GolosUI_Medium;
    }
    .tip_value {
        margin-left: 4px;
    }
    @media screen and (max-width: 1260px) {
        .transfer {
            &__middle {
                &__top {
                }
                &__left {
                    .ant-select {
                    }
                }
                &__right {
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                }
            }
            &__table {
                width: 100%;
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                :deep(table) {
                    width: 1200px;
                    background-color: #fff;
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                & .status_tips {
                    .status_tip {
                    }
                }
                & .table_pagination {
                }
            }
        }
    }
    @media screen and (max-width: 970px) {
        .transfer {
            &__middle {
                &__top {
                    .flex(column, nowrap, flex-start, flex-start);
                }
                &__left {
                    .ant-select {
                    }
                }
                &__right {
                    margin-top: 12px;
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                }
            }
            &__table {
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                :deep(table) {
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                .flex(column, nowrap, flex-start, flex-start);
                & .status_tips {
                    .status_tip {
                    }
                }
                & .table_pagination {
                    margin-top: 16px;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .transfer {
            :deep(.page_title_container) {
                display: inline-flex;
                text-align: left;
                .flex {
                    display: block;
                }
                .icon {
                    display: none;
                }
                .inline_icon {
                    display: block;
                }
                .title_p {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    margin-right: 0;
                    margin-bottom: 8px;
                }
                .number {
                    display: block;
                }
            }
            &__middle {
                margin-top: 24px;
                &__top {
                }
                &__left {
                    .ant-select {
                    }
                }
                &__right {
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                }
            }
            &__table {
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                & .status_tips {
                    .status_log {
                    }
                    .status_tip {
                        margin-left: 0;
                    }
                }
                & .table_pagination {
                }
            }
        }
    }
    @media screen and (max-width: 582px) {
        .transfer {
            padding: 24px 16px 60px;
            &__middle {
                &__top {
                }
                &__left {
                    flex-wrap: wrap;
                    .ant-select {
                        margin-left: 0;
                        margin-top: 12px;
                    }
                    :deep(.default_color) {
                        .chain_wrap {
                            .selected_color {
                                white-space: nowrap;
                            }
                        }
                    }
                }
                &__right {
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                    :deep(.ant-table-content) {
                        margin: 0 16px;
                    }
                }
            }
            &__table {
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                & .status_tips {
                    width: 100%;
                    justify-content: flex-start;
                    .status_log {
                    }
                    .status_tip {
                        margin-left: 8px;
                    }
                }
                & .table_pagination {
                }
            }
        }
    }
    @media screen and (max-width: 420px) {
        .transfer {
            &__middle {
                &__top {
                }
                &__left {
                    .ant-select {
                        width: 210px;
                    }
                    :deep(.default_color) {
                        justify-content: center;
                        margin-top: 12px;
                        min-width: 210px;
                        .chain_wrap {
                            .selected_color {
                                flex: 0 1 auto !important;
                                max-width: 72px;
                                text-align: center !important;
                            }
                        }
                    }
                }
                &__right {
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                }
            }
            &__table {
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                & .status_tips {
                    flex-wrap: wrap;
                    justify-content: space-between;
                    padding-bottom: 0;
                    .status_log {
                        width: 100%;
                        margin-bottom: 8px;
                    }
                    .status_tip {
                        margin-left: 0;
                        margin-bottom: 8px;
                    }
                }
                & .table_pagination {
                }
            }
        }
        .date_range {
            width: 210px;
        }
    }
    @media screen and (max-width: 340px) {
        .transfer {
            &__middle {
                &__top {
                }
                &__left {
                    .ant-select {
                    }
                    :deep(.default_color) {
                        .chain_wrap {
                            .selected_color {
                            }
                        }
                    }
                }
                &__right {
                    & .tip {
                    }
                    & button {
                    }
                }
                &__bottom {
                }
            }
            &__table {
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                .token {
                    &__icon {
                    }
                    &__num {
                    }
                    &__denom {
                    }
                }
                .status_icon {
                }
            }
            &__bottom {
                & .status_tips {
                    .status_log {
                    }
                    .status_tip {
                        width: 50%;
                    }
                }
                & .table_pagination {
                }
            }
        }
        .date_range {
        }
    }
</style>
