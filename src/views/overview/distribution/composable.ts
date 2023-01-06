import * as echarts from 'echarts';
import { getOverviewDistributionAPI } from '@/api/overview';
import { IDataItem } from '@/components/BjSelect/interface';
import { useGetIbcDenoms } from '@/composables';
import {
    BASE_DENOM,
    BASE_DENOM_CHAIN,
    DEFAULT_DISPLAY_TEXT,
    NoDataType,
    SYMBOL,
    TOKEN_DEFAULT_ICON
} from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import type { ISankeyData } from '@/types/interface/overview.interface';
import { formatSankeyData } from '@/helper/sankeyDataHelper';
import { SANKEY_COLOR_LIST } from '@/constants/overview';
import { formatBigNumber } from '@/helper/parseStringHelper';

export const useDistributionSelect = () => {
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
    const inputFlag = ref(false);
    const changeInputFlag = (flag: boolean) => {
        inputFlag.value = flag;
    };
    const searchToken = ref<string>(SYMBOL.ATOM);
    const baseDenom = ref<string>(BASE_DENOM.uatom);
    const baseDenomChain = ref<string>(BASE_DENOM_CHAIN.cosmoshub);
    const getPopupContainer = (): HTMLElement => document.querySelector('.distribution__select')!;
    const distributionLoading = ref<boolean>(true);
    const distributionNoDataType = ref<NoDataType>();
    const distributionSankeyData = ref<ISankeyData>();
    const originDenom = ref<string>(DEFAULT_DISPLAY_TEXT);
    const distributionDom = ref<HTMLElement>();
    let distributionChart: echarts.ECharts;

    // 获取 列表信息
    const getOverviewDistribution = async () => {
        distributionLoading.value = true;
        distributionNoDataType.value = undefined;
        try {
            const { code, data, message } = await getOverviewDistributionAPI(
                baseDenom.value,
                baseDenomChain.value
            );
            if (code === API_CODE.success && Object.keys(data).length) {
                originDenom.value = data.denom;
                distributionSankeyData.value = await formatSankeyData(data);
                console.log(distributionSankeyData.value);
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
            if (token?.inputFlag) {
                inputFlag.value = true;
            } else {
                inputFlag.value = false;
            }
            searchToken.value = id as string;
            baseDenom.value = token.metaData.denom;
            baseDenomChain.value = token.metaData.chain;
        } else {
            inputFlag.value = false;
            searchToken.value = SYMBOL.ATOM;
            baseDenom.value = BASE_DENOM.uatom;
            baseDenomChain.value = BASE_DENOM_CHAIN.cosmoshub;
        }
        getOverviewDistribution();
    };
    const onClickReset = () => {
        baseDenom.value = BASE_DENOM.uatom;
        baseDenomChain.value = BASE_DENOM_CHAIN.cosmoshub;
        searchToken.value = SYMBOL.ATOM;
        originDenom.value = DEFAULT_DISPLAY_TEXT;
        getOverviewDistribution();
    };
    let distributionOption: any;
    const levelsInfo: any[] = [];
    SANKEY_COLOR_LIST.forEach((item, index) => {
        levelsInfo.push({
            depth: index,
            itemStyle: {
                color: item
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
                        extraCssText: 'z-index:1;',
                        formatter: (params: any) => {
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
                                        ">Amount:</span>
                                        <span>
                                            ${
                                                params.value !== '-1'
                                                    ? formatBigNumber(params.value)
                                                    : DEFAULT_DISPLAY_TEXT
                                            } ${originDenom.value}
                                        </span>
                                    </div>
                                `;
                        }
                    },
                    layoutIterations: 32,
                    series: [
                        {
                            type: 'sankey',
                            data: newData.nodes,
                            links: newData.links,
                            nodeWidth: 18,
                            nodeGap: 24,
                            orient: 'horizontal',
                            draggable: false,
                            layoutIterations: 0,
                            emphasis: { focus: 'adjacency' },
                            levels: levelsInfo,
                            minAngle: 4,
                            lineStyle: {
                                color: 'source',
                                curveness: 0.5
                            },
                            label: {
                                formatter: (params: any) => {
                                    const formatNameArr = params.name.split(' ');
                                    const name = formatNameArr
                                        .filter((item: string, index: number) => {
                                            if (index >= 1) {
                                                return index !== formatNameArr.length - 1;
                                            }
                                            return item;
                                        })
                                        .join(' ');
                                    return name;
                                }
                            }
                        }
                    ]
                };
                nextTick(() => {
                    distributionChart = echarts.init(distributionDom.value as HTMLElement);
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
        inputFlag,
        changeInputFlag,
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
