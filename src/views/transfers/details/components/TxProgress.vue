<template>
    <div class="tx_progress">
        <div class="tx_progress__wrap">
            <div class="tx_progress__top">
                <div
                    v-if="progressData.length === 1"
                    class="tx_progress__step_wrap tx_progress__step_wrap__single_width tx_progress__step_wrap_mobile"
                    :class="{
                        tx_progress__step_failed: ibcTxStatus === 2,
                        tx_progress__step_proccessing: ibcTxStatus === 3
                    }"
                >
                    <div
                        v-for="(item, index) in progressData"
                        :key="index"
                        class="tx_progress__step tx_progress__step__single_flex"
                        :class="{
                            tx_progress__active: currentProgress === index,
                            tx_progress__diff_active: ibcTxStatus === 3
                        }"
                    >
                        <img
                            v-if="ibcTxStatus === 3"
                            class="tx_progress__selected_svg"
                            :src="selectedSvg"
                            alt=""
                        />
                        <img
                            v-if="ibcTxStatus === 2"
                            class="tx_progress__unselected_svg"
                            :src="lastUnSelectedSvg"
                            alt=""
                        />
                        <div class="tx_progress__description">
                            <span class="tx_progress__progress">{{ item.progress }}</span>
                            <span class="tx_progress__badge">{{ item.badge }}</span>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="tx_progress__step_wrap"
                    :class="{
                        tx_progress__step_wrap__width: progressData.length === 2,
                        tx_progress__first: currentProgress === 0
                    }"
                >
                    <div
                        v-for="(item, index) in progressData"
                        :key="index"
                        class="tx_progress__step cursor"
                        :class="{
                            tx_progress__active: currentProgress === index,
                            tx_progress__step__flex:
                                progressData.length === 2 && currentProgress === 1,
                            tx_progress__step__width: progressData.length === 2,
                            tx_progress__step__mobile_two: progressData.length === 2
                        }"
                        @click="changeCurrent(index)"
                    >
                        <img
                            v-if="index !== progressData.length - 1 && currentProgress === index"
                            class="tx_progress__first"
                            :src="selectedSvg"
                            alt=""
                        />
                        <img
                            v-if="index !== progressData.length - 1 && currentProgress !== index"
                            :src="unSelectedSvg"
                            alt=""
                        />
                        <img
                            v-if="index === progressData.length - 1 && currentProgress === index"
                            class="tx_progress__last"
                            :src="lastUnSelectedSvg"
                            alt=""
                        />
                        <div class="tx_progress__description">
                            <span class="tx_progress__progress">{{ item.progress }}</span>
                            <span class="tx_progress__badge">{{ item.badge }}</span>
                        </div>
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
    import { toRefs } from 'vue';
    import { useIbcTxInfo } from '../composable';
    import TxProgressList from './TxProgressList.vue';
    import TxSource from './TxSource.vue';
    const selectedSvg = new URL('../../../../assets/transfers/selected.svg', import.meta.url).href;
    const unSelectedSvg = new URL('../../../../assets/transfers/unselected.svg', import.meta.url)
        .href;
    const lastUnSelectedSvg = new URL(
        '../../../../assets/transfers/last_unselected.svg',
        import.meta.url
    ).href;

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
        }
        &__step_proccessing {
            border-left: 1px solid rgba(61, 80, 255, 0.2);
            .tx_progress__step {
                &:nth-of-type(1) {
                    .tx_progress__description {
                        left: -10%;
                    }
                }
            }
        }
        &__step_failed {
            border-right: 1px solid rgba(61, 80, 255, 0.2);
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
            img {
                height: 60px;
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
            font-weight: 400;
            color: #00000080;
            line-height: 20px;
        }
        &__badge {
            margin-top: 2px;
            padding: 1px 8px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: rgba(61, 80, 255, 0.49);
            line-height: 14px;
            background: rgba(61, 80, 255, 0.1);
            border-radius: 8px;
        }
        &__active {
            background: #fff;
            .tx_progress__description {
                .tx_progress__progress {
                    color: var(--bj-text-normal);
                }
                .tx_progress__badge {
                    color: var(--bj-primary-color);
                    background: rgba(61, 80, 255, 0.2);
                }
            }
        }
        &__diff_active {
            width: 50%;
            background: #f8fafd;
            img {
                transform: translateX(-15%);
            }
        }
        &__content {
            margin-top: 24px;
        }
        &__last {
            position: absolute;
            right: 0;
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        left: 0;
                        .tx_progress__description {
                            left: 0;
                        }
                    }
                }
            }
            &__step_proccessing {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                            left: -10%;
                        }
                    }
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
                &__mobile_two {
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-23%);
                }
            }
            &__content {
            }
            &__first {
                border-left: 1px solid rgba(61, 80, 255, 0.2);
                border-radius: 4px 0 0 4px;
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
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
                        left: 50%;
                    }
                }
                &:nth-of-type(2) {
                    left: -8%;
                    .tx_progress__description {
                        left: 70%;
                    }
                }
                &:nth-of-type(3) {
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -10%;
                        .tx_progress__description {
                            left: 60%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-31%);
                }
                .tx_progress__description {
                    left: -5%;
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
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -16%;
                        .tx_progress__description {
                            left: 80%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-38%);
                }
                .tx_progress__description {
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
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -26%;
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-41%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 880px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                            // left: -15%;
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -20%;
                    .tx_progress__description {
                        left: 120%;
                    }
                }
                &:nth-of-type(2) {
                    left: -20%;
                    .tx_progress__description {
                        left: 120%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 10%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -28%;
                        .tx_progress__description {
                            left: 110%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 5%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-48%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 790px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -30%;
                    .tx_progress__description {
                        left: 150%;
                    }
                }
                &:nth-of-type(2) {
                    left: -30%;
                    .tx_progress__description {
                        left: 150%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 5%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -38%;

                        .tx_progress__description {
                            left: 130%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 5%;
                        }
                    }
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
            &__diff_active {
                img {
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 760px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -30%;
                    .tx_progress__description {
                        left: 150%;
                    }
                }
                &:nth-of-type(2) {
                    left: -30%;
                    .tx_progress__description {
                        left: 150%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 5%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -40%;
                        .tx_progress__description {
                            left: 135%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 0;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-54%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 680px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -35%;
                    .tx_progress__description {
                        left: 160%;
                    }
                }
                &:nth-of-type(2) {
                    left: -35%;
                    .tx_progress__description {
                        left: 160%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -55%;
                        .tx_progress__description {
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 0;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-56%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 650px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step_proccessing {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                            left: -15%;
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -40%;
                    .tx_progress__description {
                        left: 175%;
                    }
                }
                &:nth-of-type(2) {
                    left: -40%;
                    .tx_progress__description {
                        left: 180%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -55%;
                        .tx_progress__description {
                            left: 170%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-59%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 620px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -45%;
                    .tx_progress__description {
                        left: 190%;
                    }
                }
                &:nth-of-type(2) {
                    left: -45%;
                    .tx_progress__description {
                        left: 200%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 15%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -65%;
                        .tx_progress__description {
                            left: 180%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-63%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 580px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -55%;
                    .tx_progress__description {
                        left: 210%;
                    }
                }
                &:nth-of-type(2) {
                    left: -55%;
                    .tx_progress__description {
                        left: 210%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: -5%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -80%;
                        .tx_progress__description {
                            left: 210%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                    transform: translateX(-68%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 560px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -60%;
                    .tx_progress__description {
                        left: 230%;
                    }
                }
                &:nth-of-type(2) {
                    left: -60%;
                    .tx_progress__description {
                        left: 230%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                    &:nth-of-type(2) {
                        .tx_progress__description {
                        }
                    }
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
            &__diff_active {
                img {
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 480px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    .tx_progress__description {
                        left: 235%;
                    }
                }
                &:nth-of-type(2) {
                    .tx_progress__description {
                        left: 240%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 20%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -90%;
                        .tx_progress__description {
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                width: 126px;
                img {
                    transform: translateX(-67%);
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 468px) {
        .tx_progress {
            &__wrap {
            }
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
            &__step_wrap_mobile {
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -66%;
                    .tx_progress__description {
                        left: 245%;
                    }
                }
                &:nth-of-type(2) {
                    left: -66%;
                    .tx_progress__description {
                        left: 245%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: -5%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -100%;
                        .tx_progress__description {
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
    @media screen and (max-width: 448px) {
        .tx_progress {
            &__wrap {
                overflow-x: auto;
                &::-webkit-scrollbar {
                    display: none;
                }
            }
            &__top {
                width: 384px;
            }
            &__step_wrap {
                &__width {
                }
                &__single_width {
                }
                img {
                }
            }
            &__step_wrap_mobile {
                width: 44%;
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                        }
                    }
                }
            }
            &__step_proccessing {
                width: 44%;
                .tx_progress__step {
                    &:nth-of-type(1) {
                        .tx_progress__description {
                            left: -30%;
                        }
                    }
                }
            }
            &__step {
                &__width {
                }
                &__single_flex {
                }

                &:nth-of-type(1) {
                    left: -68%;
                    .tx_progress__description {
                        left: 250%;
                    }
                }
                &:nth-of-type(2) {
                    left: -68%;
                    .tx_progress__description {
                        left: 260%;
                    }
                }
                &:nth-of-type(3) {
                    .tx_progress__description {
                        left: 14%;
                    }
                }
                &__flex {
                }
                &__mobile_two {
                    &:nth-of-type(1) {
                        left: -100%;
                        .tx_progress__description {
                            left: 255%;
                        }
                    }
                    &:nth-of-type(2) {
                        left: 0;
                        .tx_progress__description {
                            left: 10%;
                        }
                    }
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
            &__diff_active {
                img {
                }
                .tx_progress__description {
                }
            }
            &__content {
            }
        }
    }
</style>
