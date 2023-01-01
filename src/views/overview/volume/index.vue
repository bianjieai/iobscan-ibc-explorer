<template>
    <!-- todo dj 结构、样式、逻辑 待拆分 -->
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
                        v-show="false"
                        class="volume__content__card_list_wrap__c__loading"
                        :type="LoadingType.container"
                    />
                    <div v-show="false" class="volume__content__card_list_wrap__c__failed">{{
                        API_ERRPR_MESSAGE.loadFailed
                    }}</div>
                    <div
                        v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14]"
                        :id="String(i)"
                        :key="i"
                        class="volume__content__card_list_wrap__c__card cursor"
                        :class="{ selected: selectedKey == String(i) }"
                        @click="changeSeleted(String(i))"
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
                                    >Cosmos Hub</div
                                >
                                <div
                                    class="volume__content__card_list_wrap__c__card__wrap__info__value"
                                    >$279K</div
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <!-- todo dj 后续考虑抽离 -->
                <transition name="fade">
                    <div
                        v-show="leftShow"
                        class="volume__content__card_list_wrap__left_hint"
                        @click="scrollRollFn(false)"
                    >
                        <div class="volume__content__card_list_wrap__left_hint__icon_c cursor">
                            <svg-icon class-dynamic="left_icon" icon-name="icon-next1"></svg-icon>
                        </div>
                    </div>
                </transition>
                <transition name="fade">
                    <div
                        v-show="rightShow"
                        class="volume__content__card_list_wrap__right_hint"
                        @click="scrollRollFn(true)"
                    >
                        <div class="volume__content__card_list_wrap__right_hint__icon_c cursor">
                            <svg-icon class-dynamic="right_icon" icon-name="icon-next1"></svg-icon>
                        </div>
                    </div>
                </transition>
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
                <!-- todo dj  三屏适配，需要找UI -->
                <div class="volume__content__selected__legend">
                    <!-- todo dj 颜色统一处理 -->
                    <LineLegend
                        class="volume__content__selected__legend__in"
                        color="#1890FF"
                        name="IBC Volume In"
                    />
                    <LineLegend
                        class="volume__content__selected__legend__out"
                        color="#FA8C16"
                        name="IBC Volume Out"
                    />
                </div>
            </div>
            <div class="volume__content__data">
                <!-- v-if="addressRatioLoading" -->
                <loading-component
                    v-show="false"
                    class="volume__content__data__loading"
                    :type="LoadingType.container"
                />
                <!-- v-else-if="addressRatioType" :type="addressRatioType" -->
                <no-datas v-show="false" class="volume__content__data__failed" />
                <div ref="lineRefDom" class="volume__content__data__chart"></div>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import { CHAIN_DEFAULT_ICON, CHAIN_DEFAULT_VALUE, LoadingType } from '@/constants';
    import { API_ERRPR_MESSAGE } from '@/constants/apiCode';
    import { debounce } from 'lodash-es';
    import * as echarts from 'echarts';
    import LineLegend from './components/LineLegend.vue';
    import ChainHelper from '@/helper/chainHelper';
    import { useIbcChains } from '@/composables';
    import { IDataItem } from '@/components/BjSelect/interface';
    import { dayjsFormatDate } from '@/utils/timeTools';
    import moveIcon from '@/assets/overview/move.svg';
    import { useWindowSize } from '@vueuse/core';

    const pieListDomRef = ref<HTMLElement[]>([]);
    const wrapperRefDom = ref();
    const leftShow = ref(false);
    const rightShow = ref(false);
    const cardWidth = 216;
    const changeShow = () => {
        // console.log('执行 changeShow');
        const wrapper = wrapperRefDom.value;
        if (wrapper) {
            if (wrapper.clientWidth !== wrapper.scrollWidth) {
                leftShow.value = wrapper.scrollLeft > 0;
                rightShow.value = wrapper.clientWidth + wrapper.scrollLeft < wrapper.scrollWidth;
            } else {
                leftShow.value = false;
                rightShow.value = false;
            }
        } else {
            leftShow.value = false;
            rightShow.value = false;
        }
    };
    const debounceScrollFn = debounce(changeShow, 50, { leading: true });
    const scrollRollFn = (isRight: boolean) => {
        if (wrapperRefDom.value) {
            const wrapper = wrapperRefDom.value;
            const left = isRight
                ? wrapper.scrollLeft + 2 * cardWidth
                : wrapper.scrollLeft - 2 * cardWidth;
            wrapper.scrollTo({
                left,
                behavior: 'smooth'
            });
        }
    };
    const myChart: echarts.ECharts[] = [];
    const getPieOption = (inValue?: string, outValue?: string) => {
        if (inValue || outValue) {
            let option = {
                color: ['#1890FF', '#FA8C16'], // in、out
                series: [
                    {
                        type: 'pie',
                        silent: true,
                        radius: ['65%', '100%'],
                        label: {
                            show: false
                        },
                        data: [{ value: inValue }, { value: outValue }]
                    }
                ]
            };
            return option;
        } else {
            const option = {
                color: ['rgba(61,80,255,0.08)'],
                series: [
                    {
                        type: 'pie',
                        silent: true,
                        radius: ['65%', '100%'],
                        label: {
                            show: false
                        },
                        data: [{ value: '1' }]
                    }
                ]
            };
            return option;
        }
    };
    const selectedKey = ref('1');
    const changeSeleted = (key: string) => {
        selectedKey.value = key;
        if (wrapperRefDom.value) {
            nextTick(() => {
                const keyDom = document.getElementById(key);
                if (keyDom) {
                    wrapperRefDom.value.scrollTo({
                        left: keyDom.offsetLeft - cardWidth,
                        behavior: 'smooth'
                    });
                }
            });
        }
        // todo dj 逻辑待处理 Cosmos Hub
        searchChain.value = 'Cosmos Hub';
    };
    onMounted(() => {
        changeShow();
        nextTick(() => {
            myChart.length = 0;
            pieListDomRef.value.forEach((chartDom, i) => {
                myChart[i] = echarts.init(chartDom);
                myChart[i].setOption(getPieOption('1', '2'));
            });
        });
    });

    // chainDropdown
    const { ibcChains } = useIbcChains();
    const searchChain = ref<string | undefined>();
    const isDisabled = computed(() => {
        return ibcChains.value?.all.length <= 0;
    });
    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        id: CHAIN_DEFAULT_VALUE,
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v: any) => ({
                    title: v.pretty_name,
                    id: v.pretty_name,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const onSelectedChain = (val?: IDataItem) => {
        const chain = val?.id;
        searchChain.value = chain !== undefined ? String(chain) : undefined;
        console.log('刷新数据');
    };
    const getPopupContainer = (): HTMLElement => document.querySelector('.wrapRelative')!;
    const onClickReset = () => {
        console.log('条件重置,切换至all chain');
        // todo dj 卡片第一个key '1'
        selectedKey.value = '1';
        if (wrapperRefDom.value) {
            wrapperRefDom.value.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
        searchChain.value = undefined;
    };

    // chart
    const lineRefDom = ref();
    let lineChart: echarts.ECharts;
    // 假数据
    const dateArr: any[] = [];
    const value1Arr: any[] = [];
    const value2Arr: any[] = [];
    const testSize = [];
    let i = 0;
    for (let i = 0; i < 80; i++) {
        const temp = [];
        const tempValue = [];
        let time = new Date().getTime();
        for (let i = 0; i < 180; i++) {
            const format = dayjsFormatDate(time, 'YYYY-MM-DD');
            time -= 60 * 60 * 24 * 1000;
            tempValue.push(4984 * Math.random());
            temp.push(format);
            testSize.push({
                chain: 'cosmoshub1isirhubs',
                in: 4984 * Math.random(),
                out: 4984 * Math.random(),
                date: temp[i],
                toatl: 4984 * Math.random() + 4984 * Math.random()
            });
        }
        dateArr.push(temp.reverse());
        value1Arr.push(tempValue.reverse());
        value2Arr.push(tempValue.reverse().map((item) => item));
    }

    const lineOption = {
        color: ['#FA8C16', '#40A9FF'],
        // todo dj 需要设计确认,悬浮弹框样式
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: 30,
            left: 0,
            right: 22,
            bottom: 46,
            containLabel: true
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 16,
                color: '#000',
                fontSize: 14,
                lineHeight: 18,
                fontFamily: 'GolosUIWebRegular',
                fontWeight: 400
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,0,0,0.1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: ['20%', '20%'],
            axisLabel: {
                margin: 16,
                show: true,
                showMinLabel: true,
                showMaxLabel: true,
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: 'GolosUIWebRegular',
                    fontWeight: 400
                }
            },
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            data: dateArr[i]
        },
        dataZoom: [
            {
                show: true,
                type: 'slider',
                brushSelect: false,
                moveHandleSize: 0,
                filterMode: 'filter',
                minValueSpan: 1,
                handleSize: 24,
                handleIcon: `image://${moveIcon}`,
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: 'GolosUIWebRegular',
                    fontWeight: 400
                },
                height: 32,
                left: 90,
                right: 90,
                bottom: 0,
                backgroundColor: '#F8FAFD',
                borderColor: 'rgba(255,255,255,0)',
                dataBackground: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0)'
                    },
                    areaStyle: {
                        color: 'rgba(255,255,255,0)'
                    }
                },
                fillerColor: 'rgba(61,80,255,0.05)',
                selectedDataBackground: {
                    lineStyle: {
                        color: 'rgba(61, 80, 255, 0.5)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(61,80,255,0)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(61,80,255,0.8)'
                            }
                        ])
                    }
                },
                startValue: dateArr[i][dateArr[i].length - 30]
            }
        ],
        series: [
            {
                name: 'IBC Volume In',
                type: 'line',
                stack: 'volume',
                showSymbol: false,
                areaStyle: {
                    opacity: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(250,140,22,0.2)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(250,140,22,0)'
                        }
                    ])
                },
                // todo dj 数据待切换
                data: value1Arr[i]
            },
            {
                name: 'IBC Volume Out',
                type: 'line',
                stack: 'volume',
                showSymbol: false,
                areaStyle: {
                    opacity: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(64,169,255,0.2)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(64,169,255,0)'
                        }
                    ])
                },
                data: value2Arr[i]
            }
        ]
    };

    const lineChartSizeFn = () => {
        lineChart && lineChart.resize();
    };
    const { width: widthClient } = useWindowSize();
    watch(
        () => widthClient.value,
        (newValue) => {
            if (newValue > 689) {
                if (lineOption.grid.bottom !== 46 || lineOption.dataZoom[0].show !== true) {
                    lineOption.grid.bottom = 46;
                    lineOption.dataZoom[0].show = true;
                    lineChart && lineChart.setOption(lineOption);
                }
            } else {
                if (lineOption.grid.bottom !== 16 || lineOption.dataZoom[0].show !== false) {
                    lineOption.grid.bottom = 16;
                    lineOption.dataZoom[0].show = false;
                    lineChart && lineChart.setOption(lineOption);
                }
            }
        },
        {
            immediate: true
        }
    );
    onMounted(() => {
        lineChart = echarts.init(lineRefDom.value);
        lineChart.setOption(lineOption);
        lineChart.on('datazoom', function (params) {
            const option: any = lineChart.getOption();
            const startValue = option.dataZoom[0].startValue;
            const endValue = option.dataZoom[0].endValue;
            const data1 = option.series[0].data.slice(startValue, endValue + 1);
            const data2 = option.series[1].data.slice(startValue, endValue + 1);
            // todo dj 防抖去计算，相当于用户不拖动范围之后计算
            console.log(option);
            console.log(option.xAxis[0].data[startValue]);
            console.log(option.xAxis[0].data[endValue]);
            console.log(data1, data2);
            console.log(params);
        });
        window.addEventListener('resize', lineChartSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', lineChartSizeFn);
    });
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
                &__left_hint {
                    .flex(column,nowrap,center,flex-end);
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 28px;
                    border-radius: 4px;
                    background-image: linear-gradient(
                        -90deg,
                        rgba(112, 136, 255, 0) 0%,
                        rgba(61, 80, 255, 0.1) 100%
                    );
                    &__icon_c {
                        .flex(column,nowrap,center,center);
                        width: 20px;
                        height: 20px;
                        background: #ffffff;
                        border-radius: 50%;
                        box-shadow: 0px 0px 5px 0px rgba(61, 80, 255, 0.18);
                        border: 1px solid rgba(61, 80, 255, 0.35);
                        transform: translateX(4px) rotate(180deg);
                        &:hover {
                            box-shadow: 0px 0px 10px 0px rgba(61, 80, 255, 0.35);
                            border: 1px solid #3d50ff;
                        }
                        .left_icon {
                            width: 8px;
                            height: 9px;
                        }
                    }
                }
                &__right_hint {
                    .flex(column,nowrap,center,center);
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 28px;
                    border-radius: 4px;
                    background-image: linear-gradient(
                        90deg,
                        rgba(112, 136, 255, 0) 0%,
                        rgba(61, 80, 255, 0.1) 100%
                    );
                    &__icon_c {
                        .flex(column,nowrap,center,center);
                        width: 20px;
                        height: 20px;
                        background: #ffffff;
                        border-radius: 50%;
                        box-shadow: 0px 0px 5px 0px rgba(61, 80, 255, 0.18);
                        border: 1px solid rgba(61, 80, 255, 0.35);
                        transform: translateX(-4px);
                        &:hover {
                            box-shadow: 0px 0px 10px 0px rgba(61, 80, 255, 0.35);
                            border: 1px solid #3d50ff;
                        }
                        .right_icon {
                            width: 8px;
                            height: 9px;
                        }
                    }
                }
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
                                &__prety_name {
                                    opacity: 0.5;
                                    margin-top: 5px;
                                    font-size: 14px;
                                    font-weight: 400;
                                    color: #000000;
                                    line-height: 18px;
                                    transition: opacity 0.5s;
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
</style>
