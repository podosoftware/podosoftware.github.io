import { fn } from 'storybook/test';

import {TextareaBox} from './TextareaBox';

export default {
    title: 'Components/Admin/Textarea',
    tags: ['autodocs'],
};

export const 기본_텍스트영역 = {
    args: {
        placeholder: '내용을 입력해 주세요.',
        disabled: false,
    },
    render: (args) => TextareaBox(args),
};

// 📌 Docs를 스토리로 등록
export const Docs = {
    name: '📘 Docs',
    render: () => `
    <div style="padding: 1rem; line-height: 1.6;">
      <h2>텍스트아리아 가이드</h2>
      <ul>
        <li>최상단 버튼: 콘텐츠 블록 맨 위에서 사용</li>
       
      </ul>
    </div>
  `,
    parameters: {
        controls: { hideNoControlsWarning: true }, // 제어 패널 숨기기
    },
};