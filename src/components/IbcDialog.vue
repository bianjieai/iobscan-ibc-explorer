<template>
    <div
        v-show="show"
        class="modal_mask"
        :style="{ background: `rgba(0, 0, 0, ${props.opacity})` }"
        @click="cancelModal"
    >
        <div class="modal_content">
            <div class="modal_content__top"></div>
            <div class="modal_content__close">
                <svg-icon class="cursor" :icon-name="'icon-close'" @click="closeModal"></svg-icon>
            </div>
            <div class="modal_content__info">
                <p>{{ props.showText }} </p>
            </div>
            <div class="mt-16 mb-16">
                <div class="modal_content__button" @click="confirmButton">
                    <p>{{ props.goText }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, defineEmits } from 'vue';
    import { RELAYER_REGISTE_ADDRESS, RELAYER_REGISTE_TEXT } from '@/constants/relayers';
    interface DialogProps {
        showModal: boolean;
        showText?: string;
        goText?: string;
        goUrl?: string;
        opacity?: number;
    }
    const props = withDefaults(defineProps<DialogProps>(), {
        showModal: false,
        showText: RELAYER_REGISTE_TEXT,
        goText: 'Go',
        goUrl: RELAYER_REGISTE_ADDRESS,
        opacity: 0
    });
    const show = ref<boolean>(props.showModal);
    const emit = defineEmits(['update:show-modal']);
    watch(
        () => props.showModal,
        (_new) => {
            if (_new === true) {
                document.body.style.overflow = 'hidden';
                show.value = true;
            } else {
                show.value = false;
                document.body.style.overflow = '';
            }
        }
    );
    const cancelModal = (event: any) => {
        let tp = document.querySelector('.modal_content');
        if (tp) {
            if (!tp.contains(event.target)) {
                show.value = false;
                emit('update:show-modal', false);
            }
        }
    };
    // 关闭弹窗
    const closeModal = () => {
        document.body.style.overflow = '';
        show.value = false;
        emit('update:show-modal', false);
    };
    const confirmButton = () => {
        window.open(props.goUrl);
    };
</script>

<style lang="less" scoped>
    .modal_mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1200;
        .modal_content {
            width: 276px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            box-shadow: 0px 0px 16px 1px #d9deec;
            border-radius: 4px;
            border: 1px solid #d9dfee;
            text-align: center;
            z-index: 1201;
            &__top {
                height: 8px;
                border-radius: 4px 4px 0px 0px;
                background: rgba(61, 80, 255, 0.1);
            }
            &__close {
                text-align: right;
                padding: 7px 16px 8px 16px;
            }
            &__info {
                padding: 0 16px;
                font-size: 16px;
                font-weight: 400;
                color: #000000;
                line-height: 18px;
                white-space: wrap;
                width: 253px;
            }
            &__button {
                padding: 6px 33px;
                width: 86px;
                background: var(--bj-primary-color);
                border-radius: 4px;
                margin: 0 auto;
                cursor: pointer;
                p {
                    font-size: 16px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 20px;
                }
            }
        }
    }
</style>
