<template>
    <div class="table_wrapper" :class="{ table_padding_lr: hasPaddingLr }">
        <div v-if="!hasPaddingLr" class="thead_border_top"></div>
        <a-config-provider>
            <a-table
                v-if="dataSource"
                :row-key="rowKey"
                :columns="columnsSource"
                :data-source="dataSource"
                :pagination="false"
                :loading="props.tableLoading"
                :show-sorter-tooltip="false"
                :scroll="scroll"
                :custom-row="customRow"
                @change="onTableChange"
            >
                <template #headerCell="{ column }">
                    <template v-if="isKeyInNeedCustomHeader(column.title)">
                        <slot :name="column.title" :column="column"></slot>
                    </template>
                </template>
                <template #bodyCell="{ column, record, index, text }">
                    <template v-if="isKeyInNeedCustomColumns(column.key)">
                        <slot
                            :name="column.key"
                            :column="column"
                            :record="record"
                            :text="text"
                            :index="index"
                        ></slot>
                    </template>
                </template>
            </a-table>
            <template #renderEmpty>
                <no-datas v-if="!tableLoading && !data.length" :type="noDataType" />
            </template>
        </a-config-provider>
        <div v-if="hasPaddingLr" class="thead_border_bottom"></div>
        <div
            v-if="hasData || $slots.table_bottom_status"
            class="flex justify-between pt-16 items-center bottom"
            :class="{ 'pb-16': !noPagination }"
        >
            <slot name="table_bottom_status">
                <div></div>
            </slot>
            <a-pagination
                v-if="hasData && !noPagination"
                v-model:current="pageInfo.current"
                class="table_pagination"
                :class="{ android_adapter: isAndroid }"
                :page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                :show-title="false"
                :disabled="disabledPagination"
                @change="onPageChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { TableColumnsType } from 'ant-design-vue';
    import { GetComponentProps } from 'ant-design-vue/lib/vc-table/interface';
    import type { IIbcTx } from '@/types/interface/transfers.interface';
    import type { IResponseChannelsListItem } from '@/types/interface/channels.interface';
    import type { IChainsListItem } from '@/types/interface/chains.interface';
    import type {
        IResponseIbcTokenListItem,
        ITokensListItem
    } from '@/types/interface/tokens.interface';
    import type {
        IRelayerTransferItem,
        RelayerListItem
    } from '@/types/interface/relayers.interface';
    import type { IResponseAddressTxsFormat } from '@/types/interface/address.interface';
    import { CompareOrder } from '@/types/interface/components/table.interface';
    import { computed, onMounted, reactive, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import BigNumber from 'bignumber.js';
    import { formatLastUpdated } from '@/utils/timeTools';
    import { formatSupply } from '@/helper/tableCellHelper';
    import { useGetIbcDenoms } from '@/composables';
    import { RelayersListKey } from '@/constants/relayers';
    import { getIsAndroid } from '@/utils/systemTools';
    import { AGE_TIMER_INTERVAL, NoDataType } from '@/constants';
    import {
        IAddressTokenTableItem,
        IAddressAccountTableItem
    } from '@/types/interface/address.interface';

    const router = useRouter();
    const { ibcBaseDenoms } = useGetIbcDenoms();
    type TData =
        | IIbcTx[]
        | IChainsListItem[]
        | ITokensListItem[]
        | IResponseIbcTokenListItem[]
        | RelayerListItem[]
        | IResponseChannelsListItem[]
        | IRelayerTransferItem[]
        | IResponseAddressTxsFormat[]
        | IAddressTokenTableItem[]
        | IAddressAccountTableItem[];
    interface IProps {
        columns: TableColumnsType;
        data: TData;
        needCustomColumns: string[];
        needCustomHeaders?: string[];
        needCount?: boolean;
        pageSize?: number | null;
        current?: number | null;
        total?: number | null;
        noPagination?: boolean;
        scroll?: { x?: number; y?: number } | undefined;
        rowKey?: string;
        realTimeKey?: { scKey: string; dcKey: string }[] | null;
        tableLoading: boolean;
        customRow?: GetComponentProps<any>;
        hasPaddingLr?: boolean;
        isLaunchTimer?: boolean;
        pageDisabled?: boolean;
        noDataType?: NoDataType;
    }
    // Todo shan hasPaddingLr 能否修改 Transfer 列表页等移入每一行两边有间距的情况
    let backUpDataSource: any[] = [];
    const props = withDefaults(defineProps<IProps>(), {
        pageSize: null,
        current: null,
        scroll: undefined,
        realTimeKey: null,
        rowKey: 'record_id',
        hasPaddingLr: true,
        isLaunchTimer: true,
        pageDisabled: undefined
    });
    const pageInfo = reactive({
        pageSize: props.pageSize || 10,
        current: props.current || 1,
        total: props.total || props.data?.length
    });
    const columnsSource = ref(props.columns);
    const dataSource = ref(props.data);
    onMounted(() => {
        backUpData();
    });
    watch(
        () => props.data,
        (_new) => {
            backUpData();
            if (needPagination.value) {
                pageInfo.total = _new?.length;
                needPagination.value && onPageChange(1, pageInfo.pageSize, false);
            }
            if (_new?.length === 0) {
                columnsSource.value = columnsSource.value.filter((item) => item.key !== '_count');
            }
        }
    );
    watch(
        () => props.total,
        (_new) => {
            pageInfo.total = _new || 0;
        }
    );
    watch(
        () => props.current,
        (_new) => {
            pageInfo.current = _new || 1;
        }
    );
    const disabledPagination = computed(() => {
        const paginationLoading =
            props.pageDisabled === undefined ? props.tableLoading : props.pageDisabled;
        return paginationLoading || pageInfo.total <= 0;
    });
    const needPagination = computed(() => {
        return !props.noPagination && !(props.current && props.pageSize);
    }); // 需要前端分页
    const isKeyInNeedCustomColumns = computed(
        () => (key: string) => props.needCustomColumns.includes(key)
    ); // 判断key
    const isKeyInNeedCustomHeader = computed(
        () => (key: string) => props.needCustomHeaders?.includes(key)
    );
    const hasData = computed(() => props.data?.length > 0);
    const backUpData = () => {
        const { columns, data, needCount } = props;
        if (needCount && columns.filter((item) => item.key === '_count').length === 0) {
            columns.unshift({
                dataIndex: '_count',
                key: '_count',
                title: ''
            });
            props.noPagination && (columns[0].width = 50);
        }
        backUpDataSource = data?.map((item: any, index: number) => ({
            _count: index + 1,
            ...item
        }));
        let defaultSort = props.columns.find((item) => {
            return item.defaultSortOrder != undefined;
        });
        if (defaultSort) {
            onTableChange(
                {},
                {},
                {
                    columnKey: defaultSort.key,
                    column: defaultSort,
                    order: defaultSort.defaultSortOrder
                }
            );
        } else {
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
        }
    };
    const isAndroid = getIsAndroid();
    const emits = defineEmits<{
        (e: 'onPageChange', current: number, pageSize: number): void;
    }>();
    const formatDataSourceWithRealTime = (data: any[]) => {
        if (data.length && props.realTimeKey && props.realTimeKey.length) {
            data.forEach((item: any) => {
                props.realTimeKey?.forEach((key) => {
                    item[key.dcKey] = formatLastUpdated(item[key.scKey]);
                });
            });
        }
        return data;
    };
    const onPageChange = (pageNum: number, pageSize: number, isNeedBuriedPoint = true) => {
        if (isNeedBuriedPoint) {
            (window as any).gtag('event', `${router.currentRoute.value.name as string}-点击翻页器`);
        }
        if (needPagination.value) {
            pageInfo.current = pageNum;
            pageInfo.pageSize = pageSize;
            const p = (pageNum - 1) * pageSize;
            const pSize = pageNum * pageSize;
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource.slice(p, pSize));
        } else {
            emits('onPageChange', pageNum, pageSize);
        }
    };
    const formatDisplayAmount = (item: any, key: string) => {
        return formatSupply(item[key], item.base_denom, ibcBaseDenoms.value, 2, false);
    };
    let tempColumn: any;
    const relayerSort = (key: string, order: any) => {
        let registeredTemp: any[] = [];
        let unRegisteredTemp: any[] = [];
        backUpDataSource.forEach((item) => {
            item[RelayersListKey.relayersRelayerName]
                ? registeredTemp.push(item)
                : unRegisteredTemp.push(item);
        });
        registeredTemp = registeredTemp.sort((a, b) => {
            return (
                new BigNumber(a[key]).comparedTo(new BigNumber(b[key])) *
                (order === CompareOrder.DESCEND ? -1 : 1)
            );
        });
        unRegisteredTemp = unRegisteredTemp.sort((a, b) => {
            return (
                new BigNumber(a[key]).comparedTo(new BigNumber(b[key])) *
                (order === CompareOrder.DESCEND ? -1 : 1)
            );
        });
        backUpDataSource = [...registeredTemp, ...unRegisteredTemp].map(
            (item: any, index: number) => ({
                ...item,
                _count: index + 1
            })
        );
    };
    const onTableChange = (pagination: any, filters: any, sorter: any) => {
        let { columnKey, column, order } = sorter;
        column ? (tempColumn = column) : null;
        // 修改默认排序规则，取消 不排序的状态
        columnsSource.value.forEach((item) => {
            if (item.key === columnKey) {
                order = order || item.sortDirections?.[0] || 'ascend';
                item.sortOrder = order;
            } else {
                item.sortOrder = null;
            }
        });
        switch (columnKey) {
            case 'supply':
            case 'ibc_transfer_amount':
                let authedTemp: any[] = [];
                let otherTemp: any[] = [];
                backUpDataSource.forEach((item) => {
                    item.token_type === 'Authed' ? authedTemp.push(item) : otherTemp.push(item);
                });
                authedTemp = authedTemp.sort((a, b) => {
                    return (
                        new BigNumber(formatDisplayAmount(a, columnKey)).comparedTo(
                            new BigNumber(formatDisplayAmount(b, columnKey))
                        ) * (order === CompareOrder.DESCEND ? -1 : 1)
                    );
                });
                otherTemp = otherTemp.sort((a, b) => {
                    return (
                        new BigNumber(a[columnKey]).comparedTo(new BigNumber(b[columnKey])) *
                        (order === CompareOrder.DESCEND ? -1 : 1)
                    );
                });
                backUpDataSource = [...authedTemp, ...otherTemp].map(
                    (item: any, index: number) => ({
                        ...item,
                        _count: index + 1
                    })
                );
                break;
            case RelayersListKey.relayersServedChains:
            case RelayersListKey.relayersSuccessRate:
            case RelayersListKey.relayersIbcTransferTxs:
            case RelayersListKey.relayersTotalRelayedValue:
            case RelayersListKey.relayersTotalFeeCost:
            case RelayersListKey.relayersLastUpdated:
                relayerSort(columnKey, order);
                break;
            default: // reset backup
                if (tempColumn.key !== columnKey) {
                    return;
                }
                backUpDataSource = backUpDataSource
                    .sort((a, b) => {
                        return tempColumn?.sorter(a, b) * (order === CompareOrder.DESCEND ? -1 : 1);
                    })
                    .map((item: any, index: number) => ({
                        ...item,
                        _count: index + 1
                    }));
                break;
        }
        if (props.noPagination) {
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
        } else {
            needPagination.value && onPageChange(1, pageInfo.pageSize, false); // reset去第一页
        }
    };
    let timeTimer: number;
    watch(
        () => props.isLaunchTimer,
        (newValue) => {
            if (props.realTimeKey && props.realTimeKey.length) {
                if (newValue) {
                    dataSource.value = formatDataSourceWithRealTime(dataSource.value);
                    timeTimer = setInterval(() => {
                        dataSource.value = formatDataSourceWithRealTime(dataSource.value);
                    }, AGE_TIMER_INTERVAL);
                } else {
                    timeTimer && clearInterval(timeTimer);
                }
            }
        },
        {
            immediate: true
        }
    );
    onBeforeUnmount(() => {
        timeTimer && clearInterval(timeTimer);
    });
