<template>
    <a-input
        v-model:value="inputValue"
        class="header_input"
        placeholder="Search by TxHash/Address"
        :class="{ active_input_style: isActiveInputStyle, input_focus_style: inputHasFocus }"
        allow-clear
        @focus="setInputBorderStyle"
        @blur="removeInputBorderStyle"
        @press-enter="searchInput"
        @change="changeValue"
    >
        <template #suffix>
            <div class="input_prefix cursor" @click="searchInput">
                <span class="input_prefix_icon iconfont icon-search"></span>
            </div>
        </template>
    </a-input>
</template>

<script setup lang="ts">
    import { postIPAndInput } from '@/api';
    import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';
    import { ref } from 'vue';
    import router from '../router';
    const inputHasFocus = ref<boolean>(false);
    let inputValue = ref('');
    let isActiveInputStyle = ref(false);
    const IP = (window as any)?.returnCitySN?.cip || '';
    if (!IP) {
        console.log('IP Not found');
    }
    let content: string;
    const setInputBorderStyle = () => {
        isActiveInputStyle.value = true;
        inputHasFocus.value = true;
    };
    const removeInputBorderStyle = () => {
        isActiveInputStyle.value = false;
        inputHasFocus.value = false;
    };
    const changeValue = (e: ChangeEvent) => {
        content = e.target.value || '';
    };
    const searchInput = () => {
        (window as any).gtag('event', '导航栏-点击搜索', {
            searchValue: content
        });

        if (inputValue.value !== '') {
            if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                router.push(`/transfers/details?txhash=${inputValue.value}`);
                inputValue.value = '';
            } else {
                router.push(`/searchResult/${inputValue.value}`);
                inputValue.value = '';
            }
        }
        // 调取埋点接口
        const params = {
            ip: IP,
            content: content
        };
        postIPAndInput(params);
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
    .header_input {
        height: 40px;
        background-color: rgba(255, 255, 255, 0.1);
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
            font-family: GolosUIWebRegular;
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
        min-width: 280px;
    }
    // todo shan 考虑失去焦点时，缓慢变换宽度
    .input_focus_style {
        position: absolute;
        right: 0;
        width: 860px;
        background-color: #1c214c;
        transition: all 0.3s linear;
    }
    @media screen and (max-width: 1200px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 770px;
        }
    }
    @media screen and (max-width: 1180px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 750px;
        }
    }
    @media screen and (max-width: 1160px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 730px;
        }
    }
    @media screen and (max-width: 1140px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 710px;
        }
    }
    @media screen and (max-width: 1120px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 690px;
        }
    }
    @media screen and (max-width: 1100px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 670px;
        }
    }
    @media screen and (max-width: 1080px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 650px;
        }
    }
    @media screen and (max-width: 1060px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 630px;
        }
    }
    @media screen and (max-width: 1040px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 610px;
        }
    }
    @media screen and (max-width: 970px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 500px;
        }
    }
    @media screen and (max-width: 860px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 456px;
        }
    }
    @media screen and (max-width: 800px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 400px;
        }
    }
    @media screen and (max-width: 730px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 350px;
        }
    }
    @media screen and (max-width: 670px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            width: 280px;
        }
    }
    @media screen and (max-width: 620px) {
        .header_input {
            .input_prefix {
                .input_prefix_icon {
                }
            }
        }
        .input_focus_style {
            position: relative;
            width: 100%;
        }
    }
</style>
