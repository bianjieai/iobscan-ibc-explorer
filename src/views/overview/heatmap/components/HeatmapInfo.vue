<template>
    <div class="token_info">
        <div class="token_info__top">
            <p class="token_info__text">{{
                `The IBC token market is valued at $${heatmapTotalInfo.total_market_cap}, and on average a ${heatmapTotalInfo.market_cap_growth_rate}% ${heatmapTotalInfo.market_cap_trend_desc} over the last day.`
            }}</p>
            <p class="token_info__text">{{
                `The total marketcap for stablecoins is $${heatmapTotalInfo.stablecoins_market_cap}.`
            }}</p>
            <p class="token_info__text">{{
                `The total IBC transfer volume over the last 24 hours is $${heatmapTotalInfo.total_transfer_volume}.`
            }}</p>
            <p class="token_info__text">{{
                `ATOM's price is currently $${heatmapTotalInfo.atom_price}.`
            }}</p>
            <p class="token_info__text">{{
                `ATOM Dominance is currently ${heatmapTotalInfo.atom_dominance}%.`
            }}</p>
        </div>
        <div class="token_info__bottom">
            <span
                v-for="(item, index) in legendPrecent"
                :key="item.label"
                class="token_info__legend cursor"
                :style="{
                    color: item.status ? '#fff' : 'rgba(0, 0, 0, 0.15)',
                    backgroundColor: item.status ? item.bgColor : '#EEF0F6'
                }"
                @click="changeCurrentLegend(index)"
            >
                {{ item.label }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { HEATMAP_COLOR } from '@/constants/overview';
    import type { IResponseHeatmapTotalInfoFormat } from '@/types/interface/overview.interface';

    interface IHeatmapInfo {
        heatmapTotalInfo: IResponseHeatmapTotalInfoFormat;
    }
    defineProps<IHeatmapInfo>();
    const emits = defineEmits<{
        (e: 'changeChooseLegend', legendPrecent: string[]): void;
    }>();

    const legendPrecent = reactive(
        Object.keys(HEATMAP_COLOR).map((key) => {
            return {
                label: key,
                bgColor: HEATMAP_COLOR[key],
                status: true
            };
        })
    );
    const changeCurrentLegend = (currentLegendIndex: number) => {
        legendPrecent[currentLegendIndex].status = !legendPrecent[currentLegendIndex].status;
        const filterData = legendPrecent.filter((item) => item.status);
        emits(
            'changeChooseLegend',
            filterData.map((item) => item.label)
        );
    };
</script>

<style lang="less" scoped>
    .token_info {
        .flex(column, nowrap, space-between, flex-start);
        min-height: 528px;
        &__top {
            flex: 1;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
        &__text {
            margin-top: 24px;
            &:first-child {
                margin-top: 0;
            }
        }
        &__bottom {
            .flex(row, nowrap);
        }
        &__legend {
            position: relative;
            .flex(row, nowrap, center, center);
            min-width: 50px;
            min-height: 26px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            line-height: 18px;
            &::after {
                position: absolute;
                top: 0;
                right: 0;
                content: '';
                width: 1px;
                height: 26px;
                background: #fff;
            }
            &:first-child {
                border-radius: 4px 0 0 4px;
            }
            &:last-child {
                border-radius: 0 4px 4px 0;
                &::after {
                    width: 0;
                }
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .token_info {
            &__top {
            }
            &__text {
            }
            &__bottom {
            }
            &__legend {
                min-width: 42px;
            }
        }
    }
    @media screen and (max-width: 1176px) {
        .token_info {
            min-height: auto;
            &__top {
            }
            &__text {
                margin-top: 0;
            }
            &__bottom {
                margin-top: 24px;
                width: 100%;
            }
            &__legend {
                width: 14.3%;
            }
        }
    }
</style>
