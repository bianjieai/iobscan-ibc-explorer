<template>
    <div class="token_info">
        <TitleCard title="Token"></TitleCard>
        <div class="token_info__details">
            <router-link
                class="token_info__left"
                :to="`/tokens/details?denom=${tokenInfo?.base_denom}`"
            >
                <div class="token_info__icon">
                    <img :src="tokenLogo" alt="" />
                </div>
                <div class="token_info__name"> {{ tokenName }} </div>
            </router-link>
            <div class="token_info__right">
                <div
                    v-for="(item, index) in tokenInfoList"
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
                <div class="token_info__expand" @click="expandInfo">
                    <span class="token_info__expand_btn">Click to see More</span>
                    <i
                        class="token_info__expand_icon iconfont icon-shouqi"
                        :class="isShowTokenDetailsInfo ? '' : 'token_info__expand_more'"
                    >
                    </i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ITokenInfo } from '@/types/interface/transfers.interface';
    import { useTokenInfo } from '@/views/transfers/details/composable';
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
        expandInfo
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
            padding: 5px 16px;
            background: #ebedff;
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
            font-weight: 600;
            color: var(--bj-text-normal);
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            width: 100%;
            font-size: var(--bj-font-size-normal);
            color: var(--bj-text-normal);
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
                width: 140px;
            }
            &__value {
            }
            &__expand {
            }
        }
    }
    @media screen and (max-width: 600px) {
        .token_info {
            &__details {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__left {
                .flex(row, nowrap, flex-start, center);
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
            &__right {
                margin-top: 16px;
                margin-left: 0;
            }
            &__label_value_wrap {
                display: none;
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
                display: block;
                margin-top: 16px;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: var(--bj-primary-color);
                line-height: 14px;
            }
            &__expand_btn {
            }
            &__expand_icon {
                display: inline-block;
                margin-left: 6px;
                font-size: 8px;
            }
            &__expand_more {
                transform: rotate(180deg);
            }
        }
    }
</style>
