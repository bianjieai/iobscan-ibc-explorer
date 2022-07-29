<template>
    <PageContainer>
        <PageTitle
            :title="`${baseDenomInfo.symbol} IBC Token`"
            :subtitle="subtitle"
            has-icon
            :img-src="baseDenomInfo.imgSrc"
        />
        <div class="select flex items-center flex-wrap">
            <ChainsDropdown
                ref="chainDropdown"
                :chain-id="chainIdQuery"
                :dropdown-data="ibcChains?.all ?? []"
                @on-selected-chain="onSelectedChain"
            />
            <BaseDropdown
                ref="statusDropdown"
                :status="statusQuery"
                :options="IBC_STATUS_OPTIONS"
                @on-selected-change="onSelectedStatus"
            />
            <ResetButton @on-reset="resetSearchCondition" />
        </div>

        <TableCommon
            :loading="loading"
            :data="list"
            :need-custom-columns="needCustomColumns"
            :columns="IBC_COLUMNS"
            need-count
        >
            <template #denom="{ record, column }">
                <a-popover
                    v-if="record.token_type !== SPECIAL_TOKEN_TYPE.GENESIS"
                    placement="topLeft"
                >
                    <template #content>
                        <div class="notice-text">
                            <div>Path: {{ record.denom_path }}</div>
                            <div>Token Hash: {{ record[column.key] }}</div>
                        </div>
                    </template>
                    <div>{{ getRestString(rmIbcPrefix(record[column.key]), 3, 8) }}</div>
                </a-popover>
                <div v-else>
                    <div
                        v-if="getBaseDenomInfoByDenom(record[column.key], record.chain_id)?.symbol"
                        >{{
                            getBaseDenomInfoByDenom(record[column.key], record.chain_id).symbol
                        }}</div
                    >
                    <div v-else>
                        <a-popover v-if="record[column.key].length > 11" placement="topLeft">
                            <template #content>
                                <div class="popover-c">{{ record[column.key] }}</div>
                            </template>
                            <div>{{ getRestString(record[column.key], 3, 8) }}</div>
                        </a-popover>
                        <div v-else>{{ record[column.key] }}</div>
                    </div>
                </div>
            </template>
            <template #chain_id="{ record, column }">
                <ChainIcon
                    avatar-can-click
                    title-can-click
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains?.all ?? []"
                    icon-size="small"
                    @click-avatar="goChains"
                    @click-title="goChains"
                />
            </template>
            <template #ibc_hops="{ record, column }">
                <span>{{ formatBigNumber(record[column.key], 0) }}</span>
            </template>

            <template #amount="{ record, column }">
                <a-popover>
                    <template #content>
                        <div class="popover-c">{{
                            `${
                                formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms)
                                    .popover
                            }`
                        }}</div>
                    </template>
                    <div>{{
                        `${formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms).title}`
                    }}</div>
                </a-popover>
            </template>

            <template #receive_txs="{ record, column }">
                <div
                    class="hover_cursor"
                    @click="goTransfer(`allchain,${record.chain_id}`, record.denom)"
                    >{{ formatBigNumber(record[column.key], 0) }}
                </div>
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script lang="ts" setup>
    // todo clippers => 确认提示Name单元格Token Hash:的字段
    import { PAGE_PARAMETERS } from '@/constants';
    import { IBC_COLUMNS, IBC_STATUS_OPTIONS, SPECIAL_TOKEN_TYPE } from '@/constants/tokens';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { TIbcTokenType, useGetIbcTokenList } from '@/service/tokens';
    import { useGetIbcDenoms, useIbcChains } from '../home/composable';
    import { useNeedCustomColumns } from '@/composables';
    import { getRestString, rmIbcPrefix, formatBigNumber } from '@/helper/parseStringHelper';
    import { formatAmount } from '@/helper/tableCellHelper';
    import { isNullOrEmpty } from '@/utils/objectTools';
    import { urlHelper } from '@/utils/urlTools';

    let pageUrl = '/tokens/details';

    const router = useRouter();

    const { ibcChains, getIbcChains } = useIbcChains();
    const { ibcBaseDenoms, getIbcBaseDenom, getBaseDenomInfoByDenom } = useGetIbcDenoms();

    const route = useRoute();
    const baseDenomQuery = route.query.denom as string;
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TIbcTokenType;

    const { list, total, getList } = useGetIbcTokenList(baseDenomQuery);

    const baseDenomInfo = computed(() => {
        const filterData = ibcBaseDenoms.filter(
            (item: any) => item.denom === baseDenomQuery
        ) as any; // todo clippers => 补上类型
        let symbol = '';
        const filterSymbol = filterData[0]?.symbol;

        if (filterData.length === 0 || isNullOrEmpty(filterSymbol)) {
            symbol = getRestString(baseDenomQuery, 3, 8);
        } else {
            if (filterSymbol.includes('ibc')) {
                symbol = getRestString(filterSymbol.replace(/ibc\//, ''), 3, 8);
            } else {
                symbol = filterSymbol;
            }
        }

        return {
            symbol,
            imgSrc:
                filterData[0]?.icon ??
                new URL('../../assets/token-default.png', import.meta.url).href
        };
    });

    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.ibcToken);

    const chainDropdown = ref();
    const statusDropdown = ref();

    const searchChain = ref<string | undefined>(chainIdQuery ?? undefined);
    const searchStatus = ref<TIbcTokenType | undefined>(statusQuery);

    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} tokens found`;
        } else {
            return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} tokens found`;
        }
    });

    onMounted(() => {
        !sessionStorage.getItem('allChains') && getIbcChains();
        getIbcBaseDenom();

        refreshList();
    });

    const loading = ref(false);
    const refreshList = () => {
        getList({
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };

    const onSelectedChain = (chain?: string | number) => {
        searchChain.value = chain as string;
        pageUrl = urlHelper(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (status?: string | number) => {
        searchStatus.value = status as TIbcTokenType;
        pageUrl = urlHelper(pageUrl, {
            key: 'status',
            value: status as TIbcTokenType
        });
        router.replace(pageUrl);
        refreshList();
    };

    const resetSearchCondition = () => {
        location.href = `/tokens/details?denom=${baseDenomQuery}`;
    };

    const goChains = () => {
        router.push('/chains');
    };

    const goTransfer = (chain_id: string, denom: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain_id,
                denom
            }
        });
    };
</script>

<style lang="less" scoped>
    .select {
        margin-top: 26px;
        margin-bottom: 16px;

        :deep(.ant-dropdown-trigger) {
            margin-right: 8px;
        }
    }

    .notice-text {
        color: var(--bj-text-second);
    }

    // pc
    @media screen and (min-width: 768px) {
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
        .select {
            margin-top: 24px;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .select {
            margin-top: 16px;
        }
    }

    @media screen and (max-width: 353px) {
        .select {
        }

        :deep(.ant-dropdown-trigger) {
            &:first-of-type {
                margin-right: 50px;
            }

            &:last-of-type {
                margin-top: 8px;
            }
        }

        :deep(.ant-btn-icon-only) {
            margin-top: 8px;
        }
    }
</style>
