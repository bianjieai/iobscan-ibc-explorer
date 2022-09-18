<template>
    <div class="tx_progress">
        <div class="tx_progress__top">
            <div
                v-if="progressData.length === 1"
                class="tx_progress__step_wrap tx_progress__step_wrap__single_width"
            >
                <div
                    v-for="(item, index) in progressData"
                    :key="index"
                    class="tx_progress__step tx_progress__step__single_flex"
                    :class="{
                        tx_progress__active: currentProgress === index
                    }"
                >
                    <img v-if="ibcTxStatus === 3" :src="selectedSvg" alt="" />
                    <img v-if="ibcTxStatus === 2" :src="lastUnSelectedSvg" alt="" />
                    <div class="tx_progress__description">
                        <span class="tx_progress__progress">{{ item.progress }}</span>
                        <span class="tx_progress__badge">{{ item.badge }}</span>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="tx_progress__step_wrap"
                :class="{ tx_progress__step_wrap__width: progressData.length === 2 }"
            >
                <div
                    v-for="(item, index) in progressData"
                    :key="index"
                    class="tx_progress__step cursor"
                    :class="{
                        tx_progress__active: currentProgress === index,
                        tx_progress__step__flex: progressData.length === 2 && currentProgress === 1,
                        tx_progress__step__width: progressData.length === 2
                    }"
                    @click="changeCurrent(index)"
                >
                    <img
                        v-if="index !== progressData.length - 1 && currentProgress === index"
                        :src="selectedSvg"
                        alt=""
                    />
                    <img
                        v-if="index !== progressData.length - 1 && currentProgress !== index"
                        :src="unSelectedSvg"
                        alt=""
                    />
                    <div class="tx_progress__description">
                        <span class="tx_progress__progress">{{ item.progress }}</span>
                        <span class="tx_progress__badge">{{ item.badge }}</span>
                    </div>
                </div>
            </div>
        </div>
        <TxProgressList
            :ibc-tx-info="ibcTxInfo"
            :mark="progressData[currentProgress]"
            :ibc-tx-status="ibcTxStatus"
            :sc-info="scInfo"
            :dc-info="dcInfo"
        >
        </TxProgressList>
        <TxSource
            :ibc-tx-info="ibcTxInfo"
            :mark="progressData[currentProgress]"
            :sc-info="scInfo"
            :dc-info="dcInfo"
        ></TxSource>
    </div>
</template>

<script setup lang="ts">
    import type { IIbcTxInfo, ITxInfo } from '@/types/interface/transfers.interface';
    import { drawDefaultIcon } from '@/utils/urlTools';
    import { toRefs } from 'vue';
    import { useIbcTxInfo } from '../composable';
    import TxProgressList from './TxProgressList.vue';
    import TxSource from './TxSource.vue';
    const selectedSvg = drawDefaultIcon('../assets/transfers/selected.svg');
    const unSelectedSvg = drawDefaultIcon('../assets/transfers/unselected.svg');
    const lastUnSelectedSvg = drawDefaultIcon('../assets/transfers/last_unselected.svg');

    interface IProps {
        ibcTxStatus: number;
        ibcTxInfo: IIbcTxInfo | undefined;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();
    const { ibcTxStatus, ibcTxInfo } = toRefs(props);
    const { progressData, currentProgress, changeCurrent } = useIbcTxInfo(ibcTxStatus, ibcTxInfo);
</script>

<style lang="less" scoped>
    .tx_progress {
        &__top {
            background: #f8fafd;
        }
        &__step_wrap {
            .flex(row, nowrap, flex-start, center);
            background: #ebedff;
            overflow: hidden;
            &__width {
                width: 66%;
            }
            &__single_width {
                width: 33%;
            }
            img {
                height: 60px;
            }
        }
        &__step {
            position: relative;
            width: 33%;
            height: 60px;
            &__width {
                width: 50%;
            }
            &__single_flex {
                flex: 1;
            }

            &:nth-of-type(1) {
                z-index: 2;
            }
            &:nth-of-type(2) {
                z-index: 1;
            }
            &:nth-of-type(3) {
                flex: 1;
            }
            &__flex {
                flex: 1;
            }
        }
        &__description {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            .flex(column, nowrap, center, center);
            height: 100%;
        }
        &__progress {
            font-size: var(--bj-font-size-sub-title);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 20px;
        }
        &__badge {
            margin-top: 2px;
            padding: 1px 8px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-primary-color);
            line-height: 14px;
            background: rgba(61, 80, 255, 0.1);
            border-radius: 8px;
        }
        &__active {
            background: var(--bj-primary-color);
            .tx_progress__description {
                .tx_progress__progress {
                    color: #fff;
                }
                .tx_progress__badge {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.2);
                }
            }
        }
        &__content {
            margin-top: 24px;
        }
    }
    @media screen and (max-width: 1200px) {
        .tx_progress {
            &__top {
            }
            &__step_wrap {
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -5%;
                    .tx_progress__description {
                        left: 30%;
                    }
                }
                &:nth-of-type(2) {
                    left: -3%;
                    .tx_progress__description {
                        left: 30%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
            }
            &__description {
            }
            &__progress {
            }
            &__badge {
            }
            &__active {
                .tx_progress__description {
                    .tx_progress__progress {
                    }
                    .tx_progress__badge {
                    }
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 1100px) {
        .tx_progress {
            &__top {
            }
            &__step_wrap {
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -8%;
                    .tx_progress__description {
                        left: 60%;
                    }
                }
                &:nth-of-type(2) {
                    left: -8%;
                    .tx_progress__description {
                        left: 60%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
            }
            &__description {
            }
            &__progress {
            }
            &__badge {
            }
            &__active {
                .tx_progress__description {
                    .tx_progress__progress {
                    }
                    .tx_progress__badge {
                    }
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 1000px) {
        .tx_progress {
            &__top {
            }
            &__step_wrap {
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -13%;
                    .tx_progress__description {
                        left: 90%;
                    }
                }
                &:nth-of-type(2) {
                    left: -13%;
                    .tx_progress__description {
                        left: 85%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
            }
            &__description {
            }
            &__progress {
            }
            &__badge {
            }
            &__active {
                .tx_progress__description {
                    .tx_progress__progress {
                    }
                    .tx_progress__badge {
                    }
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 920px) {
        .tx_progress {
            &__top {
            }
            &__step_wrap {
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -18%;
                    .tx_progress__description {
                        left: 110%;
                    }
                }
                &:nth-of-type(2) {
                    left: -17%;
                    .tx_progress__description {
                        left: 110%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
            }
            &__description {
            }
            &__progress {
            }
            &__badge {
            }
            &__active {
                .tx_progress__description {
                    .tx_progress__progress {
                    }
                    .tx_progress__badge {
                    }
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 880px) {
        .tx_progress {
            &__top {
                overflow-x: auto;
                &::-webkit-scrollbar {
                    display: none;
                }
            }
            &__step_wrap {
                width: 730px;
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -18%;
                    .tx_progress__description {
                        left: 110%;
                    }
                }
                &:nth-of-type(2) {
                    left: -17%;
                    .tx_progress__description {
                        left: 110%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
            }
            &__description {
            }
            &__progress {
            }
            &__badge {
            }
            &__active {
                .tx_progress__description {
                    .tx_progress__progress {
                    }
                    .tx_progress__badge {
                    }
                }
            }
            &__content {
            }
        }
    }
</style>
