<template>
    <PageContainer class="address_details">
        <PageTitle class="address_details__title" title="Address Details" />
        <div class="address_details__base_info_c">
            <BaseInfo
                :base-info-loading="baseInfoLoading"
                :base-info="baseInfo"
                :current-chain-info="currentChainInfo"
                :is-show-tooltip="isShowTooltip"
                :total-value="baseInfoTotalValue"
            />
        </div>
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
                class="address_details__accounts_c__account"
                :data="accountsData?.accounts"
                :address-account-loading="accountsLoading"
                :address-account-type="accountsNoDataType"
            />
            <AccountTokensRatio
                class="address_details__accounts_c__account_tokens_ratio"
                :data="accountsData"
                :address-ratio-loading="accountsLoading"
                :address-ratio-type="accountsNoDataType"
            />
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
    import { useGetAddressTokens, useGetAddressAccounts, useGetBaseInfo } from './composable';

    const { baseInfoLoading, baseInfo, currentChainInfo, isShowTooltip } = useGetBaseInfo();
    const { tokensLoading, tokensNoDataType, tokensData, baseInfoTotalValue } =
        useGetAddressTokens();
    const { accountsLoading, accountsNoDataType, accountsData } = useGetAddressAccounts();
</script>

<style lang="less" scoped>
    .address_details {
        padding: 48px 32px 100px !important;
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
    @media screen and (max-width: 1247px) {
        .address_details {
            .info_card {
            }
            &__title {
            }
            &__base_info_c {
            }
            &__tokens_c {
                &__allocation {
                }
                &__tokens {
                }
            }
            &__transactions_c {
            }
            &__accounts_c {
                .flex(column;nowrap);
                &__account {
                    flex: none;
                    margin-right: 0;
                }
                &__account_tokens_ratio {
                    flex: none;
                }
            }
        }
    }

    @media screen and (max-width: 1091px) {
        .address_details {
            .info_card {
            }
            &__title {
            }
            &__base_info_c {
            }
            &__tokens_c {
                .flex(column,nowrap);
                &__allocation {
                    flex: none;
                    margin-right: 0;
                }
                &__tokens {
                    flex: none;
                }
            }
            &__transactions_c {
            }
            &__accounts_c {
                &__account {
                }
                &__account_tokens_ratio {
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .address_details {
            padding: 40px 24px 60px !important;
            .info_card {
            }
            &__title {
            }
            &__base_info_c {
            }
            &__tokens_c {
                &__allocation {
                }
                &__tokens {
                }
            }
            &__transactions_c {
            }
            &__accounts_c {
                &__account {
                }
                &__account_tokens_ratio {
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .address_details {
            padding: 24px 16px 60px !important;
            .info_card {
            }
            &__title {
            }
            &__base_info_c {
            }
            &__tokens_c {
                &__allocation {
                }
                &__tokens {
                }
            }
            &__transactions_c {
            }
            &__accounts_c {
                &__account {
                }
                &__account_tokens_ratio {
                }
            }
        }
    }
</style>
