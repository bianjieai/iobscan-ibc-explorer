<template>
    <div class="transfer">
        <div class="transfer_header">
            <div class="transfer_header_container">
                <div class="transfer_header_line">
                    <p class="transfer_header_title">
                        IBC Token Transfer List
                        <span class="transfer_header_num">
                            <i class="iconfont icon-shujuliebiao"></i>
                            {{ `${isIbcTxTotalAndHashFilter}`}}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="transfer_middle">
            <div class="transfer_middle_top">
                <div class="transfer_middle_left">
                    <dropdown
                        class="dropdown_token"
                        :type="'token'"
                        :ibcBaseDenoms="ibcBaseDenoms"
                        :options="tokens.value"
                        :selectedSymbol="selectedSymbol.value"
                        :showIcon="isShowSymbolIcon"
                        :clearInput="clearInput.value"
                        @clickItem="onClickDropdownItem"
                        @clickSearch="(type, item) => onClickDropdownItem(type, item, 'customToken')"
                    />
                    <chains-dropdown 
                        :selectedDouble="selectedDouble"
                        :needBadge="needBadge"
                        @onSelectedChain="onSelectedChain"
                        :dropdown-data="ibcChains.all"
                        :chain_id="chainId"
                        ref="chainDropdown"
                    />
                    <a-select
                        class="status_select"
                        defaultActiveFirstOption
                        :value="JSON.stringify(queryParam.status)"
                        @change="handleSelectChange"
                    >
                        <a-select-option
                            v-for="item of ibcTxStatusSelectOptions"
                            :key="item.title"
                            :value="item.value"
                        ><span :class="item.title ===defaultTitle.defaultStatus?'status_select_default':'status_select_title'">{{ item.title }}</span>
                        </a-select-option
                        >
                    </a-select>
                </div>
                <div class="transfer_middle_right">
                    <a-range-picker
                        :value="dateRange.value"
                        :disabledDate="disabledDate"
                        class="date_range hover"
                        :allowClear="false"
                        @change="onChangeRangePicker"
                        format="YYYY-MM-DD"
                        separator="-"
                    >
                        <template #suffixIcon>
                            <svg
                                style="positon:absolute; left: 10px; top: 13px; width: 18px; height: 18px;"
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
                    <a-popover destroyTooltipOnHide>
                        <template #content>
                            <div>
                                <p class="tip_color">
                                    Date selection range from the first IBC Transfer to the latest IBC Transfer
                                </p>
                            </div>
                        </template>
                        <img class="tip hover" src="../../assets/tip.png"/>
                    </a-popover>
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
                                style="margin: 3px 0 0 0;"
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
            <div class="transfer_middle_bottom">
                <a-table
                    class="transfer_table"
                    style="width: 100%"
                    :rowKey="record => record.record_id"
                    :columns="tableColumns"
                    :loading="isShowTransferLoading"
                    :data-source="tableDatas.value"
                    :pagination="false"
                >
                    <template #customTitle>
                        <p>
                            Token
                            <a-popover destroyTooltipOnHide>
                                <template #content>
                                    <div>
                                        <p class="tip_color">Sent Token</p>
                                    </div>
                                </template>
                                <img class="tip hover" style="margin-left: 8px;" src="../../assets/tip.png"/>
                            </a-popover>
                        </p>
                    </template>
                    <template class="token" #token="{ record }">
                        <a-popover placement="right" destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">Sent Token: {{ record.denoms.sc_denom || "--" }}</p>
                                    <p class="tip_color">Received Token: {{ record.denoms.dc_denom || "--" }}</p>
                                </div>
                            </template>
                            <router-link :to="record.status === ibcTxStatus['SUCCESS'] ? `/tokens/details?denom=${record.denoms.dc_denom}&chain=${record.dc_chain_id}` : `/tokens/details?denom=${record.denoms.sc_denom}&chain=${record.sc_chain_id}`">
                            <!-- <router-link :to="`/tokens/details?token=${record.denoms.sc_denom}`"> -->
                                <img
                                    class="token_icon hover"
                                    :src="record.symbolIcon || tokenDefaultImg"
                                />
                                <span class="token_num hover">{{
                                        formatNum(record.symbolNum)
                                    }}</span>
                                <span class="token_denom hover">{{
                                        getLasttyString(record.symbolDenom)
                                    }}</span>
                            </router-link>
                        </a-popover>
                    </template>
                    <template #hashOut="{ record }">
                        <a-popover destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.sc_tx_info.hash }}</p>
                                </div>
                            </template>
                            <router-link :to="`/transfers/details?hash=${record.sc_tx_info.hash}`">
                            <span class="hover">{{
                                    getRestString(record.sc_tx_info.hash, 4, 4)
                                }}</span>
                            </router-link>
                        </a-popover>
                    </template>
                    <template #out="{ record }">
                        <a-popover destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.sc_addr }}</p>
                                </div>
                            </template>
                            <span>{{ getRestString(record.sc_addr, 3, 8) || "--" }}</span>
                        </a-popover>
                    </template>
                    <template #status="{ record }">
                        <a-popover placement="right" destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">Chain ID：{{ record.sc_chain_id || "--" }}</p>
                                    <p class="tip_color">Channel ID: {{ record.sc_channel || "--" }}</p>
                                    <p class="tip_color">Sequence: {{ record.sequence || "--" }}</p>
                                </div>
                            </template>
                            <router-link :to="`/chains`">
                                <img
                                    class="status_icon hover"
                                    :src="findIbcChainIcon(record.sc_chain_id)"
                                />
                            </router-link>
                            <!-- <router-link :to="`/chains/details?chain_id=${record.dc_chain_id}`">
                                <img
                                    class="status_icon hover"
                                    :src="findIbcChainIcon(record.sc_chain_id)"
                                />
                            </router-link> -->

                        </a-popover>
                        <img
                            class="status_icon"
                            style="margin: 0 24px;"
                            :src="getImageUrl(record.status)"
                        />
                        <a-popover placement="right" destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">Chain ID：{{ record.dc_chain_id || "--" }}</p>
                                    <p class="tip_color">Channel ID: {{ record.dc_channel || "--" }}</p>
                                    <p class="tip_color">Sequence: {{ record.sequence || "--" }}</p>
                                </div>
                            </template>
                            <router-link :to="`/chains`">
                                <img
                                    class="status_icon hover"
                                    :src="findIbcChainIcon(record.dc_chain_id)"
                                />
                            </router-link>
                            <!-- <router-link :to="`/chains/details?chain_id=${record.dc_chain_id}`">
                                <img
                                    class="status_icon hover"
                                    :src="findIbcChainIcon(record.dc_chain_id)"
                                />
                            </router-link> -->

                        </a-popover>
                    </template>
                    <template #hashIn="{ record }">
                        <a-popover destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.dc_tx_info.hash || "--" }}</p>
                                </div>
                            </template>
                            <router-link v-if="record.dc_tx_info.hash" :to="`/transfers/details?hash=${record.dc_tx_info.hash}`">
                                <span class="hover">{{
                                        getRestString(record.dc_tx_info.hash, 4, 4) || "--"
                                    }}</span>
                            </router-link>
                            <span v-else>{{ '--' }}</span>
                        </a-popover>
                    </template>
                    <template #in="{ record }">
                        <a-popover destroyTooltipOnHide>
                            <template #content>
                                <div>
                                    <p class="tip_color">{{ record.dc_addr || "--" }}</p>
                                </div>
                            </template>
                            <!--        <router-link :to="`/address/details?address=${record.dc_addr}`">
                                        <span class="hover">{{
                                                getRestString(record.dc_addr, 3, 8) || "&#45;&#45;"
                                            }}</span>
                                    </router-link>-->
                            <span>{{ getRestString(record.dc_addr, 3, 8) || "--" }}</span>
                        </a-popover>
                    </template>
                    <template #time="{ record }">
                        <span>{{ formatDate(record.tx_time * 1000) }}</span>
                    </template>
                </a-table>
            </div>
        </div>
        <div class="transfer_bottom" v-if="tableCount.value">
            <span class="status_tips">
                <span class="status_log">Status:</span>
                <span class="status_tip" v-for="(item, index) in ibcTxStatusDesc" :key="index">
                    <img :src="getImageUrl(item.status)" alt="">
                    <span>{{item.label}}</span>
                </span>
            </span>
            <a-pagination
                class="table_pagination"
                v-model:current="pagination.current"
                :total="pagination.total"
                @change="onPaginationChange"
            />
        </div>
    </div>
