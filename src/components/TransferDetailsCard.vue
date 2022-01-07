<template>
    <div class="details_content">
        <div class="details_title">{{title}}</div>
        <ul class="details_item_content">
            <li class="details_item" v-for="(item,index) in details" :key="index">
                <span class="details_item_label">{{item.label}}</span>
                <span class="details_item_value" v-if="item.isFormatToken">{{formatToken(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatHeight">{{formatHeight(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{formatStatus(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span class="value_style" v-show="!isShowLink(details,item.value)">{{item.value}}</span>
                    <a class="link_style" v-show="isShowLink(details,item.value)" :href="setExplorerLink(details,item.value)" target="_blank" rel="noreferrer noopener">{{item.value}}</a>
                </span>
                <span class="details_item_value" v-else>{{item.value}}</span>
            </li>
            <li class="details_item" v-for="(item,index) in expandDetail" :key="index">
                <span class="details_item_label">{{item.label}}</span>
                <span class="details_item_value" v-if="item.isFormatToken">{{formatToken(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatHeight">{{formatHeight(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isFormatStatus">{{formatStatus(item.value)}}</span>
                <span class="details_item_value" v-else-if="item.isAddress">
                    <span class="value_style" v-show="!isShowLink(details,item.value)">{{item.value}}</span>
                    <a class="link_style" v-show="isShowLink(details,item.value)" :href="setExplorerLink(details,item.value)" target="_blank" rel="noreferrer noopener">{{item.value}}</a>
                </span>
                <span class="details_item_value" v-else>{{item.value}}</span>
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
        expandDetail:{
            type:Array,
            default: []
        }
    },
    setup(){
        const store = useStore();
        const formatToken = (token) => {
            if(typeof token?.amount === 'string' && token?.denom){
                const tokenInfo = Tools.findDenom(store.state.ibcBaseDenoms.value,token.denom)
                if(tokenInfo?.scale){
                    const amount = moveDecimal(token.amount,0 - tokenInfo.scale)
                    return `${amount} ${tokenInfo.symbol}`
                }

            }else if(Array.isArray(token.amount)){
                let tokenInfo = null,displayAmount = ''
                token.amount.forEach( item => {
                    if(item?.denom){
                        tokenInfo = Tools.findDenom(store.state.ibcBaseDenoms.value, item.denom)
                    }
                    if(tokenInfo?.scale){
                        const amount = moveDecimal(item.amount,0 - tokenInfo.scale)
                        displayAmount = `${amount} ${tokenInfo.symbol}`
                    }
                })
                if(displayAmount){
                    return  displayAmount
                }
            }
        }
        const formatHeight = (heightObj) => {
            if(Object.keys(heightObj)?.length){
                return `${heightObj.revision_number}-${heightObj.revision_height}`
            }
        }
        const formatStatus = (status) => {
            if(status == 1){
                return 'Success'
            }else if(status === 0) {
                return 'Failed'
            }
            return  ''
        }
        const getAddressPrefix = (address) => {
            if(address){
                return address?.toString().substr(0,3)
            }
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
        return {
            formatToken,
            formatHeight,
            formatStatus,
            isShowLink,
            setExplorerLink
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
        }
    }
</style>
