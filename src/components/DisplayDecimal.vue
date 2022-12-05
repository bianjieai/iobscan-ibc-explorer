<template>
    <div class="diplay_decimal_c">
        <span class="diplay_decimal_c__integer"
            >{{ textSplitArr[0] }}{{ textSplitArr[1] ? '.' : '' }}</span
        >
        <span v-if="textSplitArr[1]" class="diplay_decimal_c__decimal">{{ textSplitArr[1] }}</span>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        text: string;
    }
    const props = defineProps<IProps>();
    const textSplitArr = computed(() => {
        return props.text.split('.');
    });
</script>

<style lang="less">
    // todo dj style
    .diplay_decimal_c {
        &__integer {
            font-size: 18px;
        }
        &__decimal {
            font-size: 12px;
        }
    }
</style>
