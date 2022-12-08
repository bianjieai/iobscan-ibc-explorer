<template>
    <PageContainer class="address_details">
        <PageTitle class="address_details__title" title="Address Details" />
        <div class="address_details__base_info_c">
            <BaseInfo />
        </div>
        <div class="address_details__tokens_c">
            <AddressAllocation
                class="address_details__tokens_c__allocation"
                :data="tokensData"
                :address-allocation-loading="tokensLoading"
                :address-allocation-type="tokensNoDataType"
            />
            <AddressTokens class="address_details__tokens_c__tokens" />
        </div>
        <div class="address_details__transactions_c">
            <AddressTransactions />
        </div>
        <div class="address_details__accounts_c">
            <AddresssAccount class="address_details__accounts_c__account" />
            <AccountTokensRatio class="address_details__accounts_c__account_tokens_ratio" />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import BaseInfo from './components/BaseInfo.vue';
    import AddressAllocation from './components/AddressAllocation.vue';
    import AddressTokens from './components/AddressTokens.vue';
    import AddressTransactions from './components/AddressTransactions.vue';
    import AccountTokensRatio from './components/AccountTokensRatio.vue';
    import AddresssAccount from './components/AddresssAccount.vue';
    import { getAddrTokenListMock } from '@/api/address';
    import { NoDataType } from '@/constants';
    import { API_CODE } from '@/constants/apiCode';
    import { ITokenList } from '@/types/interface/address.interface';
    import BigNumber from 'bignumber.js';
    import { getBaseDenomByKey } from '@/helper/baseDenomHelper';

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
                    const tokens = [];
                    for (let i = 0; i < data.tokens.length; i++) {
                        const item = data.tokens[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        tokens.push({
                            ...item,
                            chainInfo: baseDenom
                        });
                    }
                    tokensData.value = {
                        tokens,
                        total_value: data.total_value
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
    getAddrTokenList('chain', 'address');
</script>

<style lang="less" scoped>
    .address_details {
        .info_card {
            margin-top: 16px;
        }
        &__title {
        }
        &__base_info_c {
            margin-top: 36px;
        }
        &__tokens_c {
            .flex(row,nowrap);
            &__allocation {
                flex: 1;
                margin-right: 16px;
            }
            &__tokens {
                flex: 1;
            }
        }
        &__transactions_c {
        }
        &__accounts_c {
            .flex(row,nowrap);
            &__account {
                flex: 1;
                margin-right: 16px;
            }
            &__account_tokens_ratio {
                flex: 1;
            }
        }
    }
</style>
