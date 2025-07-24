import { fn } from 'storybook/test';

import {PrimaryColor} from './Color';

export default {
    title: 'Components/Admin/Color',
    tags: ['autodocs'],
};

export const Primary = {
    args: {
    },
    render: (args) => PrimaryColor(args),
};
