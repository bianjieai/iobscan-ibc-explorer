import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';
import { removeSpaceAndToLowerCase } from '@/utils/stringTools';
import { postIPAndInput } from '@/api';
import ChainHelper from '@/helper/chainHelper';
import { IHeaderInputOption, IPrefixChain } from '@/types/interface/index.interface';
import { bech32 } from 'bech32';
export const useHeaderInputSearch = (optionClass: string) => {
    const router = useRouter();
    const getPopupContainer = (): HTMLElement => document.querySelector(`.${optionClass}`)!;
    const inputHasFocus = ref<boolean>(false);
    const isActiveInputStyle = ref(false);
    const inputOptions = ref<IHeaderInputOption[]>([]);
    const setInputBorderStyle = () => {
        isActiveInputStyle.value = true;
        inputHasFocus.value = true;
    };
    const removeInputBorderStyle = () => {
        // const autoCompleteDom = document.getElementsByClassName('auto_complete');
        // const inputDom = document.getElementsByClassName('auto_complete__input');
        const inputDropdownDom = document.getElementsByClassName('auto_complete__dropdown');
        // if (autoCompleteDom[0].classList.contains('ant-select-focused')) {
        //     inputDom[0].classList.remove('ant-select-focused');
        // }
        // if (inputDom[0].classList.contains('ant-input-affix-wrapper-focused')) {
        //     inputDom[0].classList.remove('ant-input-affix-wrapper-focused');
        // }
        (inputDropdownDom[0] as HTMLElement).style.display = 'none';
        inputValue.value = '';
        inputOptions.value = [];
        inputHasFocus.value = false;
        isActiveInputStyle.value = false;
    };
    const isInvalid = ref<boolean>(false);
    const IP = (window as any)?.returnCitySN?.cip || '';
    if (!IP) {
        console.log('IP Not found');
    }
    const inputValue = ref<string>('');
    let content: string;
    const onSearchInputText = (inputText: string) => {
        setInputBorderStyle();
        inputOptions.value = [];
        handleInputOptions(inputText);
    };
    const judgeIsAddress = (prefix: string) => {
        try {
            return bech32.decode(prefix);
        } catch (error) {
            // 输入时防止控制台有过多 console，保留
            // console.log(error);
        }
    };
    const judgeInputPrefix = async (inputText: string) => {
        const dealWidthInputText = removeSpaceAndToLowerCase(inputText);
        const prefixMap = (await ChainHelper.getChainInfoByPrefix()) as {
            [key: string]: IPrefixChain[];
        };
        const matchPrefix = Object.keys(prefixMap).filter((prefixChain) =>
            dealWidthInputText.startsWith(prefixChain)
        );
        if (matchPrefix.length) {
            const matchPrefixMap = (await ChainHelper.getChainInfoByPrefix(matchPrefix[0])) as
                | IPrefixChain[]
                | undefined;
            if (matchPrefixMap?.length) {
                const sortPrefixMap = ChainHelper.sortArrsByNames(matchPrefixMap);
                inputOptions.value = sortPrefixMap.map((prefix) => {
                    return {
                        text: prefix.chain_name,
                        value: prefix.pretty_name,
                        addrPrefix: matchPrefix[0]
                    };
                });
            } else {
                inputOptions.value = [];
            }
        } else {
            inputOptions.value = [];
        }
        return {
            dealWidthInputText,
            matchPrefix
        };
    };
    const handleInputOptions = async (inputText: string) => {
        if (!inputText) {
            inputOptions.value = [];
        } else {
            if (/^[A-F0-9]{64}$/.test(inputText)) {
                inputOptions.value = [];
            } else if (/^[A-z]/.test(inputText)) {
                await judgeInputPrefix(inputText);
            } else {
                inputOptions.value = [];
            }
        }
    };
    const searchInput = async () => {
        (window as any).gtag('event', '导航栏-点击搜索', {
            searchValue: content
        });
        if (inputValue.value !== '') {
            if (/^[A-F0-9]{64}$/.test(inputValue.value)) {
                router.push(`/transfers/details?txhash=${inputValue.value}`);
            } else if (/^[A-z]/.test(inputValue.value)) {
                const { dealWidthInputText, matchPrefix } = await judgeInputPrefix(
                    inputValue.value
                );
                if (matchPrefix.length) {
                    if (judgeIsAddress(dealWidthInputText)) {
                        const currentChain = inputOptions.value.filter((item) => {
                            return item.addrPrefix === judgeIsAddress(dealWidthInputText)?.prefix;
                        });
                        inputOptions.value = [];
                        router.push(`/address/${dealWidthInputText}?chain=${currentChain[0].text}`);
                    }
                } else {
                    router.push(`/searchResult/${dealWidthInputText}`);
                }
            } else {
                router.push(`/searchResult/${inputValue.value}`);
            }
            removeInputBorderStyle();
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
        if (!judgeIsAddress(e.target.value as string)) {
            isInvalid.value = true;
        } else {
            isInvalid.value = false;
        }
    };
    const jumpAddrandStyle = (chain: string) => {
        const dealWidthInputText = removeSpaceAndToLowerCase(inputValue.value);
        if (judgeIsAddress(dealWidthInputText)) {
            router.push(`/address/${dealWidthInputText}?chain=${chain}`);
        }
        removeInputBorderStyle();
    };
    const onSelect = () => {
        removeInputBorderStyle();
    };
    return {
        getPopupContainer,
        inputValue,
        inputOptions,
        searchInput,
        changeValue,
        inputHasFocus,
        isActiveInputStyle,
        setInputBorderStyle,
        removeInputBorderStyle,
        onSearchInputText,
        isInvalid,
        jumpAddrandStyle,
        onSelect
    };
};
