<template>
    <PageContainer class="volume">
        <PageTitle class="volume__title" title="IBC Transfer Volume" />
        <div class="volume__content">
            <div class="volume__content__card_list_wrap">
                <div
                    ref="wrapperRefDom"
                    class="volume__content__card_list_wrap__c"
                    @scroll="debounceScrollFn"
                >
                    <loading-component
                        v-show="volumeLoading"
                        class="volume__content__card_list_wrap__c__loading"
                        :type="LoadingType.container"
                    />

                    <div
                        v-show="volumeNoDataType === NoDataType.loadFailed"
                        class="volume__content__card_list_wrap__c__failed"
                        >{{ API_ERRPR_MESSAGE.loadFailed }}</div
                    >
                    <div
                        v-for="item in volumePieListData"
                        v-show="volumeNoDataType !== NoDataType.loadFailed"
                        :id="item.chain"
                        :key="item.chain"
                        class="volume__content__card_list_wrap__c__card cursor"
                        :class="{ selected: selectedKey == item.chain }"
                        @click="changeSeleted(item.chain)"
                    >
                        <div
                            class="volume__content__card_list_wrap__c__card__wrap"
                            :style="{ width: cardWidth + 'px' }"
                        >
                            <div
                                ref="pieListDomRef"
                                class="volume__content__card_list_wrap__c__card__wrap__chart"
                            ></div>
                            <div class="volume__content__card_list_wrap__c__card__wrap__info">
                                <div
                                    class="volume__content__card_list_wrap__c__card__wrap__info__prety_name"
                                    >{{ item.pretty_name }}</div
                                >
                                <div
                                    v-show="showDataZoomTotal(item.chain, selectedKey)"
                                    class="volume__content__card_list_wrap__c__card__wrap__info__value"
                                    >{{ getTotalDisplay(dataZoomTotal) }}
                                </div>
                                <div
                                    v-show="!showDataZoomTotal(item.chain, selectedKey)"
                                    class="volume__content__card_list_wrap__c__card__wrap__info__value"
                                    >{{ getTotalDisplay(item.transfer_volume_total) }}</div
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <BothSides v-show="leftShow" :is-left="true" @click="scrollRollFn(false)" />
                <BothSides v-show="rightShow" :is-left="false" @click="scrollRollFn(true)" />
            </div>
            <div class="volume__content__selected">
                <div class="volume__content__selected__dropdown wrapRelative">
                    <BjSelect
                        :data="chainData"
                        :value="searchChain"
                        placeholder="All Chains"
                        :hide-icon="true"
                        :is-disabled="isDisabled"
                        :select-color-default-val="CHAIN_DEFAULT_VALUE"
                        :dropdown-props="{
                            getPopupContainer: getPopupContainer
                        }"
                        @on-change="onSelectedChain"
                    />
                    <TypeButton
                        class="volume__content__selected__dropdown__reset_btn"
                        :is-disabled="isDisabled"
                        @on-reset="onClickReset"
                    />
                </div>
                <div class="volume__content__selected__legend">
                    <LineLegend
                        class="volume__content__selected__legend__in"
                        :color="VOLUME_COLOR.in"
                        name="IBC Volume In"
                    />
                    <LineLegend
                        class="volume__content__selected__legend__out"
                        :color="VOLUME_COLOR.out"
                        name="IBC Volume Out"
                    />
                </div>
            </div>
            <div class="volume__content__data">
                <loading-component
                    v-if="volumeLoading"
                    class="volume__content__data__loading"
                    :type="LoadingType.container"
                />
                <no-datas
                    v-else-if="volumeNoDataType"
                    :type="volumeNoDataType"
                    class="volume__content__data__failed"
                />
                <div
                    v-show="!(volumeLoading || volumeNoDataType)"
                    ref="lineRefDom"
                    class="volume__content__data__chart"
                ></div>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import LineLegend from './components/LineLegend.vue';
    import BothSides from './components/BothSides.vue';
    import { API_ERRPR_MESSAGE } from '@/constants/apiCode';
    import { CHAIN_DEFAULT_VALUE, LoadingType, NoDataType } from '@/constants';
    import { useVolume } from './composable';

    const {
        volumeLoading,
        volumeNoDataType,
        volumePieListData,
        selectedKey,
        dataZoomTotal,
        cardWidth,
        leftShow,
        rightShow,
        searchChain,
        VOLUME_COLOR,
        isDisabled,
        chainData,
        wrapperRefDom,
        pieListDomRef,
        lineRefDom,
        onSelectedChain,
        debounceScrollFn,
        scrollRollFn,
        changeSeleted,
        getTotalDisplay,
        showDataZoomTotal,
        getPopupContainer,
        onClickReset
    } = useVolume();
