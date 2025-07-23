import { SplitterBottomButtonGroup } from './SplitterBottomButtonGroup';
import { SplitterInputBox } from './SplitterInputBox';
import { SplitterTableTopButton } from './SplitterTableTopButton';
import { SplitterTableTdButton } from './SplitterTableTdButton';

export default {
    title: 'Components/Admin/Button/스플리터 콘텐츠 버튼',
    tags: ['autodocs'],
};

export const 테이블상단 = {
    args: {
        label: 'table top button',
        disabled: false,
    },
    render: (args) => SplitterTableTopButton(args),
};

export const 셀내버튼 = {
    args: {
        label: '선택',
        disabled: false,
    },
    render: (args) => SplitterTableTdButton(args),
};

export const 인풋옆 = {
    args: {
        placeholder: '입력하세요',
        buttonLabel: '확인',
    },
    render: (args) => SplitterInputBox(args),
};

export const 콘텐츠하단 = {
    args: {
        deleteLabel: '삭제',
        cancelLabel: '취소',
        saveLabel: '저장',
    },
    render: (args) => SplitterBottomButtonGroup(args),
};

// 📌 Docs를 스토리로 등록
export const Docs = {
    name: '📘 Docs',
    render: () => `
    <div style="padding: 1rem; line-height: 1.6;">
      <h2>콘텐츠 버튼 가이드</h2>
      <ul>
        <li>스플리터 내 테이블 상단: 스플리터 내 테이블 상단에 사용</li>
        <li>스플리터 내 입력 폼 옆 버튼: 가로로 늘어진 유형</li>
        <li>스플리터 내 테이블 셀 안 버튼: 스플리터 내 테이블 셀 안 버튼 기본</li>
        <li>스플리터 오른쪽 콘텐츠 하단 버튼: 스플리터 오른쪽 콘텐츠 하단에 위치한 버튼</li>
      </ul>
    </div>
  `,
    parameters: {
        controls: { hideNoControlsWarning: true }, // 제어 패널 숨기기
    },
};