</template>

<script setup>
import Dropdown from "./components/Dropdown.vue";
import ChainsDropdown from '../../components/responsive/dropdown/chains.vue';
import { ibcTxStatusSelectOptions, transfersStatusOptions, tableChainIDs, chainAddressPrefix, ibcTxStatus, ibcTxStatusDesc, defaultTitle, unknownSymbol } from '../../constants';
import Tools from '../../utils/Tools';
import tokenDefaultImg from '../../assets/token-default.png';
import { JSONparse, getRestString, formatNum, getLasttyString } from '../../helper/parseString';
import * as djs from 'dayjs';
import config from "../../../config/config.json";
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from 'vue-router';
import { useClearInterval } from '../home/composable';

import { 
    useIbcStatistics, 
    useIbcTxs, 
    useGetIbcBaseDenoms,
    useGetTokens,
    useSelectedSymbol,
    usePagination,
    useIbcChains,
    useGetTableColumns,
} from "./composable";

useClearInterval();
const { ibcStatisticsTxs, getIbcStatistics } = useIbcStatistics();
const { tableCount, getIbcTxs } = useIbcTxs();
const { getIbcDenoms,ibcBaseDenoms, getIbcBaseDenom } = useGetIbcBaseDenoms();
const { tokens, ibcDenoms } = useGetTokens();
const { selectedSymbol, isShowSymbolIcon, clearInput, selectedChain, isShowChainIcon } = useSelectedSymbol();
const { pagination } = usePagination();
const { ibcChains, getIbcChains } = useIbcChains();
const { tableColumns, isShowTransferLoading, tableDatas } = useGetTableColumns();
const chainDropdown = ref()
const selectedDouble = ref(true);
const needBadge = ref(true);

