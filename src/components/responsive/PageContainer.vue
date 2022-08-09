<template>
    <div class="page_container">
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .page_container {
        background-color: var(--bj-background-color);
        flex: 1;
        padding: 48px 48px 100px;
        width: 100%;
        text-align: left;
        box-sizing: border-box;
        .container {
            box-sizing: border-box;
            max-width: 1200px;
            margin: 0 auto;
        }
    }
    @media screen and (max-width: 768px) {
        .page_container {
            padding: 40px 32px 60px;
            .container {
                width: 100%;
            }
        }
    }
    @media screen and (max-width: 530px) {
        .page_container {
            padding: 24px 16px 60px;
            .container {
            }
        }
    }
</style>
