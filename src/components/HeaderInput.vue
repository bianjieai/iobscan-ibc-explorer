<template>
    <a-auto-complete
        v-model:value="inputValue"
        class="auto_complete"
        :class="{
            active_input_style: isActiveInputStyle,
            input_focus_style: inputHasFocus
        }"
        :options="inputOptions"
        @focus="setInputBorderStyle"
        @blur="removeInputBorderStyle"
        @search="onSearchInputText"
    >
        <template #default>
            <a-input
                v-model:value="inputValue"
                class="auto_complete__input"
                :class="{ auto_complete__input_focus: inputHasFocus }"
                placeholder="Search by TxHash/Address"
                allow-clear
                @press-enter="searchInput"
                @change="changeValue"
            >
                <template #suffix>
                    <div class="auto_complete__input_prefix cursor" @click="searchInput">
                        <span class="auto_complete__input_icon iconfont icon-search"></span>
                    </div>
                </template>
            </a-input>
        </template>
    </a-auto-complete>
</template>

<script setup lang="ts">
    import { useHeaderInputSearch } from '@/composables/input';
    const {
        inputValue,
        inputOptions,
        searchInput,
        changeValue,
        inputHasFocus,
        isActiveInputStyle,
        setInputBorderStyle,
        removeInputBorderStyle,
        onSearchInputText
    } = useHeaderInputSearch();
</script>

<style lang="less" scoped>
    .auto_complete {
        border-radius: 20px;
        &__input {
            height: 40px;
            background-color: rgba(255, 255, 255, 0.1);
            border: 0;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-right: none;
            border-radius: 20px;
            :deep(.ant-input) {
                background-color: transparent;
                color: #ffffff;
                font-family: GolosUIWebRegular;
            }
            :deep(.anticon) {
                color: #fff;
            }
        }
        &__input_prefix {
            height: 40px;
            border-radius: 0 20px 20px 0;
            padding: 8px 12px;
            background: #3d50ff;
            display: flex;
            align-items: center;
            justify-items: center;
            &:hover {
                background: #667aff;
                border-color: #667aff;
            }
        }
        &__input_icon {
            font-size: var(--bj-font-size-home-number);
            color: rgba(255, 255, 255, 0.7);
        }
    }
    .ant-input-affix-wrapper-focused {
        box-shadow: none;
    }
    .ant-input-affix-wrapper {
        padding-right: 0;
        min-width: 280px;
    }
    .active_input_style {
        border-color: rgba(61, 80, 255, 1) !important;
        border-right-color: transparent !important;
    }
    // todo shan 考虑失去焦点时，缓慢变换宽度
    .input_focus_style {
        position: absolute;
        right: 0;
        width: 860px;
        transition: width 0.3s linear;
        .auto_complete__input {
            background-color: #1c214c;
        }
    }
    @media screen and (max-width: 1200px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 770px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1180px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 750px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1160px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 730px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1140px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 710px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1120px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 690px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1100px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 670px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1080px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 650px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1060px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 630px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1040px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 610px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 970px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 500px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 860px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 456px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 800px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 400px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 730px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 350px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 670px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            width: 280px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 620px) {
        .auto_complete {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
        }
        .input_focus_style {
            position: relative;
            width: 100%;
            .auto_complete__input {
            }
        }
    }
</style>
