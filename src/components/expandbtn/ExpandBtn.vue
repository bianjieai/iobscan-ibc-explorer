<template>
    <div class="expand" @click="expandInfo">
        <span class="expand__btn">Click to see More</span>
        <i class="expand__icon iconfont icon-shouqi" :class="{ expand__more: !isShowDetailsInfo }">
        </i>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        isShowDetailsInfo: boolean;
    }
    const props = defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'updateIsShowDetailsInfo', newIsShowDetailsInfo: boolean): void;
    }>();
    const expandInfo = () => {
        emits('updateIsShowDetailsInfo', !props.isShowDetailsInfo);
    };
</script>

<style lang="less" scoped>
    .expand {
        margin-top: 16px;
        font-size: var(--bj-font-size-normal);
        font-weight: 400;
        color: var(--bj-primary-color);
        line-height: 14px;
        &__btn {
        }
        &__icon {
            display: inline-block;
            margin-left: 6px;
            font-size: var(--bj-font-size-normal);
        }
        &__more {
            transform: rotate(180deg);
        }
    }
</style>
