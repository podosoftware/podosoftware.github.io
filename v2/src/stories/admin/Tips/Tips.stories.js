import { fn } from 'storybook/test';

import {TipComponent, OperationTip, SelectOptionTip, TooltipTip, PopupContentTip} from './Tips';


export default {
    title: 'Components/Admin/Tips',
    tags: ['autodocs'],
};

export const Tip = {
    render: () => TipComponent(),
};

export const 운영관리Tip = {
  render: () => OperationTip(),
};

export const 선택항목Tip = {
  render: () => SelectOptionTip(),
};

export const Tooltip = {
  render: () => TooltipTip(),
};

export const 팝업콘텐츠Tip = {
  render: () => PopupContentTip(),
};