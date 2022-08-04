<template>
    <!-- todo 页面组件重构，后续再处理 -->
    <!-- todo duanjie class="transfer"  设置了样式，看能不能复用 PageContainer 保持统一 -->
    <div class="transfer">
        <div class="transfer__header">
            <!-- todo duanjie 看能不能复用 PageTitle -->
            <div class="transfer__header__container">
                <div class="transfer__header__line">
                    <p class="transfer__header__title">
                        IBC Token Transfer
                        <span class="transfer__header__num">
                            <i class="iconfont icon-shujuliebiao"></i>
                            {{ `${isIbcTxTotalAndHashFilter}` }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="transfer__middle">
            <div class="transfer__middle__top">
                <div class="transfer__middle__left">
                    <!-- todo duanjie 看能否使用 TokensDropDown 复用 -->
                    <drop-down
                        class="dropdown_token"
                        :ibc-base-denoms="ibcBaseDenomsSorted"
                        :selected-symbol="selectedSymbol"
                        :show-icon="isShowSymbolIcon"
                        :clear-input="clearInput"
                        @click-item="onClickDropdownItem"
                        @click-search="(item) => onClickDropdownItem(item, 'customToken')"
                    />
                    <chains-dropdown
                        ref="chainDropdown"
                        :selected-double="selectedDouble"
                        :need-badge="needBadge"
                        :dropdown-data="ibcChains.all"
                        :chain_id="chainId"
                        :witch-page="PAGE_PARAMETERS.transfers"
                        @on-selected-chain="onSelectedChain"
                    />
                    <!-- todo duanjie 看能否使用 BaseDropdown 复用  -->
                    <a-select
                        class="status_select"
                        default-active-first-option
                        :value="JSON.stringify(queryParam.status)"
                        :get-popup-container="(triggerNode: any) => triggerNode.parentNode"
                        @change="handleSelectChange"
                    >
                        <a-select-option
                            v-for="item of ibcTxStatusSelectOptions"
                            :key="item.title"
                            :value="item.value"
                            ><span
                                :class="
                                    item.title === defaultTitle.defaultStatus
                                        ? 'status_select_default'
                                        : 'status_select_title'
                                "
                                >{{ item.title }}</span
                            >
                        </a-select-option>
                    </a-select>
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
                                <p class="tip_color">
                                    Date selection range from the first IBC Transfer to the latest
                                    IBC Transfer
                                </p>
                            </div>
                        </template>
                        <img class="tip cursor" src="../../assets/tip.png" />
                    </a-popover>
                    <!-- todo duanjie 看能不能复用 ResetButton -->
                    <a-button type="primary" @click="onClickReset">
                        <template #icon>
                            <svg
                                t="1635235094959"
                                class="icon"
                                viewBox="0 0 1137 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1018"
                                width="20"
                                height="20"
                                style="margin: 3px 0 0 0"
                            >
                                <path
                                    d="M187.443357 408.766317a400.463607 400.463607 0 0 0 84.448801 365.489861 392.957046 392.957046 0 0 0 348.315761 132.274687 56.469804 56.469804 0 0 1 62.554667 49.020112 56.754144 56.754144 0 0 1-47.769018 63.692025 505.271108 505.271108 0 0 1-447.83455-169.978092 514.824912 514.824912 0 0 1-108.61765-469.842419l-67.331569-18.197721a15.240592 15.240592 0 0 1-7.392824-24.794396l187.038455-212.572133a14.956252 14.956252 0 0 1 25.988621 6.994749l56.469804 278.425138a15.240592 15.240592 0 0 1-4.435695 14.046366 14.956252 14.956252 0 0 1-14.103234 3.639544l-67.331569-18.197721z m762.484527 206.089195a400.463607 400.463607 0 0 0-84.448801-365.489861 392.957046 392.957046 0 0 0-348.315761-132.274687 56.185465 56.185465 0 0 1-52.716525-21.439191 57.265955 57.265955 0 0 1-7.392824-56.811011 56.469804 56.469804 0 0 1 45.380568-34.461935 505.271108 505.271108 0 0 1 447.777682 169.978091 514.824912 514.824912 0 0 1 108.61765 469.842419l67.331569 18.197722a15.240592 15.240592 0 0 1 7.392824 24.794395l-187.038455 212.572133a14.956252 14.956252 0 0 1-25.988621-6.994749l-56.469804-278.425137a15.240592 15.240592 0 0 1 4.435694-14.046366 14.956252 14.956252 0 0 1 14.103234-3.639545l67.33157 18.197722z"
                                    p-id="1019"
                                    fill="#ffffff"
                                ></path>
                            </svg>
                        </template>
                    </a-button>
                </div>
            </div>
            <div class="transfer__middle__bottom">
                <!-- todo duanjie 表格看能否复用  -->
                <a-table
                    class="transfer__table"
                    style="width: 100%"
                    :row-key="(record: any) => record.record_id"
                    :columns="tableColumns"
                    :loading="showTransferLoading"
                    :data-source="tableDatas"
                    :pagination="false"
                    :custom-row="handleClickRow"
                >
                    <template #customTitle>
                        <p>
                            Token
                            <a-popover destroy-tooltip-on-hide>
                                <template #content>
                                    <div>
                                        <p class="tip_color">Sent Token</p>
                                    </div>
                                </template>
                                <img
                                    class="tip cursor"
                                    style="margin-left: 8px"
                                    src="../../assets/tip.png"
                                />
                            </a-popover>
                        </p>
                    </template>
                    <template #token="{ record }">
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color"
                                        >Sent Token: {{ record.denoms.sc_denom || '--' }}</p
                                    >
                                    <p class="tip_color"
                                        >Received Token: {{ record.denoms.dc_denom || '--' }}</p
                                    >
                                </div>
                            </template>
                            <router-link
                                class="token__link hover"
                                :to="
                                    record.status === ibcTxStatus.SUCCESS
                                        ? `/tokens/details?denom=${record.base_denom}&chain=${record.dc_chain_id}`
                                        : `/tokens/details?denom=${record.base_denom}&chain=${record.sc_chain_id}`
                                "
                                @click.stop=""
                            >
                                <img
                                    class="token__icon"
                                    :src="record.symbolIcon || chainDefaultImg"
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
                    <template #hashOut="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.sc_tx_info.hash }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.sc_tx_info.hash, 4, 4)
                            }}</span>
                        </a-popover>
                    </template>
                    <template #out="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.sc_addr }}</p>
                                </div>
                            </template>
                            <span>{{ getRestString(record.sc_addr, 3, 8) || '--' }}</span>
                        </a-popover>
                    </template>
                    <template #status="{ record }">
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color"
                                        >Chain ID：{{
                                            ChainHelper.formatChainId(record.sc_chain_id)
                                        }}</p
                                    >
                                    <p class="tip_color"
                                        >Channel ID: {{ record.sc_channel || '--' }}</p
                                    >
                                    <p class="tip_color">Sequence: {{ record.sequence || '--' }}</p>
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
                            style="margin: 0 20px"
                            :src="getImageUrl(record.status)"
                        />
                        <a-popover placement="right" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color"
                                        >Chain ID：{{
                                            ChainHelper.formatChainId(record.dc_chain_id)
                                        }}</p
                                    >
                                    <p class="tip_color"
                                        >Channel ID: {{ record.dc_channel || '--' }}</p
                                    >
                                    <p class="tip_color">Sequence: {{ record.sequence || '--' }}</p>
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
                    <template #hashIn="{ record }">
                        <a-popover v-if="record.dc_tx_info.hash" destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.dc_tx_info.hash || '--' }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.dc_tx_info.hash, 4, 4) || '--'
                            }}</span>
                        </a-popover>
                        <span v-else>--</span>
                    </template>
                    <template #in="{ record }">
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.dc_addr || '--' }}</p>
                                </div>
                            </template>
                            <span class="cursor">{{
                                getRestString(record.dc_addr, 3, 8) || '--'
                            }}</span>
                        </a-popover>
                    </template>
                    <template #time="{ record }">
                        <span>{{ dayjsFormatDate(record.tx_time * 1000) }}</span>
                    </template>
                    <template #endTime="{ record }">
                        <span>{{
                            record.end_time ? dayjsFormatDate(record.end_time * 1000) : '--'
                        }}</span>
                    </template>
                </a-table>
            </div>
        </div>
        <!-- todo duanjie 状态和分页看能否复用  -->
        <div v-if="tableCount" class="transfer__bottom">
            <span class="status_tips">
                <span class="status_log">Status:</span>
                <span v-for="(item, index) in ibcTxStatusDesc" :key="index" class="status_tip">
                    <img :src="getImageUrl(item.status)" alt="" />
                    <span>{{ item.label }}</span>
                </span>
            </span>
            <a-pagination
                v-model:current="pagination.current"
                class="table_pagination"
                :class="{ disable_table_pagination: showTransferLoading }"
                :total="pagination.total"
                :show-title="false"
                :disabled="showTransferLoading"
                @change="onPaginationChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import DropDown from './components/DropDown.vue';
    import {
        ibcTxStatusSelectOptions,
        transfersStatusOptions,
        ibcTxStatus,
        ibcTxStatusDesc,
        defaultTitle,
        unknownSymbol,
        PAGE_PARAMETERS,
        txStatusNumber,
        CHAINNAME
    } from '@/constants';
    import chainDefaultImg from '@/assets/home/chain-default.png';
    import { JSONparse, getRestString, formatNum, rmIbcPrefix } from '@/helper/parseStringHelper';
    import ChainHelper from '@/helper/chainHelper';
    import { useGetIbcDenoms } from '@/views/home/composable';
    import { dayjsFormatDate } from '@/utils/timeTools';
    import {
        useIbcTxs,
        useIbcDenoms,
        useSelectedSymbol,
        usePagination,
        useGetTableColumns
    } from './composable';
    import { useIbcStatistics } from '@/composables/home';
    import dayjs from 'dayjs';
    import { urlParser } from '@/utils/urlTools';
    import { useIbcChains } from '@/composables';

    const { ibcBaseDenomsSorted } = useGetIbcDenoms();
    const { ibcStatisticsTxs } = useIbcStatistics();
    const { tableCount, getIbcTxs } = useIbcTxs();
    const { ibcDenoms } = useIbcDenoms();
    const { selectedSymbol, isShowSymbolIcon, clearInput, isShowChainIcon } = useSelectedSymbol();
    const { pagination } = usePagination();
    const { ibcChains } = useIbcChains();
    const { tableColumns, showTransferLoading, tableDatas } = useGetTableColumns();
    const chainDropdown = ref();
    const selectedDouble = ref(true);
    const needBadge = ref(true);

    const pickerPlaceholderColor = ref('var(--bj-text-second)');

    let paramsStatus = null,
        paramsSymbol: string | null = null,
        paramsDenom = null,
        startTimestamp = 0,
        endTimestamp = 0;
    const dateRange = reactive({ value: [] });
    const maxTableLength = ref(500000);
    let isHashFilterParams = ref(false);
    let ibcTxTotalMoreThan500k = ref(true);
    let pageNum = 1,
        pageSize = 10;
    let url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
    const route = useRoute();
    const router = useRouter();

    const getImageUrl = (status: string | number) => {
        return new URL(`../../assets/home/status${status}.png`, import.meta.url).href;
    };

    let chainId = route?.query.chain;
    if (chainId) {
        url += `&chain=${chainId}`;
    }
    if (route?.query?.denom) {
        url += `&denom=${route.query.denom}`;
        paramsDenom = route?.query.denom;
    }
    if (route?.query?.symbol && (route?.query?.symbol as any)?.toLowerCase() !== unknownSymbol) {
        url += `&symbol=${route.query.symbol}`;
        paramsSymbol = route?.query.symbol as string;
        watch(ibcDenoms, (newValue) => {
            if (newValue?.length) {
                newValue?.forEach((item: any) => {
                    if (item?.symbol === paramsSymbol) {
                        selectedSymbol.value = item.symbol;
                        isShowSymbolIcon.value = true;
                    }
                });
            }
        });
    } else if (paramsDenom && rmIbcPrefix(paramsDenom as string).length) {
        selectedSymbol.value = getRestString(rmIbcPrefix(paramsDenom as string), 4, 4);
    }
    if (route?.query?.status) {
        const defaultOptions = transfersStatusOptions.DEFAULT_OPTIONS;
        const successOptions = transfersStatusOptions.SUCCESS_OPTIONS;
        const failedOptions = transfersStatusOptions.FAILED_OPTIONS;
        const processingOptions = transfersStatusOptions.PROCESSING_OPTIONS;
        paramsStatus = (route?.query?.status as string).split(',');
        switch (JSON.stringify(paramsStatus)) {
            case JSON.stringify(successOptions):
                paramsStatus = successOptions;
                break;
            case JSON.stringify(failedOptions):
                paramsStatus = failedOptions;
                break;
            case JSON.stringify(processingOptions):
                paramsStatus = processingOptions;
                break;
            default:
                paramsStatus = defaultOptions;
                break;
        }
        url += `&status=${paramsStatus}`;
    }

    if (route?.query?.startTime) {
        url += `&startTime=${route.query.startTime}`;
        startTimestamp = dayjs(route.query.startTime as any).unix();
    }

    if (route?.query?.endTime) {
        url += `&endTime=${route.query.endTime}`;
        endTimestamp = dayjs(route.query.endTime as any)
            .endOf('day')
            .unix();
    }

    if (startTimestamp && endTimestamp) {
        dateRange.value = [dayjs(startTimestamp * 1000), dayjs(endTimestamp * 1000)] as any;
    }
    const queryParam = reactive({
        date_range:
            startTimestamp && endTimestamp
                ? [startTimestamp, endTimestamp]
                : [0, Math.floor(new Date().getTime() / 1000)],
        status: paramsStatus || transfersStatusOptions.DEFAULT_OPTIONS,
        chain_id: chainId || undefined,
        symbol: paramsSymbol || undefined,
        denom: paramsDenom || undefined
    });

    const queryDatas = () => {
        showTransferLoading.value = true;
        let isDateDefaultValue = false;
        if (queryParam.date_range?.length === 2) {
            const startTime = queryParam.date_range[0];
            if (!startTime) {
                isDateDefaultValue = true;
            }
        } else if (queryParam.date_range.length === 0) {
            isDateDefaultValue = true;
        }
        const params = {
            status: queryParam.status?.toString(),
            chain_id: queryParam.chain_id,
            date_range: queryParam.date_range?.toString(),
            symbol: queryParam.symbol,
            denom: queryParam.denom
        };
        isHashFilterParams.value = false;
        if (
            !params.chain_id &&
            !params.denom &&
            !params.symbol &&
            params.status === txStatusNumber.defaultStatus &&
            isDateDefaultValue
        ) {
            isHashFilterParams.value = true;
        }

        getIbcTxs({
            use_count: true,
            ...params
        })
            .then((data) => {
                tableCount.value = data as number;
                pagination.total = data as number;
            })
            .catch((error) => {
                console.log(error);
            });

        getIbcTxs({
            page_num: pagination.current,
            page_size: pagination.pageSize,
            use_count: false,
            ...params
        })
            .then(() => {
                showTransferLoading.value = false;
            })
            .catch((error) => {
                showTransferLoading.value = false;
                console.log(error);
            });
    };
    queryDatas();
    const startTime = (time: any) => {
        const nowTimeDate = new Date(time);
        return nowTimeDate.setHours(0, 0, 0, 0);
    };

    const disabledDate = (current: any) =>
        current && (current > dayjs().endOf('day') || current < dayjs(1617007625 * 1000));

    const isIbcTxTotalAndHashFilter = computed(() => {
        if (!ibcTxTotalMoreThan500k.value && !isHashFilterParams.value) {
            return `A total of ${ibcStatisticsTxs.tx_all.count} transfers found`;
        } else if (!ibcTxTotalMoreThan500k.value && isHashFilterParams.value) {
            return `${tableCount} of the ${ibcStatisticsTxs.tx_all.count} transfers found`;
        } else if (ibcTxTotalMoreThan500k.value && isHashFilterParams.value) {
            return 'Last 500k transfers found';
        } else if (ibcTxTotalMoreThan500k.value && !isHashFilterParams.value) {
            return `${tableCount} of the last 500k transfers found`;
        } else {
            return '';
        }
    });
    const setAllChains = (allChains: any) => {
        if (allChains?.value?.all) {
            const cosmosChain = allChains.value.all.filter(
                (item: any) => item.chain_name === CHAINNAME.COSMOSHUB
            );
            const irishubChain = allChains.value.all.filter(
                (item: any) => item.chain_name === CHAINNAME.IRISHUB
            );
            let notIncludesIrisAndCosmosChains: any = [];
            allChains.value.all.forEach((item: any) => {
                if (
                    item.chain_name !== CHAINNAME.COSMOSHUB &&
                    item.chain_name !== CHAINNAME.IRISHUB
                ) {
                    notIncludesIrisAndCosmosChains.push(item);
                }
            });
            if (notIncludesIrisAndCosmosChains?.length) {
                notIncludesIrisAndCosmosChains.sort((a: any, b: any) => {
                    return a.chain_name.toLowerCase() < b.chain_name.toLowerCase()
                        ? -1
                        : a.chain_name.toLowerCase() > b.chain_name.toLowerCase()
                        ? 1
                        : 0;
                });
            }
            ibcChains.value.all = [
                ...cosmosChain,
                ...irishubChain,
                ...notIncludesIrisAndCosmosChains
            ];
        }
    };
    let allChains = ibcChains;
    setAllChains(allChains);
    watch(
        () => allChains,
        (newValue) => {
            if (newValue?.value?.all) {
                setAllChains(newValue);
            }
        }
    );
    const findIbcChainIcon = (chainId: string) => {
        if (ibcChains && ibcChains.value.all) {
            const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
            if (result) {
                return result.icon || chainDefaultImg;
            }
        }
        return chainDefaultImg;
    };
    const onClickDropdownItem = (item: any, custom: any) => {
        pagination.current = 1;
        isShowSymbolIcon.value = !custom;
        selectedSymbol.value = item || defaultTitle.defaultTokens;
        if (item === defaultTitle.defaultTokens) {
            queryParam.symbol = undefined;
        } else if (custom) {
            if (item && item.length && item.length > 8) {
                selectedSymbol.value = getRestString(item, 4, 4);
            }
            queryParam.symbol = undefined;
            queryParam.denom = item ? `ibc/${item.toUpperCase()}` : undefined;
        } else {
            queryParam.symbol = item;
            queryParam.denom = undefined;
        }
        queryDatas();

        url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
            url += `&symbol=${queryParam.symbol}`;
        }
        if (queryParam?.status) {
            url += `&status=${queryParam.status.join(',')}`;
        }
        if (queryParam?.date_range?.length) {
            if (queryParam?.date_range.length === 1) {
                const timeStamp = queryParam.date_range[0];
                const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=&endTime=${endTime}`;
            }
            if (queryParam?.date_range.length === 2) {
                const startTimeStamp = queryParam.date_range[0];
                const entTimeStamp = queryParam.date_range[1];
                const startTime = startTimeStamp
                    ? dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
                    : '';
                const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=${startTime}&endTime=${endTime}`;
            }
        }
        router.replace(url);
    };
    const handleSelectChange = (item: any) => {
        pagination.current = 1;
        queryParam.status = JSONparse(item);
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;
        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
            url += `&symbol=${queryParam.symbol}`;
        }
        if (queryParam?.status) {
            url += `&status=${queryParam.status.join(',')}`;
        }
        if (queryParam?.date_range?.length) {
            if (queryParam?.date_range.length === 1) {
                const timeStamp = queryParam.date_range[0];
                const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=&endTime=${endTime}`;
            }
            if (queryParam?.date_range.length === 2) {
                const startTimeStamp = queryParam.date_range[0];
                const entTimeStamp = queryParam.date_range[1];
                const startTime = startTimeStamp
                    ? dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
                    : '';
                const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=${startTime}&endTime=${endTime}`;
            }
        }
        router.replace(url);
        queryDatas();
    };

    const onOpenChangeRangePicker = (open: boolean) => {
        pickerPlaceholderColor.value = open ? 'var(--bj-text-third)' : 'var(--bj-text-second)';
    };

    const onChangeRangePicker = (dates: any) => {
        pagination.current = 1;
        dateRange.value = dates;
        queryParam.date_range[0] = Math.floor(startTime(dayjs(dates[0]).valueOf()) / 1000);
        queryParam.date_range[1] = Math.floor(
            startTime(dayjs(dates[1]).valueOf()) / 1000 + 60 * 60 * 24 - 1
        );
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;

        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
            url += `&symbol=${queryParam.symbol}`;
        }
        if (queryParam?.status) {
            url += `&status=${queryParam.status.join(',')}`;
        }
        if (queryParam?.date_range?.length) {
            if (queryParam?.date_range.length === 1) {
                const timeStamp = queryParam.date_range[0];
                const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=&endTime=${endTime}`;
            }
            if (queryParam?.date_range.length === 2) {
                const startTimeStamp = queryParam.date_range[0];
                const entTimeStamp = queryParam.date_range[1];
                const startTime = dayjs(startTimeStamp * 1000).format('YYYY-MM-DD');
                const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=${startTime}&endTime=${endTime}`;
            }
        }
        router.replace(url);
        queryDatas();
    };
    const onPaginationChange = (page: any) => {
        pagination.current = page;
        const params: any = urlParser(url);
        url = `/transfers?pageNum=${page}&pageSize=${pageSize}`;

        if (params?.chain) {
            url += `&chain=${params.chain}`;
        }
        if (params?.denom) {
            url += `&denom=${params.denom}`;
        }
        if (params?.symbol) {
            url += `&symbol=${params.symbol}`;
        }
        if (params?.status) {
            url += `&status=${params.status}`;
        }
        if (params?.startTime || params.startTime === '') {
            url += `&startTime=${params.startTime}`;
        }
        if (params?.endTime || params.endTime === '') {
            url += `&endTime=${params.endTime}`;
        }
        router.replace(url);
        showTransferLoading.value = true;
        getIbcTxs({
            page_num: pagination.current,
            page_size: pagination.pageSize,
            use_count: false,
            ...queryParam
        })
            .then(() => {
                showTransferLoading.value = false;
            })
            .catch((error) => {
                showTransferLoading.value = false;
                console.log(error);
            });
    };
    const onClickReset = () => {
        isShowChainIcon.value = false;
        isShowSymbolIcon.value = false;
        clearInput.value += 1;
        chainDropdown.value.selectedChain = [];
        selectedSymbol.value = defaultTitle.defaultTokens;
        dateRange.value = [];
        queryParam.date_range = [];
        queryParam.status = transfersStatusOptions.DEFAULT_OPTIONS;
        queryParam.chain_id = undefined;
        queryParam.symbol = undefined;
        queryParam.denom = undefined;
        pagination.current = 1;
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;
        router.replace(url);
        queryDatas();
    };
    const onSelectedChain = (chain_id: any) => {
        queryParam.chain_id = chain_id !== 'allchain,allchain' ? chain_id : '';
        pagination.current = 1;
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;

        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
            url += `&symbol=${queryParam.symbol}`;
        }
        if (queryParam?.status) {
            url += `&status=${queryParam.status.join(',')}`;
        }
        if (queryParam?.date_range?.length) {
            if (queryParam?.date_range.length === 1) {
                const timeStamp = queryParam.date_range[0];
                const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD');
                url += `&startTime=&endTime=${endTime}`;
            }
            if (queryParam?.date_range.length === 2) {
                const startTimeStamp = queryParam.date_range[0];
                const entTimeStamp = queryParam.date_range[1];
                const startTime =
                    startTimeStamp > 0 ? dayjs(startTimeStamp * 1000).format('YYYY-MM-DD') : '';
                const endTime =
                    entTimeStamp > 0 ? dayjs(entTimeStamp * 1000).format('YYYY-MM-DD') : '';
                url += `&startTime=${startTime}&endTime=${endTime}`;
            }
        }
        router.replace(url);
        queryDatas();
    };

    const handleClickRow = (record: any) => {
        return {
            onClick: () => {
                router.push(`/transfers/details?hash=${record.sc_tx_info.hash}`);
            }
        };
    };

    watch(ibcStatisticsTxs, (newValue) => {
        if (newValue?.tx_all?.count < maxTableLength.value) {
            ibcTxTotalMoreThan500k.value = false;
        }
        ibcTxTotalMoreThan500k.value = true;
    });
