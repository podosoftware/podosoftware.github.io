import { fn } from 'storybook/test';

import {PrimaryColor, bindTokenCopyEvent} from './Color';
import {
    primaryColorTokens,
    textColorTokens,
    tableLineColorTokens,
    tableBgColorTokens,
    statesBgColorTokens,
    buttonColorTokens
} from './colorTokens';


export default {
    title: 'Components/Admin/디자인토큰/Color',
    tags: ['autodocs'],
};

export const Primary = {
    render: (args) => {
        const html = PrimaryColor(primaryColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};

export const TextColor = {
    render: (args) => {
        const html = PrimaryColor(textColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};

export const TableLine = {
    render: (args) => {
        const html = PrimaryColor(tableLineColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};

export const TableBg = {
    render: (args) => {
        const html = PrimaryColor(tableBgColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};

export const States = {
    render: (args) => {
        const html = PrimaryColor(statesBgColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};

export const Buttons = {
    render: (args) => {
        const html = PrimaryColor(buttonColorTokens);
        setTimeout(() => bindTokenCopyEvent(), 0); // 렌더 이후 바인딩
        return html;
    },
};
