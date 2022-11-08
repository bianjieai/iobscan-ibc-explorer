<template>
    <div
        id="tag_copy"
        class="copy_component_content cursor"
        :data-clipboard-text="copyText"
        @click="handleCopy()"
    >
        <span v-show="!isShowCopied" class="copied iconfont icon-fuzhi"></span>
        <span v-show="isShowCopied" class="copied iconfont icon-fuzhichenggong1">
            <span class="text">Copied</span></span
        >
    </div>
</template>

<script setup lang="ts">
    import Clipboard from 'clipboard';
    import { ref } from 'vue';
    interface IProps {
        copyText: string;
    }
    defineProps<IProps>();
    let isShowCopied = ref<boolean>(false);
    let copyTimer = ref<number>(0);
    const handleCopy = () => {
        clearTimeout(copyTimer.value);
        if (isShowCopied.value) return;
        const clipboard = new Clipboard('#tag_copy');
        clipboard.on('success', () => {
            // 释放内存
            isShowCopied.value = true;
            clipboard.destroy();
            copyTimer.value = setTimeout(() => {
                isShowCopied.value = false;
            }, 3000);
        });
        clipboard.on('error', () => {
            // 不支持复制
            // 释放内存
            isShowCopied.value = false;
            clipboard.destroy();
        });
    };
</script>

<style scoped lang="less">
    .copy_component_content {
        margin-left: 8px;
        display: inline-block;
        align-items: center;
        color: var(--bj-primary-color);
        user-select: none;
        .copied {
            .flex(row, nowrap, flex-start, center);
            font-size: var(--bj-font-size-normal);
            line-height: 14px;
            .text {
                margin-left: 3px;
                font-family: GolosUIWebRegular;
                font-weight: 400;
                line-height: 18px;
            }
        }
    }
</style>
