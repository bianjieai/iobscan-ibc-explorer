<template>
    <div class="details_content">
        <div class="details_title">{{ title }}</div>
        <ul class="details_item_content">
            <li v-for="(item, index) in details" :key="index" class="details_item">
                <span class="details_item_label">{{ item.label }}</span>
                <span v-if="item.isFormatToken" class="details_item_value">
                    <router-link
                        v-if="item.value"
                        :to="`/tokens/details?denom=${baseDenom}&chain=${chainId}`"
                    >
                        <span class="details_item_amount">{{
                            formatToken(item.value, details).symbolNum || '--'
                        }}</span>
                        <a-popover destroy-tooltip-on-hide>
                            <template #content>
                                {{ formatToken(item.value, details).denom }}
                            </template>
                            <span>{{ formatDenom(formatToken(item.value, details).symbol) }}</span>
                        </a-popover>
                    </router-link>
                    <span v-else>--</span>
                </span>
                <span v-else-if="item.isFormatHeight" class="details_item_value">{{
                    formatHeight(item.value)
                }}</span>
                <span v-else-if="item.isFormatStatus" class="details_item_value">{{
                    formatStatus(item.value)
                }}</span>
                <span v-else-if="item.isFormatFee" class="details_item_value">
                    <span class="details_item_amount">{{
                        formatToken(formatFee(item.value), details).symbolNum || '--'
                    }}</span>
                    <a-popover destroy-tooltip-on-hide>
                        <template #content>
                            {{ formatToken(formatFee(item.value), details).denom }}
                        </template>
                        <span>{{
                            formatDenom(formatToken(formatFee(item.value), details).symbol)
                        }}</span>
                    </a-popover>
                </span>
                <router-link
                    v-else-if="item.isFormatChainID"
                    :to="`/chains`"
                    class="details_item_value"
                    >{{ formatChainID(item.value) }}</router-link
                >
                <span v-else-if="item.isAck" class="details_item_value">{{
                    formatAck(item.value)
                }}</span>
                <span v-else-if="item.isFormatDate" class="details_item_value">
                    <span style="display: none">{{ formatDate(item.value) }}</span>
                    <span>{{ date }}</span>
                </span>
                <span v-else-if="item.isAddress" class="details_item_value">
                    <span v-show="Array.isArray(item.value)">
                        <div v-if="item.value.length >= 1">
                            <span v-for="(address, addressIndex) of item.value" :key="addressIndex">
                                <span v-if="item.isNotLink" class="value_style">{{
                                    address || '--'
                                }}</span>
                                <router-link
                                    v-else
                                    :to="`/relayers?chain=${scChainId},${dcChainId}`"
                                    class="value_style"
                                    >{{ address || '--' }}</router-link
                                >
                            </span>
                        </div>
                        <span v-else>--</span>
                    </span>
                    <span v-if="!Array.isArray(item.value)" class="value_style">{{
                        item.value || '--'
                    }}</span>
                </span>
                <router-link
                    v-else-if="item.isChannelID"
                    :to="`/channels?chain=${scChainId},${dcChainId}`"
                    class="details_item_value"
                    >{{ item.value ? item.value : '--' }}</router-link
                >
                <span v-else class="details_item_value">{{ item.value ? item.value : '--' }}</span>
            </li>
            <li
                v-for="(item, index) in expandDetails"
                v-show="isExpand"
                :key="index"
                class="details_item"
            >
                <span class="details_item_label">{{ item.label }}</span>
                <span v-if="item.isFormatToken" class="details_item_value">
                    <!--                    {{formatToken(item.value)}}-->
                    <span class="details_item_amount"
                        >{{ formatToken(item.value, expandDetails).symbolNum || '--'
                        }}{{ formatToken(item.value, expandDetails).denom }}</span
                    >
                    <a-popover destroy-tooltip-on-hide>
                        <template #content>
                            {{ formatToken(item.value, expandDetails).denom }}
                        </template>
                        <span>{{
                            formatDenom(formatToken(item.value, expandDetails).symbol)
                        }}</span>
                    </a-popover>
                </span>
                <span v-if="item.isFormatHeight" class="details_item_value">{{
                    formatHeight(item.value)
                }}</span>
                <span v-else-if="item.isFormatStatus" class="details_item_value">{{
                    formatStatus(item.value)
                }}</span>
                <span v-else-if="item.isFormatFee" class="details_item_value">{{
                    formatFee(item.value)
                }}</span>
                <router-link
                    v-else-if="item.isFormatChainID"
                    :to="`/chains`"
                    class="details_item_value"
                    >{{ formatChainID(item.value) }}</router-link
                >
                <span v-else-if="item.isAck" class="details_item_value">{{
                    formatAck(item.value)
                }}</span>
                <span v-else-if="item.isFormatDate" class="details_item_value">
                    <span style="display: none">{{ formatDate(item.value) }}</span>
                    <span>{{ date }}</span>
                </span>
                <span v-else-if="item.isAddress" class="details_item_value">
                    <span class="value_style">{{ item.value || '--' }}</span>
                </span>
                <span v-else class="details_item_value">{{
                    item.value === 0 ? 0 : item.value ? item.value : '--'
                }}</span>
            </li>
            <li class="see_more_button cursor" @click="expandInfo">
                <span class="see_more_label">Click to see More</span>
                <span
                    class="see_more_icon iconfont icon-shouqi"
                    :class="isExpand ? 'less_style' : 'more_style'"
                ></span>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import moveDecimal from 'move-decimal-point';
    import { transfersDetailStatus, ackConnectStatus } from '@/constants';
    import * as djs from 'dayjs';
    import { getRestString, formatBigNumber } from '@/helper/parseStringHelper';
    import ChainHelper from '@/helper/chainHelper';
    import { getDenomKey } from '@/helper/baseDenomHelper';
    import { formatAge, getTimestamp } from '@/utils/timeTools';
    import { useIbcStatisticsChains } from '@/store/index';

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcDenomsMapGetter, ibcBaseDenomsSymbolKeyMapGetter } =
        storeToRefs(ibcStatisticsChainsStore);

    defineProps({
        title: {
            type: String,
            default: ''
        },
        details: {
            type: Array,
            default() {
                return [];
            }
        },
        expandDetails: {
            type: Array,
            default() {
                return [];
            }
        },
        baseDenom: {
            type: String,
            default: ''
        },
        chainId: {
            type: String,
            default: ''
        },
        scChainId: {
            type: String,
            default: ''
        },
        dcChainId: {
            type: String,
            default: ''
        }
    });

    const dayjs = djs?.default || djs;

    const isExpand = ref(false);
    const date = ref('');
    const formatToken = (token, details) => {
        let chainID = '';
        if (details?.length) {
            details.forEach((item) => {
                if (item?.label === 'Chain ID:') {
                    chainID = item.value;
                }
            });
        }
        if (token?.amount >= 0 && token?.denom) {
            let symbol = '';
            if (chainID) {
                symbol = ibcDenomsMapGetter.value[getDenomKey(chainID, token?.denom)]?.symbol;
            }
            let symbolNum = token?.amount || 0;
            let symbolDenom = token?.denom || '';
            let denom = token?.denom || '';
            if (symbol) {
                const findSymbol = ibcBaseDenomsSymbolKeyMapGetter.value[symbol];
                if (findSymbol) {
                    // (token.amount || 0) * 10 ** -findSymbol.scale;
                    symbolNum = formatBigNumber(moveDecimal(token.amount, 0 - findSymbol.scale));
                    symbolDenom = findSymbol.symbol;
                }
            }
            return {
                denom: denom,
                symbol: symbolDenom,
                symbolNum: symbolNum
            };
        }
        return '--';
    };
    const formatHeight = (heightObj) => {
        if (Object.keys(heightObj)?.length && heightObj !== '--') {
            return `${heightObj.revision_number}-${heightObj.revision_height}`;
        }
        return '--';
    };
    const formatStatus = (status) => {
        if (status == transfersDetailStatus.SUCCESS.value) {
            return transfersDetailStatus.SUCCESS.label;
        } else if (status === transfersDetailStatus.FAILED.value) {
            return transfersDetailStatus.FAILED.label;
        }
        return '--';
    };
    const expandInfo = () => {
        isExpand.value = !isExpand.value;
    };

    const formatFee = (fee) => {
        if (Array.isArray(fee)) {
            const amountObj = fee[0];
            return amountObj;
        }
        return fee;
    };

    const formatChainID = (chainId) => {
        return ChainHelper.formatChainId(chainId);
    };

    const formatDate = (timestamp) => {
        if (timestamp > 0) {
            date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${formatAge(
                getTimestamp(),
                timestamp * 1000,
                'ago',
                '>'
            )})`;
            setTimeout(() => {
                date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${formatAge(
                    getTimestamp(),
                    timestamp * 1000,
                    'ago',
                    '>'
                )})`;
            }, 1000);
        } else {
            date.value = '--';
        }
    };

    const formatAck = (ack) => {
        if (ack && ack !== '--') {
            if (ack.includes('result:"\\001"')) {
                return ackConnectStatus.CORRECT;
            } else if (ack.includes(ackConnectStatus.ERROR)) {
                return ackConnectStatus.ERROR;
            }
        } else {
            return '--';
        }
    };
    const formatDenom = (denom) => {
        if (denom?.includes('ibc/')) {
            return getRestString(denom, 8, 4);
        }
        return denom;
    };
