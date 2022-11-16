<template>
    <a-popover
        overlay-class-name="relayers_chain_popover"
        destroy-tooltip-on-hide
        placement="right"
    >
        <template #content>
            <div class="chain_popover_c">
                <div
                    v-for="(chain, index) in displayChainList"
                    :key="chain.chainName + chain.chainLogo"
                    class="chain_popover_c__item"
                    :class="{
                        chain_popover_c__item_last:
                            displayChainList.length - 1 === index && !showViewAll
                    }"
                >
                    <div class="chain_popover_c__item__chain">
                        <div class="chain_popover_c__item__chain__img_c">
                            <img :src="chain.chainLogo" alt="" />
                        </div>
                        <span class="chain_popover_c__item__chain__text">{{
                            chain.chainName
                        }}</span>
                    </div>
                    <div
                        v-for="address in chain.address"
                        :key="address"
                        class="chain_popover_c__item__address"
                    >
                        <div class="chain_popover_c__item__address__img_c">
                            <img src="@/assets/home/address.png" alt="address_icon" />
                        </div>
                        <span class="chain_popover_c__item__address__text">{{ address }}</span>
                    </div>
                </div>
                <div
                    v-show="showViewAll"
                    class="chain_popover_c__bottom"
                    @click="goRelayersDetails(props.isRegistered, props.relayerId)"
                >
                    <div class="chain_popover_c__bottom__ellipsis">……</div>
                    <div class="chain_popover_c__bottom__botton">
                        <span>View All</span>
                        <i class="iconfont icon-turnto"></i>
                    </div>
                </div>
            </div>
        </template>
        <div class="chain_popover_content">{{ props.servedChainsNum }}</div>
    </a-popover>
</template>

<script setup lang="ts">
    import { useGoRelayersDetails } from '../composable';
    import { useChainPopover } from './composable';
    import { ChainPopoverChainItem } from '@/types/interface/relayers.interface';

    interface IProps {
        servedChainsNum: number;
        relayerId: string;
        isRegistered: boolean;
        changeModal: (flag: boolean) => void;
        chainList: ChainPopoverChainItem[];
    }

    const props = defineProps<IProps>();
    const { chainList } = toRefs(props);
    const { showViewAll, displayChainList } = useChainPopover(chainList);

    const { goRelayersDetails } = useGoRelayersDetails(props.changeModal);
</script>
<style lang="less" scoped>
    :global(.relayers_chain_popover .ant-popover-inner-content) {
        padding: 0;
    }
    .chain_popover_content {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
    }
    .chain_popover_c {
        padding: 4px 16px 0 12px;
        &__item {
            min-width: 386px;
            padding: 8px 0 0 0;
            border-bottom: 1px solid #ebebeb;
            &__chain {
                .flex(row,nowrap);
                margin-bottom: 8px;
                &__img_c {
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                &__text {
                    font-size: 16px;
                    font-family: GolosUI_Medium;
                    font-weight: 500;
                    color: #000000;
                    line-height: 20px;
                }
            }
            &__address {
                .flex(row,nowrap);
                margin-bottom: 8px;
                &__img_c {
                    width: 20px;
                    height: 20px;
                    margin-right: 4px;
                    .flex(row,nowrap,center,center);
                    img {
                        display: block;
                        width: 12px;
                        height: 14px;
                    }
                }
                &__text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #000000;
                    line-height: 18px;
                }
            }
        }
        &__item_last {
            border-bottom: none;
        }
        &__bottom {
            margin: 8px 0;
            height: 18px;
            .flex(row,nowrap,space-between);
            &__ellipsis {
                font-size: 14px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.75);
            }
            &__botton {
                .flex(row,nowrap,center,center);
                cursor: pointer;
                span {
                    margin-right: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--bj-primary-color);
                    line-height: 18px;
                }
                .iconfont {
                    color: var(--bj-primary-color);
                    margin-top: 1px;
                }
            }
        }
    }
</style>
