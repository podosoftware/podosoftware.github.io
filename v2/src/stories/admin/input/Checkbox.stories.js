import { fn } from 'storybook/test';

import {Checkbox} from './Checkbox';

export default {
    title: 'Components/Admin/Input/체크박스',
    tags: ['autodocs'],
};

export const 체크박스 = {
    args: {
        label: '사과',
        label2: '귤',
        label3: '수박',
        disabled: false,
        checked: false,
    },
    render: (args) => Checkbox(args),
};
