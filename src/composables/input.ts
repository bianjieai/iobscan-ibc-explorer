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
    const inputDom = ref();
    const setInputBorderStyle = () => {
        isActiveInputStyle.value = true;
        inputHasFocus.value = true;
    };
    let clearContentTimer: number;
    const removeInputBorderStyle = () => {
        const inputDropdownDom = document.getElementsByClassName('auto_complete__dropdown');
        inputDropdownDom[0] && ((inputDropdownDom[0] as HTMLElement).style.display = 'none');
        inputValue.value = '';
        inputOptions.value = [];
        inputHasFocus.value = false;
        isActiveInputStyle.value = false;
        inputDom.value?.input.blur();
        clearContentTimer && clearTimeout(clearContentTimer);
        clearContentTimer = setTimeout(() => {
            content = '';
        }, 500);
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
        const matchPrefix = Object.keys(prefixMap).filter(
            (prefixChain) => prefixChain && dealWidthInputText.startsWith(prefixChain)
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
    const searchBoxJump = async (searchContent: string) => {
        if (searchContent) {
            if (/^[A-F0-9]{64}$/.test(searchContent)) {
                router.push(`/transfers/details?txhash=${searchContent}`);
            } else if (/^[A-z]/.test(searchContent)) {
                const { dealWidthInputText, matchPrefix } = await judgeInputPrefix(searchContent);
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
                router.push(`/searchResult/${searchContent}`);
            }
        }
    };
    const searchInput = async (isSearchBtn?: boolean) => {
        (window as any).gtag('event', '导航栏-点击搜索', {
            searchValue: content
        });
        if (!isSearchBtn) {
            searchBoxJump(inputValue.value || '');
        } else {
            searchBoxJump(content || '');
        }
        removeInputBorderStyle();
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
        inputDom,
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
