<template>
    <div class="search">
        <div
            class="search__content"
            :class="{
                highlighted_border: isHighlighted
            }"
        >
            <a-dropdown
                v-model:visible="visibleDropdown"
                class="search__content__dropdown"
                :trigger="['click']"
            >
                <div class="cursor inline-flex items-center">
                    <div
                        class="flex-1 ml-8 mr-8 text-center selecetd_text"
                        :class="{
                            visible_color: visibleDropdown,
                            selected_color: isDropdownSelected
                        }"
                    >
                        {{ selectedText }}</div
                    >
                    <span class="button_icon flex justify-between items-center">
                        <i
                            :class="{ visible_color: visibleDropdown }"
                            class="iconfont icon-zhankai-copy-icon"
                            :style="{
                                transform: visibleDropdown ? 'rotate(180deg)' : 'rotate(0)'
                            }"
                        ></i>
                    </span>
                </div>
                <template #overlay>
                    <div class="overlay_container">
                        <div
                            v-for="item in SEARCH_OPTIONS"
                            :key="item.key"
                            class="item cursor"
                            :class="{ selected_option: item.key === selectOption[0]?.key }"
                            @click="onSelect(item.key, item.value)"
                            >{{ item.value }}</div
                        >
                    </div>
                </template>
            </a-dropdown>
            <a-auto-complete
                v-model:value="completeValue"
                class="search__content__complete"
                :options="options"
                @select="onCompleteSelect"
                @search="onSearch"
            >
                <template #default>
                    <div class="search__content__complete__c">
                        <input
                            v-model="inputValue"
                            :placeholder="placeholder"
                            class="search__content__complete__c__input"
                            type="text"
                            @keydown.enter="searchFn"
                            @focus="onFocus"
                            @blur="onBlur"
                        />
                        <div
                            v-show="completeValue.length > 0"
                            class="search__content__complete__c__svg_c"
                            @click="clearValue"
                        >
                            <svg
                                t="1667888567647"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="2796"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                width="14"
                                height="14"
                            >
                                <path
                                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 64a448 448 0 1 0 0 896A448 448 0 0 0 512 64z"
                                    fill="#D9DFEE"
                                    p-id="2797"
                                ></path>
                                <path
                                    d="M552.768 512l142.72-142.72a28.928 28.928 0 0 0-40.768-40.832L512 471.232l-142.72-142.72a28.928 28.928 0 0 0-40.832 40.832L471.168 512l-142.72 142.72a28.928 28.928 0 0 0 40.768 40.768L512 552.832l142.72 142.72a28.928 28.928 0 0 0 40.832-40.768L552.768 512z"
                                    fill="#3D50FF"
                                    p-id="2798"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </template>
            </a-auto-complete>
        </div>
        <TypeButton :type="TypeButtonProp.search" @on-reset="searchFn" />
    </div>
</template>

<script setup lang="ts">
    import { TypeButtonProp } from '@/constants';
    import { SEARCH_OPTIONS } from '@/constants/relayers';
    import { useRelayerSearch } from './composable';
    const emits = defineEmits<{
        (e: 'onSearch', searchType: string, searchValue: string): void;
    }>();

    const {
        isHighlighted,
        visibleDropdown,
        isDropdownSelected,
        selectedText,
        selectOption,
        onSelect,
        completeValue,
        options,
        onCompleteSelect,
        onSearch,
        inputValue,
        placeholder,
        onFocus,
        onBlur,
        clearValue,
        searchFn
    } = useRelayerSearch(emits);
</script>
<style lang="less" scoped>
    .search {
        .flex(row,nowrap,flex-start,center);
        &__content {
            .flex(row,nowrap,flex-start,center);
            border-radius: 4px;
            border: 1px solid #d9dfee;
            &:hover {
                border-color: #3d50ff;
            }
            margin-right: 8px;
            :deep(&__dropdown) {
                width: 142px;
                height: 36px;
                border-radius: 4px 0 0 4px;
                box-shadow: unset;
                background-color: #fff;
                border-right: 1px solid var(--bj-border-color);
                .button_icon {
                    border-left: none;
                    padding: 0 6px 0 3px;
                    .iconfont {
                        font-size: 18px;
                        color: var(--bj-text-third);
                    }
                }
                .selecetd_text {
                    margin-right: 0;
                    color: var(--bj-text-second);
                }
                .selected_color {
                    color: var(--bj-primary-color);
                }
                .visible_color {
                    color: var(--bj-primary-color) !important;
                }
            }
            &__complete {
                width: 357px;
                height: 36px;
                :deep(.ant-select-selector) {
                    height: 100%;
                }
                &__c {
                    .flex(row,nowrap,flex-start,center);
                    height: 100%;
                    border-radius: 4px;
                    background-color: #fff;
                    &__input {
                        flex: 1;
                        border-radius: 4px;
                        padding: 8px 5px 10px 8px;
                        box-sizing: border-box;
                        height: 100%;
                        width: 0;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    &__svg_c {
                        margin: 0 8px 0px 5px;
                        width: 14px;
                        height: 14px;
                        .flex(row,nowrap,center,center);
                    }
                }
            }
        }
        .highlighted_border {
            border-color: #3d50ff;
        }
    }
    .overlay_container {
        background: #fff;
        color: var(--bj-text-second);
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        text-align: center;

        .item {
            padding: 12px 0;

            &:hover {
                color: var(--bj-primary-color);
            }
        }
        .selected_option {
            background: rgba(61, 80, 255, 0.04);
            color: var(--bj-primary-color);
        }
    }

    :global(.ant-select-dropdown .ant-select-item) {
        padding: 12px 20px;
    }
    :global(.ant-select-dropdown .ant-select-item-option-active) {
        background-color: rgba(61, 80, 255, 0.04);
        color: rgba(61, 80, 255, 1);
    }
    @media screen and (max-width: 606px) {
        .search__content {
            flex: 1;
            .search__content__complete {
                flex: 1;
                width: auto;
            }
        }
    }
</style>
