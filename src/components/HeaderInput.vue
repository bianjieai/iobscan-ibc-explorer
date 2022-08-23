<template>
    <a-input
        v-model:value="inputValue"
        class="header_input"
        placeholder="Search by TxHash"
        :class="isActiveInputStyle ? 'active_input_style' : 'default_input_style'"
        allow-clear
        @focus="setInputBorderStyle"
        @blur="removeInputBorderStyle"
        @press-enter="searchInput"
    >
        <template #suffix>
            <div class="input_prefix cursor" @click="searchInput">
                <span class="input_prefix_icon iconfont icon-search"></span>
            </div>
        </template>
    </a-input>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import router from '../router';
    interface IProps {
        disabled: boolean;
    }
    defineProps<IProps>();
    let inputValue = ref('');
    let isActiveInputStyle = ref(false);
    const setInputBorderStyle = () => {
        isActiveInputStyle.value = true;
    };
    const removeInputBorderStyle = () => {
        isActiveInputStyle.value = false;
    };
    const searchInput = () => {
        if (inputValue.value !== '') {
            if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                router.push(`/transfers/details?hash=${inputValue.value}`);
                inputValue.value = '';
            } else {
                router.push(`/searchResult?${inputValue.value}`);
                inputValue.value = '';
            }
        }
    };
</script>

<style lang="less" scoped>
    .ant-input-affix-wrapper-focused {
        box-shadow: none;
    }
    .active_input_style {
        border-color: rgba(61, 80, 255, 1) !important;
        border-right-color: transparent !important;
    }
    .default_input_style {
    }
    .header_input {
        height: 40px;
        background-color: rgba(#ffffff, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        border-right: none;
        :hover {
            .input_prefix {
                background-color: #2c3ee3;
                color: rgba(255, 255, 255, 1);
            }
        }
        :deep(.ant-input) {
            background-color: transparent;
            color: #ffffff;
        }
        :deep(.anticon) {
            color: #fff;
        }
        .input_prefix {
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
            .input_prefix_icon {
                font-size: var(--bj-font-size-home-number);
                color: rgba(255, 255, 255, 0.7);
            }
        }
    }
    .ant-input-affix-wrapper {
        padding-right: 0;
    }
</style>
