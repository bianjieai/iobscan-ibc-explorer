<template>
    <PageContainer class="address_details">
        <PageTitle class="address_details__title" title="Address Details" />
        <div class="address_details__base_info_c">
            <BaseInfo />
        </div>
        <!-- todo dj 三屏适配 -->
        <div class="address_details__tokens_c">
            <AddressAllocation
                class="address_details__tokens_c__allocation"
                :data="tokensData"
                :address-allocation-loading="tokensLoading"
                :address-allocation-type="tokensNoDataType"
            />
            <AddressTokens
                class="address_details__tokens_c__tokens"
                :data="tokensData?.tokens"
                :address-tokens-loading="tokensLoading"
                :address-tokens-type="tokensNoDataType"
            />
        </div>
        <div class="address_details__transactions_c">
            <AddressTransactions />
        </div>
        <div class="address_details__accounts_c">
            <AddresssAccount
                :data="accountsData?.accounts"
                :address-account-loading="accountsLoading"
                :address-account-type="accountsNoDataType"
                class="address_details__accounts_c__account"
            />
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
    import { useAddressTokens, useAddressAccounts } from './composable';

    const { tokensLoading, tokensNoDataType, tokensData } = useAddressTokens();
    const { accountsLoading, accountsNoDataType, accountsData } = useAddressAccounts();
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
