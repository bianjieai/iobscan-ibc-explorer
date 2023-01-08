import { debounce } from 'lodash-es';
import * as echarts from 'echarts';
import { useWindowSize } from '@vueuse/core';
import BigNumber from 'bignumber.js';
import moveIcon from '@/assets/overview/move.svg';
import type { IDataItem } from '@/components/BjSelect/interface';
import type { ITransferVolumeItem } from '@/types/interface/overview.interface';
import { CHAIN_DEFAULT_ICON, DEFAULT_DISPLAY_TEXT, NoDataType } from '@/constants';
import { UNIT_SIGNS } from '@/constants/relayers';
import { API_CODE } from '@/constants/apiCode';
import { VOLUME_COLOR, VOLUME_ALL_CHAIN } from '@/constants/overview';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { formatDimension } from '@/helper/overviewHelper';
import { useIbcChains } from '@/composables';
import { getOverviewTransferVolumeAPI, getOverviewTransferVolumeTrendAPI } from '@/api/overview';
import { bigNumberAdd } from '@/utils/calculate';

export const useVolume = () => {
    const volumeLoading = ref(true);
    const volumeNoDataType = ref<NoDataType>();
    const volumePieListData = ref<ITransferVolumeItem[]>([]);
    const volumeTrendDates = ref<string[]>([]);
    const volumeInDatas = ref<string[]>([]);
    const volumeOutDatas = ref<string[]>([]);
    const dataZoomInTotal = ref('');
    const dataZoomOutTotal = ref('');
    const dataZoomTotal = computed(() =>
        bigNumberAdd(dataZoomInTotal.value, dataZoomOutTotal.value)
    );

    // pie list
    const pieListDomRef = ref<HTMLElement[]>([]);
    const wrapperRefDom = ref();
    const leftShow = ref(false);
    const rightShow = ref(false);
    const cardWidth = 224;
    const changeShow = () => {
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
    const pieCharts: echarts.ECharts[] = [];
    const getPieOption = (inValue?: number | string, outValue?: number | string) => {
        if (Number(inValue) || Number(outValue)) {
            const option = {
                color: [VOLUME_COLOR.in, VOLUME_COLOR.out],
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
    const selectedKey = ref(VOLUME_ALL_CHAIN);
    const goCardScroll = (key: string) => {
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
    };
    const changeSeleted = (key: string) => {
        selectedKey.value = key;
        searchChain.value = key;
        goCardScroll(key);
        getData(key);
    };

    const getTotalDisplay = (total: string | number) => {
        const displayTotal = formatDimension(total) as string;
        const space = Number(displayTotal) == 0 || displayTotal == DEFAULT_DISPLAY_TEXT ? ' ' : '';
        return `${UNIT_SIGNS}${space}${displayTotal}`;
    };
    const showDataZoomTotal = (currentChain: string, selectedKey: string) => {
        return selectedKey == currentChain && !volumeLoading.value;
    };

    // chainDropdown
    const { ibcChains } = useIbcChains();
    const searchChain = ref<string | undefined>();
    const isDisabled = computed(() => {
        return ibcChains.value?.all.length <= 0 || volumeLoading.value;
    });
    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        id: VOLUME_ALL_CHAIN,
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v: any) => ({
                    title: v.pretty_name,
                    id: v.chain_name,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const onSelectedChain = (val?: IDataItem) => {
        const chain = String(val?.id);
        searchChain.value = chain;
        selectedKey.value = chain;
        goCardScroll(chain);
        getData(chain);
    };
    const getPopupContainer = (): HTMLElement => document.querySelector('.wrapRelative')!;
    const onClickReset = () => {
        selectedKey.value = VOLUME_ALL_CHAIN;
        if (wrapperRefDom.value) {
            wrapperRefDom.value.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
        searchChain.value = undefined;
        getData();
    };

    // line chart
    const lineRefDom = ref();
    let lineChart: echarts.ECharts;
    const lineOption = {
        color: [VOLUME_COLOR.out, VOLUME_COLOR.in],
        tooltip: {
            trigger: 'axis',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'z-index:1;',
            formatter: (params: any) => {
                const date = params[0].name;
                const dataOut = params[0]?.value || '0';
                const dataIn = params[1]?.value || '0';
                return `<div
                            style="
                                padding: 8px 16px;
                                background: #ffffff;
                                box-shadow: 0px 2px 8px 0px #d9deec;
                                border-radius: 4px;
                                border: 1px solid #d9dfee;
                            "
                        >
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span
                                    style="
                                        margin-right: 78px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >Date:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >${date}</span
                                >
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span
                                    style="
                                        margin-right: 10px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >IBC Volume In:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >${UNIT_SIGNS}${formatBigNumber(dataIn)}</span
                                >
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span
                                    style="
                                        margin-right: 10px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >IBC Volume Out:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        height: 18px;
                                        line-height: 18px;
                                    "
                                    >${UNIT_SIGNS}${formatBigNumber(dataOut)}</span
                                >
                            </div>
                        </div>`;
            },
            confine: true
        },
        grid: {
            top: 30,
            left: 0,
            right: 40,
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
            data: volumeTrendDates.value
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
                startValue: volumeTrendDates.value[volumeTrendDates.value.length - 30],
                endValue: volumeTrendDates.value.at(-1)
            }
        ],
        series: [
            {
                name: 'IBC Volume Out',
                type: 'line',
                stack: 'Total',
                showSymbol: false,
                emphasis: {
                    focus: 'series'
                },
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
                data: volumeOutDatas.value
            },
            {
                name: 'IBC Volume In',
                type: 'line',
                stack: 'Total',
                showSymbol: false,
                emphasis: {
                    focus: 'series'
                },
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
                data: volumeInDatas.value
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
    const handleApiError = () => {
        volumeLoading.value = false;
        volumeNoDataType.value = NoDataType.loadFailed;
        volumePieListData.value = [];
    };
    const handleData = (chain: string) => {
        nextTick(() => {
            // pie card
            changeShow();
            pieCharts.length = 0;
            pieListDomRef.value.forEach((chartDom, i) => {
                pieCharts[i] = pieCharts[i] || echarts.init(chartDom);
                const pieData = volumePieListData.value[i];
                const keyIndex = volumePieListData.value.findIndex(
                    (item) => item.chain === selectedKey.value
                );
                if (keyIndex === i) {
                    pieCharts[i].setOption(
                        getPieOption(dataZoomInTotal.value, dataZoomOutTotal.value)
                    );
                } else {
                    pieCharts[i].setOption(
                        getPieOption(pieData.transfer_volume_in, pieData.transfer_volume_out)
                    );
                }
            });
            goCardScroll(chain);

            // line
            lineChart = lineChart || echarts.init(lineRefDom.value);
            lineChartSizeFn();
            lineOption.dataZoom[0].startValue =
                volumeTrendDates.value.length >= 30
                    ? volumeTrendDates.value[volumeTrendDates.value.length - 30]
                    : volumeTrendDates.value[0] || '';
            lineOption.dataZoom[0].endValue = volumeTrendDates.value?.at(-1) || '';
            lineOption.xAxis.data = volumeTrendDates.value;
            lineOption.series[0].data = volumeOutDatas.value;
            lineOption.series[1].data = volumeInDatas.value;
            lineChart.setOption(lineOption);
            lineChart.on('datazoom', function () {
                const option: any = lineChart.getOption();
                const startValue = option.dataZoom[0].startValue;
                const endValue = option.dataZoom[0].endValue;
                const dataOut: string[] = option.series[0].data.slice(startValue, endValue + 1);
                const dataIn: string[] = option.series[1].data.slice(startValue, endValue + 1);
                dataZoomOutTotal.value = dataOut.reduce((total, current) => {
                    return new BigNumber(total).plus(current).toString();
                }, '0');
                dataZoomInTotal.value = dataIn.reduce((total, current) => {
                    return new BigNumber(total).plus(current).toString();
                }, '0');
                const keyIndex = volumePieListData.value.findIndex(
                    (item) => item.chain === selectedKey.value
                );
                // console.log(dataOut, dataIn);
                pieCharts[keyIndex].setOption(
                    getPieOption(dataZoomInTotal.value, dataZoomOutTotal.value)
                );
            });
        });
    };
    const getData = async (chain = '') => {
        try {
            volumeLoading.value = true;
            volumeNoDataType.value = undefined;
            const [volumeApiData, volumeTrendApiData] = await Promise.all([
                getOverviewTransferVolumeAPI(),
                getOverviewTransferVolumeTrendAPI(chain === VOLUME_ALL_CHAIN ? '' : chain)
            ]);
            if (
                volumeApiData.code === API_CODE.success &&
                volumeTrendApiData.code === API_CODE.success
            ) {
                if (
                    volumeTrendApiData.data?.volume_in.length > 0 &&
                    volumeTrendApiData.data?.volume_in.length > 0
                ) {
                    volumeTrendDates.value = volumeTrendApiData.data.volume_in.map(
                        (item) => item.datetime
                    );
                    volumeInDatas.value = volumeTrendApiData.data.volume_in.map(
                        (item) => item.value
                    );
                    volumeOutDatas.value = volumeTrendApiData.data.volume_out.map(
                        (item) => item.value
                    );
                    const spliceVolumeInDatas = volumeInDatas.value.slice(-30);
                    const spliceVolumeOutDatas = volumeOutDatas.value.slice(-30);
                    dataZoomInTotal.value = spliceVolumeInDatas.reduce((total, current) => {
                        return new BigNumber(total).plus(current).toString();
                    }, '0');
                    dataZoomOutTotal.value = spliceVolumeOutDatas.reduce((total, current) => {
                        return new BigNumber(total).plus(current).toString();
                    }, '0');
                    // const inTotal = volumeInDatas.value.reduce((total, current) => {
                    //     return new BigNumber(total).plus(current).toString();
                    // }, '0');
                    // const outTotal = volumeOutDatas.value.reduce((total, current) => {
                    //     return new BigNumber(total).plus(current).toString();
                    // }, '0');
                } else {
                    volumeNoDataType.value = NoDataType.noData;
                }
                if (volumeApiData.data && volumeApiData.data.length > 0) {
                    const sortData = volumeApiData.data.sort((a, b) =>
                        BigNumber(b.transfer_volume_total).comparedTo(a.transfer_volume_total)
                    );
                    const handleData: ITransferVolumeItem[] = [];
                    for (let i = 0; i < sortData.length; i++) {
                        const item = sortData[i];
                        if (item.chain === 'all_chain') {
                            handleData.push({
                                pretty_name: 'All IBC Chains',
                                ...item
                            });
                        } else {
                            const chainInfo = await ChainHelper.getChainInfoByKey(item.chain);
                            handleData.push({
                                pretty_name: chainInfo?.pretty_name || DEFAULT_DISPLAY_TEXT,
                                ...item
                            });
                        }
                    }
                    volumePieListData.value = handleData;
                } else {
                    if (volumeNoDataType.value !== NoDataType.noData) {
                        volumeNoDataType.value = NoDataType.loadFailed;
                    }
                }
                volumeLoading.value = false;
                handleData(chain);
            } else {
                handleApiError();
            }
        } catch (error) {
            handleApiError();
        }
    };
    onMounted(async () => {
        await getData();
        window.addEventListener('resize', lineChartSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', lineChartSizeFn);
    });

    return {
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
    };
};
