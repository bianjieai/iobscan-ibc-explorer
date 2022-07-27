<template>
    <div class="statistic_list">
        <!-- vertical -->
        <div v-if="type === 'vertical'" class="vertical_container">
            <div
                v-for="item of msg"
                :key="item.statistics_name"
                class="list_item ibc_selected_title cursor"
                style="width: 100%"
                @click="clickListItem(item.statistics_name)"
            >
                <div
                    class="list_item_info"
                    :style="
                        item.statistics_name === ibcStatisticsDenomsDefault.denom_all.statistics_name
                            ? 'cursor: text;'
                            : ''
                    "
                >
                    <span class="list_item_name"
                        >{{ statisticsName[item.statistics_name]
                        }}<span v-if="item.statistics_name.indexOf(dayTime) !== -1" class="list_item_tip"
                            >24hr</span
                        ></span
                    >
                    <span
                        class="list_item_value"
                        :style="
                            item.statistics_name === ibcStatisticsDenomsDefault.denom_all.statistics_name
                                ? 'color: var(--bj-text-normal); cursor: text;'
                                : ''
                        "
                        >{{ `${formatBigNumber(item.count)}` }}</span
                    >
                </div>
            </div>
        </div>

        <!-- horizontal -->
        <div v-if="type === 'horizontal'" class="horizontal_container">
            <div
                v-for="item of msg"
                :key="item.statistics_name"
                class="list_item_horizontal ibc_selected_title cursor"
                @click="clickListItem(item.statistics_name)"
            >
                <div class="list_item">
                    <div
                        class="list_item_info"
                        :style="
                            item.statistics_name === ibcStatisticsDenomsDefault.denom_all.statistics_name
                                ? 'cursor: text;'
                                : ''
                        "
                    >
                        <span class="list_item_name"
                            >{{ statisticsName[item.statistics_name]
                            }}<span v-if="item.statistics_name.indexOf(dayTime) !== -1" class="list_item_tip"
                                >24hr</span
                            ></span
                        >
                        <span
                            class="list_item_value"
                            :style="
                                item.statistics_name === ibcStatisticsDenomsDefault.denom_all.statistics_name
                                    ? 'color: var(--bj-text-normal);cursor: text;'
                                    : ''
                            "
                            >{{ `${formatBigNumber(item.count)}` }}</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { statisticsName, ibcStatisticsDenomsDefault, dayTime } from '../../../constants/index';
    import { formatBigNumber } from '../../../helper/parseStringHelpers';
    defineProps({
        type: {
            type: String,
            required: true
        },
        msg: {
            type: Object,
            required: true
        }
    });
    const emits = defineEmits(['clickItem']);
    const clickListItem = (value) => {
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
        border-bottom: 1px solid var(--bj-border-color);
        &:first-child {
            padding-top: 0;
        }
        &:last-child {
            padding-bottom: 0;
            border-bottom: 0;
        }

        &_horizontal {
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
        &_info {
            .flex(column, nowrap, flex-start, flex-start);
        }

        &_name {
            font-size: var(--bj-font-size-sub-title);
            font-family: Montserrat-Regular, Montserrat;
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-sub-title);
            margin-bottom: 16px;
        }

        &_value {
            transition: color 0.3s;
            transition-timing-function: ease;
            font-size: var(--bj-font-size-home-number);
            font-family: Montserrat-Regular, Montserrat;
            color: var(--bj-text-normal);
            line-height: var(--bj-font-size-home-number);
        }

        &_tip {
            margin-left: 8px;
            padding: 0 4px;
            font-size: var(--bj-font-size-small);
            font-family: Montserrat-Regular, Montserrat;
            color: #3d50ff;
            line-height: var(--bj-font-size-small);
            background: rgba(61, 80, 255, 0.15);
            border-radius: 7px;
        }

        &_divider {
            width: 226px;
        }

        &_divider_vertical {
            height: 56px;
            margin-right: 24px;
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
                    .list_item_info {
                        border-right: 0;
                    }
                }
                &:nth-last-child(2) {
                    padding-bottom: 0;
                    border-bottom: 0;
                }
                &_info {
                    border-right: 1px solid var(--bj-border-color);
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .horizontal_container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            .list_item_horizontal {
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
    @media screen and (max-width: 520px) {
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
                &_info {
                    border-right: 0;
                }
            }
        }
        .horizontal_container {
            grid-template-columns: repeat(1, 1fr);
            .list_item_horizontal {
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