</script>

<style lang="less" scoped>
    .volume {
        &__title {
        }
        &__content {
            margin-top: 28px;
            height: 591px;
            padding: 29px 24px 24px;
            background-color: #fff;
            &__card_list_wrap {
                position: relative;
                &__c {
                    padding-right: 13px;
                    height: 112px;
                    background-color: #f8fafd;
                    .flex(row,nowrap);
                    &::-webkit-scrollbar {
                        display: none; /* Chrome Safari */
                    }
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE 10+ */
                    overflow-x: auto;
                    &__loading {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 100%;
                        height: 100%;
                        transform: translate(-50%, -50%);
                        background-color: rgba(255, 255, 255, 0.6);
                        z-index: 4;
                    }
                    &__failed {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: var(--bj-font-size-normal);
                        font-weight: 400;
                        color: var(--bj-font-color-65);
                    }
                    &__card {
                        padding: 8px 0;
                        &__wrap {
                            .flex(row,nowrap);
                            padding: 16px;
                            transition: border, border-radius, box-shadow, background-color 0.5s;
                            &__chart {
                                opacity: 0.5;
                                width: 64px;
                                height: 64px;
                                transition: opacity 0.5s;
                            }
                            &__info {
                                flex: 1;
                                margin-left: 20px;
                                overflow: hidden;
                                &__prety_name {
                                    opacity: 0.5;
                                    margin-top: 5px;
                                    font-size: 14px;
                                    font-weight: 400;
                                    color: #000000;
                                    line-height: 18px;
                                    transition: opacity 0.5s;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                &__value {
                                    opacity: 0.75;
                                    margin-top: 4px;
                                    font-size: 24px;
                                    font-family: 'GolosUI_Medium';
                                    font-weight: 500;
                                    color: #000000;
                                    line-height: 32px;
                                    transition: opacity 0.5s;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                            }
                        }
                    }
                    .selected {
                        .volume__content__card_list_wrap__c__card__wrap {
                            border-radius: 4px;
                            border: 1px solid rgba(61, 80, 255, 0.35);
                            box-shadow: 0px 0px 5px 0px rgba(61, 80, 255, 0.18);
                            background-color: #fff;
                            &__chart {
                                opacity: 1;
                            }
                            &__info {
                                &__prety_name {
                                    opacity: 1;
                                }
                                &__value {
                                    opacity: 1;
                                }
                            }
                        }
                    }
                }
            }
            &__selected {
                margin-top: 25px;
                .flex(row,nowrap,space-between,center);
                &__dropdown {
                    .flex(row,nowrap,flex-start,center);
                    &__reset_btn {
                        margin-left: 8px;
                    }
                }
                &__legend {
                    .flex(row);
                    &__in {
                        margin-right: 24px;
                    }
                    &__out {
                    }
                }
            }
            &__data {
                position: relative;
                height: 366px;
                overflow-x: auto;
                &__loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(255, 255, 255, 0.6);
                    z-index: 1;
                }
                &__failed {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                }
                &__chart {
                    min-width: 788px;
                    width: 100%;
                    height: 100%;
                    // padding-bottom: 1px;
                    // background-color: rgba(135, 206, 235, 0.1);
                }
            }
        }
    }
    @media screen and (max-width: 550px) {
        .volume {
            &__content {
                &__selected {
                    .flex(column,nowrap,center,flex-start);
                    &__dropdown {
                        &__reset_btn {
                        }
                    }
                    &__legend {
                        margin-top: 16px;
                        &__in {
                        }
                        &__out {
                        }
                    }
                }
            }
        }
    }
</style>
