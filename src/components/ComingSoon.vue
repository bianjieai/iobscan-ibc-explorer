<template>
    <div class="coming_soon_container">
        <div class="coming_soon_content_wrap">
            <div class="coming_soon_img">
                <img src="../assets/coming_soon.png" alt="" />
            </div>
            <p class="coming_soon_content">Coming Soon…</p>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
    .coming_soon_container {
        width: 1200px;
        height: 442px;
        .flex(row,nowrap,center,center);
        margin: 48px auto 0 auto;
        background-color: #fff;
        border-radius: 4px;
        .coming_soon_content_wrap {
            margin-top: 60px;
            .coming_soon_content {
                padding-bottom: 144px;
            }
        }
    }
</style>
