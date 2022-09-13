<template>
    <div class="chain_info">
        <TitleCard :title="title"></TitleCard>
        <div class="chain_info__details">
            <ChainAddress :chain-address="chainAddress"></ChainAddress>
            <div class="chain_info__chain_id">
                <span class="chain_info__label">{{ chainInfoList.label }}</span>
                <span class="chain_info__value chain_info__chain_id_value">
                    <span class="chain_info__icon">
                        <img :src="searchChainIcon" alt="" />
                    </span>
                    <span>{{ ChainHelper.formatChainId(chainInfoList.value) }}</span>
                </span>
            </div>
            <div class="chain_info__list">
                <div
                    v-for="(item, index) in chainInfoListExpand"
                    :key="index"
                    class="chain_info__list_expand__item"
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
                class="chain_info__expand"
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
    import TitleCard from './TitleCard.vue';
    import ChainAddress from './ChainAddress.vue';
    interface IProps {
        title: string;
        chainInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();

    const {
        chainAddress,
        chainInfoList,
        chainInfoListExpand,
        isShowChainDetailsInfo,
        searchChainIcon,
        updateIsShowDetailsInfo
    } = useChainInfo(props);
</script>

<style lang="less" scoped>
    .chain_info {
        .flex(column, nowrap, flex-start, flex-start);
        width: 300px;
        min-height: 326px;
        &__details {
            flex: 1;
            margin-top: 16px;
            padding: 16px;
            width: 100%;
            min-width: 300px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
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
            .flex(row, nowrap, flex-start, center);
            margin-top: 16px;
        }
        &__label {
            width: 92px;
            font-size: var(--bj-font-size-normal);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
        &__expand {
            display: none;
        }
    }
    @media screen and (max-width: 1160px) {
        .chain_info {
            width: 100%;
            min-height: auto;
            &__details {
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
        }
    }
    @media screen and (max-width: 600px) {
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
        }
    }
</style>
