<template>
    <div class="error_network">
        <div class="error_network__content">
            <div class="error_network__content__img">
                <img src="/src/assets/error/500.png" alt="" />
            </div>
            <div class="error_network__content__wrap">
                <p class="error_network__content__title">Something went wrong</p>
                <p class="error_network__content__description"
                    >Don’t worry, we’ll fix it soon. Please try again after some time.</p
                >
                <router-link :to="'/home'" class="error_network__content__button"
                    >Go Back</router-link
                >
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '500'
    };
</script>

<style scoped lang="less">
    .error_network {
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/error/default_bg.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/error/mouse_tree.png'), default !important;
        user-select: none;
        &__content {
            max-width: 550px;
            position: relative;
            &__img {
                width: 100%;
                img {
                    width: 100%;
                }
            }
            &__wrap {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                text-align: center;
            }
            &__title {
                font-size: 24px;
                font-weight: 400;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.65);
                margin-top: 60px;
            }
            &__description {
                margin-top: 16px;
                color: rgba(255, 255, 255, 0.65);
                font-size: var(--bj-font-size-normal);
                font-weight: 300;
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
