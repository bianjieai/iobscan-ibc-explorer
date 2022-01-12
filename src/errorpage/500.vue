<template>
    <div class="error_network_container">
        <div class="error_network_content_wrap">
            <div class="error_network_img_content">
                <img class="error_network_img" src="../assets/500.png" alt="">
            </div>
            <div class="description_content">
                <p class="error_network_img_title">Something went wrong</p>
                <p class="error_network_content_description">Don’t worry, we’ll fix it soon. Please try again after some time.</p>
                <router-link :to="'/home'" class="go_back_button">Go Back</router-link>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "500"
}
</script>

<style scoped lang="scss">
.error_network_container{
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../assets/bg_default.png") no-repeat center center;
    background-size: cover;
    .error_network_content_wrap{
        max-width: 550px;
        position: relative;
        .error_network_img_content{
            width: 100%;
            .error_network_img{
                width: 100%;
            }
        }
        .description_content{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            text-align: center;
            .error_network_img_title{
                font-size: 24px;
                font-weight: 400;
                line-height: 24px;
                color:rgba(255, 255, 255, 0.65);
                margin-top: 60px;
            }
            .error_network_content_description{
                margin-top: 16px;
                color: rgba(255, 255, 255, 0.65);
                font-size: 14px;
                font-weight: 300;
                line-height: 16px;
            }
            .go_back_button{
                display: inline-block;
                width: 172px;
                height: 36px;
                border-radius: 18px;
                background: rgba(61, 80, 255, 1);
                color: rgba(255, 255, 255, 1);
                font-size: 16px;
                line-height: 36px;
                margin: 40px auto 0 auto;
                cursor: pointer !important;
            }
        }

    }
}
</style>
