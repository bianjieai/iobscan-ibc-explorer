<template>
    <div class="out_hash">
        <div class="out_hash_address_wrap">
            <div class="out_hash_address_link">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.sc_chain_id)" />
            </div>
            <div class="out_hash_container">
                <span class="out_hash_value">
                    <img class="out_hash_icon" src="../../../assets/tx.png" alt="icon" />
                    <a-popover v-if="item.sc_tx_info.hash" destroy-tooltip-on-hide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.sc_tx_info.hash }}</p>
                            </div>
                        </template>
                        <span class="hover">{{ getRestString(item.sc_tx_info.hash, 6, 5) }}</span>
                    </a-popover>
                    <span v-else>--</span>
                </span>
                <span class="out_hash_value" style="margin-top: 14px">
                    <img class="out_hash_icon" src="../../../assets/address.png" alt="icon" />
                    <a-popover destroy-tooltip-on-hide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.sc_addr }}</p>
                            </div>
                        </template>
                        <span>{{ getRestString(item.sc_addr, 6, 6) || '--' }}</span>
                    </a-popover>
                </span>
            </div>
        </div>

        <img class="status_icon" :src="getImageUrl(item.status)" alt="status" />
        <div class="out_hash_address_wrap">
            <div class="out_hash_address_link">
                <img class="out_hash_address_icon" :src="findIbcChainIcon(item.dc_chain_id)" />
            </div>

            <div class="out_hash_container">
                <span class="out_hash_value">
                    <img class="out_hash_icon" src="../../../assets/tx.png" alt="icon" />
                    <a-popover v-if="item?.dc_tx_info?.hash" destroy-tooltip-on-hide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item?.dc_tx_info?.hash || '' }}</p>
                            </div>
                        </template>
                        <span class="hover">{{ getRestString(item?.dc_tx_info?.hash || '', 6, 6) }}</span>
                    </a-popover>
                    <span v-else>--</span>
                </span>
                <span class="out_hash_value" style="margin-top: 14px">
                    <img class="out_hash_icon" src="../../../assets/address.png" alt="icon" />
                    <a-popover destroy-tooltip-on-hide>
                        <template #content>
                            <div>
                                <p class="tip_color">{{ item.dc_addr }}</p>
                            </div>
                        </template>
                        <span>{{ getRestString(item.dc_addr, 6, 6) || '--' }}</span>
                    </a-popover>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getRestString } from '../../../helper/parseStringHelpers';
    import { useFindIbcChainIcon } from '../composable/useTransferList';
    const props = defineProps({
        item: {
            type: Object,
            required: true
        },
        ibcChains: {
            type: Object,
            required: true
        }
    });
    const { findIbcChainIcon } = useFindIbcChainIcon(props);

    const getImageUrl = (name) => {
        return new URL(`../../../assets/status${name}.png`, import.meta.url).href;
    };
</script>

<style lang="less" scoped>
    .out_hash {
        .flex(row, nowrap, space-between, center);
        &_address_wrap {
            .flex(row, nowrap, space-between, center);
        }
        &_address_link {
            margin: 0 10px 0 0;
        }
        &_address_icon {
            width: 24px;
            height: 24px;
            // margin: 0 10px;
            border-radius: 50%;
        }
        &_container {
            .flex(column, nowrap, flex-start, flex-start);
        }
        &_value {
            .flex(row, nowrap, flex-start, center);
            width: 100%;
            min-width: 145px;
            font-size: var(--bj-font-size-normal);
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-normal);
            & .hover {
                color: var(--bj-font-color-65);
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
            margin: 7px 0 7px 1px;
            height: auto;
            transform: rotateZ(90deg);
        }
    }
</style>
