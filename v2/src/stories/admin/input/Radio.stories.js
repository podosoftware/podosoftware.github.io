import { fn } from 'storybook/test';

import {Radio} from './Radio';

export default {
    title: 'Components/Admin/Input/라디오',
    tags: ['autodocs'],
};

export const 라디오박스 = {
    args: {
        label: '사과',
        label2: '귤',
        label3: '수박',
        disabled: false,
        checked: false,
    },
    render: (args) => Radio(args),
};