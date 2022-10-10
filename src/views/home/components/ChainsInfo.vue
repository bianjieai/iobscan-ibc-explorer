<template>
    <div class="card ibc_selected_title cursor">
        <img
            class="card__img"
            :src="msg.statistics_name.indexOf(DAY_TIME) !== -1 ? chains24hrImg : chainsAllImg"
            alt="chains_all"
        />
        <div class="card__content">
            <span class="card__content__name">
                {{ (STATISTICS_NAME as any)[msg.statistics_name] }}
                <span v-if="msg.statistics_name.indexOf(DAY_TIME) !== -1" class="card__content__tip"
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
    import { STATISTICS_NAME, DAY_TIME } from '@/constants';
    import { formatBigNumber } from '@/helper/parseStringHelper';

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
        padding: 19px 24px;
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
            margin-right: 24px;
            width: 60px;
        }
        &__content {
            .flex(column, nowrap, flex-start, flex-start);
            &__name {
                font-size: var(--bj-font-size-sub-title);
                color: var(--bj-font-color-65);
                line-height: var(--bj-font-size-sub-title);
                margin-bottom: 16px;
            }
            &__value {
                font-size: var(--bj-font-size-home-number);
                font-family: GolosUI_Medium;
                color: var(--bj-text-normal);
                line-height: var(--bj-font-size-home-number);
                transition: color 0.3s ease;
            }
            &__tip {
                margin-left: 8px;
                padding: 0 4px;
                font-size: var(--bj-font-size-small);
                color: #3d50ff;
                line-height: var(--bj-font-size-small);
                background: rgba(61, 80, 255, 0.15);
                border-radius: 7px;
            }
        }
    }
    @media screen and (max-width: 375px) {
        .card {
            &:hover {
                .card__content {
                    &__value {
                    }
                }
            }
            &__img {
                display: none;
            }
            &__content {
                &__name {
                }
                &__value {
                }
                &__tip {
                }
            }
        }
    }
</style>
