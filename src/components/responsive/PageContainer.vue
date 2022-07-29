<template>
    <div class="page-container">
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .page-container {
        background-color: var(--bj-background-color);
        flex: 1;
        padding: 48px 32px 100px;
        width: 100%;
        text-align: left;
        box-sizing: border-box;
        .container {
            box-sizing: border-box;
            max-width: 1200px;
            margin: 0 auto;
        }
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
        .container {
            width: 100%;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .page-container {
            padding: 24px 16px 80px;
        }
        .container {
            width: 100%;
        }
    }
</style>
