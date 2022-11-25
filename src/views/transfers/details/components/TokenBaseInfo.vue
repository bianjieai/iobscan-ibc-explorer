<template>
    <div class="token_info">
        <TitleCard title="Token"></TitleCard>
        <div class="token_info__details">
            <router-link
                v-if="tokenName !== DEFAULT_DISPLAY_TEXT"
                class="token_info__left"
                :to="`/tokens/details?denom=${tokenInfo?.base_denom}&denomChain=${tokenInfo?.base_denom_chain}`"
            >
                <div class="token_info__icon">
                    <img :src="tokenLogo" alt="" />
                </div>
                <a-popover
                    v-if="tokenName?.length > 6"
                    destroy-tooltip-on-hide
                    class="token_info__name_popover"
                >
                    <template #content>{{ tokenName }}</template>
                    <span class="token_info__name">{{ getRestString(tokenName, 6, 0) }}</span>
                </a-popover>
                <span v-else class="token_info__name token_info__name_max">{{
                    getRestString(tokenName, 6, 0)
                }}</span>
                <span class="token_info__name token_info__name_mobile">{{ tokenName }}</span>
            </router-link>
            <span v-else class="token_info__left">
                <div class="token_info__icon">
                    <img :src="tokenLogo" alt="" />
                </div>
                <span class="token_info__name">
                    {{ DEFAULT_DISPLAY_TEXT }}
                </span>
            </span>
            <div class="token_info__right">
                <div class="token_info__label_value">
                    <span class="token_info__label">
                        {{ tokenInfoList.label }}
                    </span>
                    <span class="token_info__value">
                        {{ tokenInfoList.value }}
                    </span>
                </div>
                <div class="token_info__label_value_wrap">
                    <div
                        v-for="(item, index) in tokenInfoListExpand"
                        :key="index"
                        class="token_info__label_value"
                    >
                        <span class="token_info__label">
                            {{ item.label }}
                        </span>
                        <span class="token_info__value">
                            {{ item.value }}
                        </span>
                    </div>
                </div>
                <div v-if="isShowTokenDetailsInfo" class="token_info__label_value_expand">
                    <div
                        v-for="(item, index) in tokenInfoListExpand"
                        :key="index"
                        class="token_info__label_value"
                    >
                        <span class="token_info__label">
                            {{ item.label }}
                        </span>
                        <span class="token_info__value">
                            {{ item.value }}
                        </span>
                    </div>
                </div>
                <ExpandBtn
                    class="token_info__expand cursor"
                    :is-show-details-info="isShowTokenDetailsInfo"
                    @update-is-show-details-info="updateIsShowDetailsInfo"
                ></ExpandBtn>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ITokenInfo } from '@/types/interface/transfers.interface';
    import { useTokenInfo } from '@/views/transfers/details/composable';
    import { getRestString } from '@/helper/parseStringHelper';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';

    import TitleCard from './TitleCard.vue';
    interface IProps {
        tokenInfo: ITokenInfo | undefined;
    }
    const props = defineProps<IProps>();
    const {
        tokenLogo,
        tokenName,
        tokenInfoList,
        tokenInfoListExpand,
        isShowTokenDetailsInfo,
        updateIsShowDetailsInfo
    } = useTokenInfo(props);
</script>

<style lang="less" scoped>
    .token_info {
        padding-bottom: 24px;
        border-bottom: 1px solid var(--bj-border-color);
        &__details {
            .flex(row, nowrap, space-between, flex-start);
            margin-top: 16px;
        }
        &__left {
            width: 175px;
            text-align: center;
        }
        &__icon {
            padding: 30px 16px;
            background: #f8fafd;
            img {
                width: 60px;
            }
        }
        &__name {
            display: inline-block;
            padding: 5px 16px;
            width: 100%;
            background: #ebedff;
        }
        &__name_mobile {
            display: none;
        }
        &__right {
            flex: 1;
            margin-left: 40px;
        }
        &__label_value_wrap {
            margin-top: 16px;
        }
        &__label_value_expand {
            display: none;
        }
        &__label_value {
            .flex(row, nowrap, flex-start, flex-start);
            margin-top: 16px;
            line-height: 18px;
            &:first-child {
                margin-top: 0;
            }
        }
        &__label {
            display: inline-block;
            width: 164px;
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            width: 100%;
            font-size: var(--bj-font-size-normal);
            color: var(--bj-text-second);
            word-break: break-all;
        }
        &__expand {
            display: none;
        }
    }
    @media screen and (max-width: 768px) {
        .token_info {
            &__details {
            }
            &__left {
                width: 140px;
            }
            &__icon {
                padding: 24px 16px;
                img {
                    width: 48px;
                }
            }
            &__name {
            }
            &__right {
                margin-left: 24px;
            }
            &__label_value_wrap {
            }
            &__label_value {
                &:first-child {
                }
            }
            &__label {
                width: 145px;
            }
            &__value {
            }
            &__expand {
            }
        }
    }
    @media screen and (max-width: 680px) {
        .token_info {
            &__details {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__left {
                .flex(row, nowrap, flex-start, flex-start);
                width: 100%;
                text-align: left;
            }
            &__icon {
                padding: 0;
                background: #fff;
                img {
                    width: 24px;
                }
            }
            &__name {
                margin-left: 8px;
                padding: 0;
                background: #fff;
            }
            &__name_popover {
                display: none;
            }
            &__name_max {
                display: none;
            }
            &__name_mobile {
                display: inline-block;
                flex: 1;
                word-break: break-all;
                width: 279px;
            }
            &__right {
                margin-top: 16px;
                margin-left: 0;
                width: 100%;
            }
            &__label_value_wrap {
            }
            &__label_value_expand {
                display: block;
                margin-top: 16px;
            }
            &__label_value {
                .flex(column, nowrap, flex-start, flex-start);
                &:first-child {
                }
            }
            &__label {
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
            }
            &__expand {
            }
        }
    }
    @media screen and (max-width: 500px) {
        .token_info {
            &__details {
            }
            &__left {
            }
            &__icon {
                img {
                }
            }
            &__name {
            }
            &__right {
            }
            &__label_value_wrap {
                display: none;
            }
            &__label_value_expand {
                display: block;
                margin-top: 16px;
            }
            &__label_value {
                &:first-child {
                }
            }
            &__label {
            }
            &__value {
            }
            &__expand {
                display: block;
            }
        }
    }
</style>
