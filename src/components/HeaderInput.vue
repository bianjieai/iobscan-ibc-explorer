<template>
    <a-input
        class="header__input"
        placeholder="Search by TxHash"
        allowClear
        v-model:value="inputValue"
    >
        <template #suffix>
            <div class="input__prefix" @click="searchInput">
                <img class="input__prefix_img" src="../assets/search.png" alt="search"/>
            </div>
        </template>
    </a-input>
</template>

<script>
import {ref} from 'vue';
import router from "../router";
export default {
    props: {
        disabled: Boolean,
    },
    setup(props, context) {
        const inputValue = ref('');
        const onPressEnter = (evt) => {
            context.emit('pressedEnter', evt.target.value);
        };
        const searchInput = (evt) => {
            if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                router.push(`/transfers/details?hash=${inputValue.value}`)
            }

        }
        return {
            inputValue,
            onPressEnter,
            searchInput
        };
    },
};
</script>

<style lang="scss">
.header__input {
    height: 40px;
    background-color: rgba(#ffffff, 0.1);
    border: 1px solid rgba(61, 80, 255, 0.5);
    border-radius: 20px;

    input {
        background-color: transparent;
        color: #ffffff;
        font-family: Montserrat-Regular, Montserrat;
    }

    .input__prefix {
        height: 40px;
        border-radius:  0 40px 40px 0;
        padding: 6px 18px;
        background: #3D50FF;
        display: flex;
        align-items: center;
        justify-items: center;
        cursor: pointer;
        .input__prefix_img{
            width: 24px;
        }
    }

}
.ant-input-affix-wrapper{
    padding-right: 0;
}
</style>
