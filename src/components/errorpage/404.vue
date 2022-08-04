<template>
    <div class="error_page">
        <div class="error_page__content">
            <div class="error_page__content__img">
                <img src="/src/assets/error/404.png" alt="" />
            </div>
            <p class="error_page__content__title">Oops!</p>
            <p class="error_page__content__descripton"
                >The planet you are looking for doesn’t exist.</p
            >
            <router-link :to="'/home'" class="error_page__content__button">Go Back</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: '404'
    };
</script>

<style scoped lang="less">
    .error_page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/error/default_bg.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/error/mouse_tree.png'), default !important;
        &__content {
            max-width: 550px;
            &__img {
                width: 100%;
                img {
                    width: 100%;
                }
            }
            &__title {
                font-size: 24px;
                font-weight: 400;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.65);
                margin-top: 60px;
            }
            &__descripton {
                margin-top: 16px;
                color: rgba(255, 255, 255, 0.65);
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                line-height: 16px;
            }
            &__button {
                display: inline-block;
                width: 172px;
                height: 36px;
                border-radius: 18px;
                background: rgba(61, 80, 255, 1);
                color: rgba(255, 255, 255, 1);
                font-size: 16px;
                line-height: 36px;
                margin: 40px auto 0 auto;
            }
        }
    }
</style>