let paramsStatus = null, paramsSymbol = null, paramsDenom = null, startTimestamp = 0, endTimestamp = 0;
const dateRange = reactive({value: []});
const maxTableLength = ref(500000);
let isHashFilterParams = ref(false);
let ibcTxTotalMoreThan500k = ref(true);
let pageNum = 1, pageSize = 10;
let url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
const router = useRoute();

const dayjs = (djs?.default || djs);

const formatDate = (time)=>{
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
}
const getImageUrl = (status) => {
    return new URL(`../../assets/status${status}.png`, import.meta.url).href;
}

let chainId = router?.query.chain;
if (router?.query?.chain) {
    chainId = router?.query.chain
    url += `&chain=${chainId}`;
}
if (router?.query?.denom) {
    url += `&denom=${router.query.denom}`
    paramsDenom = router?.query.denom
}
if (router?.query?.symbol && router?.query?.symbol?.toLowerCase() !== unknownSymbol) {
    url += `&symbol=${router.query.symbol}`
    paramsSymbol = router?.query.symbol
    watch(ibcDenoms, (newValue, oldValue) => {
        if (newValue?.value?.length) {
            newValue?.value.forEach(item => {
                if (item?.symbol === paramsSymbol) {
                    selectedSymbol.value = item.symbol
                    isShowSymbolIcon.value = true
                }
            })
        }
    })
}
if (router?.query?.status) {
    const defaultOptions = transfersStatusOptions.DEFAULT_OPTIONS;
    const successOptions = transfersStatusOptions.SUCCESS_OPTIONS;
    const failedOptions = transfersStatusOptions.FAILED_OPTIONS;
    const processingOptions = transfersStatusOptions.PROCESSING_OPTIONS;
    paramsStatus = router?.query?.status.split(',')
    //todo  Optimize the writing
    if(JSON.stringify(paramsStatus) == JSON.stringify(successOptions)){
        paramsStatus =  successOptions
    }else if(JSON.stringify(paramsStatus) == JSON.stringify(failedOptions)){
        paramsStatus =  failedOptions
    }else if(JSON.stringify(paramsStatus) == JSON.stringify(processingOptions)){
        paramsStatus =  processingOptions
    }else {
        paramsStatus =  defaultOptions
    }
    url += `&status=${paramsStatus}`
}

if (router?.query?.startTime) {
    url += `&startTime=${router.query.startTime}`
    startTimestamp = dayjs(router.query.startTime).unix()
}

if (router?.query?.endTime) {
    url += `&endTime=${router.query.endTime}`
    endTimestamp = dayjs(router.query.endTime).endOf('day').unix()
}

if (startTimestamp && endTimestamp) {
    dateRange.value = [dayjs(startTimestamp * 1000), dayjs(endTimestamp * 1000)]
}
const queryParam = reactive({
    date_range: startTimestamp && endTimestamp ? [startTimestamp, endTimestamp] : [0, Math.floor(new Date().getTime() / 1000)],
    status: paramsStatus || transfersStatusOptions.DEFAULT_OPTIONS,
    chain_id: chainId || undefined,
    symbol: paramsSymbol || undefined,
    denom: paramsDenom || undefined,
});

