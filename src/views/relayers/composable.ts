import { getTextWidth } from '@/utils/urlTools';
import { getRelayersListAPI } from '@/api/relayers';
import ChainHelper from '@/helper/chainHelper';
import { ServedChainsInfo, chainPopoverProp } from '@/types/interface/relayers.interface';
import { RelayerListItem } from '@/types/interface/relayers.interface';
import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';
import {
    BASE_PARAMS,
    PAGE_PARAMETERS,
    CHAIN_DEFAULT_ICON,
    UNKNOWN,
    PRETTYNAME,
    DEFAULT_DISPLAY_TEXT
} from '@/constants';
import { useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';
import { RelayersListKey, RelayersSearchType } from '@/constants/relayers';
import { Ref } from 'vue';

export const useGetRelayersList = (loading: Ref<boolean>) => {
    const router = useRouter();
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
                prettyName: chainInfo?.pretty_name || UNKNOWN,
                chainLogo: chainInfo?.icon || CHAIN_DEFAULT_ICON,
                address: [...servedChainsInfo.addresses]
            });
        }
        const irishub = formatChainPopoverProp.filter(
            (item) => item.prettyName === PRETTYNAME.IRISHUB
        );
        const cosmos = formatChainPopoverProp.filter(
            (item) => item.prettyName === PRETTYNAME.COSMOSHUB
        );
        const other = formatChainPopoverProp.filter(
            (item) =>
                item.prettyName !== PRETTYNAME.IRISHUB && item.prettyName !== PRETTYNAME.COSMOSHUB
        );
        other.sort((a, b) => a.prettyName.localeCompare(b.prettyName));
        return [...cosmos, ...irishub, ...other];
    };
    const searchNoResult = ref(false);
    const handleSerchNoResult = (
        dataLength: number,
        relayer_name?: string,
        relayer_address?: string
    ) => {
        if ((relayer_address || relayer_name) && dataLength <= 0) {
            searchNoResult.value = true;
        } else {
            searchNoResult.value = false;
        }
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
                const result = await getRelayersListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const items = (data as IResponseRelayerList).items;
                        if (items && items.length > 0) {
                            const formatItems: RelayerListItem[] = [];
                            for (let i = 0; i < items.length; i++) {
                                const item = items[i];
                                const served_chains_infos = await sortServedChainsInfo(
                                    item.served_chains_info
                                );
                                const is_registered = Boolean(item.relayer_name);
                                const textWidth =
                                    getTextWidth(item.relayer_name, '16px GolosUI_Medium') || 0;
                                const isShowEllipsis = textWidth > 80;
                                formatItems.push({
                                    relayer_id: item.relayer_id,
                                    is_registered,
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
                                        item.relayed_total_txs_value || DEFAULT_DISPLAY_TEXT,
                                    [RelayersListKey.relayersTotalFeeCost]:
                                        item.total_fee_value || DEFAULT_DISPLAY_TEXT,
                                    [RelayersListKey.relayersLastUpdated]: item.update_time,
                                    show_popover: isShowEllipsis
                                });
                            }
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...formatItems];
                                loading && (loading.value = false);
                                relayersList.value = allData;
                                handleSerchNoResult(
                                    relayersList.value.length,
                                    params.relayer_name,
                                    params.relayer_address
                                );
                            } else {
                                allData = [...(allData || []), ...formatItems];
                                allParams.page_num++;
                                getAllData();
                            }
                        } else {
                            loading && (loading.value = false);
                            relayersList.value = allData;
                            handleSerchNoResult(
                                relayersList.value.length,
                                params.relayer_name,
                                params.relayer_address
                            );
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    relayersList.value = allData;
                    handleSerchNoResult(
                        relayersList.value.length,
                        params.relayer_name,
                        params.relayer_address
                    );
                    console.error(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                relayersList.value = allData;
                handleSerchNoResult(
                    relayersList.value.length,
                    params.relayer_name,
                    params.relayer_address
                );
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
    const searchFn = (searchType: string, searchValue: string) => {
        if (!searchValue) {
            router.replace('/relayers');
            getRelayersList({ ...BASE_PARAMS, loading: loading });
        } else {
            const params: {
                relayer_name?: string;
                relayer_address?: string;
            } = {};
            let pageUrl: string;
            switch (searchType) {
                case RelayersSearchType.relayerName:
                    params.relayer_name = searchValue;
                    pageUrl = `/relayers?relayer_name=${searchValue}`;
                    router.replace(pageUrl);
                    break;
                case RelayersSearchType.relayerAddress:
                    params.relayer_address = searchValue;
                    pageUrl = `/relayers?relayer_address=${searchValue}`;
                    router.replace(pageUrl);
                    break;
                default:
                    break;
            }
            getRelayersList({ ...BASE_PARAMS, ...params, loading: loading });
        }
    };
    return {
        relayersList,
        getRelayersList,
        subtitle,
        searchFn,
        searchNoResult
    };
};

export const useShowModal = () => {
    const showModal = ref(false);
    const changeModal = (flag: boolean) => {
        showModal.value = flag;
    };
    return {
        showModal,
        changeModal
    };
};

export const useGoRelayersDetails = () => {
    const router = useRouter();
    const goRelayersDetails = (relayerId?: string) => {
        router.push({
            path: '/relayers/details/' + relayerId
        });
    };
    return {
        goRelayersDetails
    };
};
