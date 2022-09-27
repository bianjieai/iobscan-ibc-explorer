<template>
    <div class="progress">
        <img class="progress__img" :src="searchTxImg" alt="" />
        <img class="progress__img_adaptor" :src="searchTxAdaptorImg" alt="" />
    </div>
</template>

<script setup lang="ts">
    import type { IIbcTxInfo } from '@/types/interface/transfers.interface';
    import { useTxImg } from '../composable';
    interface IProps {
        ibcTxStatus: number;
        ibcTxInfo: IIbcTxInfo | undefined;
        txImg: string;
    }
    const props = defineProps<IProps>();

    const { searchTxImg, searchTxAdaptorImg } = useTxImg(props);
</script>

<style lang="less" scoped>
    .progress {
        align-self: center;
        margin: 0 40px;
        &__img {
            display: inline-block;
            width: 46px;
            height: 24px;
        }
        &__img_adaptor {
            display: none;
        }
    }
    @media screen and (max-width: 1296px) {
        .progress {
            margin: 0 24px;
            &__img {
            }
            &__img_adaptor {
            }
        }
    }
    @media screen and (max-width: 1232px) {
        .progress {
            margin: 0 16px;
            &__img {
            }
            &__img_adaptor {
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .progress {
            margin: 0 8px;
            &__img {
            }
            &__img_adaptor {
            }
        }
    }
    @media screen and (max-width: 1160px) {
        .progress {
            margin: 16px 0;
            transform: rotate(90deg);
            &__img {
                display: none;
            }
            &__img_adaptor {
                display: block;
                width: 32px;
                height: 24px;
            }
        }
    }
</style>
