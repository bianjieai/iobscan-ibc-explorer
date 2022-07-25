<template>
    <div class="list_item">
        <div class="list_item_wrap" :class="!item.expanded? '': 'list_item_line_hidden'">
            <div class="list_item_expand_btn" @click="onClickExpandBtn">
                <img :src="!item.expanded ? expandImg : packUpImg " alt="">
            </div>
            <div class="list_item_info" :class="!item.expanded? 'list_item_line': ''">
                <span class="list_item_number">{{ prefixInteger(index + 1, 3) }}</span>
                <router-link class="list_item_link" :to="item.status === ibcTxStatus.SUCCESS ? `/tokens/details?denom=${item.base_denom}&chain=${item.dc_chain_id}` : `/tokens/details?denom=${item.base_denom}&chain=${item.sc_chain_id}`">
                    <img class="list_item_icon" :src="item.symbolIcon || tokenDefaultImg" alt="icon" />
                </router-link>
                <div class="list_subItem" :style="{ borderBottom: isFinal ? '' : '1px solid rgba(0, 0, 0, 0.2)' }">
                    <router-link :to="item.status === ibcTxStatus.SUCCESS ? `/tokens/details?denom=${item.base_denom}&chain=${item.dc_chain_id}` : `/tokens/details?denom=${item.base_denom}&chain=${item.sc_chain_id}`" class="list_subItem_title_container">
                        <span class="list_subItem_value">{{ formatNum(item.symbolNum) || 0 }}</span>
                        <a-tooltip placement="topLeft">
                            <template #title>{{ item.symbolDenom || "" }}</template>
                            <span class="list_subItem_title">{{ item.symbolDenom || "" }}</span>
                        </a-tooltip>
                    </router-link>
        
                    <div class="list_subItem_adress_container">
                        <hash-addr-icon :item="item" :ibcChains="ibcChains"></hash-addr-icon>
                        <p class="list_item_ago">{{ item.parseTime }} ago</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="out_hash_wrap" v-if="item.expanded">
            <hash-addr-icon :item="item" :ibcChains="ibcChains"></hash-addr-icon>
        </div>
    </div>
</template>

<script setup>
import HashAddrIcon from './HashAddrIcon.vue';
import { computed, watch } from 'vue';
import {
    getRestString, getLasttyString, prefixInteger, formatNum,
} from '../../../helper/parseString';
import tokenDefaultImg from '../../../assets/token-default.png';
import expandImg from '../../../assets/expand.png';
import packUpImg from '../../../assets/pack_up.png';
import { chainAddressPrefix, tableChainIDs, ibcTxStatus } from "../../../constants";
import { useIsExpand } from '../hooks/useTransferList';
const props = defineProps({
    isFinal: Boolean,
    index: Number,
    item: Object,
    ibcChains: Object
})
const emits = defineEmits(['clickItem','clickViewAll','itemDidExpand']);

const { onClickExpandBtn } = useIsExpand(emits, props.index);

const clickListItem = () => {
    emits('clickItem', props.item);
};

// todo duanjie 这个方法工程中写了3次，需抽离
const getAddressPrefix = (address) => {
    if (address) {
        return address?.toString().substr(0, 3)
    }
    return '--'
}
// todo duanjie 这个方法工程中写了3次，需抽离
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

</script>

<style lang="less" scoped>
.list_item {
    .flex(row, nowrap, space-between, center);
    padding: 0 16px 0 0;
    height: 78px;
    &_wrap {
        width: 100%;
    }
    &_line_hidden {
            border-bottom: none;
        }
    &_expand_btn {
        display: none;
    }
    &_info{
        .flex(row, nowrap, space-between, center);
        height: 100%;
        .list_subItem {
            .flex(row, nowrap, space-between, center);
            padding: 14px 0;
            width: 100%;
            &_adress_container {
                flex: 1;
                .flex(row, nowrap, space-between, center);
            }
            &_title_container {
                .flex(column, nowrap, space-between, flex-start);
                width: 100%;
                max-width: 150px;
                &:hover {
                    .list_subItem_value {
                        color: var(--bj-primary-color);
                    }
                    .list_subItem_title {
                        color: var(--bj-primary-color);
                    }
                }
            }
            &_value {
                width: 100%;
                text-align: left;
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.75);
                line-height: var(--bj-font-size-normal);
            }

            &_title {
                text-align: left;
                margin-top: 4px;
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: var(--bj-text-third);
                line-height: var(--bj-font-size-normal);
                width: 150px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    &_line{
        a {
            cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
        }
        
    }
    &_ago {
        width: 150px;
        text-align: right;
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: var(--bj-font-color-65);
        line-height: var(--bj-font-size-normal);
    }
    &_number {
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: var(--bj-text-third);
        line-height: var(--bj-font-size-normal);
        margin: 0 0 0 8px;
    }
    &_link {
        // margin: 0 24px 0 18px;
        cursor: url("/src/assets/mouse/shiftlight_mouse.png"), default ;
    }
    &_icon {
        width: 40px;
        border-radius: 50%;
        margin: 0 24px 0 12px;
    }
    & .out_hash_wrap {
        display: none;
    }

}
@media screen and (max-width: 970px) {
    .list_item {
        .flex(column, nowrap, space-between, center);
        height: auto;
        &_wrap {
            .flex(row, nowrap, space-between, center);
        }
        &_line_hidden {
            border-bottom: none;
        }
        &_expand_btn {
            display: block;
            img {
                width: 16px;
                height: 16px;
            }
        }
        &_info{
            width: 100%;
            .list_subItem {
                border-bottom: 0 !important;
                &_adress_container {
                    .flex(row, nowrap, flex-end, center);
                    .out_hash {
                        display: none;
                    }
                }
                &_title_container {
                    overflow: auto;
                    text-overflow: ellipsis;
                }
                &_value {}

                &_title {
                    width: 100%;
                }
            }
        }
        &_line{
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        &_ago {}
        &_number {}

        &_icon {}
        & .out_hash_wrap {
            .flex(row, nowrap, center, center);
            padding: 12px 0;
            width: 100%;
            background: #F5F7FC;
        }
    }
}
@media screen and (max-width: 600px) {
    .list_item {
        width: 100%;
        &_wrap {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        &_line_hidden {
            border-bottom: none;
        }
        &_expand_btn {
            img {}
        }
        &_info{
            border-bottom: 0;
            & a {
                img {
                    margin: 0 8px;
                    width: 32px;
                }
            }
            .list_subItem {
                &_adress_container {
                    .out_hash {}
                }
                &_title_container {
                    margin-left: 0;
                    margin-right: 0;
                }
                &_value {}
                &_title {}
            }
        }
        &_line{
            
        }
        &_ago {
            max-width: 70px;
        }
        &_number {
            margin-left: 4px;
        }

        &_icon {}
        & .out_hash_wrap {
            .out_hash {
                .flex(column, nowrap, flex-start, flex-start);
            }
        }
    }
}
</style>
