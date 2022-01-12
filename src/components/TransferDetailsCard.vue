<template>
    <div class="details_content">
        <div class="details_title">{{title}}</div>
        <ul class="details_item_content">
            <li class="details_item" v-for="(item,index) in details" :key="index">
                <span class="details_item_label">{{item.label}}</span>
                <span class="details_item_value" v-if="item.isFormatToken">{{formatToken(item.value,details)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatHeight">{{formatHeight(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{formatStatus(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatFee">{{formatFee(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatChainID">{{formatChainID(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isAck">{{formatAck(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatDate">
                    <span style="display: none">{{formatDate(item.value)}}</span>
                    <span>{{date}}</span>
                </span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span v-show="Array.isArray(item.value)">
                        <span v-if="item.value.length >= 1" v-for="(address,index) of item.value">
                            <span class="value_style" v-show="!isShowLink(details,address)">{{address  || '--'}}</span>
                            <a class="link_style" v-show="isShowLink(details,address)" :href="setExplorerLink(details,address)" target="_blank" rel="noreferrer noopener">{{address}}</a>
                        </span>
                        <span v-else>--</span>
                    </span>
                    <span v-if="!Array.isArray(item.value)" class="value_style" v-show="!isShowLink(details,item.value)">{{item.value  || '--'}}</span>
                    <a v-if="!Array.isArray(item.value)" class="link_style" v-show="isShowLink(details,item.value)" :href="setExplorerLink(details,item.value)" target="_blank" rel="noreferrer noopener">{{item.value}}</a>
                </span>
                <span class="details_item_value" v-else>{{item.value ? item.value : '--'}}</span>
            </li>
            <li class="details_item" v-for="(item,index) in expandDetails" :key="index" v-show="isExpand">
                <span class="details_item_label">{{item.label}}</span>
                <span class="details_item_value" v-if="item.isFormatToken">{{formatToken(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatHeight">{{formatHeight(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{formatStatus(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatFee">{{formatFee(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatChainID">{{formatChainID(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isAck">{{formatAck(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatDate">
                    <span style="display: none">{{formatDate(item.value)}}</span>
                    <span>{{date}}</span>
                </span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span class="value_style" v-show="!isShowLink(details,item.value)">{{item.value || '--'}}</span>
                    <a class="link_style" v-show="isShowLink(details,item.value)" :href="setExplorerLink(details,item.value)" target="_blank" rel="noreferrer noopener">{{item.value}}</a>
                </span>
                <span class="details_item_value" v-else>{{item.value === 0 ? 0 : item.value ? item.value : '--'}}</span>
            </li>
            <li class="see_more_button" @click="expandInfo">
                <span class="see_more_label">Click to see More</span>
                <span class="see_more_icon iconfont icon-shouqi" :class="isExpand ? 'less_style' : 'more_style'"></span>
            </li>
        </ul>
    </div>
</template>

<script>
import Tools from "../util/Tools";
import {useStore} from 'vuex';
import moveDecimal from 'move-decimal-point';
import {chainAddressPrefix, chainIDs} from "../constant";
import config from '../../config/config.json'
import {ref} from 'vue'
import moment from 'moment'
export default {
    name: "TransferDetailsCard",
    props:{
        title:{
            type:String,
            default:''
        },
        details:{
            type:Array,
            default: []
        },
        expandDetails:{
            type:Array,
            default: []
        },
        baseDenom :{
            type:String,
            default:''
        }
    },
    setup(props){
        const store = useStore();
        const isExpand = ref(false)
        const date = ref('')
        const formatToken = (token,details) => {
            let chainID=''
            if(details?.length){
                details.forEach( item => {
                    if(item?.label === 'Chain ID:' && props?.title === 'IBC Out Details'){
                        chainID = item.value
                    }
                })
            }
            if(token?.amount >=0 && token?.denom){
                let symbol = ''
                if(chainID){
                    symbol =  Tools.findDenomSymbol(
                        store.state.ibcDenoms.value,
                        token?.denom,
                        chainID
                    );
                }
                let symbolNum = token?.amount || 0;
                let symbolDenom =  props.baseDenom || '';

                if (symbol) {
                    const findSymbol = Tools.findSymbol(
                        store.state.ibcBaseDenoms.value,
                        symbol,
                    );
                    if (findSymbol) {
                        // (token.amount || 0) * 10 ** -findSymbol.scale;
                        symbolNum = moveDecimal(token.amount,0 - findSymbol.scale)

                        symbolDenom = findSymbol.symbol;
                    }
                }
                return `${symbolNum} ${symbolDenom}`
            }
            return '--'
        }
        const formatHeight = (heightObj) => {
            if(Object.keys(heightObj)?.length){
                return `${heightObj.revision_number}-${heightObj.revision_height}`
            }
            return  '--'

        }
        const formatStatus = (status) => {
            if(status == 1){
                return 'Success'
            }else if(status === 0) {
                return 'Failed'
            }
            return  '--'
        }
        const getAddressPrefix = (address) => {
            if(address){
                return address?.toString().substr(0,3)
            }
            return '--'
        }
        const expandInfo = () => {
            isExpand.value = !isExpand.value
        }
        const isShowLink = (info,address) => {
            if(info?.length){
                let isExplorerLink = false
                info.forEach( item => {
                    if(item.label ==='Chain ID:'){
                        if(item.value === chainIDs.irishub){
                            const addressPrefix = getAddressPrefix(address)
                            if(addressPrefix === chainAddressPrefix.irishubPrefix){
                                isExplorerLink = true
                            }
                        }
                        if(item.value === chainIDs.cosmoshub){
                            const addressPrefix = getAddressPrefix(address)
                            if(addressPrefix === chainAddressPrefix.cosmoshubPrefix){
                                isExplorerLink = true
                            }
                        }
                    }
                })
                return isExplorerLink
            }
        }
        const setExplorerLink = (info,address) => {
            if(info?.length) {
                let explorerLink = ''
                info.forEach(item => {
                    if (item.label === 'Chain ID:') {
                        if (item.value === chainIDs.irishub) {
                            const addressPrefix = getAddressPrefix(address)
                            if (addressPrefix === chainAddressPrefix.irishubPrefix) {
                                explorerLink = `${config.IRISHUB_IOBSCAN_LINK}${address}`
                            }
                        }
                        if (item.value === chainIDs.cosmoshub) {
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
            if(Array.isArray(fee)){
                const amountObj = fee[0]
                let displayAmountNum = '',displayAmountDenom = ''
                if(amountObj?.denom && amountObj?.amount){
                    const tokenInfo = Tools.findDenom(store.state.ibcBaseDenoms.value,amountObj.denom)
                    if(tokenInfo?.scale){
                        displayAmountNum =  moveDecimal(amountObj.amount,0 - tokenInfo.scale)
                        displayAmountDenom = tokenInfo.symbol
                    }
                }
                return `${displayAmountNum} ${displayAmountDenom}`
            }
            return '--'
        }
        const formatDate = (timestamp) => {
            if(timestamp > 0){
                date.value =  `${moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') } (${Tools.formatAge(Tools.getTimestamp(), timestamp * 1000, 'ago', '>')})`
                setTimeout(() => {
                    date.value =  `${moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') } (${Tools.formatAge(Tools.getTimestamp(), timestamp * 1000, 'ago', '>')})`
                },1000)
            }else {
                date.value = '--'
            }
        }
        const formatChainID = (chainID) => {
            if(chainID){
                return chainID.replace(new RegExp("\_", "g"),"-")
            }
            return '--'
        }
        const formatAck = (ack) => {
            if(ack){
                if(ack.includes('result:"\\001"')){
                    return 'correct'
                }else if(ack.includes('error')) {
                    return 'error'
                }
            }else {
                return '--'
            }
        }
        return {
            formatAck,
            expandInfo,
            formatChainID,
            formatDate,
            formatFee,
            formatToken,
            formatHeight,
            formatStatus,
            isShowLink,
            setExplorerLink,
            isExpand,
            date,

        }
    }
}
</script>

<style scoped lang="scss">
    .details_content{
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        margin-bottom: 100px;
        .details_title{
            border-bottom: 1px solid  rgba(151, 151, 151, 0.2);
            padding: 16px 0 16px 24px;
            font-size: 16px;
            line-height: 16px;
            font-weight: 400;
            text-align: left;
        }
        .details_item_content{
            list-style: none;
            box-sizing: border-box;
            margin: 0 24px;
            text-align: left;
            padding-top: 15px;
            .details_item{
                padding: 14px 0;
                display: flex;
                .details_item_label{
                    display: inline-block;
                    width: 153px;
                    margin-right: 35px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 14px;
                }
                .details_item_value{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 14px;
                    word-break: break-all;
                    .value_style{
                        word-break: break-all;
                        max-width: 300px;
                        display: inline-block;
                        line-height: 17px;
                    }
                    .link_style{
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(61, 80, 255, 1);
                        line-height: 17px;
                        max-width: 300px;
                        display: inline-block;
                    }
                }
            }
            .see_more_button{
                padding: 14px 0;
                display: flex;
                cursor: pointer;

                .see_more_label{
                    color: rgba(61, 80, 255, 1);
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 14px;
                    &:hover{
                        color: #1E2CB4
                    }
                }
                .see_more_icon{
                    margin-left: 8px;
                    color: rgba(61, 80, 255, 1);
                    font-size: 14px;
                    line-height: 14px;
                    z-index: 1;
                    &:hover{
                        color: #1E2CB4;
                    }
                }
                .more_style{
                    transform: rotate(180deg);
                }
                .less_style{

                }
            }
        }
    }
</style>
