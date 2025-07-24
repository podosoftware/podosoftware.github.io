import { fn } from 'storybook/test';

import {PrimaryColor, bindTokenCopyEvent} from './Color';
import {
    primaryColorTokens,
    textColorTokens
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
