import ChainHelper from '@/helper/chainHelper';
import { CHAINID } from '@/constants/index';
import { ServedChainsInfo, chainPopoverProp } from '@/types/interface/relayers.interface';
import { RelayerListItem } from '@/types/interface/relayers.interface';
import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import { getRelayersListMock } from '@/api/relayers';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';
import { BASE_PARAMS, PAGE_PARAMETERS, CHAIN_DEFAULT_ICON, UNKNOWN } from '@/constants';
import { useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';
import { RelayersListKey } from '@/constants/relayers';

export const useGetRelayersList = () => {
    const relayersList = ref<RelayerListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const sortServedChainsInfo = async (
        servedChainsInfos: ServedChainsInfo[]
    ): Promise<chainPopoverProp[]> => {
        if (servedChainsInfos.length <= 0) return [];
        const formatChainPopoverProp: chainPopoverProp[] = [];
        for (let i = 0; i < servedChainsInfos.length; i++) {
            const servedChainsInfo = servedChainsInfos[i];
            const chainInfo = await ChainHelper.getChainInfoByKey(servedChainsInfo.chain);
            formatChainPopoverProp.push({
                chain: servedChainsInfo.chain,
                chainName: chainInfo?.chain_name || UNKNOWN,
                chainLogo: chainInfo?.icon || CHAIN_DEFAULT_ICON,
                address: [...servedChainsInfo.addresses]
            });
        }
        const irishub = formatChainPopoverProp.filter((item) => item.chain === CHAINID.irishub);
        const cosmos = formatChainPopoverProp.filter((item) => item.chain === CHAINID.cosmoshub);
        const other = formatChainPopoverProp.filter(
            (item) => item.chain !== CHAINID.irishub && item.chain !== CHAINID.cosmoshub
        );
        other.sort((a, b) => a.chain.localeCompare(b.chain));
        return [...cosmos, ...irishub, ...other];
    };
    const getRelayersList = async (params: IRequestRelayerList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        let allData: RelayerListItem[] = [];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllData = async () => {
            try {
                // todo dj mock => api getRelayersListAPI
                const result = await getRelayersListMock(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    // todo dj || 条件待删除
                    if (!allParams.use_count || true) {
                        const items = (data as IResponseRelayerList).items;
                        if (items && items.length > 0) {
                            const formatItems: RelayerListItem[] = [];
                            for (let i = 0; i < items.length; i++) {
                                const item = items[i];
                                const served_chains_infos = await sortServedChainsInfo(
                                    item.served_chains_info
                                );
                                formatItems.push({
                                    relayer_id: item.relayer_id,
                                    is_registered: Boolean(item.relayer_name),
                                    relayer_icon: item.relayer_icon,
                                    served_chains_infos: served_chains_infos,
                                    [RelayersListKey.relayersRelayerName]: item.relayer_name,
                                    [RelayersListKey.relayersServedChains]: item.served_chains,
                                    [RelayersListKey.relayersSuccessRate]:
                                        formatTransfer_success_txs(
                                            item.relayed_success_txs,
                                            item.relayed_total_txs
                                        ),
                                    [RelayersListKey.relayersIbcTransferTxs]:
                                        item.relayed_total_txs,
                                    [RelayersListKey.relayersTotalRelayedValue]:
                                        item.relayed_total_txs_value,
                                    [RelayersListKey.relayersTotalFeeCost]: item.total_fee_value,
                                    [RelayersListKey.relayersLastUpdated]: item.update_time
                                });
                            }
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...formatItems];
                                loading && (loading.value = false);
                                relayersList.value = allData;
                            } else {
                                allData = [...(allData || []), ...formatItems];
                                allParams.page_num++;
                                getAllData();
                            }
                        } else {
                            loading && (loading.value = false);
                            relayersList.value = allData;
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    relayersList.value = allData;
                    console.error(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                relayersList.value = allData;
                console.error(error);
            } finally {
                if (!params.relayer_name && !params.relayer_address) {
                    isHaveParams.value = false;
                } else {
                    isHaveParams.value = true;
                }
            }
        };
        getAllData();
    };
    getRelayersList({ ...BASE_PARAMS, use_count: true });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            relayersList.value.length,
            PAGE_PARAMETERS.relayers
        );
    });
    return {
        relayersList,
        getRelayersList,
        subtitle
    };
};

export const useGoRelayersDetails = () => {
    const router = useRouter();
    const goRelayersDetails = (isRegistered: boolean, relayerId?: string) => {
        if (isRegistered) {
            router.push({
                path: '/relayers/details/' + relayerId
            });
        } else {
            // todo dj 弹窗
        }
    };
    return {
        goRelayersDetails
    };
};
