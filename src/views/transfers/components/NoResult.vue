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
        flex: 1;
        padding: 48px 48px 100px;
        width: 100%;
        text-align: left;
        background-color: #f5f7fc;

        &__content {
            margin: 0 auto;
            max-width: 1200px;
            background: #fff;
            border-radius: 4px;
            text-align: left;
            box-sizing: border-box;
            padding: 20px 22px;
            display: flex;
            flex-direction: column;

            .search_result {
                &__label {
                    font-size: var(--bj-font-size-sub-title);
                    font-weight: 600;
                    color: var(--bj-text-normal);
                    line-height: 24px;
                }

                &__value {
                    margin-left: 8px;
                    font-size: var(--bj-font-size-sub-title);
                    font-weight: 400;
                    color: var(--bj-text-second);
                    line-height: 24px;
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
    @media screen and (max-width: 768px) {
        .no_result {
            padding: 40px 32px 60px;

            &__content {
                .search_result {
                    &__label {
                    }

                    &__value {
                    }
                }

                .result_icon {
                    &__wrap {
                        .result_no_data_img_content {
                            img {
                            }
                        }

                        .result_tip_text {
                        }

                        .result_description {
                        }

                        .back_home_button {
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .no_result {
            padding: 24px 16px 60px;

            &__content {
                .search_result {
                    &__label {
                    }

                    &__value {
                    }
                }

                .result_icon {
                    &__wrap {
                        .result_no_data_img_content {
                            img {
                            }
                        }

                        .result_tip_text {
                        }

                        .result_description {
                        }

                        .back_home_button {
                        }
                    }
                }
            }
        }
    }
</style>
