import { fn } from 'storybook/test';

import {InputBox, InputBoxNormal, InputBoxRightText, InputBoxButton} from './InputBox';

export default {
    title: 'Components/Admin/Input/입력 창',
    tags: ['autodocs'],
};

export const 대타이틀_상단검색 = {
    args: {
        label: '검색'
    },
    render: (args) => InputBox(args),
};

export const 기본_입력박스 = {
    args: {
        placeholder: '검색',
        disabled: false,
    },
    render: (args) => InputBoxNormal(args),
};

export const 단위_텍스트_포함 = {
    args: {
        placeholder: '9,999,999',
        disabled: false,
        labelText: '원'
    },
    render: (args) => InputBoxRightText(args),
};

export const 버튼_포함 = {
    args: {
        placeholder: '버튼을 클릭하세요.',
        disabled: false,
        buttonText: '검색'
    },
    render: (args) => InputBoxButton(args),
};

// 📌 Docs를 스토리로 등록
export const Docs = {
    name: '📘 Docs',
    render: () => `
    <div style="padding: 1rem; line-height: 1.6;">
      <h2>인풋 가이드</h2>
      <ul>
        <li></li>
      </ul>
    </div>
  `,
    parameters: {
        controls: { hideNoControlsWarning: true }, // 제어 패널 숨기기
    },
};