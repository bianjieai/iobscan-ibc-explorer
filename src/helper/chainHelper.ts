import { isArray } from '@/utils/objectTools';
import { CHAINNAME, UNKNOWN } from '@/constants';
import { useIbcChains } from '@/composables';
import { IResponseChainsListItem } from '@/types/interface/chains.interface';
import { IResponseTokensListItem, ITokensListItem } from '@/types/interface/tokens.interface';
import { IIbcchain, IIbcchainMap } from '@/types/interface/index.interface';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { getRestString } from '@/helper/parseStringHelper';
const { ibcChains } = useIbcChains();
export default class ChainHelper {
    static formatChainId(chainId: any) {
        if (chainId && chainId !== '--') {
            return chainId.replace(new RegExp('_', 'g'), '-');
        }
        return '--';
    }

    // chain_name sort
    static sortByChainName(sourceList: any, chain: any) {
        function changeChainsSort(item: any) {
            const saveChain = item.chain_a;
            item.chain_a = item.chain_b;
            item.chain_b = saveChain;
            const saveChannel = item.channel_a;
            item.channel_a = item.channel_b;
            item.channel_b = saveChannel;
            const saveAddress = item.chain_a_address;
            item.chain_a_address = item.chain_b_address;
            item.chain_b_address = saveAddress;
        }
        if (isArray(sourceList) && sourceList?.length) {
            const updateList = sourceList?.map((item: any) => {
                const matchChainA = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_id === item.chain_a
                );
                const matchChainB = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_id === item.chain_b
                );
                // 满足单选情况
                if (chain?.split(',')[0] !== 'allchain' && chain?.split(',')[1] === 'allchain') {
                    if (matchChainB?.chain_id === chain?.split(',')[0]) {
                        changeChainsSort(item);
                    }
                    return item;
                } else {
                    if (
                        [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                            CHAINNAME.COSMOSHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                                CHAINNAME.COSMOSHUB
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    } else if (
                        [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                            CHAINNAME.IRISHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                                CHAINNAME.IRISHUB
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
                            matchChainA?.chain_name.localeCompare(
                                (matchChainB as any)?.chain_name
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
        sortNames = [CHAINNAME.COSMOSHUB, CHAINNAME.IRISHUB]
    ) {
        if (!dropdownData?.length) {
            return [];
        }

        const res = [];

        sortNames.forEach((v) => {
            const mathItem = dropdownData.filter((item) => item.chain_name === v);
            res.push(...mathItem);
        });

        const excludes = dropdownData.filter((v) => !sortNames.includes(v.chain_name));

        excludes.sort((a, b) => {
            return a.chain_name.toLowerCase() < b.chain_name.toLowerCase()
                ? -1
                : a.chain_name.toLowerCase() > b.chain_name.toLowerCase()
                ? 1
                : 0;
        });

        res.push(...excludes);

        return res;
    }

    static async sortByChainMap(
        data: IResponseChainsListItem[]
    ): Promise<IResponseChainsListItem[]> {
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
            ibcChainsAllMap[ibcChain.chain_id] = ibcChain.chain_name;
        });
        const chainsList = ref<IResponseChainsListItem[]>([]);
        chainsList.value = data.map((item: IResponseChainsListItem) => {
            const chainName = ibcChainsAllMap[item.chain_id];
            item.chainName = chainName ? chainName : UNKNOWN;
            return item;
        });
        console.log(chainsList.value);
        return chainsList.value;
    }

    static async sortByBaseDenom(data: IResponseTokensListItem[]) {
        const temp: ITokensListItem[] = [];
        for (let i = 0; i < (data ?? []).length; i++) {
            const item: ITokensListItem = data[i];
            const baseDenom = await getBaseDenomByKey(item.chain_id, item.base_denom);
            item['name'] = baseDenom
                ? getRestString(baseDenom.symbol, 6, 0)
                : getRestString(item.base_denom, 6, 0);
            temp.push(item);
        }
        return temp;
    }
}
