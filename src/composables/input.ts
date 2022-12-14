import { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';
import { removeSpaceAndToLowerCase } from '@/utils/stringTools';
import { postIPAndInput } from '@/api';
import ChainHelper from '@/helper/chainHelper';
import { IHeaderInputOption, IPrefixChain } from '@/types/interface/index.interface';
import { bech32 } from 'bech32';
export const useHeaderInputSearch = () => {
    const router = useRouter();
    const getPopupContainer = (): HTMLElement => document.querySelector('.auto_complete')!;
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
    const isInvalid = ref<boolean>(false);
    const IP = (window as any)?.returnCitySN?.cip || '';
    if (!IP) {
        console.log('IP Not found');
    }
    const inputValue = ref<string>('');
    let content: string;
    const inputOptions = ref<IHeaderInputOption[]>([]);
    const onSearchInputText = (inputText: string) => {
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
            inputValue.value = '';
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
    const jumpAddrandStyle = (address: string, chain: string) => {
        router.push(`/address/${address}?chain=${chain}`);
        removeInputBorderStyle();
        inputOptions.value = [];
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
        jumpAddrandStyle
    };
};
