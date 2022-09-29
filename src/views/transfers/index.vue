<template>
    <PageContainer class="transfer">
        <PageTitle title="IBC Token Transfers" :subtitle="isIbcTxTotalAndHashFilter" />
        <div class="transfer__middle relative">
            <div class="transfer__middle__top">
                <div class="transfer__middle__left">
                    <BjSelect
                        :data="tokenData"
                        :value="searchToken"
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
                        :status="JSON.stringify(queryParam.status)"
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
                    <ResetButton @on-reset="onClickReset" />
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
                                        ? `/tokens/details?denom=${record.base_denom}&chain=${record.dc_chain_id}`
                                        : `/tokens/details?denom=${record.base_denom}&chain=${record.sc_chain_id}`
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
                            <span class="status_tips">
                                <span class="status_log">Status:</span>
                                <span
                                    v-for="(item, index) in IBC_TX_STATUS_DESC"
                                    :key="index"
                                    class="status_tip"
                                >
                                    <img :src="getImageUrl(item.status)" alt="" />
                                    <span>{{ item.label }}</span>
                                </span>
                            </span>
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
        TRANSFERS_STATUS_OPTIONS,
        IBC_TX_STATUS,
        IBC_TX_STATUS_DESC,
        UNKNOWN_SYMBOL,
        TX_STATUS_NUMBER,
        CHAINNAME,
        CHAIN_DEFAULT_VALUE,
        TOTAL_BOUND,
        CHAIN_DEFAULT_ICON,
        TOKEN_DEFAULT_ICON,
        TIP_ICON,
        PAGE_PARAMETERS
    } from '@/constants';
    import { JSONparse, getRestString, formatNum, rmIbcPrefix } from '@/helper/parseStringHelper';
    import ChainHelper from '@/helper/chainHelper';
    import { dayjsFormatDate } from '@/utils/timeTools';
    import { usePagination, useGetTableColumns } from './composable';
    import { useIbcStatistics } from '@/composables/home';
    import dayjs from 'dayjs';
    import { urlParser } from '@/utils/urlTools';
    import { useGetIbcDenoms, useIbcChains, useNeedCustomColumns } from '@/composables';
    import { IIbcTx } from '@/types/interface/transfers.interface';
    import { axiosCancel } from '@/utils/axios';
    import { IDataItem, TDenom } from '@/components/BjSelect/interface';
    import { MODES } from '@/components/BjSelect/constants';
    import { TRANSFERS_TOKEN_DEFAULT_VALUE } from '@/constants/transfers';

    const { ibcBaseDenomsSorted } = useGetIbcDenoms();
    const { ibcStatisticsTxs, getIbcStatistics } = useIbcStatistics();
    const { pagination } = usePagination();
    const { ibcChains } = useIbcChains();
    const { tableColumns, showTransferLoading, tableDatas, getIbcTxs } = useGetTableColumns();
    const chainDropdown = ref();
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.transfers
    );
    getIbcStatistics();

    const pickerPlaceholderColor = ref('var(--bj-text-second)');

    let paramsStatus = null,
        paramsSymbol: string | null = null,
        paramsDenom: string | null = null,
        startTimestamp = 0,
        endTimestamp = 0;
    const dateRange = reactive({ value: [] });
    let isHashFilterParams = ref(false);
    let ibcTxTotalMoreThan500k = ref(false);
    let pageNum = 1,
        pageSize = 10;
    let url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
    const route = useRoute();
    const router = useRouter();

    const getImageUrl = (status: string | number) => {
        return new URL(`../../assets/home/status${status}.png`, import.meta.url).href;
    };

    const searchToken = ref<string | undefined>();
    let chainId = route?.query.chain;
    if (chainId) {
        url += `&chain=${chainId}`;
    }
    if (route?.query?.denom) {
        url += `&denom=${route.query.denom}`;
        paramsDenom = route?.query.denom as string;
    }
    if (
        route?.query?.symbol &&
        (route?.query?.symbol as string)?.toLowerCase() !== UNKNOWN_SYMBOL
    ) {
        url += `&symbol=${route.query.symbol}`;
        paramsSymbol = route?.query.symbol as string;
        searchToken.value = paramsSymbol;
    } else if (paramsDenom && rmIbcPrefix(paramsDenom as string).length) {
        searchToken.value = rmIbcPrefix(paramsDenom as string);
    }
    if (route?.query?.status) {
        const defaultOptions = TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS;
        const successOptions = TRANSFERS_STATUS_OPTIONS.SUCCESS_OPTIONS;
        const failedOptions = TRANSFERS_STATUS_OPTIONS.FAILED_OPTIONS;
        const processingOptions = TRANSFERS_STATUS_OPTIONS.PROCESSING_OPTIONS;
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
        status: paramsStatus || TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS,
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

        getIbcTxs({
            use_count: true,
            ...params,
            page_num: 1,
            page_size: 10
        })
            .then((data) => {
                pagination.total = data as number;
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                if (
                    !params.chain_id &&
                    !params.denom &&
                    !params.symbol &&
                    params.status === TX_STATUS_NUMBER.defaultStatus &&
                    isDateDefaultValue
                ) {
                    isHashFilterParams.value = false;
                } else {
                    isHashFilterParams.value = true;
                }
            });

        getIbcTxs({
            page_num: pagination.current,
            page_size: pagination.pageSize,
            use_count: false,
            ...params
        })
            .then((data) => {
                tableDatas.value = data as IIbcTx[];
                showTransferLoading.value = false;
            })
            .catch((error) => {
                if (!axiosCancel(error)) {
                    showTransferLoading.value = false;
                }
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
        if (ibcTxTotalMoreThan500k.value) {
            if (isHashFilterParams.value) {
                if (pagination.total === TOTAL_BOUND) {
                    return 'Last 500k transfers found';
                }
                return `${pagination.total} of the last 500k transfers found`;
            }
            return 'Last 500k transfers found';
        } else {
            if (isHashFilterParams.value) {
                return `${pagination.total} of the ${ibcStatisticsTxs.tx_all.count} transfers found`;
            }
            return `A total of ${ibcStatisticsTxs.tx_all.count} transfers found`;
        }
    });
    const setAllChains = (ibcChains: any) => {
        if (ibcChains?.value?.all) {
            const cosmosChain = ibcChains.value.all.filter(
                (item: any) => item.chain_name === CHAINNAME.COSMOSHUB
            );
            const irishubChain = ibcChains.value.all.filter(
                (item: any) => item.chain_name === CHAINNAME.IRISHUB
            );
            let notIncludesIrisAndCosmosChains: any = [];
            ibcChains.value.all.forEach((item: any) => {
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
    setAllChains(ibcChains);
    watch(
        () => ibcChains,
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
                return result.icon || CHAIN_DEFAULT_ICON;
            }
        }
        return CHAIN_DEFAULT_ICON;
    };
    const handleSelectChange = (item: any) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Status');

        pagination.current = 1;
        queryParam.status = item ? JSONparse(item) : item;
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;
        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== UNKNOWN_SYMBOL) {
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
        (window as any).gtag('event', 'Transfers-点击过滤条件Date');

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
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== UNKNOWN_SYMBOL) {
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
    const onPaginationChange = (current: number, pageSize: number) => {
        (window as any).gtag('event', 'Transfers-点击翻页器');

        pagination.current = current;
        const params: any = urlParser(url);
        url = `/transfers?pageNum=${current}&pageSize=${pageSize}`;

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
            .then((data) => {
                tableDatas.value = data as IIbcTx[];
                showTransferLoading.value = false;
            })
            .catch((error) => {
                if (!axiosCancel(error)) {
                    showTransferLoading.value = false;
                }
                console.log(error);
            });
    };
    const onClickReset = () => {
        chainDropdown.value.selectedChain = [];
        dateRange.value = [];
        queryParam.date_range = [];
        queryParam.status = TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS;
        queryParam.chain_id = undefined;
        queryParam.symbol = undefined;
        queryParam.denom = undefined;
        pagination.current = 1;
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;
        router.replace(url);
        chainIds.value = [];
        searchToken.value = undefined;
        queryDatas();
    };

    const chainIds = ref<TDenom[]>(chainId ? (chainId as string).split(',') : []);
    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        doubleTime: true,
                        id: CHAIN_DEFAULT_VALUE,
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v) => ({
                    title: v.chain_name,
                    id: v.chain_id,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const chainGetPopupContainer = (): HTMLElement => document.querySelector('.transfer__middle')!;

    const onSelectedChain = (vals: IDataItem[]) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Chain');

        chainIds.value = vals?.map((v) => v.id);
        const chain_id = chainIds.value.join(',');

        queryParam.chain_id = chain_id !== 'allchain,allchain' ? chain_id : '';
        pagination.current = 1;
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;

        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== UNKNOWN_SYMBOL) {
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
        if (newValue?.tx_all?.count <= TOTAL_BOUND) {
            ibcTxTotalMoreThan500k.value = false;
        } else {
            ibcTxTotalMoreThan500k.value = true;
        }
    });

    const tokenData = computed(() => {
        return [
            {
                groupName: '',
                children: [
                    {
                        title: 'All Tokens',
                        id: '',
                        metaData: null
                    }
                ]
            },
            {
                groupName: 'Authed IBC Tokens',
                children: ibcBaseDenomsSorted.value.map((v) => ({
                    title: v.symbol,
                    id: v.symbol,
                    icon: v.icon || TOKEN_DEFAULT_ICON,
                    metaData: v
                }))
            },
            {
                groupName: 'Custom IBC Tokens',
                children: [
                    {
                        id: 'Others',
                        title: 'Others',
                        icon: TOKEN_DEFAULT_ICON
                    }
                ]
            }
        ];
    });

    const onSelectedToken = (val?: IDataItem) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Token');
        pagination.current = 1;
        const id = String(val?.id || '');
        searchToken.value = id;
        if (val?.inputFlag) {
            queryParam.symbol = undefined;
            queryParam.denom = id ? `ibc/${id.toUpperCase()}` : undefined;
        } else {
            queryParam.symbol = id || undefined;
            queryParam.denom = undefined;
        }
        url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
        if (queryParam?.chain_id) {
            url += `&chain=${queryParam.chain_id}`;
        }
        if (queryParam?.denom) {
            url += `&denom=${queryParam.denom}`;
        }
        if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== UNKNOWN_SYMBOL) {
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
        .thead_border_bottom {
            position: absolute;
            top: 48px;
            left: 0;
            right: 0;
            background: var(--bj-border-color);
            height: 1px;
            z-index: 1;
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
                padding: 16px;
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
                padding: 16px;
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
