<template>
    <div class="chain_info">
        <TitleCard :title="title"></TitleCard>
        <div class="chain_info__details" :class="{ chain_info__details_column: isFlexColumn }">
            <ChainAddress :chain-address="chainAddress"></ChainAddress>
            <div class="chain_info__chain_id" :class="{ chain_info__column: isFlexColumn }">
                <span class="chain_info__label">{{ chainInfoList.label }}</span>
                <router-link
                    v-if="chainInfoList.value !== DEFAULT_DISPLAY_TEXT"
                    :to="`/chains`"
                    class="chain_info__value chain_info__chain_id_value"
                >
                    <span class="chain_info__icon">
                        <img :src="searchChainIcon" alt="" />
                    </span>
                    <span>{{ ChainHelper.formatChainId(chainInfoList.value) }}</span>
                </router-link>
                <span v-else class="chain_info__value chain_info__chain_id_value">
                    <span>{{ DEFAULT_DISPLAY_TEXT }}</span>
                </span>
            </div>
            <div class="chain_info__list">
                <div
                    v-for="(item, index) in chainInfoListExpand"
                    :key="index"
                    class="chain_info__list_expand__item"
                    :class="{ chain_info__column: isFlexColumn }"
                >
                    <span class="chain_info__label">{{ item.label }}</span>
                    <span class="chain_info__value">{{ item.value }}</span>
                </div>
            </div>
            <div v-if="isShowChainDetailsInfo" class="chain_info__list_expand">
                <div
                    v-for="(item, index) in chainInfoListExpand"
                    :key="index"
                    class="chain_info__list_expand__item"
                >
                    <span class="chain_info__label">{{ item.label }}</span>
                    <span class="chain_info__value">{{ item.value }}</span>
                </div>
            </div>
            <ExpandBtn
                class="chain_info__expand cursor"
                :is-show-details-info="isShowChainDetailsInfo"
                @update-is-show-details-info="updateIsShowDetailsInfo"
            ></ExpandBtn>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ITxInfo } from '@/types/interface/transfers.interface';
    import ChainHelper from '@/helper/chainHelper';
    import { useChainInfo } from '@/views/transfers/details/composable';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import TitleCard from './TitleCard.vue';
    import ChainAddress from './ChainAddress.vue';
    interface IProps {
        title: string;
        chainInfo: ITxInfo | undefined;
        isFlexColumn: boolean;
    }

    const props = defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'updateIsFlexColumn', newIsFlexColumn: boolean): void;
    }>();
    const {
        chainAddress,
        chainInfoList,
        chainInfoListExpand,
        isShowChainDetailsInfo,
        searchChainIcon,
        updateIsShowDetailsInfo
    } = useChainInfo(props, emits);
</script>

<style lang="less" scoped>
    .chain_info {
        .flex(column, nowrap, flex-start, flex-start);
        min-width: 300px;
        &__details {
            flex: 1;
            margin-top: 16px;
            padding: 16px;
            width: 100%;
            min-height: 290px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
        &__details_column {
            min-height: 362px;
        }
        &__chain_id {
            .flex(row, nowrap, flex-start, center);
            margin-top: 16px;
        }
        &__icon {
            margin-right: 4px;
            img {
                width: 24px;
            }
        }
        &__list {
            margin-top: 16px;
        }
        &__list_expand {
            display: none;
        }
        &__list_expand__item {
            .flex(row, nowrap, flex-start, flex-start);
            margin-top: 16px;
        }
        &__label {
            width: 92px;
            font-size: var(--bj-font-size-normal);
            font-weight: 500;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            font-size: var(--bj-font-size-normal);
            font-family: GolosUIWebRegular;
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
        &__expand {
            display: none;
        }
        &__column {
            .flex(column, nowrap, flex-start, flex-start);
            .chain_info__value {
                margin-top: 2px;
                margin-left: 0;
            }
        }
    }
    @media screen and (max-width: 1160px) {
        .chain_info {
            width: 100%;
            &__details {
                min-height: auto;
            }
            &__chain_id {
            }
            &__icon {
                img {
                }
            }
            &__list {
            }
            &__list_expand {
            }
            &__list_expand__item {
            }
            &__label {
                width: 140px;
            }
            &__value {
            }
            &__expand {
            }
            &__column {
                .flex(row, nowrap, flex-start, center);
                .chain_info__value {
                    margin-top: 0;
                    margin-left: 24px;
                }
            }
        }
    }
    @media screen and (max-width: 500px) {
        .chain_info {
            &__details {
                min-width: auto;
            }
            &__chain_id {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__chain_id_value {
                margin-top: 2px;
            }
            &__icon {
                img {
                }
            }
            &__list {
                display: none;
            }
            &__list_expand {
                display: block;
            }
            &__list_expand__item {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__label {
                width: 100%;
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
            }
            &__expand {
                display: block;
            }
            &__column {
                .chain_info__value {
                    margin-top: 2px;
                    margin-left: 0;
                }
            }
        }
    }
</style>
