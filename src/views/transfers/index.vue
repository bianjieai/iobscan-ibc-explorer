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
                        :value="chains"
                        :placeholders="['All Chains', 'All Chains']"
                        :hide-icon="true"
                        :badges="['Transfer', 'Receive']"
                        :mode="MODES.double"
                        associate-id="allchain"
                        :input-ctn="{
                            placeholder: 'Search by Chain Name,Chain Name',
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
                    <RangePicker
                        :date-range="dateRange"
                        :disabled-date="disabledDate"
                        @change="onChangeRangePicker"
                    ></RangePicker>
                    <a-tooltip>
                        <template #title>
                            <div>
                                <p class="popover_c">
                                    Supports filtering within the latest 500k transfers found.
                                </p>
                            </div>
                        </template>
                        <img class="tip cursor" :src="TIP_ICON" />
                    </a-tooltip>
                    <TypeButton @on-reset="onClickReset" />
                </div>
            </div>
            <div class="transfer__middle__bottom">
                <TableCommon
                    class="transfer__table"
                    :table-loading="showTransferLoading"
                    :data="tableDatas"
                    row-key="record_id"
                    :need-custom-headers="needCustomHeaders"
                    :need-custom-columns="needCustomColumns"
                    :columns="tableColumns"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    :total="pagination.total"
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
                            <div
                                class="token__link hover"
                                @click="goTransfersDetails(record.sc_tx_info.hash)"
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
                            </div>
                        </a-popover>
                    </template>
                    <template #fromTxhash="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.sc_tx_info.hash }}</p>
                                </div>
                            </template>
                            <span
                                class="cursor primary_color"
                                @click="goTransfersDetails(record.sc_tx_info.hash)"
                                >{{ getRestString(record.sc_tx_info.hash, 4, 4) }}</span
                            >
                        </a-popover>
                    </template>
                    <template #from="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.sc_addr }}</p>
                                </div>
                            </template>
                            <span
                                class="transfer__table__address"
                                :class="{
                                    cursor: judgeIsAddressCursor(record.sc_addr, record.sc_chain)
                                }"
                                @click="goAddressDetails(record.sc_addr, record.sc_chain)"
                                >{{ getRestString(record.sc_addr, 6, 6) || '--' }}</span
                            >
                        </a-popover>
                    </template>
                    <template #status="{ record }">
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">
                                        <span class="tip_label">Chain ID:</span>
                                        <span class="tip_value">{{
                                            useMatchChainInfo(record.sc_chain).currentChainId
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
                                <img class="status_icon" :src="findIbcChainIcon(record.sc_chain)" />
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
                                            useMatchChainInfo(record.dc_chain).currentChainId
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
                                <img class="status_icon" :src="findIbcChainIcon(record.dc_chain)" />
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
                            <span
                                class="transfer__table__address"
                                :class="{
                                    cursor: judgeIsAddressCursor(record.dc_addr, record.dc_chain)
                                }"
                                @click="goAddressDetails(record.dc_addr, record.dc_chain)"
                                >{{ getRestString(record.dc_addr, 6, 6) || '--' }}</span
                            >
                        </a-popover>
                    </template>
                    <template #toTxHash="{ record }">
                        <a-popover v-if="record.dc_tx_info.hash" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="popover_c">{{ record.dc_tx_info.hash }}</p>
                                </div>
                            </template>
                            <span
                                class="cursor primary_color"
                                @click="goTransfersDetails(record.sc_tx_info.hash)"
                                >{{ getRestString(record.dc_tx_info.hash, 4, 4) }}</span
                            >
                        </a-popover>
                        <span
                            v-else
                            class="cursor"
                            @click="goTransfersDetails(record.sc_tx_info.hash)"
                            >--</span
                        >
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
    import {
        IBC_TX_STATUS_SELECT_OPTIONS,
        CHAIN_DEFAULT_VALUE,
        TOKEN_DEFAULT_ICON,
        TIP_ICON,
        PAGE_PARAMETERS,
        BOTTOM_STATUS_DATA
    } from '@/constants';
    import { getRestString, formatNum } from '@/helper/parseStringHelper';
    import { dayjsFormatDate } from '@/utils/timeTools';
    import {
        useGetTableColumns,
        useSubTitleFilter,
        useSelectedParams,
        useTransfersTable,
        useQueryDatas,
        useRouteParams,
        useSortIbcChains,
        useCurrentPage
    } from './composable';
    import { useIbcStatistics } from '@/composables/home';
    import {
        useIbcChains,
        useNeedCustomColumns,
        useMatchChainInfo,
        useGoTransfersDetail,
        usePagination
    } from '@/composables';
    import { MODES } from '@/components/BjSelect/constants';
    import { TRANSFERS_TOKEN_DEFAULT_VALUE } from '@/constants/transfers';
    import { useGoAddressDetail } from '@/composables';
    const { currentPage, pageSize } = useCurrentPage();
    const { goAddressDetails, judgeIsAddressCursor } = useGoAddressDetail();
    const { ibcStatisticsTxs, getIbcStatistics } = useIbcStatistics();
    const { pagination } = usePagination(currentPage, pageSize);
    const { ibcChains } = useIbcChains();
    const { tableColumns, showTransferLoading, tableDatas, getIbcTxs } = useGetTableColumns();
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.transfers
    );
    getIbcStatistics();
    useSortIbcChains(ibcChains);
    const { url, searchToken, inputFlag, dateRange, chain, queryParams } = useRouteParams();

    const {
        queryDatas,
        getIbcTxsData,
        isHashFilterParams,
        isShowValuedText,
        countLoading,
        txsValue
    } = useQueryDatas(showTransferLoading, pagination, getIbcTxs, tableDatas, queryParams);
    const { isIbcTxTotalAndHashFilter } = useSubTitleFilter(
        isHashFilterParams,
        pagination,
        ibcStatisticsTxs,
        isShowValuedText,
        countLoading,
        txsValue
    );
    const {
        chainDropdown,
        chains,
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
        chain,
        url,
        inputFlag,
        dateRange,
        queryDatas
    );
    const { onPaginationChange, getImageUrl, findIbcChainIcon } = useTransfersTable(
        pagination,
        url,
        getIbcTxsData,
        queryParams,
        ibcChains
    );
    const { goTransfersDetails } = useGoTransfersDetail();
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
            &__address {
                &:hover {
                    color: var(--bj-primary-color);
                }
            }
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
                &:last-child {
                    padding-right: 16px;
                }
                &:nth-last-child(2) {
                    padding-right: 16px;
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
                &__address {
                }
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
                &__address {
                }
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
            :deep(.page_title) {
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
                &__address {
                }
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
                &__address {
                }
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
                &__address {
                }
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
                &__address {
                }
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
    }
</style>
