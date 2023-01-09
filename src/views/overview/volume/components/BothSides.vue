<template>
    <transition name="fade">
        <div class="both_sides" :class="{ left: isLeft, right: !isLeft }">
            <div class="both_sides__icon_c cursor">
                <svg-icon class-dynamic="left_icon" icon-name="icon-next1"></svg-icon>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
    interface IBothSides {
        isLeft: Boolean;
    }
    defineProps<IBothSides>();
</script>

<style lang="less" scoped>
    .both_sides {
        .flex(column,nowrap,center,flex-end);
        position: absolute;
        top: 0;
        bottom: 0;
        width: 28px;
        border-radius: 4px;
        &__icon_c {
            .flex(column,nowrap,center,center);
            width: 20px;
            height: 20px;
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0px 0px 5px 0px rgba(61, 80, 255, 0.18);
            border: 1px solid rgba(61, 80, 255, 0.35);
            &:hover {
                box-shadow: 0px 0px 10px 0px rgba(61, 80, 255, 0.35);
                border: 1px solid #3d50ff;
            }
            .left_icon {
                width: 8px;
                height: 9px;
            }
        }
    }
    .left {
        left: 0;
        background-image: linear-gradient(
            -90deg,
            rgba(112, 136, 255, 0) 0%,
            rgba(61, 80, 255, 0.1) 100%
        );
        .both_sides__icon_c {
            transform: translateX(4px) rotate(180deg);
            &:hover {
            }
            .left_icon {
            }
        }
    }
    .right {
        right: 0;
        background-image: linear-gradient(
            90deg,
            rgba(112, 136, 255, 0) 0%,
            rgba(61, 80, 255, 0.1) 100%
        );
        .both_sides__icon_c {
            transform: translateX(-4px);
            &:hover {
            }
            .right_icon {
            }
        }
    }
</style>
