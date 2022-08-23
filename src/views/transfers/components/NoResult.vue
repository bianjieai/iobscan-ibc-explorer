<template>
    <div class="no_result">
        <div class="no_result__content">
            <p class="search_result">
                <span class="search_result__label">Search Results</span>
                <span class="search_result__value">{{ searchInputValue.value[0] }}</span>
            </p>
            <div class="result_icon">
                <div class="result_icon__wrap">
                    <div class="result_no_data_img_content">
                        <img src="../../../assets/no_datas.png" alt="" />
                    </div>
                    <p class="result_tip_text">There is no valid result.</p>
                    <p class="result_description">Try to search with Transaction.</p>
                    <a-button class="back_home_button" type="primary" @click="toHome"
                        >Back Home</a-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useNoResult } from '../composable';
    const { searchInputValue, toHome } = useNoResult();
</script>

<style scoped lang="less">
    .no_result {
        width: 100%;

        &__content {
            max-width: 1200px;
            background: #fff;
            border-radius: 4px;
            margin: 48px auto 100px auto;
            text-align: left;
            box-sizing: border-box;
            padding: 20px 22px;
            display: flex;
            flex-direction: column;

            .search_result {
                font-size: var(--bj-font-size-title);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.65);
                line-height: 30px;

                &__value {
                    margin-left: 8px;
                    word-break: break-all;
                }
            }

            .result_icon {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 70px 0 100px 0;

                &__wrap {
                    text-align: center;

                    .result_no_data_img_content {
                        width: 120px;
                        height: 120px;
                        margin: 0 auto;

                        img {
                            width: 100%;
                        }
                    }

                    .result_tip_text {
                        margin-top: 15px;
                        font-size: var(--bj-font-size-sub-title);
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 16px;
                    }

                    .result_description {
                        margin-top: 10px;
                        font-size: var(--bj-font-size-normal);
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.35);
                    }

                    .back_home_button {
                        margin-top: 34px;
                    }
                }
            }
        }
    }
</style>
