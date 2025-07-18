import { fn } from 'storybook/test';

import { createButton } from './ContentButton';

export default {
    title: 'Components/Admin/Button/콘텐츠 버튼',
    tags: ['autodocs'],
    render: ({ label, ...args }) => createButton({ label, ...args }),
    argTypes: {
        backgroundColor: { control: 'color' },
        label: { control: 'text' },
        onClick: { action: 'onClick' },
        primary: { control: 'boolean' },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
    },
    args: { onClick: fn() },
};

export const 최상단 = {
    args: {
        label: '최상단 버튼',
        type: "top",
        size: 'medium',
    },
};

export const 최하단 = {
    args: {
        label: '최하단 버튼',
        type: "bottom",
        size: 'medium',
    },
};

export const 최상단검색 = {
    args: {
        label: '최상단 검색 버튼',
        type: "top search",
        size: 'medium',
    },
};

export const 테이블상단 = {
    args: {
        label: '테이블 상단 버튼',
        type: "top table",
        size: 'medium',
    },
};

export const 검색 = {
    args: {
        label: '검색 버튼',
        type: "search",
        size: 'medium',
    },
};

export const 팝업최하단 = {
    args: {
        label: '팝업 최 하단 버튼',
        type: "bottom popup",
        size: 'medium',
    },
};

// 📌 Docs를 스토리로 등록
export const Docs = {
    name: '📘 Docs',
    render: () => `
    <div style="padding: 1rem; line-height: 1.6;">
      <h2>콘텐츠 버튼 가이드</h2>
      <ul>
        <li>최상단 버튼: 콘텐츠 블록 맨 위에서 사용</li>
        <li>최하단 버튼: 콘텐츠 종료 후 액션용</li>
        <li>최상단 검색 버튼: 콘텐츠 최상단 검색 조건 옆 배치</li>
        <li>테이블 상단 버튼: 테이블 위에 주요 액션 배치</li>
        <li>검색 버튼: 검색 조건 밑 또는 옆 배치</li>
        <li>팝업 최 하단 버튼: 팝업 최 하단 오른쪽 정렬 배치</li>
      </ul>
    </div>
  `,
    parameters: {
        controls: { hideNoControlsWarning: true }, // 제어 패널 숨기기
    },
};