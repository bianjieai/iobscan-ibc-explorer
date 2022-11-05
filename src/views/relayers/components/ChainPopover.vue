<template>
    <!-- todo dj -->
    <!-- :default-visible="true" -->
    <a-popover
        overlay-class-name="relayers_chain_popover"
        destroy-tooltip-on-hide
        placement="right"
    >
        <template #content>
            <div class="chain_popover_c">
                <div class="chain_popover_c__item">
                    <div class="chain_popover_c__item__chain">
                        <div class="chain_popover_c__item__chain__img_c">
                            <img
                                src="https://iobscan.io/resources/xp-chains/irishub-1.png"
                                alt="chain_logo"
                            />
                        </div>
                        <span class="chain_popover_c__item__chain__text">Cosmos Hub</span>
                    </div>
                    <div class="chain_popover_c__item__address">
                        <div class="chain_popover_c__item__address__img_c">
                            <img src="@/assets/home/address.png" alt="address_icon" />
                        </div>
                        <span class="chain_popover_c__item__address__text"
                            >cosmos1u443493849384938498304</span
                        >
                    </div>
                </div>
                <div class="chain_popover_c__bottom" @click="goRelayerDetails">
                    <div class="chain_popover_c__bottom__ellipsis">……</div>
                    <div class="chain_popover_c__bottom__botton">
                        <span>View All</span>
                        <i class="iconfont icon-turnto"></i>
                    </div>
                </div>
            </div>
        </template>
        <span class="chain_popover_content">{{ props.servedChainsNum }}</span>
    </a-popover>
</template>

<script setup lang="ts">
    // todo dj 数据待组装处理
    interface chainItem {
        chainName: string;
        chainLogo: string;
        address: string[];
    }

    interface IProps {
        servedChainsNum: number;
        relayerId: string;
        chainList: chainItem[];
    }

    const props = withDefaults(defineProps<IProps>(), {
        relayerId: 'relayerId',
        chainList: () => {
            return [
                {
                    chainName: 'Cosmos Hub',
                    chainLogo: 'logo',
                    address: ['cosmos1rkr8dlz03q6t76mv65sqx28s3ydzgzz59j4w7s']
                }
            ];
        }
    });
    const router = useRouter();
    const goRelayerDetails = () => {
        router.push({
            path: '/relayers/details/' + props.relayerId
        });
    };
</script>
<style lang="less" scoped>
    :global(.relayers_chain_popover .ant-popover-inner-content) {
        padding: 0;
    }
    :global(.relayers_chain_popover .ant-popover-inner) {
        box-shadow: 0px 2px 8px 0px #d9deec;
    }
    .chain_popover_content {
        font-size: 14px;
        font-family: GolosUIWebRegular;
        font-weight: 400;
        color: #000000;
        line-height: 18px;
    }
    .chain_popover_c {
        padding: 4px 16px 0 12px;
        &__item {
            min-width: 386px;
            padding: 8px 0 6px 0;
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
                    font-family: GolosUIWebRegular;
                    font-weight: 400;
                    color: #000000;
                    line-height: 18px;
                }
            }
        }
        &__bottom {
            margin: 8px 0;
            height: 18px;
            .flex(row,nowrap,space-between);
            &__ellipsis {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.75);
            }
            &__botton {
                .flex(row,nowrap,center,center);
                cursor: pointer;
                span {
                    margin-right: 4px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: var(--bj-primary-color);
                    line-height: 18px;
                }
                .iconfont {
                    color: var(--bj-primary-color);
                }
            }
        }
    }
</style>
