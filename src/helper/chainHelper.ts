import { isArray } from '@/utils/objectTools';
import { CHAINNAME, CHAIN_DEFAULT_VALUE } from '@/constants';
import { useIbcChains } from '@/composables';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
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

    // channels and relayers 选择框是否需要排序
    static isNeedSort = (chainIdArr: TDenom[], chooseChains: IDataItem[]) => {
        /**
         * 1. 选择 All Chains + Other Chain => 相当于选择了一条链，第一个选择的是 All Chains 的需要 sort
         * 2. 选择了两个都不是 All Chains 的 chain
         *      a. 判断选中两条链是否包含 Cosmos Hub 或 IRIS Hub：
         *          包含 Cosmos Hub：左边不需要，右边需要
         *          包含 IRIS Hub：左边不需要，右边需要
         *      b. 其他的根据其对应 chain_name 字母大小写排序
         */
        const isLocaleCompare = ref<boolean>(false);
        const chainsName = chooseChains.map((chain) => chain.title);
        if (chainIdArr[0] === CHAIN_DEFAULT_VALUE) {
            isLocaleCompare.value = true;
        } else if (chainsName.indexOf(CHAINNAME.COSMOSHUB) === 0) {
            isLocaleCompare.value = false;
        } else if (chainsName.indexOf(CHAINNAME.COSMOSHUB) === 1) {
            isLocaleCompare.value = true;
        } else if (chainsName.indexOf(CHAINNAME.IRISHUB) === 0) {
            isLocaleCompare.value = false;
        } else if (chainsName.indexOf(CHAINNAME.IRISHUB) === 1) {
            isLocaleCompare.value = true;
        } else if (chainsName[1]) {
            if ((chainsName[0] as string)?.localeCompare(chainsName[1] as string) === 1) {
                isLocaleCompare.value = true;
            }
        }
        return isLocaleCompare.value;
    };
}
