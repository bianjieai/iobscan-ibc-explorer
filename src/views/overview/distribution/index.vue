<template>
    <PageContainer class="distribution">
        <PageTitle title="IBC Token Distribution" />
        <div class="distribution__container">
            <div class="distribution__select">
                <BjSelect
                    ref="distributionTokenDropdown"
                    class="distribution__token_select"
                    :data="distributionTokenData"
                    :value="searchToken"
                    :hide-icon="true"
                    :input-flag="inputFlag"
                    :change-input-flag="changeInputFlag"
                    :placeholder="SYMBOL.ATOM"
                    :dropdown-props="{
                        getPopupContainer: getPopupContainer
                    }"
                    :default-value="defaultToken"
                    :is-disabled="distributionDisable"
                    @on-change="onSelectedToken"
                />
                <TypeButton class="distribution__reset_btn" @on-reset="onClickReset" />
            </div>
            <div class="distribution__chart">
                <loading-component
                    v-if="distributionLoading"
                    class="distribution__loading"
                    :type="LoadingType.container"
                />
                <no-datas
                    v-else-if="distributionNoDataType"
                    :type="distributionNoDataType"
                    class="distribution__failed"
                />
                <div
                    v-show="!distributionLoading && !distributionNoDataType"
                    class="distribution__chart__wrap"
                >
                    <div ref="distributionDom" class="distribution__chart__dom"></div>
                </div>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import { SYMBOL, LoadingType } from '@/constants';
    import { useDistributionSelect } from './composable';

    const {
        distributionTokenDropdown,
        distributionTokenData,
        defaultToken,
        inputFlag,
        changeInputFlag,
        searchToken,
        getPopupContainer,
        distributionDisable,
        onSelectedToken,
        onClickReset,
        distributionLoading,
        distributionNoDataType,
        distributionDom
    } = useDistributionSelect();
</script>

<style lang="less" scoped>
    .distribution {
        padding: 48px 32px 100px !important;
        &__container {
            margin-top: 28px;
        }
        &__select {
            .flex(row,nowrap, flex-start,center);
        }
        &__token_select {
        }
        &__reset_btn {
            margin-left: 8px;
        }
        &__chart {
            .flex(row, nowrap, center);
            margin-top: 16px;
            padding: 24px;
            min-height: 360px;
            max-height: 1000px;
            background: #fff;
            border-radius: var(--border-radius-normal);
            &__wrap {
                width: 100%;
                background: #f8fafd;
                overflow-y: auto;
            }
            &__dom {
                min-width: 1152px;
            }
        }
        &__failed {
            margin-top: -100px;
        }
    }

    @media screen and(max-width: 912px) {
        .distribution {
            &__container {
            }
            &__select {
            }
            &__token_select {
            }
            &__reset_btn {
            }
            &__chart {
                &__wrap {
                    overflow-x: auto;
                }
                &__dom {
                }
            }
        }
    }
    @media screen and(max-width: 768px) {
        .distribution {
            padding: 40px 32px 60px !important;
            &__container {
            }
            &__select {
            }
            &__token_select {
            }
            &__reset_btn {
            }
            &__chart {
                &__wrap {
                }
                &__dom {
                }
            }
        }
    }
    @media screen and(max-width: 530px) {
        .distribution {
            padding: 24px 16px 60px !important;
            &__container {
            }
            &__select {
            }
            &__token_select {
            }
            &__reset_btn {
            }
            &__chart {
                &__wrap {
                }
                &__dom {
                }
            }
        }
    }
</style>
