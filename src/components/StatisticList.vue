<template>
    <div class="statistic_list">
        <!-- vertical -->
        <div v-if="type === 'vertical'" class="vertical_container">
            <div
                v-for="item of msg"
                :key="item.statistics_name"
                class="list_item ibc_selected_title"
                :class="{ cursor: !item.no_link }"
                style="width: 100%"
                @click="clickListItem(item.statistics_name)"
            >
                <div class="list_item__info" :class="{ cursor: !item.no_link }">
                    <span class="list_item__name"
                        >{{ STATISTICS_NAME[item.statistics_name]
                        }}<span
                            v-if="item.statistics_name.indexOf(DAY_TIME) !== -1"
                            class="list_item__tip"
                            >24hr</span
                        ></span
                    >
                    <span
                        class="list_item__value"
                        :style="{
                            cursor: item.no_link ? 'text' : 'pointer',
                            color: item.no_link ? 'var(--bj-text-normal)' : ''
                        }"
                    >
                        <span v-if="item.unit" class="list_item__dollar">{{ item.unit }} </span>
                        {{ `${formatBigNumber(item.count, 0)}` || DEFAULT_DISPLAY_TEXT }}
                    </span>
                </div>
            </div>
        </div>

        <!-- horizontal -->
        <div v-if="type === 'horizontal'" class="horizontal_container">
            <div
                v-for="item of msg"
                :key="item.statistics_name"
                class="list_item__horizontal ibc_selected_title"
                :class="{ cursor: !item.no_link }"
                @click="clickListItem(item.statistics_name)"
            >
                <div class="list_item">
                    <div class="list_item__info" :class="{ cursor: !item.no_link }">
                        <span class="list_item__name">
                            {{ STATISTICS_NAME[item.statistics_name] }}
                            <span
                                v-if="item.statistics_name.indexOf(DAY_TIME) !== -1"
                                class="list_item__tip"
                                >24hr</span
                            >
                        </span>
                        <span
                            class="list_item__value"
                            :style="{
                                cursor: item.no_link ? 'text' : 'pointer',
                                color: item.no_link ? 'var(--bj-text-normal)' : ''
                            }"
                        >
                            <span v-if="item.unit" class="list_item__unit">{{ item.unit }} </span>
                            {{ `${formatBigNumber(item.count, 0)}` || DEFAULT_DISPLAY_TEXT }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { STATISTICS_NAME, DAY_TIME, DEFAULT_DISPLAY_TEXT } from '@/constants';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    import type { IDenomStatistic } from '@/types/interface/index.interface';
    interface IProps {
        type: String;
        msg: IDenomStatistic;
    }
    defineProps<IProps>();
    const emits = defineEmits(['clickItem']);
    const clickListItem = (value: any) => {
        emits('clickItem', value);
    };
</script>

<style lang="less" scoped>
    .statistic_list {
        padding: 24px;
        width: 100%;
    }

    .vertical_container {
        .flex(column, nowrap, flex-start, flex-start);
    }

    .horizontal_container {
        .flex(row, nowrap, flex-start, flex-start);
    }

    .list_item {
        padding: 24px 0;
        width: 100%;
        border-bottom: 1px solid var(--bj-border-color);
        &:hover {
            .list_item__value {
                color: var(--bj-primary-color);
            }
        }
        &:first-child {
            padding-top: 0;
        }
        &:last-child {
            padding-bottom: 0;
            border-bottom: 0;
        }

        &__horizontal {
            padding-left: 24px;
            width: 25%;
            .flex(row, nowrap, space-between, flex-start);
            border-right: 1px solid var(--bj-border-color);
            &:first-child {
                padding-left: 0;
            }
            &:last-child {
                border-right: 0;
            }
        }
        &__info {
            .flex(column, nowrap, flex-start, flex-start);
        }

        &__name {
            font-size: var(--bj-font-size-sub-title);
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-sub-title);
            margin-bottom: 16px;
        }

        &__value {
            transition: color 0.3s;
            transition-timing-function: ease;
            font-size: var(--bj-font-size-home-number);
            font-family: GolosUI_Medium;
            color: var(--bj-text-normal);
            line-height: var(--bj-font-size-home-number);
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

    @media screen and (max-width: 1200px) {
        .vertical_container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            .list_item {
                padding-left: 24px;
                &:nth-of-type(2) {
                    padding-top: 0;
                }
                &:nth-of-type(2n + 1) {
                    padding-left: 0;
                }
                &:nth-of-type(2n),
                &:last-child {
                    .list_item__info {
                        border-right: 0;
                    }
                }
                &:nth-last-child(2) {
                    padding-bottom: 0;
                    border-bottom: 0;
                }
                &__info {
                    border-right: 1px solid var(--bj-border-color);
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .horizontal_container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            .list_item__horizontal {
                padding: 24px 0;
                width: 100%;
                border-bottom: 1px solid var(--bj-border-color);
                border-right: 0;
                &:nth-of-type(2n + 1) {
                    padding-left: 0;
                }
                &:nth-of-type(2n) {
                    padding-left: 24px;
                    .list_item {
                        border-right: 0;
                    }
                }
                &:first-child {
                    padding-top: 0;
                }
                &:nth-of-type(2) {
                    padding-top: 0;
                }
                &:last-child {
                    padding-bottom: 0;
                    border-bottom: 0;
                }
                &:nth-last-child(2) {
                    padding-bottom: 0;
                    border-bottom: 0;
                }
                .list_item {
                    width: 100%;
                    border-right: 1px solid var(--bj-border-color);
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .statistic_list {
            padding: 16px;
        }
        .vertical_container {
            grid-template-columns: repeat(1, 1fr);
            .list_item {
                padding-left: 0;
                &:nth-of-type(2) {
                    padding-top: 24px;
                }
                &:nth-last-child(2) {
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--bj-border-color);
                }
                &__info {
                    border-right: 0;
                }
            }
        }
        .horizontal_container {
            grid-template-columns: repeat(1, 1fr);
            .list_item__horizontal {
                &:nth-of-type(2n + 1) {
                    .list_item {
                        border-right: 0;
                    }
                }
                &:nth-of-type(2n) {
                    padding-left: 0;
                }
                &:nth-of-type(2) {
                    padding-top: 24px;
                }
                &:nth-last-child(2) {
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--bj-border-color);
                }
            }
        }
    }
</style>
