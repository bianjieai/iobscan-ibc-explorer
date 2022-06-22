<template>
    <div class="home">
        <header-input class="header_input_layout" @pressedEnter="onPressEnter" disabled />
        <layer-block class="home_top" title="Chains" type="dark">
            <div class="home_top_slot">
                <div class="home_top_left">
                    <chains-info :msg="ibcStatisticsChains.chains_24hr" @click="onClickViewAll('chains')" />
                    <chains-info :msg="ibcStatisticsChains.chain_all" style="margin-top: 18px;"
                        @click="onClickViewAll('chains')" />
                </div>
                <div class="home_top_right">
                    <chains-list-info :chainList="ibcChains" @onMenuSelected="onMenuSelected" @clickItem="onClickViewAll" />
                </div>
            </div>
        </layer-block>
        <div class="home_bottom">
            <div class="home_bottom_left">
                <layer-block title="Channels">
                    <statistic-list type="vertical" :msg="ibcStatisticsChannels" @clickItem="onClickViewAll" />
                </layer-block>

                <layer-block title="IBC Tokens" style="margin-top: 47px" showTip :tipMsg="tipMsg">
                    <statistic-list type="vertical" :msg="ibcStatisticsDenoms" @clickItem="onClickViewAll" />
                </layer-block>
            </div>

            <layer-block class="home_bottom_right" title="IBC Token Transfer">
                <statistic-list type="horizontal" :msg="ibcStatisticsTxs" @clickItem="onClickViewAll" />
                <transfer-list :ibcChains="ibcChains" :transferList="ibcTxs.value" @clickViewAll="onClickViewAll('tx_all')"
                    @clickItem="onClickViewAll" />
            </layer-block>
        </div>
    </div>
</template>

<script setup>
import HeaderInput from '../../components/HeaderInput.vue';
import LayerBlock from '../../components/LayerBlock.vue';
import ChainsInfo from './components/ChainsInfo.vue';
import ChainsListInfo from './components/ChainsListInfo.vue';
import StatisticList from './components/StatisticList.vue';
import TransferList from './components/TransferList.vue';
import { useIbcStatistics, useIbcChains, useIbcTxs, useInterfaceActive, useClearInterval, useGetIbcDenoms } from './composable';
import { useOnPressEnter } from '../../layout/hooks/useStarAnimation';
import { onMounted, onBeforeUnmount } from 'vue';
const {
    ibcStatisticsChains,
    ibcStatisticsChannels,
    ibcStatisticsDenoms,
    ibcStatisticsTxs,
    getIbcStatistics 
} = useIbcStatistics();
const { ibcChains, getIbcChains } = useIbcChains();
const { ibcTxs, getIbcTxs } = useIbcTxs();
const { tipMsg, onClickViewAll, onMenuSelected } = useInterfaceActive();
const { getIbcDenoms, getIbcBaseDenom } = useGetIbcDenoms();
const { clearInterval } = useClearInterval();
const { onPressEnter } = useOnPressEnter();

onMounted(() => {
    getIbcStatistics();
    !sessionStorage.getItem('allChains') && getIbcChains();
    getIbcTxs({page_num: 1, page_size: 10, use_count: false});
    getIbcDenoms();
    getIbcBaseDenom();
})
onBeforeUnmount(() => {
    clearInterval();
})
</script>

<style lang="less">
.home {
    box-sizing: border-box;
    padding: 48px 0 102px 0;
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
            margin-left: 24px;
            width: 100%;
        }
    }
}

@media screen and (max-width: 1200px) {
    .home {
        padding: 48px 32px 102px 32px;
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
                & .block {
                    width: 100%;
                    &_content {
                        width: 100%;
                        .statistic_list {
                            width: 100%;
                            .vertical_container {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                width: 100%;
                                .list_item {
                                    &:nth-of-type(2n+1) {
                                        .list_item_info {
                                            border-right: 1px solid rgba(151, 151, 151, 0.2);
                                        }
                                    }
                                    &:nth-of-type(2n){
                                        .list_item_info {
                                            padding-left: 24px;
                                        }
                                    }
                                    &:nth-of-type(3) {
                                        .list_item_divider {
                                            display: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &:nth-of-type(2) {
                        .block_content {
                            .statistic_list {
                                .vertical_container {
                                    .list_item {
                                        &:nth-of-type(2n+1) {
                                            .list_item_info {
                                            }
                                        }
                                        &:nth-of-type(2n){
                                            .list_item_info {
                                            }
                                        }
                                        &:nth-of-type(1) {
                                            .list_item_divider {
                                                display: none;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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
        padding: 24px 16px 48px 16px;
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
            &_right {
                & .block {
                    &_content {
                        .statistic_list {
                            .horizontal_container {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                width: 100%;
                                .list_item_horizontal {
                                    padding: 24px 0;
                                    width: 100%;
                                    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
                                    &:nth-of-type(2n) {
                                        .list_item_divider_vertical {
                                            display: none;
                                        }
                                    }
                                    &:nth-of-type(1) {
                                        padding-top: 0;
                                    }
                                    &:nth-of-type(2) {
                                        padding-top: 0;
                                    }
                                    &:nth-of-type(3) {
                                        padding-bottom: 0;
                                        border-bottom: 0;
                                    }
                                    &:nth-of-type(4) {
                                        padding-bottom: 0;
                                        border-bottom: 0;
                                    }
                                }
                            }
                        }
                        & .list_top{
                            .flex(column, nowrap, flex-start, flex-start);
                            &_name{
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
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
            &_slot {
            }
            &_left {
                .ibc_selected_title {}
            }
            &_right {
            }
        }
        &_bottom {
            &_left {
                & .block {
                    &_content {
                        .statistic_list {
                            .vertical_container {
                                grid-template-columns: repeat(1, 1fr);
                                .list_item {
                                    &:nth-of-type(2n+1) {
                                        .list_item_info {
                                            border-right: 0;
                                        }
                                    }
                                    &:nth-of-type(2n) {
                                        .list_item_info {
                                            padding-left: 0;
                                        }
                                    }
                                    &:nth-of-type(3) {
                                        .list_item_divider {
                                            display: block;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &:nth-of-type(2) {
                        .block_content {
                            .statistic_list {
                                .vertical_container {
                                    .list_item {
                                        &:nth-of-type(1) {
                                            .list_item_divider {
                                                display: block;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            &_right {
                .block_content {
                    .statistic_list {
                        .horizontal_container {
                            grid-template-columns: repeat(1, 1fr);
                            width: 100%;
                            .list_item_horizontal {
                                padding: 24px 0;
                                width: 100%;
                                border-bottom: 1px solid rgba(151, 151, 151, 0.2);
                                .list_item_divider_vertical {
                                    display: none;
                                }
                                &:nth-of-type(1) {
                                    padding-top: 0;
                                }
                                &:nth-of-type(2) {
                                    padding-top: 24px;
                                }
                                &:nth-of-type(3) {
                                    padding-bottom: 24px;
                                    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
                                }
                                &:nth-of-type(4) {
                                    border-bottom: 0;
                                }
                            }
                        }
                    }
                    & .list_top{
                        .flex(column, nowrap, flex-start, flex-start);
                        &_name{
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>