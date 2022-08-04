<template>
    <div class="card ibc_selected_title cursor">
        <img
            class="card__img"
            :src="msg.statistics_name.indexOf(dayTime) !== -1 ? chains24hrImg : chainsAllImg"
            alt="chains_all"
        />
        <div class="card__content">
            <span class="card__content__name">
                {{ (statisticsName as any)[msg.statistics_name] }}
                <span v-if="msg.statistics_name.indexOf(dayTime) !== -1" class="card__content__tip"
                    >24hr</span
                >
            </span>
            <span class="card__content__value">{{
                `${formatBigNumber(msg.count, undefined)}`
            }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import chains24hrImg from '@/assets/home/chains_24hr.png';
    import chainsAllImg from '@/assets/home/chains_all.png';
    import { statisticsName } from '@/constants/index';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    import { dayTime } from '@/constants';

    defineProps({
        msg: {
            type: Object,
            required: true
        }
    });
</script>

<style lang="less" scoped>
    .card {
        .flex(row, nowrap, flex-start, center);
        width: 360px;
        height: 108px;
        background-image: url('../../../assets/home/card.png');
        background-position: center;
        background-size: cover;
        border-radius: 4px;
        &:hover {
            .card__content {
                &__value {
                    color: var(--bj-primary-color);
                }
            }
        }
        &__img {
            margin: 23px 29px;
            width: 60px;
        }
        &__content {
            .flex(column, nowrap, flex-start, flex-start);
            &__name {
                font-size: @font-size4;
                font-family: Montserrat-Regular, Montserrat;
                color: @font-color2;
                line-height: @font-size4;
                margin-bottom: 16px;
            }
            &__value {
                font-size: @font-size2;
                font-family: Montserrat-Regular, Montserrat;
                color: @font-color1;
                line-height: @font-size2;
                transition: color 0.3s ease;
            }
            &__tip {
                margin-left: 8px;
                padding: 0 4px;
                font-size: @font-size6;
                font-family: Montserrat-Regular, Montserrat;
                color: #3d50ff;
                line-height: @font-size6;
                background: rgba(61, 80, 255, 0.15);
                border-radius: 7px;
            }
        }
    }
</style>
