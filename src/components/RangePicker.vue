<template>
    <a-range-picker
        class="range_picker cursor"
        :value="dateRange"
        :disabled-date="disabledDate"
        :allow-clear="false"
        format="YYYY-MM-DD"
        separator="-"
        :placeholder="['Start Date', 'End Date']"
        :disabled="isShowModal"
        @open-change="onOpenChangeRangePicker"
        @on-change="onChangeRangePicker"
    >
        <template #suffixIcon>
            <svg
                style="positon: absolute; left: 10px; top: 13px; width: 18px; height: 18px"
                t="1635216291915"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1016"
                width="200"
                height="200"
            >
                <path
                    d="M291.584 633.7024h438.0672c26.2144 0 47.2576-21.504 47.2576-47.9744a47.6672 47.6672 0 0 0-47.2576-48.0256H291.584a47.616 47.616 0 0 0-47.1552 48.0256 47.616 47.616 0 0 0 47.1552 48.0256z m438.0672 74.0864H291.584a45.568 45.568 0 0 0-33.1264 13.824 49.664 49.664 0 0 0-14.0288 34.304 47.616 47.616 0 0 0 47.1552 47.9744h438.0672a45.568 45.568 0 0 0 33.1776-13.7728 49.664 49.664 0 0 0 14.08-34.2016 49.664 49.664 0 0 0-14.08-34.304 45.568 45.568 0 0 0-33.1776-13.824z m-385.536-503.7568a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.136-20.5824-49.3568-45.9264-49.3568-25.3952 0-45.9776 22.2208-45.9776 49.3568V154.624a49.8176 49.8176 0 0 0 13.2096 34.6112c8.6016 9.2672 20.3776 14.592 32.768 14.7456z m333.312 0a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.1872-20.5824-49.3568-45.9776-49.3568-25.344 0-45.9264 22.2208-45.9264 49.3568V154.624a49.8176 49.8176 0 0 0 13.1584 34.6112c8.6016 9.2672 20.4288 14.592 32.768 14.7456zM475.4944 150.0672h70.1952a47.616 47.616 0 0 0 47.2576-47.9744 47.6672 47.6672 0 0 0-47.2576-48.0256H475.5456a47.616 47.616 0 0 0-47.2064 48.0256 47.616 47.616 0 0 0 47.2064 47.9744z"
                    p-id="1017"
                    fill="#A4ABC0"
                ></path>
                <path
                    d="M970.3424 102.0928a47.2064 47.2064 0 0 0-11.5712-30.4128c-0.8704-1.0752-1.2288-2.4064-2.2528-3.3792-0.8704-0.9728-2.1504-1.4336-3.1232-2.304a43.7248 43.7248 0 0 0-29.1328-12.032l-0.6144 0.1024-0.7168-0.1024H806.912a47.5648 47.5648 0 0 0-47.2064 47.9744 47.616 47.616 0 0 0 47.2064 48.0256h71.3216v157.0304H143.1552V150.0672H214.528a47.616 47.616 0 0 0 47.2576-47.9744 47.616 47.616 0 0 0-47.2576-48.0256H98.5088l-0.8192 0.1536-0.6144-0.1536a43.1104 43.1104 0 0 0-29.0816 12.032c-0.7168 0.768-2.1504 1.3312-2.8672 2.2528-1.024 0.9728-1.536 2.304-2.4064 3.328A47.872 47.872 0 0 0 51.2 102.0928l0.1024 0.6144L51.2 103.424v871.1168l0.1024 0.768L51.2 975.872c0.2048 11.264 4.3008 22.016 11.52 30.4128 0.8704 1.1264 1.28 2.3552 2.2528 3.3792 0.8704 1.024 2.0992 1.3312 3.1232 2.3552A44.6464 44.6464 0 0 0 97.28 1024l0.6656-0.1536 0.6656 0.1536h824.32c0.3072 0 0.512-0.256 0.768-0.256 0.256 0 0.512 0.256 0.768 0.256a44.288 44.288 0 0 0 37.6832-22.8352c1.536-2.3552 3.328-4.352 4.4032-6.9632 1.3824-3.584 1.6384-7.68 2.2528-11.5712 0.3584-2.2016 1.28-4.1984 1.28-6.656v-0.256c0-0.3584 0.256-0.7168 0.256-1.1264V103.3728l-0.1024-0.6656c0-0.1536 0.1536-0.3584 0.1536-0.6144zM143.1552 403.0464h735.232v524.8H143.2064V403.0464z"
                    p-id="1018"
                    fill="#A4ABC0"
                ></path>
            </svg>
        </template>
    </a-range-picker>
</template>

<script setup lang="ts">
    import { usePickerPlaceholder } from '@/composables';
    import { Dayjs } from 'dayjs';

    interface IRangePicker {
        dateRange: [Dayjs, Dayjs] | undefined;
        disabledDate: (current: Dayjs) => boolean;
        isShowModal?: boolean;
    }
    withDefaults(defineProps<IRangePicker>(), {
        isShowModal: false
    });
    const emits = defineEmits<{
        (e: 'onChange'): void;
    }>();
    const { pickerPlaceholderColor, onOpenChangeRangePicker } = usePickerPlaceholder();
    const onChangeRangePicker = () => {
        emits('onChange');
    };
</script>

<style lang="less" scoped>
    .range_picker {
        width: 250px;
        height: 36px;
        &:hover {
            border-color: var(--bj-primary-color);
        }
        :deep(.ant-picker-input) {
            input {
                font-family: GolosUIWebRegular;
                color: var(--bj-primary-color);
                text-align: center;
                &::placeholder {
                    color: v-bind(pickerPlaceholderColor);
                }
            }
            input[disabled] {
                cursor: url('../assets/forbidden.png'), not-allowed;
            }
        }
        border: 1px solid var(--bj-border-color);
    }
</style>
