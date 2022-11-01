<template>
    <div class="page_title_container">
        <img v-if="hasIcon" class="icon" :src="imgSrc" />
        <div class="flex">
            <div class="title_p">
                <img v-if="hasIcon" class="icon inline_icon" :src="imgSrc" />
                <a-typography-text class="title">{{ title }}</a-typography-text>
                <div class="background" :style="{ bottom: hasIcon ? '3px' : '-3px' }"></div>
            </div>
            <a-typography-text v-if="subtitle" class="number"
                ><i class="iconfont" :class="titleIcon"></i>{{ subtitle }}</a-typography-text
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        hasIcon?: boolean;
        titleIcon?: string;
        title: string;
        subtitle?: string;
        imgSrc?: string;
    }

    withDefaults(defineProps<IProps>(), {
        titleIcon: 'icon-shujuliebiao'
    });
</script>

<style lang="less" scoped>
    .page_title_container {
        display: inline-flex;
        align-items: center;
        line-height: 1;
        position: relative;
        justify-content: flex-start;

        .flex {
            display: flex;
            align-items: center;
        }

        .icon {
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
        }

        .inline_icon {
            display: none;
        }

        .title_p {
            margin-right: 8px;

            .title {
                font-size: var(--bj-font-size-title);
                font-family: Eurocine-regular;
                font-weight: 600;
            }
        }

        .number {
            color: var(--bj-text-second);
            .iconfont {
                margin-right: 4px;
            }
        }

        .background {
            position: absolute;
            left: 0;
            right: -8px;
            height: 12px;
            bottom: 3px;
            background: linear-gradient(
                90deg,
                rgba(112, 136, 255, 0) 0%,
                rgba(61, 80, 255, 0.15) 100%
            );
            border-radius: 5px;
            box-sizing: border-box;
        }
    }

    // mobile
    @media screen and (max-width: 580px) {
        .page_title_container {
            display: inline-flex;
            text-align: left;

            .flex {
                display: block;
            }

            .icon {
                display: none;
            }

            .inline_icon {
                display: block;
            }

            .title_p {
                position: relative;
                display: inline-flex;
                align-items: center;
                margin-right: 0;
                margin-bottom: 8px;
            }

            .number {
                display: block;
            }
        }
    }
</style>
