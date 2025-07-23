import './InputSelect.css';

export default {
  title: 'Example/admin/InputSelect',
};

export const 대타이틀_상단검색 = () => `
  <h4 class="title-title">높이가 42px / 대타이틀 옆 상단 검색 기능 input</h4>
  <div class="cont_body">
    <div class="cont_body-top mb0">
      <div class="title">대타이틀명</div>
      <ul class="search-wrap">
        <li>
          <div class="input-box">
            <input type="text" class="k-textbox" placeholder="input box" />
            <button type="button" class="btn_search">
              <i class="icon icon-search"></i>
              <span class="blind">검색</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
`;

export const 기본_입력박스 = () => `
  <input type="text" class="k-textbox pd-w-full" placeholder="input box" />
`;

export const 비활성화_입력박스 = () => `
  <input type="text" class="k-textbox pd-w-full" placeholder="input box" disabled />
`;

export const 단위_텍스트_포함 = () => `
  <div class="input-box" style="width: 178px;">
    <input type="text" class="k-textbox pd-w-full" placeholder="input box" />
    <span class="txt">원</span>
  </div>
`;

export const 버튼_포함 = () => `
  <div class="input-box" style="width: 30%;">
    <input type="text" class="k-textbox pd-w-full" placeholder="input box" />
    <button type="button" class="btn_inner">버튼</button>
  </div>
`;
