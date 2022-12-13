import { isArray } from '@/utils/objectTools';
import { PRETTYNAME, UNKNOWN, CHAIN_DEFAULT_VALUE } from '@/constants';
import { useIbcChains } from '@/composables';
import { IChainsListItem, IResponseChainsListItem } from '@/types/interface/chains.interface';
import { IResponseTokensListItem, ITokensListItem } from '@/types/interface/tokens.interface';
import { IIbcchain, IIbcchainMap, IPrefixChain } from '@/types/interface/index.interface';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { getRestString } from '@/helper/parseStringHelper';
import { TData, TDenom, IDataItem } from '@/components/BjSelect/interface';
import { useIbcStatisticsChains } from '@/store/index';

const { ibcChains } = useIbcChains();

// todo dj 改造 export default => export
export default class ChainHelper {
    // pretty_name sort
    // Todo shan 该方法中 ibcChains 可能存在没有值的情况，需要做处理
    static sortByPrettyName(sourceList: any, chain?: any) {
        function changeChainsSort(item: any) {
            const saveChain = item.chain_a;
            item.chain_a = item.chain_b;
            item.chain_b = saveChain;
            const saveChannel = item.channel_a;
            item.channel_a = item.channel_b;
            item.channel_b = saveChannel;
            if (item.chain_a_address || item.chain_b_address) {
                const saveAddress = item.chain_a_address;
                item.chain_a_address = item.chain_b_address;
                item.chain_b_address = saveAddress;
            }
            if (item.chain_a_addresses || item.chain_b_addresses) {
                const saveAddresses = item.chain_a_addresses;
                item.chain_a_addresses = item.chain_b_addresses;
                item.chain_b_addresses = saveAddresses;
            }
        }
        if (isArray(sourceList) && sourceList?.length) {
            const updateList = sourceList?.map((item: any) => {
                const matchChainA = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_name === item.chain_a
                );
                const matchChainB = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_name === item.chain_b
                );
                // 满足单选情况
                if (chain?.split(',')[0] !== 'allchain' && chain?.split(',')[1] === 'allchain') {
                    if (matchChainB?.chain_name === chain?.split(',')[0]) {
                        changeChainsSort(item);
                    }
                    return item;
                } else {
                    if (!matchChainA?.chain_name) {
                        if (matchChainB?.chain_name) {
                            changeChainsSort(item);
                        }
                    } else if (
                        [matchChainA?.pretty_name, matchChainB?.pretty_name].indexOf(
                            PRETTYNAME.COSMOSHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.pretty_name, matchChainB?.pretty_name].indexOf(
                                PRETTYNAME.COSMOSHUB
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    } else if (
                        [matchChainA?.pretty_name, matchChainB?.pretty_name].indexOf(
                            PRETTYNAME.IRISHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.pretty_name, matchChainB?.pretty_name].indexOf(
                                PRETTYNAME.IRISHUB
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    } else {
                        /**
                         * -1 -- need not
                         *  0 -- same
                         *  1 -- need
                         */
                        if (
                            matchChainA?.pretty_name.localeCompare(
                                (matchChainB as any)?.pretty_name
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    }
                    return item;
                }
            });
            return updateList;
        }
        return [];
    }

    // 按照类型顺序重新排序（ChainDropDown.vue 中的setAllChains 函数修改）
    static sortArrsByNames(
        dropdownData: any[],
        sortNames = [PRETTYNAME.COSMOSHUB, PRETTYNAME.IRISHUB]
    ) {
        if (!dropdownData?.length) {
            return [];
        }

        const res = [];

        sortNames.forEach((v) => {
            const mathItem = dropdownData.filter((item) => item.pretty_name === v);
            res.push(...mathItem);
        });

        const excludes = dropdownData.filter((v) => !sortNames.includes(v.pretty_name));

        excludes.sort((a, b) => {
            return a.pretty_name?.toLowerCase() < b.pretty_name?.toLowerCase()
                ? -1
                : a.pretty_name?.toLowerCase() > b.pretty_name?.toLowerCase()
                ? 1
                : 0;
        });

        res.push(...excludes);

        return res;
    }

    static async getChainName(data: IResponseChainsListItem[]): Promise<IChainsListItem[]> {
        if (data.length === 0) {
            return [];
        }
        const { ibcChains, getIbcChains } = useIbcChains();
        if (Object.keys(ibcChains.value).length <= 0) {
            try {
                await getIbcChains();
            } catch (error) {
                console.log('getIbcChains', error);
            }
        }
        const ibcChainsAllMap: IIbcchainMap = {};
        (ibcChains.value?.all || []).forEach((ibcChain: IIbcchain) => {
            ibcChainsAllMap[ibcChain.chain_name] = ibcChain.pretty_name;
        });
        const chainsList = ref<IChainsListItem[]>([]);
        chainsList.value = data.map((item: IResponseChainsListItem) => {
            const prettyName = ibcChainsAllMap[item.chain] || UNKNOWN;
            const chain = {
                ...item,
                prettyName
            };
            return chain;
        });
        return chainsList.value;
    }

    static async getBaseDenom(data: IResponseTokensListItem[]) {
        const temp: ITokensListItem[] = [];
        for (let i = 0; i < (data ?? []).length; i++) {
            const item: ITokensListItem = data[i];
            const baseDenom = await getBaseDenomByKey(item.chain, item.base_denom);
            item['name'] = baseDenom
                ? getRestString(baseDenom.symbol, 6, 0)
                : getRestString(item.base_denom, 6, 0);
            temp.push(item);
        }
        return temp;
    }

    // channels and relayers 选择框是否需要排序
    static isNeedSort = (chainIdArr: TDenom[], chainsArrs: TData) => {
        // 拍扁数组处理，集合
        const tempFlats: IDataItem[] = [];

        chainsArrs?.forEach((v) => {
            if (v.children && v.children.length) {
                tempFlats.push(...v.children);
            }
        });
        /**
         * 需要判断输入的值是否和选择的值匹配，使用匹配的值判断
         * 1. 选择 All Chains + Other Chain => 相当于选择了一条链，第一个选择的是 All Chains 的需要 sort，第二个选择的是 All Chains 的不需要 sort
         * 2. 选择了两个都不是 All Chains 的 chain
         *      a. 判断选中两条链是否包含 Cosmos Hub 或 IRIS Hub：
         *          包含 Cosmos Hub：左边不需要，右边需要
         *          包含 IRIS Hub：左边不需要，右边需要
         *      b. 其他的根据其对应 chain_name 字母大小写排序
         */
        const isLocaleCompare = ref<boolean>(false);
        const chainsName = chainIdArr.map((id) => {
            const filterItem = tempFlats.find((v) => v.id === id);
            if (filterItem) {
                return filterItem.title;
            }
            return undefined;
        });

        if (chainIdArr[0] === CHAIN_DEFAULT_VALUE) {
            isLocaleCompare.value = true;
        } else if (chainIdArr[1] === CHAIN_DEFAULT_VALUE) {
            isLocaleCompare.value = false;
        } else if (chainsName.indexOf(PRETTYNAME.COSMOSHUB) === 0) {
            isLocaleCompare.value = false;
        } else if (chainsName.indexOf(PRETTYNAME.COSMOSHUB) === 1) {
            isLocaleCompare.value = true;
        } else if (chainsName.indexOf(PRETTYNAME.IRISHUB) === 0) {
            isLocaleCompare.value = false;
        } else if (chainsName.indexOf(PRETTYNAME.IRISHUB) === 1) {
            isLocaleCompare.value = true;
        } else if (chainsName[1]) {
            if ((chainsName[0] as string)?.localeCompare(chainsName[1] as string) === 1) {
                isLocaleCompare.value = true;
            }
        }
        return isLocaleCompare.value;
    };

    static getChainInfoByKey = async (chain: string): Promise<IIbcchain | undefined> => {
        const ibcStatisticsChainsStore = useIbcStatisticsChains();
        const { ibcChainsUniqueKeyMapGetter } = ibcStatisticsChainsStore;
        if (Object.keys(ibcChainsUniqueKeyMapGetter).length <= 0) {
            await ibcStatisticsChainsStore.getIbcChainsAction();
        }
        return ibcChainsUniqueKeyMapGetter[chain];
    };

    static getChainInfoByPrettyName = async (
        prettyName: string
    ): Promise<IIbcchain | undefined> => {
        const ibcStatisticsChainsStore = useIbcStatisticsChains();
        const { ibcChainsPrettyNameKeyMapGetter } = ibcStatisticsChainsStore;
        if (Object.keys(ibcChainsPrettyNameKeyMapGetter).length <= 0) {
            await ibcStatisticsChainsStore.getIbcChainsAction();
        }
        return ibcChainsPrettyNameKeyMapGetter[prettyName];
    };

    static handleChainIdToChain = async (comchainId: string) => {
        const array = comchainId.split(',');
        const resArray: string[] = [];
        for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (item === 'allchain') {
                resArray.push(item);
            } else {
                const formatRes = await this.getChainInfoByPrettyName(item);
                const pushRes = formatRes?.chain_name || item;
                resArray.push(pushRes);
            }
        }
        return resArray.join(',');
    };

    static getChainInfoByPrefix = async (prefix: string): Promise<IPrefixChain[] | undefined> => {
        const ibcStatisticsChainsStore = useIbcStatisticsChains();
        const { ibcChainsPrefixMapGetter } = ibcStatisticsChainsStore;
        if (Object.keys(ibcChainsPrefixMapGetter).length <= 0) {
            await ibcStatisticsChainsStore.getIbcChainsAction();
        }
        return ibcChainsPrefixMapGetter[prefix];
    };
}
