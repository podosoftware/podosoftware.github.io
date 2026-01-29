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

function renderColorTable(tokenList) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = PrimaryColor(tokenList);

    // 바인딩은 렌더링 후 DOM에서 수행
    bindTokenCopyEvent(wrapper);

    return wrapper;
}

export const Primary = {
    render: () => renderColorTable(primaryColorTokens),
};

export const TextColor = {
    render: () => renderColorTable(textColorTokens),
};

export const TableLine = {
    render: () => renderColorTable(tableLineColorTokens),
};

export const TableBg = {
    render: () => renderColorTable(tableBgColorTokens),
};

export const States = {
    render: () => renderColorTable(statesBgColorTokens),
};

export const Buttons = {
    render: () => renderColorTable(buttonColorTokens),
};
