<template>
    <InfoCard
        class="relayed_trend_c"
        icon="icon-Trend"
        title="Last 30D Relayed Trend"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedTrendChoose"
        @change-choose-btn="relayedTrendChooseBtnFn"
    >
        <loading-component v-if="relayedTrendLoading" :type="LoadingType.container" :height="300" />
        <no-datas
            v-else-if="relayedTrendNoDataType"
            class="relayed_trend_c__abnormal"
            :type="relayedTrendNoDataType"
        />
        <div v-else class="relayed_trend_c__chart_wrap flex flex-col">
            <value-txs
                class="relayed_trend_c__chart_wrap__btn"
                :default-choose-btn="relayedTrendChoose"
                @change-choose-btn="relayedTrendChooseBtnFn"
            />
            <div ref="relayedTrendDom" class="relayed_trend_c__chart_wrap__chart"></div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { LoadingType } from '@/constants';
    import { useRelayedTrend } from '../composable';

    const {
        relayedTrendDom,
        relayedTrendChoose,
        relayedTrendChooseBtnFn,
        relayedTrendLoading,
        relayedTrendNoDataType
    } = useRelayedTrend();
</script>

<style lang="less" scoped>
    .relayed_trend_c {
        max-width: 756px;
        :deep(.info_card__primary) {
            padding: 0 24px 24px 24px;
        }
        &__abnormal {
            margin: 0 auto;
            height: 300px;
        }
        &__chart_wrap {
            width: 100%;
            &__btn {
                display: none;
            }
            &__chart {
                min-width: 418px;
                height: 300px;
            }
        }
    }
    // 1247px
    @media screen and (max-width: 1183px) {
        .relayed_trend_c {
            width: 100%;
            max-width: 100%;
            :deep(.info_card__primary) {
            }
            &__chart_wrap {
                &__btn {
                }
                &__chart {
                }
            }
        }
    }
    @media screen and (max-width: 560px) {
        .relayed_trend_c {
            :deep(.info_card__primary) {
                padding: 0 16px 16px 16px;
            }
            &__chart_wrap {
                &__btn {
                }
                &__chart {
                }
            }
        }
    }
    @media screen and (max-width: 500px) {
        .relayed_trend_c {
            :deep(.info_card__title_wrap) {
                .info_card__choose_btn {
                    display: none;
                }
            }
            :deep(.info_card__primary) {
                padding: 8px 16px 16px;
            }
            &__chart_wrap {
                padding: 0 0 16px 0;
                width: 100%;
                overflow-x: auto;
                &__btn {
                    display: inline-block;
                    align-self: flex-end;
                }
                &__chart {
                }
            }
        }
    }
</style>