const queryDatas = () => {
    isShowTransferLoading.value = true;
    let isDateDefaultValue = false
    if(queryParam.date_range?.length === 2){
        const startTime = queryParam.date_range[0]
        if(!startTime){
            isDateDefaultValue = true
        }
    }else if(queryParam.date_range.length === 0){
        isDateDefaultValue = true
    }
    const params = {
        status: queryParam.status?.toString(),
        chain_id: queryParam.chain_id,
        date_range: queryParam.date_range?.toString(),
        symbol: queryParam.symbol,
        denom: queryParam.denom,
    }
    isHashFilterParams.value = false
    if(!params.chain_id && !params.denom && !params.symbol && params.status === '1,2,3,4' && isDateDefaultValue){
        isHashFilterParams.value = true
    }

    getIbcTxs({
        use_count: true,
        ...params,
    }).then(() => {
        pagination.total = tableCount?.value;
    }).catch(error => {
        console.log(error);
    })

    getIbcTxs({
        page_num: pagination.current,
        page_size: pagination.pageSize,
        use_count: false,
        ...params,
    }).then(() => {
        isShowTransferLoading.value = false;
    }).catch(error => {
        isShowTransferLoading.value = false;
        console.log(error);
    })
};
queryDatas();
const startTime = (time) => {
    const nowTimeDate = new Date(time);
    return nowTimeDate.setHours(0, 0, 0, 0);
};

const disabledDate = (current) => current
    && (current > dayjs().endOf('day')
    || current
    < dayjs(1617007625 * 1000));

const isIbcTxTotalAndHashFilter = computed(() => {
    if(!ibcTxTotalMoreThan500k.value && !isHashFilterParams.value) {
        return `A total of ${ibcStatisticsTxs.value.tx_all.count} transfers found`;
    } else if(!ibcTxTotalMoreThan500k.value && isHashFilterParams.value) {
        return `${tableCount.value} of the ${ibcStatisticsTxs.value.tx_all.count} transfers found`;
    } else if(ibcTxTotalMoreThan500k.value && isHashFilterParams.value) {
        return `Last 500k transfers found`;
    } else if(ibcTxTotalMoreThan500k.value && !isHashFilterParams.value) {
        return `${tableCount.value} of the last 500k transfers found`;
    }
})
const setAllChains = (allChains) => {
    if (allChains?.value?.all) {
        const cosmosChain = allChains.value.all.filter(item => item.chain_name === 'Cosmos Hub')
        const irishubChain = allChains.value.all.filter(item => item.chain_name === 'IRIS Hub')
        let notIncludesIrisAndCosmosChains = []
        allChains.value.all.forEach(item => {
            if (item.chain_name !== 'Cosmos Hub' && item.chain_name !== 'IRIS Hub') {
                notIncludesIrisAndCosmosChains.push(item)
            }
        })
        if (notIncludesIrisAndCosmosChains?.length) {
            notIncludesIrisAndCosmosChains.sort((a, b) => {
                return a.chain_name.toLowerCase() < b.chain_name.toLowerCase() ? -1 : a.chain_name.toLowerCase() > b.chain_name.toLowerCase() ? 1 : 0
            })
        }
        ibcChains.value.all = [
            ...cosmosChain,
            ...irishubChain,
            ...notIncludesIrisAndCosmosChains,
        ]
    }
}
let allChains = ibcChains;
if (!Object?.keys(allChains).length) {
    allChains = sessionStorage.getItem('allChains') ? JSON.parse(sessionStorage.getItem('allChains')) : {}
}
setAllChains(allChains)
watch(()=>allChains, (newValue, oldValue) => {
    if (newValue?.value?.all) {
        setAllChains(newValue)
    }
}, {immeidate: true})
const findIbcChainIcon = (chainId) => {
    if (ibcChains && ibcChains.value.all) {
        const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
        if (result) {
            return result.icon || tokenDefaultImg;
        }
    }
    return tokenDefaultImg;
};
const onClickDropdownItem = (type, item, custom) => {
    pagination.current = 1;
    switch (type) {
        case 'token':
            isShowSymbolIcon.value = !custom;
            selectedSymbol.value = item || 'All Tokens';
            if (item === 'All Tokens') {
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
            break;
        default:
            break;
    }
    url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`
    if (queryParam?.chain) {
        url += `&chain=${queryParam.chain}`
    } else if (queryParam?.chain_id) {
        url += `&chain=${queryParam.chain_id}`
    }
    if (queryParam?.denom) {
        url += `&denom=${queryParam.denom}`
    }
    if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
        url += `&symbol=${queryParam.symbol}`
    }
    if (queryParam?.status) {
        url += `&status=${queryParam.status.join(',')}`
    }
    if (queryParam?.date_range?.length) {
        if (queryParam?.date_range.length === 1) {
            const timeStamp = queryParam.date_range[0]
            const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=&endTime=${endTime}`
        }
        if (queryParam?.date_range.length === 2) {
            const startTimeStamp = queryParam.date_range[0]
            const entTimeStamp = queryParam.date_range[1]
            const startTime = startTimeStamp ? dayjs(startTimeStamp * 1000).format('YYYY-MM-DD') : ''
            const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=${startTime}&endTime=${endTime}`
        }
    }
    history.pushState(null, null, url)
};
const handleSelectChange = (item) => {
    pagination.current = 1;
    queryParam.status = JSONparse(item);
    url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`
    if (queryParam?.chain) {
        url += `&chain=${queryParam.chain}`
    } else if (queryParam?.chain_id) {
        url += `&chain=${queryParam.chain_id}`
    }
    if (queryParam?.denom) {
        url += `&denom=${queryParam.denom}`
    }
    if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
        url += `&symbol=${queryParam.symbol}`
    }
    if (queryParam?.status) {
        url += `&status=${queryParam.status.join(',')}`
    }
    if (queryParam?.date_range?.length) {
        if (queryParam?.date_range.length === 1) {
            const timeStamp = queryParam.date_range[0]
            const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=&endTime=${endTime}`
        }
        if (queryParam?.date_range.length === 2) {
            const startTimeStamp = queryParam.date_range[0]
            const entTimeStamp = queryParam.date_range[1]
            const startTime = startTimeStamp ? dayjs(startTimeStamp * 1000).format('YYYY-MM-DD') : ''
            const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=${startTime}&endTime=${endTime}`
        }
    }
    history.pushState(null, null, url)
    queryDatas();
};