</script>

<style scoped lang="less">
    .details_content {
        margin-top: 16px;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;

        .details_title {
            border-bottom: 1px solid var(--bj-border-color);
            padding: 16px 0 16px 24px;
            font-size: 16px;
            line-height: 16px;
            font-weight: 400;
            text-align: left;
        }

        .details_item_content {
            list-style: none;
            box-sizing: border-box;
            margin: 0 24px;
            text-align: left;
            padding-top: 15px;

            .details_item {
                padding: 14px 0;
                display: flex;

                .details_item_label {
                    display: inline-block;
                    width: 153px;
                    margin-right: 35px;
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 14px;
                }

                .details_item_value {
                    flex: 1;
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 14px;
                    word-break: break-all;

                    .details_item_amount {
                        margin-right: 5px;
                    }

                    .ant-tooltip-open {
                    }

                    .value_style {
                        word-break: break-all;
                        display: inline-block;
                        line-height: 17px;
                    }

                    .link_style {
                        font-size: var(--bj-font-size-normal);
                        font-weight: 400;
                        color: rgba(61, 80, 255, 1);
                        line-height: 17px;
                        max-width: 300px;
                        display: inline-block;
                    }
                }
                a {
                    color: var(--bj-text-normal);
                    &:hover {
                        color: var(--bj-primary-color);
                    }
                }
            }

            .see_more_button {
                padding: 14px 0;
                display: flex;

                .see_more_label {
                    color: rgba(61, 80, 255, 1);
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    line-height: 14px;

                    &:hover {
                        color: #1e2cb4;
                    }
                }

                .see_more_icon {
                    margin-left: 8px;
                    color: rgba(61, 80, 255, 1);
                    font-size: var(--bj-font-size-normal);
                    line-height: 14px;
                    z-index: 1;

                    &:hover {
                        color: #1e2cb4;
                    }
                }

                .more_style {
                    transform: rotate(180deg);
                }

                .less_style {
                }
            }
        }
    }

    @media screen and (max-width: 530px) {
        .details_content {
            .details_title {
            }

            .details_item_content {
                .details_item {
                    .details_item_label {
                        margin-right: 26px;
                        max-width: 100px;
                    }

                    .details_item_value {
                        .details_item_amount {
                        }

                        .ant-tooltip-open {
                        }

                        .value_style {
                        }

                        .link_style {
                        }
                    }
                }

                .see_more_button {
                    .see_more_label {
                        &:hover {
                        }
                    }

                    .see_more_icon {
                        &:hover {
                        }
                    }

                    .more_style {
                    }

                    .less_style {
                    }
                }
            }
        }
    }
</style>
