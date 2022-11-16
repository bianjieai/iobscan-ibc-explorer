import { Ref } from 'vue';
import { removeSpaceAndToLowerCase } from '@/utils/stringTools';
import { SEARCH_OPTIONS, RelayersSearchType, RelayerSearchPlaceholder } from '@/constants/relayers';
import { useIbcStatisticsChains } from '@/store';
import { ChainPopoverChainItem } from '@/types/interface/relayers.interface';

export const useRelayerSearch = (emits: any) => {
    const router = useRouter();
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    // a-dropdown
    const isDropdownSelected = ref(false);
    const searchType = ref<RelayersSearchType>(RelayersSearchType.relayerName);
    const selectOption = ref<{ key: any; value: any }[]>([
        {
            key: RelayersSearchType.relayerName,
            value: 'Relayer Name'
        }
    ]);
    const placeholder = ref(RelayerSearchPlaceholder.relayerName);
    const visibleDropdown = ref(false);
    const selectedText = computed(() => {
        if (selectOption.value.length > 0) {
            return selectOption.value[0].value;
        } else {
            return SEARCH_OPTIONS[0].value;
        }
    });
    const onSelect = (key: RelayersSearchType, value: string) => {
        if (key === RelayersSearchType.relayerName) {
            placeholder.value = RelayerSearchPlaceholder.relayerName;
        } else {
            options.value = [];
            placeholder.value = RelayerSearchPlaceholder.relayerAddress;
        }
        isDropdownSelected.value = true;
        selectOption.value = [];
        selectOption.value.push({
            key,
            value
        });
        searchType.value = key;
        visibleDropdown.value = false;
    };

    // a-auto-complete
    const completeValue = ref('');
    const inputValue = ref('');

    const route = useRoute();
    const initDataByUrl = () => {
        const relayerNameQuery = route.query.relayer_name as string | undefined;
        const relayerAddressQuery = route.query.relayer_address as string | undefined;
        if (relayerNameQuery && relayerAddressQuery) {
            completeValue.value = relayerNameQuery;
            inputValue.value = relayerNameQuery;
        } else if (relayerNameQuery) {
            completeValue.value = relayerNameQuery;
            inputValue.value = relayerNameQuery;
        } else if (relayerAddressQuery) {
            searchType.value = RelayersSearchType.relayerAddress;
            selectOption.value = SEARCH_OPTIONS.filter(
                (item) => item.key === RelayersSearchType.relayerAddress
            );
            completeValue.value = relayerAddressQuery;
            inputValue.value = relayerAddressQuery;
            placeholder.value = RelayerSearchPlaceholder.relayerAddress;
        }
    };
    initDataByUrl();

    const options = ref<{ text: string; value: string }[]>([]);
    const onSearch = (searchText: string) => {
        handleOptions(searchText);
    };
    const handleOptions = (searchText: string) => {
        if (searchType.value === RelayersSearchType.relayerName) {
            if (!searchText) {
                options.value = [];
            } else {
                const matching = removeSpaceAndToLowerCase(searchText);
                const res = ibcStatisticsChainsStore.relayerNames.filter((item) =>
                    item.matching.includes(matching)
                );
                options.value = res.map((item) => {
                    return { text: item.source, value: item.source };
                });
            }
        }
    };
    const onCompleteSelect = (value: string) => {
        inputValue.value = value;
    };
    const isCompleteFocus = ref(false);
    const onFocus = () => {
        isCompleteFocus.value = true;
        handleOptions(completeValue.value);
    };
    const onBlur = () => {
        isCompleteFocus.value = false;
    };
    const isHighlighted = computed(() => {
        return visibleDropdown.value || isCompleteFocus.value;
    });
    const clearValue = () => {
        completeValue.value = '';
        inputValue.value = '';
        options.value = [];
        router.replace('/relayers');
    };
    const searchFn = () => {
        emits('onSearch', searchType.value, completeValue.value);
    };
    onMounted(() => {
        searchFn();
    });
    return {
        isHighlighted,
        visibleDropdown,
        isDropdownSelected,
        selectedText,
        selectOption,
        onSelect,
        completeValue,
        options,
        onCompleteSelect,
        onSearch,
        inputValue,
        placeholder,
        onFocus,
        onBlur,
        clearValue,
        searchFn
    };
};

export const useChainPopover = (chainList: Ref<ChainPopoverChainItem[]>) => {
    const showViewAll = ref(false);
    const displayChainList = ref<ChainPopoverChainItem[]>([]);

    watch(
        () => chainList,
        (newValue) => {
            if (newValue.value.length <= 0) return [];
            const maxheight = 246;
            let currentHeight = 0;
            const tempChainList = [...newValue.value];
            displayChainList.value = [];
            for (let i = 0; i < tempChainList.length; i++) {
                currentHeight += 36;
                if (currentHeight > maxheight) {
                    displayChainList.value = newValue.value.slice(0, i - 1);
                    showViewAll.value = true;
                    return;
                }
                const chain = tempChainList[i];
                for (let j = 0; j < chain.address.length; j++) {
                    currentHeight += 28;
                    if (currentHeight > maxheight) {
                        if (i === 0) {
                            const lastIndex = i;
                            const tempAddressList = newValue.value[lastIndex].address.slice(
                                0,
                                j - 1
                            );
                            displayChainList.value = newValue.value.slice(0, i + 1);
                            displayChainList.value[lastIndex].address = [...tempAddressList];
                        } else {
                            displayChainList.value = newValue.value.slice(0, i);
                        }
                        showViewAll.value = true;
                        return;
                    }
                }
            }
            displayChainList.value = [...newValue.value];
        },
        {
            immediate: true
        }
    );
    return {
        showViewAll,
        displayChainList
    };
};
