import * as echarts from 'echarts';
import { getOverviewDistributionAPI } from '@/api/overview';
import { IDataItem } from '@/components/BjSelect/interface';
import { useGetIbcDenoms } from '@/composables';
import {
    BASE_DENOM,
    BASE_DENOM_CHAIN,
    DEFAULT_DISPLAY_TEXT,
    NoDataType,
    TOKEN_DEFAULT_ICON
} from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import type { IResponseDistribution, ISankeyData } from '@/types/interface/overview.interface';
import { NOHOP_COLOR, SANKEY_COLOR_LIST } from '@/constants/overview';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { formatSankeyData } from '@/helper/sankeyDataHelper';
import { getLeftValueByLastSpace } from '@/utils/urlTools';
import { getIos } from '@/utils/systemTools';

export const useDistributionSelect = () => {
    const isIos = getIos();
    const { ibcBaseDenomsSorted } = useGetIbcDenoms();
    const distributionDisable = computed(() => {
        if (!ibcBaseDenomsSorted.value.length) {
            return true;
        } else {
            return false;
        }
    });
    const distributionTokenDropdown = ref();
    const distributionTokenData = computed(() => {
        return [
            {
                children: ibcBaseDenomsSorted.value.map((v) => ({
                    title: v.symbol,
                    id: v.denom + v.chain,
                    icon: v.icon || TOKEN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const defaultToken = computed(() => {
        const matchToken = distributionTokenData.value[0].children.filter(
            (item) =>
                item.metaData.denom === BASE_DENOM.uatom &&
                item.metaData.chain === BASE_DENOM_CHAIN.cosmoshub
        );
        return matchToken[0];
    });

    const searchToken = ref<string>(`${BASE_DENOM.uatom}${BASE_DENOM_CHAIN.cosmoshub}`);
    const baseDenom = ref<string>(BASE_DENOM.uatom);
    const baseDenomChain = ref<string>(BASE_DENOM_CHAIN.cosmoshub);
    const getPopupContainer = (): HTMLElement => document.querySelector('.distribution__select')!;
    const distributionLoading = ref<boolean>(true);
    const distributionNoDataType = ref<NoDataType>();
    const distributionSankeyData = ref<ISankeyData>();
    const originDenom = ref<string>(DEFAULT_DISPLAY_TEXT);
    const originAPIData = ref<IResponseDistribution>();
    const distributionDom = ref<HTMLElement>();
    let distributionChart: echarts.ECharts;

    const getOverviewDistribution = async () => {
        distributionLoading.value = true;
        distributionNoDataType.value = undefined;
        try {
            const { code, data, message } = await getOverviewDistributionAPI(
                baseDenom.value,
                baseDenomChain.value
            );
            if (code === API_CODE.success) {
                originDenom.value = data.denom;
                originAPIData.value = data;
                distributionSankeyData.value = await formatSankeyData(data);
            } else {
                console.log(message);
                originDenom.value = DEFAULT_DISPLAY_TEXT;
                distributionNoDataType.value = NoDataType.noData;
                distributionSankeyData.value = undefined;
            }
        } catch (error) {
            console.log(error);
            originDenom.value = DEFAULT_DISPLAY_TEXT;
            distributionNoDataType.value = NoDataType.loadFailed;
            distributionSankeyData.value = undefined;
        } finally {
            distributionLoading.value = false;
        }
    };
    const onSelectedToken = (token: IDataItem) => {
        const id = token?.id;
        if (id) {
            searchToken.value = id as string;
            baseDenom.value = token.metaData.denom;
            baseDenomChain.value = token.metaData.chain;
        } else {
            searchToken.value = `${BASE_DENOM.uatom}${BASE_DENOM_CHAIN.cosmoshub}`;
            baseDenom.value = BASE_DENOM.uatom;
            baseDenomChain.value = BASE_DENOM_CHAIN.cosmoshub;
        }
        getOverviewDistribution();
    };
    const onClickReset = () => {
        baseDenom.value = BASE_DENOM.uatom;
        baseDenomChain.value = BASE_DENOM_CHAIN.cosmoshub;
        searchToken.value = `${BASE_DENOM.uatom}${BASE_DENOM_CHAIN.cosmoshub}`;
        originDenom.value = DEFAULT_DISPLAY_TEXT;
        getOverviewDistribution();
    };
    let distributionOption: any;
    const levelsInfo: any[] = [];
    watch(originAPIData, (newOriginData) => {
        if (!newOriginData?.children?.length) {
            NOHOP_COLOR.forEach((item, index) => {
                levelsInfo.push({
                    depth: index,
                    itemStyle: {
                        color: item.color,
                        borderWidth: 1,
                        borderColor: item.borderColor
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.15
                    },
                    tooltip: {
                        show: false
                    }
                });
            });
        } else {
            SANKEY_COLOR_LIST.forEach((item, index) => {
                levelsInfo.push({
                    depth: index,
                    itemStyle: {
                        color: item,
                        borderWidth: 1,
                        borderColor: item
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.15
                    },
                    tooltip: {
                        show: false
                    }
                });
            });
        }
    });
    const maxHopRecord = computed(() => {
        return distributionSankeyData?.value?.maxHopRecord;
    });
    const maxNodeHeight = computed(() => {
        return distributionSankeyData?.value?.maxNodeHeight;
    });
    const createChartWidthorHeight = () => {
        if (distributionDom.value) {
            distributionDom.value.style.width =
                (Number(maxHopRecord.value) > 8
                    ? 1152 + (Number(maxHopRecord.value) - 8) * 136
                    : 1152) + 'px';
            distributionDom.value.style.height = Number(maxNodeHeight.value) * 50 + 'px';
        }
    };
    watch(
        () => distributionSankeyData.value,
        (newData) => {
            if (newData) {
                distributionOption = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove',
                        backgroundColor: null,
                        borderWidth: 0,
                        padding: 0,
                        extraCssText: 'z-index: 1;',
                        position: (
                            point: any[],
                            params: any,
                            dom: HTMLElement,
                            rect: any,
                            size: any
                        ) => {
                            // 解决悬浮窗显示遮挡问题
                            let x = 0,
                                y = 0;
                            // 当前鼠标位置
                            const pointX = point[0],
                                pointY = point[1];
                            // 提示框大小
                            const boxWidth = size.contentSize[0],
                                boxHeight = size.contentSize[1];
                            // boxWidth > pointX 说明鼠标左边放不下提示框
                            if (boxWidth > pointX) {
                                x = 5; // 自己定个x坐标值，以防出屏
                                y -= 15; // 防止点被覆盖住
                            } else {
                                // 左边放的下
                                x = pointX - boxWidth - 15;
                            }
                            // boxHeight > pointY 说明鼠标上边放不下提示框
                            if (boxHeight + 20 > pointY) {
                                y = pointY + 15;
                            } else if (boxHeight > pointY) {
                                y = 5;
                            } else {
                                // 上边放得下
                                y += pointY - boxHeight;
                            }
                            return [x, y];
                        },
                        formatter: (params: any) => {
                            let key;
                            let value;
                            if (params.dataType === 'node') {
                                key = 'Chain';
                                value = getLeftValueByLastSpace(params.data.name);
                            } else {
                                key = params.data.isZeroJumpLine ? 'In-Chain Supply' : 'Amount';
                                value = `${formatBigNumber(params.data.value)} ${
                                    originDenom.value
                                }`;
                            }
                            return ` <div style="
                                        padding: 8px 16px;
                                        background: #ffffff;
                                        box-shadow: 0px 2px 8px 0px #d9deec;
                                        border-radius: 4px;
                                        border: 1px solid #d9dfee;
                                    ">
                                        <span style="
                                            margin-right: 12px;
                                            font-size: 14px;
                                            font-family: GolosUI_Medium;
                                            font-weight: 500;
                                            color: #000;
                                            line-height: 18px;
                                        ">${key}:</span>
                                        <span>${value}</span>
                                    </div>
                                `;
                        }
                    },
                    width: distributionDom.value?.style.width,
                    height: distributionDom.value?.style.height,
                    series: [
                        {
                            type: 'sankey',
                            data: newData.nodes,
                            links: newData.links,
                            top: 8,
                            right: 112,
                            bottom: '12%',
                            left: 0,
                            nodeWidth: 18,
                            nodeGap: 24,
                            nodeAlign: 'justify',
                            orient: 'horizontal',
                            draggable: false,
                            layoutIterations: 0,
                            emphasis: { focus: 'adjacency' },
                            levels: levelsInfo,
                            lineStyle: {
                                color: 'source',
                                curveness: 0.5
                            },
                            label: {
                                fontFamily: 'GolosUIWebRegular',
                                fontWeight: 300,
                                fontSize: 14,
                                color: 'rgba(0, 0, 0, 0.74)',
                                formatter: (params: any) => {
                                    const name = getLeftValueByLastSpace(params.name);
                                    return name;
                                }
                            }
                        }
                    ]
                };
                nextTick(() => {
                    createChartWidthorHeight();
                    distributionChart = echarts.init(
                        distributionDom.value as HTMLElement,
                        {},
                        { renderer: isIos ? 'svg' : 'canvas' }
                    );
                    distributionOption && distributionChart.setOption(distributionOption, true);
                });
            }
        }
    );
    const distributionResize = () => {
        distributionChart && distributionChart.resize();
    };
    onMounted(async () => {
        await getOverviewDistribution();
        window.addEventListener('resize', distributionResize);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', distributionResize);
    });
    return {
        distributionTokenDropdown,
        distributionTokenData,
        defaultToken,
        searchToken,
        getPopupContainer,
        distributionDisable,
        onSelectedToken,
        onClickReset,
        distributionLoading,
        distributionNoDataType,
        distributionDom
    };
};
