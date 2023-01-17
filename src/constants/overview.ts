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

export const HEATMAP_COLOR = {
    '+10%': '#00C853',
    '+9%': '#4BD284',
    '+3%': '#80DDA7',
    '0%': '#CAD1E4',
    '-3%': '#FFA9A9',
    '-9%': '#FF8181',
    '-10%': '#FF5A5A'
};

export enum VOLUME_COLOR {
    in = '#1890FF',
    out = '#FA8C16'
}

export const VOLUME_ALL_CHAIN = 'all_chain';

export const SANKEY_COLOR_LIST = [
    'rgba(13, 71, 161, 1)',
    'rgba(47, 84, 235, 1)',
    'rgba(250, 140, 22, 1)',
    'rgba(41, 121, 255, 1)',
    'rgba(24, 144, 255, 1)',
    'rgba(89, 126, 247, 1)',
    'rgba(250, 173, 20, 1)',
    'rgba(64, 169, 255, 1)',
    'rgba(133, 165, 255, 1)',
    'rgba(130, 177, 255, 1)',
    'rgba(255, 192, 105, 1)',
    'rgba(255, 214, 102, 1)',
    'rgba(255, 213, 145, 1)',
    'rgba(129, 212, 250, 1)',
    'rgba(255, 229, 143, 1)',
    'rgba(255, 231, 186, 1)',
    'rgba(255, 241, 184, 1)',
    'rgba(190, 210, 255, 1)'
];

export const NOHOP_COLOR = [
    {
        color: 'rgba(13, 71, 161, 1)',
        borderColor: 'rgba(13, 71, 161, 1)'
    },
    {
        color: '#fff',
        borderColor: 'rgba(13, 71, 161, 1)'
    }
];

export const UNKNOWN_NODE_COLOR = 'rgba(176, 182, 200, 1)';

export const SANKEY_ZERO_JUMP_LINE_OPACITY = {
    line: 0.05,
    emphasis: 0.1
};
