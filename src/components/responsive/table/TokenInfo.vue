<template>
    <div class="las">
        <img class="las__logo" :src="tokenLogo" alt="" />
        <span class="las__content">
            <span class="las__top">{{ formatNum(tokenAmount) }}</span>
            <a-popover destroy-tooltip-on-hide>
                <template #content>
                    <span class="las__bottom">{{ tokenSymbol }}</span>
                </template>
                <span class="las__bottom">{{ getRestString(tokenSymbol, 6, 0) }}</span>
            </a-popover>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { getRestString, formatNum } from '@/helper/parseStringHelper';
    import type { IRtTokenInfo } from '@/types/interface/relayers.interface';
    import { useFormatTokenDenom } from '@/views/relayers/details/composable';
    interface ITokenInfo {
        tokenInfo: IRtTokenInfo;
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
