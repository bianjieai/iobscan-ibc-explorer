<template>
    <div class="home">
        <header-input class="home__header_input_layout" disabled @pressed-enter="onPressEnter" />
        <layer-block class="home__top" title="Chains" type="dark">
            <div class="home__top__slot">
                <div class="home__top__left">
                    <chains-info
                        :msg="ibcStatisticsChains.chains_24hr"
                        @click="onClickViewAll(PAGE_PARAMETERS.chains)"
                    />
                    <chains-info
                        :msg="ibcStatisticsChains.chain_all"
                        style="margin-top: 18px"
                        @click="onClickViewAll(PAGE_PARAMETERS.chains)"
                    />
                </div>
                <div class="home__top__right">
                    <chains-list-info
                        :chain-list="ibcChains"
                        @on-menu-selected="onMenuSelected"
                        @click-item="onClickViewAll"
                    />
                </div>
            </div>
        </layer-block>
        <div class="home__bottom">
            <div class="home__bottom__left">
                <layer-block title="Channel Pairs">
                    <statistic-list
                        type="vertical"
                        :msg="ibcStatisticsChannels"
                        @click-item="onClickViewAll"
                    />
                </layer-block>

                <layer-block title="IBC Tokens" style="margin-top: 47px" show-tip :tip-msg="tipMsg">
                    <statistic-list
                        type="vertical"
                        :msg="ibcStatisticsDenoms"
                        @click-item="onClickViewAll"
                    />
                </layer-block>
            </div>
            <layer-block class="home__bottom__right" title="IBC Token Transfer">
                <statistic-list
                    type="horizontal"
                    :msg="ibcStatisticsTxs"
                    @click-item="onClickViewAll"
                />
                <transfer-list
                    :ibc-chains="ibcChains"
                    :transfer-list="homeIbcTxs"
                    @click-view-all="onClickViewAll(ibcStatisticsTxsDefault.tx_all.statistics_name)"
                    @click-item="onClickViewAll"
                    @item-did-expand="setExpandByIndex"
                />
            </layer-block>
        </div>
    </div>
</template>

<script setup lang="ts">
    import LayerBlock from './components/LayerBlock.vue';
    import ChainsInfo from './components/ChainsInfo.vue';
    import ChainsListInfo from './components/ChainsListInfo.vue';
    import StatisticList from './components/StatisticList.vue';
    import TransferList from './components/TransferList.vue';
    import { useIbcChains } from '@/composables';
    import { useIbcTxs, useInterfaceActive } from './composable';
    import { useOnPressEnter } from '@/composables/useStarAnimation';
    import { PAGE_PARAMETERS, ibcStatisticsTxsDefault } from '@/constants/index';
    import { useIbcStatistics } from '@/composables/home';
    import { DATA_REFRESH_GAP } from '@/constants/home';
    const { ibcStatisticsChains, ibcStatisticsChannels, ibcStatisticsDenoms, ibcStatisticsTxs } =
        useIbcStatistics(DATA_REFRESH_GAP);

    const { ibcChains } = useIbcChains(DATA_REFRESH_GAP);
    const { homeIbcTxs, setExpandByIndex } = useIbcTxs(DATA_REFRESH_GAP);
    const { tipMsg, onClickViewAll, onMenuSelected } = useInterfaceActive();
    const { onPressEnter } = useOnPressEnter();
</script>

<style lang="less">
    .home {
        box-sizing: border-box;
        padding: 48px 0 100px 0;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        &__header_input_layout {
            display: none;
        }

        &__top {
            width: 100%;

            &__slot {
                .flex(row, nowrap, space-between, center);
                box-sizing: border-box;
                padding: 24px;
                width: 100%;
                max-width: 1200px;
            }
            &__left {
            }
            &__right {
                margin-left: 17px;
                width: 100%;
            }
        }
        &__bottom {
            .flex(row, nowrap, space-between, flex-start);
            margin-top: 24px;
            width: 100%;
            &__left {
            }
            &__right {
                flex: 1;
                margin-left: 24px;
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .home {
            padding: 48px 48px 100px 48px;
            &__top {
                width: 100%;
                &__slot {
                    .flex(column, nowrap, center, center);
                    width: 100%;
                }
                &__left {
                    width: 100%;
                    .ibc_selected_title {
                        width: 100%;
                    }
                }
                &__right {
                    margin-top: 24px;
                    margin-left: 0;
                    width: 100%;
                }
            }
            &__bottom {
                .flex(column, nowrap, flex-start, flex-start);
                margin-top: 24px;
                width: 100%;
                &__left {
                    width: 100%;
                }
                &__right {
                    margin-top: 24px;
                    margin-left: 0;
                    width: 100%;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .home {
            padding: 40px 32px 60px 32px;
            &__top {
                &__slot {
                    .flex(column, nowrap, center, center);
                }
                &__left {
                    .ibc_selected_title {
                    }
                }
                &__right {
                    margin-top: 24px;
                    margin-left: 0;
                    width: 100%;
                }
            }
            &__bottom {
                &__left {
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .home {
            padding: 24px 16px 60px 16px;
            &__header_input_layout {
                display: inline-block;
                .flex(row, nowrap, flex-start, center);
            }
            &__top {
                margin-top: 48px;
                &__slot {
                    padding: 16px;
                }
                &__left {
                    .ibc_selected_title {
                    }
                }
                &__right {
                }
            }
            &__bottom {
                &__left {
                }
                &__right {
                }
            }
        }
    }
</style>