</script>

<style lang="less" scoped>
    .transfer {
        flex: 1;
        padding: 48px 32px 100px;
        width: 100%;
        text-align: left;
        background-color: #f5f7fc;
        &__header {
            width: 100%;
            &__container {
                position: relative;
                margin: 0 auto;
                width: 100%;
                max-width: 1200px;
            }
            &__line {
                position: absolute;
                top: 11px;
                display: inline-block;
                height: 12px;
                background: linear-gradient(
                    90deg,
                    rgba(112, 136, 255, 0) 0%,
                    rgba(61, 80, 255, 0.15) 100%
                );
                border-radius: 5px;
            }
            &__title {
                position: relative;
                top: -11px;
                padding-right: 16px;
                font-size: var(--bj-font-size-title);
                font-weight: 400;
                color: #000000;
                line-height: 20px;
            }
            &__num {
                margin-left: 12px;
                font-size: var(--bj-font-size-normal);
                color: var(--bj-font-color-65);
            }
        }
        &__middle {
            margin: 48px auto 0;
            max-width: 1200px;
            &__top {
                .flex(row, nowrap, flex-start, center);
            }
            &__left {
                .flex(row, nowrap, flex-start, center);
                .ant-select {
                    width: 146px;
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
                margin-top: 16px;
            }
        }
        &__table {
            font-size: 14px;
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            :deep(.ant-table-placeholder) {
                // .flex(column, nowrap, center, center);
                min-height: 500px;
            }
            :deep(a, span) {
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: var(--bj-font-color-65);
                line-height: 14px;
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
                    &__num {
                        font-size: var(--bj-font-size-normal);
                        color: var(--bj-text-second);
                    }

                    &__denom {
                        margin-top: 4px;
                        font-size: var(--bj-font-size-normal);
                        font-family: Montserrat-Regular, Montserrat;
                        color: var(--bj-text-third);
                    }
                }
            }
            .status_icon {
                width: 22px;
            }
        }
        &__bottom {
            .flex(row, nowrap, space-between, center);
            margin: 0 auto;
            padding: 16px 24px;
            max-width: 1200px;
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
                text-align: right;
                li {
                    width: initial;
                    height: 24px;
                    min-width: 24px;
                    line-height: 24px;
                    box-sizing: border-box;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                li button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ant-pagination-item {
                    border: none;
                }

                .ant-pagination-item-active {
                    border: 1px solid var(--bj-primary-color);
                }

                .ant-pagination-options {
                    display: none !important;
                }
            }
            & :deep(.disable_table_pagination) {
                .ant-pagination-item-active {
                    border: none;
                }
            }
        }
    }
    .status_select {
        width: 146px;
        margin: 0 8px;
        color: var(--bj-text-second);
        :deep(.ant-select-arrow) {
            right: 8px;
            color: rgba(164, 171, 192, 1);
        }
        :deep(.ant-select-selector) {
            height: 36px !important;
            border: 1px solid var(--bj-border-color);
            .ant-select-selection-item {
                text-align: center;
                line-height: 34px;
            }
            .ant-select-selection-search {
                border-right: 1px solid var(--bj-border-color);
            }

            &_default {
                color: var(--bj-text-second);
            }
            .status_select_title {
                color: var(--bj-primary-color);
            }
        }
        .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
            .ant-select-selector {
            box-shadow: none;
        }
    }

    .date_range {
        margin-right: 8px;
        width: 250px;
        height: 36px;
        :deep(.ant-picker-input > input) {
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
    @media screen and (max-width: 1200px) {
        .transfer {
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                }
                &__num {
                }
            }
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
                overflow-x: auto;
                :deep(.ant-table-placeholder) {
                }
                :deep(a, span) {
                }
                :deep(table) {
                    width: 1200px;
                    background-color: #fff;
                }
                &::-webkit-scrollbar {
                    height: 4px;
                }

                &::-webkit-scrollbar-track {
                    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
                    border-radius: 2px;
                    height: 6px;
                    background: rgba(61, 80, 255, 0.1);
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 4px;
                    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
                    background: rgba(61, 80, 255, 0.5);
                }

                &::-webkit-scrollbar-thumb:window-inactive {
                    background: rgba(61, 80, 255, 0.9);
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
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
    }
    @media screen and (max-width: 970px) {
        .transfer {
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                }
                &__num {
                }
            }
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
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
    }
    @media screen and (max-width: 768px) {
        .transfer {
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                    .flex(column, nowrap, flex-start, flex-start);
                }
                &__num {
                    margin-top: 12px;
                    margin-left: 0;
                }
            }
            &__middle {
                margin-top: 72px;
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
                padding: 16px;
                & .status_tips {
                    .status_log {
                    }

                    .status_tip {
                        margin-left: 0;
                    }
                }
                & .table_pagination {
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
    }
    @media screen and (max-width: 582px) {
        .transfer {
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                }
                &__num {
                }
            }
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
                padding: 8px;
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
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
    }
    @media screen and (max-width: 420px) {
        .transfer {
            padding: 24px 16px 80px;
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                }
                &__num {
                }
            }
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
            &_bottom {
                & .status_tips {
                    flex-wrap: wrap;
                    justify-content: space-between;
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
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
        .date_range {
            width: 210px;
        }
    }
    @media screen and (max-width: 340px) {
        .transfer {
            &__header {
                &__container {
                }
                &__line {
                }
                &__title {
                }
                &__num {
                }
            }
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
                    :deep(.ant-pagination-options) {
                    }
                }
            }
        }
        .status_select {
            :deep(.ant-select-selector) {
            }
            :deep(.ant-select-selection-item) {
            }
            :deep(.ant-select-selection-search) {
            }
            :deep(.ant-select-arrow) {
            }
        }
        .date_range {
        }
    }
</style>