const onChangeRangePicker = (dates) => {
    pagination.current = 1;
    dateRange.value = dates;
    queryParam.date_range[0] = Math.floor(startTime(dayjs(dates[0]).valueOf()) / 1000);
    queryParam.date_range[1] = Math.floor(
        startTime(dayjs(dates[1]).valueOf()) / 1000 + 60 * 60 * 24 - 1,
    );
    url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`
    if (queryParam?.chain) {
        url += `&chain=${queryParam.chain}`
    }
    if (queryParam?.denom) {
        url += `&denom=${queryParam.denom}`
    }
    if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
        url += `&symbol=${queryParam.symbol}`
    }
    if (queryParam?.status) {
        url += `&status=${queryParam.status.join(',')}`
    }
    if (queryParam?.date_range?.length) {
        if (queryParam?.date_range.length === 1) {
            const timeStamp = queryParam.date_range[0]
            const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=&endTime=${endTime}`
        }
        if (queryParam?.date_range.length === 2) {
            const startTimeStamp = queryParam.date_range[0]
            const entTimeStamp = queryParam.date_range[1]
            const startTime = dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
            const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=${startTime}&endTime=${endTime}`
        }
    }
    history.pushState(null, null, url)
    queryDatas();
};
const onPaginationChange = (page) => {
    if (isShowTransferLoading.value) return;
    pagination.current = page;
    const params = Tools.urlParser(url);
    url = `/transfers?pageNum=${page}&pageSize=${pageSize}`;

    if (params?.chain) {
        url += `&chain=${params.chain}`
    }
    if (params?.denom) {
        url += `&denom=${params.denom}`
    }
    if (params?.symbol) {
        url += `&symbol=${params.symbol}`
    }
    if (params?.status) {
        url += `&status=${params.status}`
    }
    if (params?.startTime || params.startTime === '') {
        url += `&startTime=${params.startTime}`
    }
    if (params?.endTime || params.endTime === '') {
        url += `&endTime=${params.endTime}`
    }

    history.pushState(null, null, url);
    isShowTransferLoading.value = true;
    getIbcTxs({
        page_num: pagination.current,
        page_size: pagination.pageSize,
        use_count: false,
        ...queryParam,
    }).then(() => {
        isShowTransferLoading.value = false;
    }).catch(error => {
        isShowTransferLoading.value = false;
        console.log(error);
    })
};
const onClickReset = () => {
    isShowChainIcon.value = false;
    isShowSymbolIcon.value = false;
    clearInput.value += 1;
    chainDropdown.value.selectedChain = [];
    selectedSymbol.value = 'All Tokens';
    dateRange.value = [];
    queryParam.date_range = [];
    queryParam.status = transfersStatusOptions.DEFAULT_OPTIONS;
    queryParam.chain_id = undefined;
    queryParam.symbol = undefined;
    queryParam.chain = undefined;
    queryParam.denom = undefined;
    pagination.current = 1;
    url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`;
    history.pushState(null, null, url)
    queryDatas();
};
const getAddressPrefix = (address) => {
    if (address) {
        return address?.toString().substr(0, 3)
    }
    return '--'
}

