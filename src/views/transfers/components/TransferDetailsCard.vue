<template>
    <div class="details_content">
        <div class="details_title">{{ title }}</div>
        <ul class="details_item_content">
            <li class="details_item" v-for="(item, index) in details" :key="index">
                <span class="details_item_label">{{ item.label }}</span>
                <span class="details_item_value" v-if="item.isFormatToken">

                    <!--                    {{formatToken(item.value,details)}}-->

                    <router-link :to="`/tokens?chain=${chain1}`" class="details_item_amount">{{ formatToken(item.value, details).symbolNum || '--' }}</router-link>
                    <a-tooltip>
                        <template #title>
                            {{ formatToken(item.value, details).denom }}
                        </template>
                        <span>{{ formatDenom(formatToken(item.value, details).symbol) }}</span>
                    </a-tooltip>
                </span>
                <span class="details_item_value" v-else-if="item.isFormatHeight">{{ formatHeight(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{ formatStatus(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatFee">
                    <span class="details_item_amount">{{ formatToken(formatFee(item.value), details).symbolNum ||
                            '--'
                    }}</span>
                    <a-tooltip>
                        <template #title>
                            {{ formatToken(formatFee(item.value), details).denom }}
                        </template>
                        <span>{{ formatDenom(formatToken(formatFee(item.value), details).symbol) }}</span>
                    </a-tooltip>

                    <!--                    {{formatFee(item.value)}}-->
                </span>
                <router-link :to="`/chains`" class="details_item_value" v-else-if="item.isFormatChainID">{{ formatChainID(item.value) }}</router-link>
                <span class="details_item_value" v-else-if="item.isAck">{{ formatAck(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatDate">
                    <span style="display: none">{{ formatDate(item.value) }}</span>
                    <span>{{ date }}</span>
                </span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span v-show="Array.isArray(item.value)">
                        <span v-if="item.value.length >= 1" v-for="(address, index) of item.value">
                            <span class="value_style">{{ address || '--' }}</span>
                        </span>
                        <span v-else>--</span>
                    </span>
                    <span v-if="!Array.isArray(item.value)" class="value_style">{{ item.value || '--' }}</span>
                </span>
                <!-- todo shan 确认传递的 chain 参数 chian -->
                <router-link :to="`/channels?chain=${chain1}`" class="details_item_value" v-else-if="item.isChannelID">{{ item.value ? item.value : '--' }}</router-link>
                <span class="details_item_value" v-else>{{ item.value ? item.value : '--' }}</span>
            </li>
            <li class="details_item" v-for="(item, index) in expandDetails" :key="index" v-show="isExpand">
                <span class="details_item_label">{{ item.label }}</span>
                <span class="details_item_value" v-if="item.isFormatToken">

                    <!--                    {{formatToken(item.value)}}-->
                    <span class="details_item_amount">{{ formatToken(item.value, expandDetails).symbolNum ||
                            '--'
                    }}{{ formatToken(item.value, expandDetails).denom }}</span>
                    <a-tooltip>
                        <template #title>
                            {{ formatToken(item.value, expandDetails).denom }}
                        </template>
                        <span>{{ formatDenom(formatToken(item.value, expandDetails).symbol) }}</span>
                    </a-tooltip>
                </span>
                <span class="details_item_value" v-if="item.isFormatHeight">{{ formatHeight(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{ formatStatus(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatFee">{{ formatFee(item.value) }}</span>
                <router-link :to="`/chains`" class="details_item_value" v-else-if="item.isFormatChainID">{{ formatChainID(item.value) }}</router-link>
                <span class="details_item_value" v-else-if="item.isAck">{{ formatAck(item.value) }}</span>
                <span class="details_item_value" v-else-if="item.isFormatDate">
                    <span style="display: none">{{ formatDate(item.value) }}</span>
                    <span>{{ date }}</span>
                </span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span class="value_style">{{ item.value || '--' }}</span>
                </span>
                <span class="details_item_value" v-else>{{ item.value === 0 ? 0 : item.value ? item.value : '--'
                }}</span>
            </li>
            <li class="see_more_button" @click="expandInfo">
                <span class="see_more_label">Click to see More</span>
                <span class="see_more_icon iconfont icon-shouqi" :class="isExpand ? 'less_style' : 'more_style'"></span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import Tools from "../../../utils/Tools";
import moveDecimal from 'move-decimal-point';
import { chainAddressPrefix, chainIDs, tableChainIDs } from "../../../constants";
import config from '../../../../config/config.json'
import { ref } from 'vue'
import * as dayjs from 'dayjs'
import { getRestString } from "../../../helper/parseString";
import { useGetTokens, useGetIbcBaseDenoms } from '../composable';
const { ibcBaseDenoms } = useGetIbcBaseDenoms();

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    details: {
        type: Array,
        default: []
    },
    expandDetails: {
        type: Array,
        default: []
    },
    baseDenom: {
        type: String,
        default: ''
    },
    ibcDenoms: {
        type: Object,
        default: {}
    }
})

const isExpand = ref(false)
const date = ref('')
const formatToken = (token, details) => {
    let chainID = ''
    if (details?.length) {
        details.forEach(item => {
            if (item?.label === 'Chain ID:') {
                chainID = item.value
            }
        })
    }
    if (token?.amount >= 0 && token?.denom) {
        let symbol = ''
        if (chainID) {
            symbol = Tools.findDenomSymbol(
                props.ibcDenoms.value,
                token?.denom,
                chainID
            );
        }
        let symbolNum = token?.amount || 0;
        let symbolDenom = token?.denom || '';
        let denom = token?.denom || ''
        if (symbol) {
            const findSymbol = Tools.findSymbol(
                ibcBaseDenoms.value,
                symbol,
            );
            if (findSymbol) {
                // (token.amount || 0) * 10 ** -findSymbol.scale;
                symbolNum = moveDecimal(token.amount, 0 - findSymbol.scale)
                symbolDenom = findSymbol.symbol;
            }
        }
        return {
            denom: denom,
            symbol: symbolDenom,
            symbolNum: symbolNum,
        }
    }
    return '--'
}
const formatHeight = (heightObj) => {
    if (Object.keys(heightObj)?.length && heightObj !== '--') {
        return `${heightObj.revision_number}-${heightObj.revision_height}`
    }
    return '--'

}
const formatStatus = (status) => {
    if (status == 1) {
        return 'Success'
    } else if (status === 0) {
        return 'Failed'
    }
    return '--'
}
const getAddressPrefix = (address) => {
    if (address) {
        return address?.toString().substr(0, 3)
    }
    return '--'
}
const expandInfo = () => {
    isExpand.value = !isExpand.value
}
const isShowLink = (info, address) => {
    if (info?.length) {
        let isExplorerLink = false
        info.forEach(item => {
            if (item.label === 'Chain ID:') {
                if (item.value === tableChainIDs.irishub) {
                    const addressPrefix = getAddressPrefix(address)
                    if (addressPrefix === chainAddressPrefix.irishubPrefix) {
                        isExplorerLink = true
                    }
                }
                if (item.value === tableChainIDs.cosmoshub) {
                    const addressPrefix = getAddressPrefix(address)
                    if (addressPrefix === chainAddressPrefix.cosmoshubPrefix) {
                        isExplorerLink = true
                    }
                }
            }
        })
        return isExplorerLink
    }
}
const setExplorerLink = (info, address) => {
    if (info?.length) {
        let explorerLink = ''
        info.forEach(item => {
            if (item.label === 'Chain ID:') {
                if (item.value === tableChainIDs.irishub) {
                    const addressPrefix = getAddressPrefix(address)
                    if (addressPrefix === chainAddressPrefix.irishubPrefix) {
                        explorerLink = `${config.IRISHUB_IOBSCAN_LINK}${address}`
                    }
                }
                if (item.value === tableChainIDs.cosmoshub) {
                    const addressPrefix = getAddressPrefix(address)
                    if (addressPrefix === chainAddressPrefix.cosmoshubPrefix) {
                        explorerLink = `${config.COSMOSHUB_IOBSCAN_LINK}${address}`
                    }
                }
            }
        })
        return explorerLink
    }
}
const formatFee = (fee) => {
    if (Array.isArray(fee)) {
        const amountObj = fee[0]
        return amountObj
        /*let displayAmountNum = '',displayAmountDenom = ''
        if(amountObj?.denom && amountObj?.amount){
            const tokenInfo = Tools.findDenom(store.state.ibcBaseDenoms.value,amountObj.denom)
            if(tokenInfo?.scale){
                displayAmountNum =  moveDecimal(amountObj.amount,0 - tokenInfo.scale)
                displayAmountDenom = tokenInfo.symbol
            }else {
                displayAmountNum = amountObj.amount
                displayAmountDenom = amountObj.denom
            }
        }
        return `${displayAmountNum} ${displayAmountDenom}`*/
    }
    return fee
}
const formatDate = (timestamp) => {
    if (timestamp > 0) {
        date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${Tools.formatAge(Tools.getTimestamp(), timestamp * 1000, 'ago', '>')})`
        setTimeout(() => {
            date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${Tools.formatAge(Tools.getTimestamp(), timestamp * 1000, 'ago', '>')})`
        }, 1000)
    } else {
        date.value = '--'
    }
}
const formatChainID = (chainID) => {
    if (chainID && chainID !== '--') {
        return chainID.replace(new RegExp("\_", "g"), "-")
    }
    return '--'
}
const formatAck = (ack) => {
    if (ack && ack !== '--') {
        if (ack.includes('result:"\\001"')) {
            return 'correct'
        } else if (ack.includes('error')) {
            return 'error'
        }
    } else {
        return '--'
    }
}
const formatDenom = (denom) => {
    if (denom?.includes('ibc/')) {
        return getRestString(denom, 8, 4)
    }
    return denom
}
</script>

<style scoped lang="less">
.details_content {
    margin-top: 16px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;

    .details_title {
        border-bottom: 1px solid rgba(151, 151, 151, 0.2);
        padding: 16px 0 16px 24px;
        font-size: 16px;
        line-height: 16px;
        font-weight: 400;
        text-align: left;
    }

    .details_item_content {
        list-style: none;
        box-sizing: border-box;
        margin: 0 24px;
        text-align: left;
        padding-top: 15px;

        .details_item {
            padding: 14px 0;
            display: flex;

            .details_item_label {
                display: inline-block;
                width: 153px;
                margin-right: 35px;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.65);
                line-height: 14px;
            }

            .details_item_value {
                flex: 1;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
                line-height: 14px;
                word-break: break-all;

                .details_item_amount {
                    margin-right: 5px;
                }

                .ant-tooltip-open {}

                .value_style {
                    word-break: break-all;
                    display: inline-block;
                    line-height: 17px;
                }

                .link_style {
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    color: rgba(61, 80, 255, 1);
                    line-height: 17px;
                    max-width: 300px;
                    display: inline-block;
                }
            }
        }

        .see_more_button {
            padding: 14px 0;
            display: flex;
            cursor: url("../../../assets/mouse/shiftlight_mouse.png"), default;

            .see_more_label {
                color: rgba(61, 80, 255, 1);
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                line-height: 14px;

                &:hover {
                    color: #1E2CB4
                }
            }

            .see_more_icon {
                margin-left: 8px;
                color: rgba(61, 80, 255, 1);
                font-size: var(--bj-font-size-normal);
                line-height: 14px;
                z-index: 1;

                &:hover {
                    color: #1E2CB4;
                }
            }

            .more_style {
                transform: rotate(180deg);
            }

            .less_style {}
        }
    }
}

@media screen and (max-width: 530px) {
    .details_content {
        .details_title {
        }

        .details_item_content {
            .details_item {
                .details_item_label {
                    margin-right: 26px;
                    max-width: 100px;
                }

                .details_item_value {
                    .details_item_amount {
                    }

                    .ant-tooltip-open {}

                    .value_style {
                    }

                    .link_style {
                    }
                }
            }

            .see_more_button {
                .see_more_label {
                    &:hover {
                    }
                }

                .see_more_icon {
                    &:hover {
                    }
                }

                .more_style {
                }

                .less_style {}
            }
        }
    }
}
</style>