<template>
    <div class="view_source">
        <div class="view_source__label">View Source</div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="Raw Data" class="view_source__first_tab">
                <a-table
                    v-if="sourceCode"
                    :columns="TRANSFER_DETAILS_TABLE"
                    :data-source="sourceCode"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #expandIcon="props">
                        <span v-if="props.record.children?.length">
                            <div
                                v-if="props.expanded"
                                style="display: inline-block; margin-right: 8px"
                                @click="
                                    (e:any) => {
                                        props.onExpand(props.record, e);
                                    }
                                "
                            >
                                <img class="view_source__table_icon" :src="tableExpand" alt="" />
                            </div>
                            <div
                                v-else
                                style="display: inline-block; margin-right: 8px"
                                @click="
                                    (e:any) => {
                                        props.onExpand(props.record, e);
                                    }
                                "
                            >
                                <img class="view_source__table_icon" :src="tablePackUp" alt="" />
                            </div>
                        </span>
                        <span v-else style="margin-right: 24px"></span>
                    </template>
                </a-table>
                <no-datas v-if="!sourceCode"></no-datas>
            </a-tab-pane>
            <a-tab-pane key="2" tab="JSON" force-render>
                <pre v-if="JSONSource" class="view_source__json">{{ JSONSource }}</pre>
                <no-datas v-if="!JSONSource" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
    import type { IIbcTxInfo, IProgress, ITxInfo } from '@/types/interface/transfers.interface';
    import { TRANSFER_DETAILS_TABLE } from '@/constants/transfers';
    import { useViewSource } from '../composable';
    import { useLoading } from '@/composables';

    interface IProps {
        ibcTxInfo: IIbcTxInfo | undefined;
        mark: IProgress;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();
    const { loading } = useLoading();
    // todo shan 明确入参 需要优化
    const { activeKey, JSONSource, sourceCode, tableExpand, tablePackUp } = useViewSource(
        props,
        loading
    );
</script>

<style lang="less" scoped>
    .view_source {
        margin-top: 16px;
        &__label {
            font-size: var(--bj-font-size-normal);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__bottom {
            margin-top: 16px;
        }
        &__table_icon {
            display: inline-block;
            width: 16px;
            height: 16px;
        }
        &__json {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        :deep(thead tr .ant-table-cell) {
            background: #f8fafd;
        }
        :deep(td) {
            overflow-wrap: anywhere;
        }
        :deep(.ant-table-cell-with-append) {
            min-width: 250px;
        }
        :deep(.ant-tabs-nav-wrap) {
            border-bottom: rgba(61, 80, 255, 0.1);
        }
    }
    @media screen and (max-width: 874px) {
        .view_source {
            &__label {
            }
            &__bottom {
            }
            &__table_icon {
            }
            &__json {
            }
            :deep(th .ant-table-cell) {
            }
            :deep(td) {
            }
            :deep(.ant-table-cell-with-append) {
            }
            :deep(.ant-tabs-nav-wrap) {
            }
            :deep(.ant-tabs-content-top) {
                overflow-x: auto;
            }
            &__first_tab {
                width: 746px;
            }
        }
    }
</style>
