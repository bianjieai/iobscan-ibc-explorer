import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';
// import { removeSpaceAndToLowerCase } from '@/utils/stringTools';
import { postIPAndInput } from '@/api';
// import ChainHelper from '@/helper/chainHelper';

export const useHeaderInputSearch = () => {
    const router = useRouter();
    const inputHasFocus = ref<boolean>(false);
    const isActiveInputStyle = ref(false);
    const setInputBorderStyle = () => {
        isActiveInputStyle.value = true;
        inputHasFocus.value = true;
    };
    const removeInputBorderStyle = () => {
        isActiveInputStyle.value = false;
        inputHasFocus.value = false;
    };
    const IP = (window as any)?.returnCitySN?.cip || '';
    if (!IP) {
        console.log('IP Not found');
    }
    const inputValue = ref<string>('');
    let content: string;
    const inputOptions = ref<{ text: string; value: string }[]>([]);
    const onSearchInputText = (inputText: string) => {
        handleInputOptions(inputText);
    };
    const handleInputOptions = async (inputText: string) => {
        if (!inputText) {
            inputOptions.value = [];
        } else {
            if (/^[A-F0-9]{64}$/.test(inputText)) {
                inputOptions.value = [];
            } else if (/^[A-z]/.test(inputText)) {
                // const dealWidthInputText = removeSpaceAndToLowerCase(inputText);
                // const prefixInfo = await ChainHelper.getChainInfoByPrefix(dealWidthInputText);
                // if (prefixInfo?.length) {
                //     inputOptions.value = prefixInfo.map((prefix) => {
                //         return {
                //             text: prefix.chain_name,
                //             value: prefix.pretty_name
                //         };
                //     });
                // } else {
                //     inputOptions.value = [];
                // }
            } else {
                inputOptions.value = [];
            }
        }
    };
    const searchInput = () => {
        (window as any).gtag('event', '导航栏-点击搜索', {
            searchValue: content
        });
        if (inputValue.value !== '') {
            console.log('---');
            if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                router.push(`/transfers/details?txhash=${inputValue.value}`);
                inputValue.value = '';
            } else if (/^[A-z]/.test(inputValue.value)) {
                // todo shan 跳转 address details 的情况
            } else {
                router.push(`/searchResult/${inputValue.value}`);
            }
        }
        // 调取埋点接口
        const params = {
            ip: IP,
            content: content
        };
        postIPAndInput(params);
    };

    const changeValue = (e: ChangeEvent) => {
        content = e.target.value || '';
    };
    return {
        inputValue,
        inputOptions,
        searchInput,
        changeValue,
        inputHasFocus,
        isActiveInputStyle,
        setInputBorderStyle,
        removeInputBorderStyle,
        onSearchInputText
    };
};
