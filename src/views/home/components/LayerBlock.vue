<template>
    <div class="block">
        <div class="block__header">
            <div :class="type === 'dark' ? 'block__header__line_dark' : 'block__header__line'">
                <p
                    class="block__header__title"
                    :style="{ color: type === 'dark' ? '#ffffff' : '#000000' }"
                >
                    {{ title }}
                </p>
            </div>
            <a-tooltip>
                <template #title>{{ tipMsg }}</template>
                <img v-if="showTip" class="tip_icon cursor" src="@/assets/tip.png" />
            </a-tooltip>
        </div>
        <div class="block__content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        type: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            required: true
        },
        showTip: {
            type: Boolean,
            default: false
        },
        tipMsg: {
            type: String,
            default: ''
        }
    });
</script>

<style lang="less" scoped>
    .block {
        .flex(column, nowrap, flex-start, flex-start);
        &__header {
            display: inline-block;
            &__title {
                display: inline-block;
                font-size: @font-size3;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: @nav-font-weight;
                margin-right: 10px;
                position: relative;
                top: -16px;
                z-index: 5;
            }
            &__line_dark {
                top: -16px;
                left: 5px;
                display: inline-block;
                width: 100%;
                height: 12px;
                background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, #3d50ff 100%);
                border-radius: 5px;
                position: relative;
                z-index: 1;
            }
            &__line {
                left: 5px;
                display: inline-block;
                width: 100%;
                height: 12px;
                background: linear-gradient(
                    90deg,
                    rgba(112, 136, 255, 0) 0%,
                    rgba(61, 80, 255, 0.15) 100%
                );
                border-radius: 5px;
                position: relative;
            }
        }
        &__content {
            width: 100%;
            background-color: #ffffff;
            border-radius: @card-radio;
        }
        .tip_icon {
            width: 24px;
            position: absolute;
            margin-left: 16px;
            margin-top: -10px;
        }
    }
</style>
