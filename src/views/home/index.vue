<template>
    <div class="home">
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
                <div class="home__bottom__left__bottom">
                    <layer-block
                        title="IBC Tokens"
                        style="margin-top: 32px"
                        show-tip
                        :tip-msg="tipMsg"
                    >
                        <statistic-list
                            type="vertical"
                            :msg="ibcStatisticsDenoms"
                            @click-item="onClickViewAll"
                        />
                    </layer-block>
                    <layer-block title="Relayers" style="margin-top: 32px">
                        <statistic-list
                            type="vertical"
                            :msg="ibcStatisticsRelayer"
                            @click-item="onClickViewAll"
                        />
                    </layer-block>
                </div>
            </div>
            <layer-block class="home__bottom__right" title="IBC Token Transfers">
                <statistic-list
                    type="horizontal"
                    :msg="ibcStatisticsTxs"
                    @click-item="onClickViewAll"
                />
                <transfer-list
                    :transfer-list="homeIbcTxs"
                    @click-view-all="
                        onClickViewAll(IBC_STATISTICS_TXS_DEFAULT.tx_all.statistics_name)
                    "
                    @item-did-expand="setExpandByIndex"
                />
            </layer-block>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ChainsInfo from './components/ChainsInfo.vue';
    import ChainsListInfo from './components/ChainsListInfo.vue';
    import TransferList from './components/TransferList.vue';
    import { useIbcChains } from '@/composables';
    import { useIbcTxs, useInterfaceActive } from './composable';
    import { PAGE_PARAMETERS, IBC_STATISTICS_TXS_DEFAULT } from '@/constants/index';
    import { useIbcStatistics } from '@/composables/home';
    import { DATA_REFRESH_GAP } from '@/constants/home';
    const {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsRelayer,
        ibcStatisticsTxs,
        intervalFunction
    } = useIbcStatistics(DATA_REFRESH_GAP);

    const { ibcChains, lifeFunction } = useIbcChains(DATA_REFRESH_GAP);
    const { homeIbcTxs, setExpandByIndex } = useIbcTxs(DATA_REFRESH_GAP);
    const { tipMsg, onClickViewAll, onMenuSelected } = useInterfaceActive();
    lifeFunction();
    intervalFunction();
</script>

<style lang="less">
    .home {
        box-sizing: border-box;
        padding: 48px 0 100px 0;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;

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
                margin-right: 24px;
                width: 274px;
                &__bottom {
                }
            }
            &__right {
                flex: 1;
                max-width: 902px;
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
                    margin-right: 0;
                    width: 100%;
                    &__bottom {
                        .flex(row, nowrap, flex-start, center);
                        .block {
                            width: 50%;
                            &:nth-of-type(2) {
                                margin-left: 24px;
                            }
                        }
                    }
                }
                &__right {
                    margin-top: 40px !important;
                    width: 100%;
                    max-width: 100%;
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
                    &__bottom {
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .home {
            padding: 0 16px 60px 16px;
            &__top {
                margin-top: 48px !important;
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
                    &__bottom {
                        .flex(column, nowrap, flex-start, flex-start);
                        .block {
                            width: 100%;
                            &:nth-of-type(2) {
                                margin-left: 0;
                            }
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
</style>
