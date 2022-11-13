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
            v-else-if="relayedTrendNoData || relayedTrendNetworkError"
            class="relayed_trend_c__abnormal"
            :text="relayedAbnormalText"
        />
        <div v-else class="relayed_trend_c__chart_wrap">
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
        relayedTrendNoData,
        relayedTrendNetworkError,
        relayedAbnormalText
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
                &__chart {
                }
            }
        }
    }
    @media screen and (max-width: 496px) {
        .relayed_trend_c {
            :deep(.info_card__title_wrap) {
                flex-direction: column;
                align-items: flex-start;
                border-bottom: none;
                padding: 0;
                .info_card__title {
                    padding: 12px 16px;
                    width: 100%;
                    border-bottom: 1px solid var(--bj-border-color);
                }
                .info_card__choose_btn {
                    margin: 8px 16px 0 0;
                    align-self: flex-end;
                }
            }
            :deep(.info_card__primary) {
                padding: 0 16px 18px 16px;
            }
            &__chart_wrap {
                padding: 0 0 16px 0;
                overflow-x: auto;
                &__chart {
                }
            }
        }
    }
</style>
