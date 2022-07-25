<template>
    <div class="block">
        <div class="block_header">
            <div :class="type === 'dark' ? 'block_header_line_dark' : 'block_header_line'">
                <p class="block_header_title" :style="{ color: type === 'dark' ? '#ffffff' : '#000000' }">
                    {{ title }}
                </p>
            </div>
            <a-tooltip>
                <template #title>{{ tipMsg }}</template>
                <img v-if="showTip" class="tip_icon" src="../assets/tip.png" />
            </a-tooltip>
        </div>
        <div class="block_content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        type: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        showTip: {
            type: Boolean,
            required: true
        },
        tipMsg: {
            type: String,
            required: true
        }
    });
</script>

<style lang="less" scoped>
    .block {
        .flex(column, nowrap, flex-start, flex-start);
        &_header {
            display: inline-block;
            &_title {
                display: inline-block;
                font-size: @font-size3;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: @nav-font-weight;
                margin-right: 10px;
                position: relative;
                top: -16px;
                z-index: 5;
            }
            &_line_dark {
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
            &_line {
                left: 5px;
                display: inline-block;
                width: 100%;
                height: 12px;
                background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
                border-radius: 5px;
                position: relative;
            }
        }
        &_content {
            width: 100%;
            background-color: #ffffff;
            border-radius: @card-radio;
        }
        .tip_icon {
            width: 24px;
            position: absolute;
            margin-left: 16px;
            margin-top: -10px;
            cursor: url('../assets/mouse/shiftlight_mouse.png'), default !important;
        }
    }
</style>
