export const GROWTH_RATE = {
    increase: {
        sign: '+',
        label: 'increase'
    },
    decrease: {
        sign: '-',
        label: 'decrease'
    }
};
export const LEGEND_PRECENT = reactive([
    {
        label: '+10%',
        bgColor: '#00C853',
        status: true
    },
    {
        label: '+9%',
        bgColor: '#4BD284',
        status: true
    },
    {
        label: '+3%',
        bgColor: '#80DDA7',
        status: true
    },
    {
        label: '0%',
        bgColor: '#CAD1E4',
        status: true
    },
    {
        label: '-3%',
        bgColor: '#FFA9A9',
        status: true
    },
    {
        label: '-9%',
        bgColor: '#FF8181',
        status: true
    },
    {
        label: '-10%',
        bgColor: '#FF5A5A',
        status: true
    }
]);

export enum VOLUME_COLOR {
    in = '#1890FF',
    out = '#FA8C16'
}

export const VOLUME_ALL_CHAIN = 'all_chain';
