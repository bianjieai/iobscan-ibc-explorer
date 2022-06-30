<template>
    <div class="out_hash">
        <div class="out_hash_address_wrap">
            <router-link :to="`/chains`">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.sc_chain_id)" />
            </router-link>
            <!-- <router-link :to="`/chains/details?chain_id=${item.sc_chain_id}`">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.sc_chain_id)" />
            </router-link> -->
    
            <div class="out_hash_container">
                <span class="out_hash_value">
                    <img class="out_hash_icon" src="../../../assets/tx.png" alt="icon" />
                    <a-popover destroyTooltipOnHide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.sc_tx_info.hash }}</p>
                            </div>
                        </template>
                        <router-link :to="`/transfers/details?hash=${item.sc_tx_info.hash}`">
                            <span class="hover">{{ getRestString(item.sc_tx_info.hash, 6, 5) }}</span>
                        </router-link>
                    </a-popover>
                </span>
                <span class="out_hash_value" style="margin-top: 14px;">
                    <img class="out_hash_icon" src="../../../assets/address.png" alt="icon" />
                    <a-popover destroyTooltipOnHide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.sc_addr }}</p>
                            </div>
                        </template>
                        <!--                <router-link :to="`/address/details?address=${item.sc_addr}`">
                    <span class="hover">{{ getRestString(item.sc_addr, 6, 5) }}</span>
                </router-link>-->
                        <span>{{ getRestString(item.sc_addr, 6, 6) || "--" }}</span>
                    </a-popover> 
                </span>
            </div>
        </div>

        <img class="status_icon" :src="getImageUrl(item.status)" alt="status" />
        <div class="out_hash_address_wrap">
            <router-link :to="`/chains`">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.dc_chain_id)" />
            </router-link>
            <!-- <router-link :to="`/chains/details?chain_id=${item.dc_chain_id}`">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.dc_chain_id)" />
            </router-link> -->
    
            <div class="out_hash_container">
                <span class="out_hash_value">
                    <img class="out_hash_icon" src="../../../assets/tx.png" alt="icon" />
                    <a-popover destroyTooltipOnHide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item?.dc_tx_info?.hash || "" }}</p>
                            </div>
                        </template>
                        <router-link v-if="item?.dc_tx_info?.hash" :to="`/transfers/details?hash=${item.dc_tx_info.hash}`">
                            <span class="hover">{{ getRestString(item?.dc_tx_info?.hash || "", 6, 6) }}</span>
                        </router-link>
                        <span v-else></span>
                    </a-popover>
                </span>
                <span class="out_hash_value" style="margin-top: 14px;">
                    <img class="out_hash_icon" src="../../../assets/address.png" alt="icon" />
                    <a-popover destroyTooltipOnHide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.dc_addr }}</p>
                            </div>
                        </template>
                        <!--                <router-link :to="`/address/details?address=${item.dc_addr}`">
                        <span class="hover">{{ getRestString(item.dc_addr, 6, 6) }}</span>
                </router-link>-->
                        <span>{{ getRestString(item.dc_addr, 6, 6) || "--" }}</span>
                    </a-popover>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getRestString } from '../../../helper/parseString';
import { useFindIbcChainIcon } from '../hooks/useTransferList'; 
const props = defineProps({
    item: Object,
    ibcChains: Object
})
const { findIbcChainIcon } = useFindIbcChainIcon(props);

const getImageUrl = (name) => {
    return new URL(`../../../assets/status${name}.png`, import.meta.url).href
}
</script>

<style lang="less" scoped>
.out_hash {
    .flex(row, nowrap, space-between, center);
    &_address_wrap {
        .flex(row, nowrap, space-between, center);
        & a {
            cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
        }
    }
    &_address_icon {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
    &_container {
        .flex(column, nowrap, flex-start, flex-start);
    }
    &_value {
        .flex(row, nowrap, flex-start, center);
        width: 100%;
        min-width: 150px;
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: var(--bj-font-color-65);
        line-height: var(--bj-font-size-normal);
        cursor: text;
        & .hover {
            color: var(--bj-font-color-65);
            cursor: url("../../../assets/mouse/shiftlight_mouse.png"), default !important;
            &:hover {
                color: var(--bj-primary-color);
            }
        }
    }
    &_icon {
        width: 14px;
        margin-right: 10px;
    }
}
.status_icon {
    width: 22px;
    margin: 0 16px;
}
.tip {
    &_color {
        color: var(--bj-font-color-65);
    }
}
@media screen and (max-width: 600px) {
    .status_icon {
        margin: 7px 0 7px 10px;
        height: auto;
        transform: rotateZ(90deg);
    }
}
</style>