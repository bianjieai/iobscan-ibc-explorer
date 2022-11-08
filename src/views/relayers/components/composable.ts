import { SEARCH_OPTIONS, RelayersSearchType, RelayerSearchPlaceholder } from '@/constants/relayers';

export const useRelayerSearch = () => {
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
            // todo dj  如果url 两者都有值如何处理
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
    // todo dj 获取 options
    const handleOptions = (searchText: string) => {
        if (searchType.value === RelayersSearchType.relayerName) {
            options.value = !searchText ? [] : [{ text: 'testtext', value: 'testvalue' }];
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
    };
    return {
        isHighlighted,
        visibleDropdown,
        searchType,
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
        clearValue
    };
};
