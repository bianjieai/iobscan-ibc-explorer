<template>
    <div class="home">
        <header-input class="header_input_layout" @pressedEnter="onPressEnter" disabled />
        <layer-block class="home_top" title="Chains" type="dark">
            <div class="home_top_slot">
                <div class="home_top_left">
                    <chains-info :msg="ibcStatisticsChains.chains_24hr" @click="onClickViewAll(pageParameters.chains)" />
                    <chains-info :msg="ibcStatisticsChains.chain_all" style="margin-top: 18px;"
                        @click="onClickViewAll(pageParameters.chains)" />
                </div>
                <div class="home_top_right">
                    <!-- todo duanjie 事件传参，可优化，未细看 -->
                    <chains-list-info :chainList="ibcChains" @onMenuSelected="onMenuSelected" @clickItem="onClickViewAll" />
                </div>
            </div>
        </layer-block>
        <div class="home_bottom">
            <div class="home_bottom_left">
                <layer-block title="Channel Pairs">
                    <statistic-list type="vertical" :msg="ibcStatisticsChannels" @clickItem="onClickViewAll" />
                </layer-block>

                <layer-block title="IBC Tokens" style="margin-top: 47px" showTip :tipMsg="tipMsg">
                    <statistic-list  type="vertical" :msg="ibcStatisticsDenoms" @clickItem="onClickViewAll" />
                </layer-block>
            </div>
            <layer-block class="home_bottom_right" title="IBC Token Transfer">
                <statistic-list type="horizontal" :msg="ibcStatisticsTxs" @clickItem="onClickViewAll" />
                <transfer-list :ibcChains="ibcChains" :transferList="ibcTxs.value" @clickViewAll="onClickViewAll(ibcStatisticsTxsDefault.tx_all.statistics_name)"
                    @clickItem="onClickViewAll" @itemDidExpand="setExpandByIndex"/>
            </layer-block>
        </div>
    </div>
</template>

<script setup>
// import HeaderInput from '../../components/HeaderInput.vue';
// import LayerBlock from '../../components/LayerBlock.vue';
// import ChainsInfo from './components/ChainsInfo.vue';
// import ChainsListInfo from './components/ChainsListInfo.vue';
// import StatisticList from './components/StatisticList.vue';
// import TransferList from './components/TransferList.vue';
import { onMounted,onBeforeUnmount } from 'vue';
import { useIbcStatistics, useIbcChains, useIbcTxs, useInterfaceActive, useClearInterval, useGetIbcDenoms } from './composable';
import { useOnPressEnter } from '../../layout/hooks/useStarAnimation';
import { pageParameters, ibcStatisticsTxsDefault } from '../../constants';
const {
    ibcStatisticsChains,
    ibcStatisticsChannels,
    ibcStatisticsDenoms,
    ibcStatisticsTxs,
    getIbcStatistics 
} = useIbcStatistics();
const { ibcChains, getIbcChains } = useIbcChains();
const { limitIbcTxs, ibcTxs, getIbcTxs, setExpandByIndex } = useIbcTxs();
const { tipMsg, onClickViewAll, onMenuSelected } = useInterfaceActive();
const { getIbcDenoms, getIbcBaseDenom } = useGetIbcDenoms();
useClearInterval();
const { onPressEnter } = useOnPressEnter();
onMounted(() => {
    getIbcStatistics();
    !sessionStorage.getItem('allChains') && getIbcChains();
    getIbcTxs({page_num: 1, page_size: 100, use_count: false});
    getIbcDenoms();
    !sessionStorage.getItem('ibcBaseDenom') && getIbcBaseDenom();
})
onBeforeUnmount(() => {
    limitIbcTxs();
})
</script>

<style lang="less">
.home {
    box-sizing: border-box;
    padding: 48px 0 100px 0;
    width: 100%;
    max-width: 1200px;
    & .header_input_layout {
        display: none;
    }

    &_top {
        width: 100%;

        &_slot {
            .flex(row, nowrap, space-between, center);
            box-sizing: border-box;
            padding: 24px;
            width: 100%;
            max-width: 1200px;
        }
        &_left {}
        &_right {
            margin-left: 17px;
            width: 100%;
        }
    }
    &_bottom {
        .flex(row, nowrap, space-between, flex-start);
        margin-top: 24px;
        width: 100%;
        &_left {
        }
        &_right {
            flex: 1;
            margin-left: 24px;
        }
    }
}

@media screen and (max-width: 1200px) {
    .home {
        padding: 48px 32px 100px 32px;
        &_top {
            width: 100%;
            &_slot {
                .flex(column, nowrap, center, center);
                width: 100%;
            }
            &_left {
                width: 100%;
                .ibc_selected_title {
                    width: 100%;
                }
            }
            &_right {
                margin-top: 24px;
                margin-left: 0;
                width: 100%;
            }
        }
        &_bottom {
            .flex(column, nowrap, flex-start, flex-start);
            margin-top: 24px;
            width: 100%;
            &_left {
                width: 100%;
            }
            &_right {
                margin-top: 24px;
                margin-left: 0;
                width: 100%;
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .home {
        padding: 36px 16px 48px 16px;
        &_top {
            &_slot {
                .flex(column, nowrap, center, center);
            }
            &_left {
                .ibc_selected_title {}
            }
            &_right {
                margin-top: 24px;
                margin-left: 0;
                width: 100%;
            }
        }
        &_bottom {
            &_left {}
            &_right {}
        }
    }
}
@media screen and (max-width: 530px) {
    .home {
        padding: 16px 16px 48px 16px;
        & .header_input_layout {
            display: inline-block;
            .flex(row, nowrap, flex-start, center);
        }
        &_top {
            margin-top: 48px;
            &_slot {}
            &_left {
                .ibc_selected_title {}
            }
            &_right {}
        }
        &_bottom {
            &_left {}
            &_right {}
        }
    }
}
</style>