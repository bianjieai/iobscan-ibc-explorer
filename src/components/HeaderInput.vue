<template>
    <a-auto-complete
        v-model:value="inputValue"
        :class="[
            optionClass,
            {
                active_input_style: isActiveInputStyle,
                input_focus_style: inputHasFocus
            }
        ]"
        :options="inputOptions"
        :default-active-first-option="false"
        dropdown-class-name="auto_complete__dropdown"
        :get-popup-container="getPopupContainer"
        @focus="setInputBorderStyle"
        @blur="removeInputBorderStyle"
        @search="onSearchInputText"
        @select="onSelect"
    >
        <template #option="item">
            <div
                class="auto_complete__option"
                :title="''"
                @click="!isInvalid ? jumpAddrandStyle(item.text) : ''"
            >
                <span>Search for</span>
                <span class="auto_complete__option__chain">{{ item.value }}</span>
                <span>address</span>
                <span v-if="isInvalid" class="auto_complete__option__invalid">(invalid)</span>
            </div>
        </template>
        <a-input
            ref="inputDom"
            v-model:value="inputValue"
            class="auto_complete__input"
            placeholder="Search by TxHash/Address"
            allow-clear
            @press-enter="searchInput"
            @change="changeValue"
        >
        </a-input>
    </a-auto-complete>
    <div class="input_prefix cursor" @click="searchInput(true)">
        <span class="input_prefix__icon iconfont icon-search"></span>
    </div>
</template>

<script setup lang="ts">
    import { useHeaderInputSearch } from '@/composables/input';
    interface IProps {
        optionClass?: string;
    }
    const props = withDefaults(defineProps<IProps>(), {
        optionClass: 'auto_complete'
    });
    const {
        inputDom,
        getPopupContainer,
        inputValue,
        inputOptions,
        searchInput,
        changeValue,
        inputHasFocus,
        isActiveInputStyle,
        setInputBorderStyle,
        removeInputBorderStyle,
        onSearchInputText,
        isInvalid,
        jumpAddrandStyle,
        onSelect
    } = useHeaderInputSearch(props.optionClass);
</script>

<style lang="less" scoped>
    .auto_complete,
    .auto_complete__mobile {
        min-width: 257px;
        border-radius: 20px;
        :deep(&__dropdown) {
            padding: 0;
        }
        :deep(.rc-virtual-list-holder-inner) {
            .ant-select-item {
                padding: 0 16px;
                min-height: auto;
                &:last-child {
                    .ant-select-item-option-content {
                        .auto_complete__option {
                            border-bottom: none;
                        }
                    }
                }
            }
        }
        &__option {
            padding: 12px 0;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
            text-align: left;
            border-bottom: 1px solid rgba(151, 151, 151, 0.2);
            &__chain {
                margin: 0 4px;
                font-family: GolosUI_Medium;
            }
            &__invalid {
                margin-left: 4px;
                color: var(--bj-failed);
            }
        }
        &__input {
            height: 40px;
            background-color: #1c214c;
            border: 0;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-right: none;
            border-radius: 20px 0 0 20px;
            :deep(.ant-input) {
                background-color: #1c214c;
                color: #ffffff;
                font-family: GolosUIWebRegular;
            }
            :deep(.anticon) {
                color: #fff;
            }
        }
    }
    .input_prefix {
        .flex(row, nowrap, center, center);
        height: 40px;
        border-radius: 0 20px 20px 0;
        padding: 8px 12px;
        background: #3d50ff;
        z-index: 2;
        &:hover {
            background: #667aff;
            border-color: #667aff;
        }
        &__icon {
            font-size: var(--bj-font-size-home-number);
            color: rgba(255, 255, 255, 0.7);
        }
    }
    .ant-input-affix-wrapper-focused {
        box-shadow: none;
    }
    .ant-input-affix-wrapper {
        padding-right: 0;
        min-width: 257px;
    }
    .active_input_style {
        border-color: rgba(61, 80, 255, 1) !important;
        border-right-color: transparent !important;
    }
    // todo shan 考虑失去焦点时，缓慢变换宽度
    .input_focus_style {
        position: absolute;
        right: 48px;
        width: 812px;
        transition: width 0.3s linear;
    }
    @media screen and (max-width: 1200px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 752px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1180px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 732px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1160px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 712px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1140px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 698px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1120px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 672px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1100px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 652px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1080px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 632px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1060px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 582px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 1040px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 562px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 970px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 452px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 860px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 408px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 800px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 352px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 730px) {
        .auto_complete,
        .auto_complete__mobile {
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            width: 257px;
            .auto_complete__input {
            }
        }
    }
    @media screen and (max-width: 670px) {
        .auto_complete,
        .auto_complete__mobile {
            position: relative;
            width: 100%;
            &__input {
            }
            &__input_prefix {
            }
            &__input_icon {
            }
        }
        .input_focus_style {
            position: relative;
            right: 0;
            width: 100%;
            .auto_complete__input {
            }
        }
    }
</style>
