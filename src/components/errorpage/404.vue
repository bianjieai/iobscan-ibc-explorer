<template>
    <div class="error_page_container">
        <div class="error_page_content_wrap">
            <div class="error_img_content">
                <img class="error_img" src="/src/assets/404.png" alt="" />
            </div>
            <p class="error_img_title">Oops!</p>
            <p class="error_content_description">The planet you are looking for doesn’t exist.</p>
            <router-link :to="'/home'" class="go_back_button">Go Back</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: '404'
    };
</script>

<style scoped lang="less">
    .error_page_container {
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/bg_default.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/errpr_mouse_tree.png'), default !important;
        .error_page_content_wrap {
            max-width: 550px;
            .error_img_content {
                width: 100%;
                .error_img {
                    width: 100%;
                }
            }
            .error_img_title {
                font-size: 24px;
                font-weight: 400;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.65);
                margin-top: 60px;
            }
            .error_content_description {
                margin-top: 16px;
                color: rgba(255, 255, 255, 0.65);
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                line-height: 16px;
            }
            .go_back_button {
                display: inline-block;
                width: 172px;
                height: 36px;
                border-radius: 18px;
                background: rgba(61, 80, 255, 1);
                color: rgba(255, 255, 255, 1);
                font-size: 16px;
                line-height: 36px;
                margin: 40px auto 0 auto;
                cursor: url('../../assets/mouse/shiftlight_mouse.png'), default !important;
            }
        }
    }
</style>
