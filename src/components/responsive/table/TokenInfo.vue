<template>
    <div class="las">
        <img class="las__logo" :src="tokenLogo" alt="" />
        <span class="las__content">
            <span class="las__top">{{ tokenAmount }}</span>
            <a-popover v-if="tokenSymbol.length > 6" destroy-tooltip-on-hide>
                <template #content>
                    <span>{{ tokenSymbol }}</span>
                </template>
                <span class="las__bottom">{{ getRestString(tokenSymbol, 6, 0) }}</span>
            </a-popover>
            <span v-else class="las__bottom">{{ getRestString(tokenSymbol, 6, 0) }}</span>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { getRestString } from '@/helper/parseStringHelper';
    import type { IResponseTokenInfo } from '@/types/interface/index.interface';
    import { useFormatTokenDenom } from '@/views/relayers/details/composable';
    interface ITokenInfo {
        tokenInfo: IResponseTokenInfo;
        type: string;
    }
    const props = defineProps<ITokenInfo>();
    const { tokenInfo, type } = toRefs(props);
    const { tokenLogo, tokenSymbol, tokenAmount } = useFormatTokenDenom(tokenInfo, type);
</script>

<style lang="less" scoped>
    .las {
        .flex(row, nowrap, flex-start, center);
        &__logo {
            display: inline-block;
            width: 32px;
            height: 32px;
        }
        &__content {
            .flex(column, nowrap, flex-start, flex-start);
            margin-left: 8px;
        }
        &__top {
            font-size: var(--bj-font-size-sub-title);
            font-weight: 400;
            line-height: 20px;
        }
        &__bottom {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-third);
            line-height: 18px;
        }
    }
</style>
