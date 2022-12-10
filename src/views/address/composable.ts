import ChainHelper from '@/helper/chainHelper';
import { getAddrTokenListMock, getAddrAccountListMock } from '@/api/address';
import { NoDataType } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import {
    ITokenList,
    ITokenListItem,
    IAccountListItem,
    IAccountData
} from '@/types/interface/address.interface';
import BigNumber from 'bignumber.js';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import moveDecimal from 'move-decimal-point';

export const useAddressTokens = () => {
    const tokensLoading = ref(true);
    const tokensNoDataType = ref<NoDataType>();
    const tokensData = ref<ITokenList>();

    const getAddrTokenList = async (chain: string, address: string) => {
        try {
            tokensLoading.value = true;
            tokensNoDataType.value = undefined;
            const { code, data, message } = await getAddrTokenListMock(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.tokens = data.tokens.sort((a, b) =>
                        new BigNumber(b.denom_value).comparedTo(a.denom_value)
                    );
                    const tokens: ITokenListItem[] = [];
                    for (let i = 0; i < data.tokens.length; i++) {
                        const item = data.tokens[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        let displayAmount: string;
                        let displayAvaliableAmount: string;
                        if (baseDenom) {
                            const tempAmount = moveDecimal(item.denom_amount, -baseDenom.scale);
                            const tempAvaliableAmount = moveDecimal(
                                item.denom_avaliable_amount,
                                -baseDenom.scale
                            );
                            displayAmount = formatBigNumber(tempAmount, 6);
                            displayAvaliableAmount = formatBigNumber(tempAvaliableAmount, 6);
                        } else {
                            displayAmount = formatBigNumber(item.denom_amount, 6);
                            displayAvaliableAmount = formatBigNumber(
                                item.denom_avaliable_amount,
                                6
                            );
                        }
                        tokens.push({
                            ...item,
                            displayAmount,
                            displayAvaliableAmount,
                            tokenInfo: baseDenom
                        });
                    }
                    tokensData.value = {
                        tokens,
                        total_value: data.total_value
                    };
                } else {
                    tokensData.value = {
                        tokens: [],
                        total_value: '0'
                    };
                }
            } else {
                tokensNoDataType.value = NoDataType.loadFailed;
                console.error(message);
            }
        } catch (error) {
            tokensNoDataType.value = NoDataType.loadFailed;
            console.error(error);
        } finally {
            tokensLoading.value = false;
        }
    };

    // todo dj 接口入参待处理
    getAddrTokenList('chain', 'address');
    return {
        tokensLoading,
        tokensNoDataType,
        tokensData
    };
};

export const useAddressAccounts = () => {
    const accountsLoading = ref(true);
    const accountsNoDataType = ref<NoDataType>();
    const accountsData = ref<IAccountData>();

    const getAddrAccountList = async (chain: string, address: string) => {
        try {
            accountsLoading.value = true;
            accountsNoDataType.value = undefined;
            const { code, data, message } = await getAddrAccountListMock(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.accounts = data.accounts.sort((a, b) =>
                        new BigNumber(b.token_value).comparedTo(a.token_value)
                    );
                    const accounts: IAccountListItem[] = [];
                    for (let i = 0; i < data.accounts.length; i++) {
                        const item = data.accounts[i];
                        const chainInfo = await ChainHelper.getChainInfoByKey(item.chain);
                        accounts.push({
                            ...item,
                            chainInfo
                        });
                    }
                    accountsData.value = {
                        accounts,
                        total_value: data.total_value
                    };
                } else {
                    accountsData.value = {
                        accounts: [],
                        total_value: '0'
                    };
                }
            } else {
                accountsNoDataType.value = NoDataType.loadFailed;
                console.error(message);
            }
        } catch (error) {
            accountsNoDataType.value = NoDataType.loadFailed;
            console.error(error);
        } finally {
            accountsLoading.value = false;
        }
    };

    // todo dj 接口入参待处理
    getAddrAccountList('chain', 'address');
    return {
        accountsLoading,
        accountsNoDataType,
        accountsData
    };
};