const onSelectedChain = (chain_id) => {
    queryParam.chain = chain_id;
    queryParam.chain_id = chain_id;
    pagination.current = 1;
    url = `/transfers?pageNum=${pagination.current}&pageSize=${pageSize}`
    if(queryParam?.chain) {
        url += `&chain=${queryParam.chain_id}`
    } else if (queryParam?.chain_id) {
        url += `&chain=${queryParam.chain_id}`
    }
    if (queryParam?.denom) {
        url += `&denom=${queryParam.denom}`
    }
    if (queryParam?.symbol && queryParam?.symbol?.toLowerCase() !== unknownSymbol) {
        url += `&symbol=${queryParam.symbol}`
    }
    if (queryParam?.status) {
        url += `&status=${queryParam.status.join(',')}`
    }
    if (queryParam?.date_range?.length) {
        if (queryParam?.date_range.length === 1) {
            const timeStamp = queryParam.date_range[0]
            const endTime = dayjs(timeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=&endTime=${endTime}`
        }
        if (queryParam?.date_range.length === 2) {
            const startTimeStamp = queryParam.date_range[0]
            const entTimeStamp = queryParam.date_range[1]
            const startTime = dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
            const endTime = dayjs(entTimeStamp * 1000).format('YYYY-MM-DD')
            url += `&startTime=${startTime}&endTime=${endTime}`
        }
    }
    history.pushState(null, null, url)
    queryDatas();
}
const isShowLink = (address, chainID) => {
    let isShowLink = false
    if (address && chainID) {
        if (chainID === tableChainIDs.irishub && address) {
            const addressPrefix = getAddressPrefix(address)
            if (addressPrefix === chainAddressPrefix.irishubPrefix) {
                isShowLink = true
            }
        }
        if (chainID === tableChainIDs.cosmoshub) {
            const addressPrefix = getAddressPrefix(address)
            if (addressPrefix === chainAddressPrefix.cosmoshubPrefix) {
                isShowLink = true
            }
        }
    }
    return isShowLink

}
const setExplorerLink = (address, chainID) => {
    let explorerLink = ''
    if (address && chainID) {
        if (chainID === tableChainIDs.irishub && address) {
            const addressPrefix = getAddressPrefix(address)
            if (addressPrefix === chainAddressPrefix.irishubPrefix) {
                explorerLink = `${config.IRISHUB_IOBSCAN_LINK}${address}`
            }
        }
        if (chainID === tableChainIDs.cosmoshub && address) {
            const addressPrefix = getAddressPrefix(address)
            if (addressPrefix === chainAddressPrefix.cosmoshubPrefix) {
                explorerLink = `${config.COSMOSHUB_IOBSCAN_LINK}${address}`
            }
        }
    }
    return explorerLink
}

watch(ibcStatisticsTxs,(newValue,oldValue) => {
    if(newValue?.tx_all?.count < maxTableLength){
        ibcTxTotalMoreThan500k.value = false
    }
    ibcTxTotalMoreThan500k.value = true
})
onMounted(() => {
    getIbcStatistics();
    getIbcDenoms();
    !sessionStorage.getItem('ibcBaseDenoms') && getIbcBaseDenom();
    !sessionStorage.getItem('allChains') && getIbcChains();
})
</script>
<style lang="less" scoped>
.transfer {
    flex: 1;
    padding: 48px 32px 154px;
    width: 100%;
    text-align: left;
    background-color: #f5f7fc;
    &_header {
        width: 100%;
        &_container {
            position: relative;
            margin: 0 auto;
            width: 100%;
            max-width: 1200px;
        }
        &_line {
            position: absolute;
            top: 11px;
            display: inline-block;
            height: 12px;
            background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
            border-radius: 5px;
        }
        &_title {
            position: relative;
            top: -11px;
            padding-right: 16px;
            font-size: var(--bj-font-size-title);
            font-weight: 400;
            color: #000000;
            line-height: 20px;
        }
        &_num {
            margin-left: 12px;
            font-size: var(--bj-font-size-normal);
            color: var(--bj-font-color-65);
        }
    }
    &_middle {
        margin: 48px auto 0;
        max-width: 1200px;
        &_top {
            .flex(row, nowrap, flex-start, center);
        }
        &_left {
            .flex(row, nowrap, flex-start, center);
            .ant-select {
                width: 146px;
            }
        }
        &_right {
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
        &_bottom {
            margin-top: 16px;
        }
    }
    &_table {
        font-size: 14px;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        ::v-deep .ant-table-placeholder {
            // .flex(column, nowrap, center, center);
            min-height: 500px;
        }
        ::v-deep a, span {
            font-size: var(--bj-font-size-normal);
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: 14px;
        }
        .token {
            &_icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 8px;
                cursor: url("../../assets/mouse/shiftlight_mouse.png"),default !important;
            }

            &_num {
                cursor: url("../../assets/mouse/shiftlight_mouse.png"),default !important;
                font-size: var(--bj-font-size-normal);
                color: var(--bj-text-second);
                margin-right: 4px;
            }

            &_denom {
                cursor: url("../../assets/mouse/shiftlight_mouse.png"),default !important;
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                color: var(--bj-text-third);
            }
        }
        .status_icon {
            width: 22px;
        }
    }
    &_bottom {
        .flex(row, nowrap, space-between, center);
        margin: 0 auto;
        padding: 16px 24px;
        max-width: 1200px;
        background: #FFFFFF;
        border-radius: var(--border-radius-normal);
        & .status_tips {
            .flex(row, nowrap, space-between, center);
            padding: 5px 9px;
            width: 396px;
            font-size: 14px;
            font-weight: 400;
            color: var(--bj-text-third);
            line-height: 14px;
            background: #F8F9FC;
            border-radius: 8px;
            .status_tip {
                .flex(row, wrap, flex-start, center);
                img {
                    margin-right: 8px;
                    height: 8px;
                }
            }
        }
        & .table_pagination {

            ::v-deep .ant-pagination-options {
                display: none;
            }
        }
    }
}
.status_select {
    width: 146px;
    margin: 0 8px;
    color: var(--bj-text-second);
    ::v-deep .ant-select-arrow {
        right: 8px;
        color: rgba(164, 171, 192, 1);
    }
    ::v-deep .ant-select-selector{
        height: 36px;
        border: 1px solid var(--bj-border-color);
        .ant-select-selection-item{
            text-align: center;
            line-height: 34px;
        }
        .ant-select-selection-search {
            border-right: 1px solid var(--bj-border-color);
        }
    
    &_default{
        color:var(--bj-text-second);
    }
    .status_select_title{
        color: var(--bj-primary-color);
    }
}}

.date_range {
    margin-right: 8px;
    width: 250px;
    height: 36px;
    ::v-deep .ant-picker-input > input{
        color: var(--bj-primary-color);
        text-align: center;
        &::placeholder{
            color: var(--bj-text-second);
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
.hover {
    cursor: url("../../assets/mouse/shiftlight_mouse.png"),default !important;
    &:hover {
        color: var(--bj-primary-color);
    }
}
@media screen and (max-width: 1200px) {
    .transfer {
        &_header {
            &_container {
            }
            &_line {
            }
            &_title {
            }
            &_num {
            }
        }
        &_middle {
            &_top {
            }
            &_left {
                .ant-select {
                }
            }
            &_right {
                & .tip {
                }
                & button {
                }
            }
            &_bottom {
            }
        }
        &_table {
            width: 100%;
            overflow-x: auto;
            ::v-deep .ant-table-placeholder {
            }
            ::v-deep a, span {
            }
            ::v-deep table {
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
                &_icon {
                }

                &_num {
                }

                &_denom {
                }
            }
            .status_icon {
            }
        }
        &_bottom {
            & .status_tips {
                .status_tip {
                }
            }
            & .table_pagination {
                ::v-deep .ant-pagination-options {
                }
            }
        }
    }
    .status_select {
        ::v-deep .ant-select-selector {
        }
        ::v-deep .ant-select-selection-item {
        }
        ::v-deep .ant-select-selection-search {
        }
        ::v-deep .ant-select-arrow {
        }
    }
}
@media screen and (max-width: 970px) {
    .transfer {
        &_header {
            &_container {
            }
            &_line {
            }
            &_title {
            }
            &_num {
            }
        }
        &_middle {
            &_top {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &_left {
                .ant-select {
                }
            }
            &_right {
                margin-top: 12px;
                & .tip {
                }
                & button {
                }
            }
            &_bottom {
            }
        }
        &_table {
            ::v-deep .ant-table-placeholder {
            }
            ::v-deep a, span {
            }
            ::v-deep table {
            }
            .token {
                &_icon {
                }

                &_num {
                }

                &_denom {
                }
            }
            .status_icon {
            }
        }
        &_bottom {
            .flex(column, nowrap, flex-start, flex-start);
            & .status_tips {
                .status_tip {
                }
            }
            & .table_pagination {
                margin-top: 16px;
                ::v-deep .ant-pagination-options {
                }
            }
        }
    }
    .status_select {
        ::v-deep .ant-select-selector {
        }
        ::v-deep .ant-select-selection-item {
        }
        ::v-deep .ant-select-selection-search {
        }
        ::v-deep .ant-select-arrow {
        }
    }
}
@media screen and (max-width: 768px) {
    .transfer {
        &_header {
            &_container {
            }
            &_line {
            }
            &_title {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &_num {
                margin-top: 12px;
                margin-left: 0;
            }
        }
        &_middle {
            margin-top: 72px;
            &_top {
            }
            &_left {
                .ant-select {
                }
            }
            &_right {
                & .tip {
                }
                & button {
                }
            }
            &_bottom {
            }
        }
        &_table {
            ::v-deep .ant-table-placeholder {
            }
            ::v-deep a, span {
            }
            .token {
                &_icon {
                }

                &_num {
                }

                &_denom {
                }
            }
            .status_icon {
            }
        }
        &_bottom {
            padding: 16px;
            & .status_tips {
                .status_log {
                }

                .status_tip {
                    margin-left: 0;
                }
            }
            & .table_pagination {
                ::v-deep .ant-pagination-options {
                }
            }
        }
    }
    .status_select {
        ::v-deep .ant-select-selector {
        }
        ::v-deep .ant-select-selection-item {
        }
        ::v-deep .ant-select-selection-search {
        }
        ::v-deep .ant-select-arrow {
        }
    }
}
@media screen and (max-width: 574px) {
    .transfer {
        &_header {
            &_container {
            }
            &_line {
            }
            &_title {
            }
            &_num {
            }
        }
        &_middle {
            &_top {
            }
            &_left {
                flex-wrap: wrap;
                .ant-select {
                    margin-left: 0;
                    margin-top: 12px;
                }
            }
            &_right {
                & .tip {
                }
                & button {
                }
            }
            &_bottom {
            }
        }
        &_table {
            ::v-deep .ant-table-placeholder {
            }
            ::v-deep a, span {
            }
            .token {
                &_icon {
                }

                &_num {
                }

                &_denom {
                }
            }
            .status_icon {
            }
        }
        &_bottom {
            padding: 8px 8px 0 8px;
            & .status_tips {
                width: 100%;
                .status_log {
                }

                .status_tip {
                    margin-bottom: 8px;
                }
            }
            & .table_pagination {
                ::v-deep .ant-pagination-options {
                }
            }
        }
    }
    .status_select {
        ::v-deep .ant-select-selector {
        }
        ::v-deep .ant-select-selection-item {
        }
        ::v-deep .ant-select-selection-search {
        }
        ::v-deep .ant-select-arrow {
        }
    }
}
@media screen and (max-width: 420px) {
    .transfer {
       padding: 24px 16px 80px;
        &_header {
            &_container {
            }
            &_line {
            }
            &_title {
            }
            &_num {
            }
        }
        &_middle {
            &_top {
            }
            &_left {
                .ant-select {
                    width: 210px;
                }
            }
            &_right {
                & .tip {
                }
                & button {
                }
            }
            &_bottom {
            }
        }
        &_table {
            ::v-deep .ant-table-placeholder {
            }
            ::v-deep a, span {
            }
            .token {
                &_icon {
                }

                &_num {
                }

                &_denom {
                }
            }
            .status_icon {
            }
        }
        &_bottom {
            & .status_tips {
                flex-wrap: wrap;
                .status_log {
                    width: 100%;
                    margin-bottom: 8px;
                }

                .status_tip {
                    margin-left: 0;
                }
            }
            & .table_pagination {
                ::v-deep .ant-pagination-options {
                }
            }
        }
    }
    .status_select {
        ::v-deep .ant-select-selector {
        }
        ::v-deep .ant-select-selection-item {
        }
        ::v-deep .ant-select-selection-search {
        }
        ::v-deep .ant-select-arrow {
        }
    }
    .date_range {
        width: 210px;
    }
}

</style>