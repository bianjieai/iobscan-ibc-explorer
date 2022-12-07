<template>
    <PageContainer class="address_details">
        <PageTitle class="address_details__title" title="Address Details" />
        <div class="address_details__base_info_c">
            <BaseInfo />
        </div>
        <div class="address_details__tokens_c">
            <AddressAllocation class="address_details__tokens_c__allocation" />
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
</script>

<style lang="less" scoped>
    .address_details {
        &__title {
        }
        &__base_info_c {
            margin-top: 36px;
        }
        &__tokens_c {
            margin-top: 16px;
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
            margin-top: 16px;
        }
        &__accounts_c {
            margin-top: 16px;
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