</script>

<style lang="less" scoped>
    :deep(.ant-table) {
        overflow-x: auto;
        font-size: 14px;
    }
    :deep(.ant-table-container) {
        width: 1150px;
        // min-height: 300px;
        min-height: 436px;
    }
    :deep(div.ant-table-body) {
        overflow-y: auto !important;
        max-height: 690px !important;
    }
    :deep(.ant-table-thead .ant-table-cell) {
        font-size: var(--bj-font-size-sub-title);
        padding: 14px 16px 14px 0;
        height: 48px;
        line-height: 1;
        background-color: #fff;
    }
    :deep(.ant-table-tbody .ant-table-cell) {
        padding-right: 35px;
        color: var(--bj-text-second);
        line-height: 1;
        vertical-align: middle;
        &:first-child {
            padding-right: 16px;
            width: 24px;
            text-align: left;
        }
    }
    :deep(.ant-table-thead > tr > th) {
        white-space: nowrap;
        border-bottom: none;
    }
    :deep(.ant-table-cell-scrollbar) {
        display: none;
    }
    :deep(.ant-table-tbody > tr > td) {
        border-bottom: 1px solid var(--bj-border-color);
        padding: 16px 16px 15px 0;
        &:only-child {
            border-bottom: none;
        }
    }
    :deep(.ant-table-cell) {
        padding-left: 0;
        white-space: nowrap;
    }
    :deep(
            .ant-table-thead
                > tr
                > th:not(:last-child):not(.ant-table-selection-column):not(
                    .ant-table-row-expand-icon-cell
                ):not([colspan])::before
        ) {
        width: 0;
    }
    :deep(.ant-table-column-sorter) {
        margin-left: 8px;
    }
    :deep(.ant-table-column-has-sorters) {
        cursor: pointer;
    }
    // :deep(.ant-pagination li) {
    //     margin-bottom: 8px;
    // }

    :deep(td.ant-table-column-sort) {
        background: transparent;
    }
    .table_wrapper {
        margin-top: 16px;
        background-color: #fff;
        border-radius: 4px;
        position: relative;
    }
    .table_padding_lr {
        padding: 0 24px;
    }
    .thead_border_top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(61, 80, 255, 0.1);
        height: 2px;
        z-index: 1;
    }
    .thead_border_bottom {
        position: absolute;
        top: 48px;
        left: 0;
        right: 0;
        background: var(--bj-border-color);
        height: 1px;
        z-index: 1;
    }
    :deep(.ant-pagination) {
        // overflow: auto;
        .ant-pagination-item {
            min-width: auto;
        }
        .ant-pagination-jump-next-custom-icon,
        .ant-pagination-jump-prev-custom-icon {
            min-width: 30px;
            .ant-pagination-item-link {
                width: 100%;
                height: 100%;
                .ant-pagination-item-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    .ant-pagination-item-ellipsis {
                        line-height: 24px;
                    }
                }
            }
        }
    }
    .android_adapter {
        :deep(.ant-pagination-item-ellipsis) {
            letter-spacing: -5px;
        }
    }
    // tablet
    @media screen and (max-width: 810px) {
        .bottom {
            display: block;
        }
        :deep(.ant-pagination) {
            margin: 8px 0;
            text-align: left;
        }
    }
    // mobile
    @media screen and (max-width: 530px) {
        .table_wrapper {
        }
        .table_padding_lr {
            padding: 0 16px;
        }
        .bottom {
            display: block;
        }
        :deep(.ant-pagination) {
            margin-top: 8px;
            text-align: left;
        }
    }
</style>
