import './tipStyle.css';

export const TipComponent = () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="tip-box">
          <span>Tip</span>
          <ul>
              <li>1. 해당 과정의 상세 이미지가 있을 경우 아래에서 [파일선택]을 통해 업로드 합니다.</li>
              <li>2. 만일 상세 이미지가 없을 경우 이미지선택을 통해 이미지 풀에서 가져다 쓸 수 있습니다.</li>
              <li>3. 이미지 제작에 관해선 헬프데스크(070-7432-2657)로 문의 주시기 바랍니다.</li>
          </ul>
      </div>
    `;

    return wrapper;
};

export const OperationTip = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="pd-flex- cont-tip-box cmptDiv-tip-box pd-mb20">
      <div class="tip-title">
        <span>수료관리<br>운영Tip</span>
      </div>
      <ul>
        <li>1. <span class="pd-tag">일괄수료선택</span>버튼을 클릭하면 모든 수강생이 수료로 선택됩니다.</li>
        <li>2. <span class="pd-tag">일괄상태변경</span>버튼을 클릭하면 수료기준점수에 따라 수료/미수료가 자동 선택됩니다.</li>
        <li>3. <span class="pd-tag">수료엑셀업로드</span>기능을 이용하여 엑셀로 일괄 수료처리를 하실 수 있습니다.</li>
      </ul>
    </div>
  `;
  return wrapper;
};

export const SelectOptionTip = () => {
  const wrapper = document.createElement('p');
  wrapper.className = 'pd-flex- info-txt pd-mt pd-gap4 pd-align-center';
  wrapper.innerHTML = `
    <i class="icon-info-blue"></i>
    <span>기타를 선택할 경우 교육기관명을 입력하세요.</span>
  `;
  return wrapper;
};

export const TooltipTip = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="tip-wrap">
      <button type="button" class="tit_icon">
        <img src="../images/runway/admin/icon_subtract.png" alt="tip">
      </button>
      <div class="title_box" style="display: none;">
        <p class="tit">차수관리 사용 TIP</p>
        <div class="px">과정관리에서 추가된 과정을 개설할 수 있습니다.</div>
        <div class="px">교육시작일 기준으로 검색을 하여 개설된 정보를 열람할 수 있습니다.</div>
        <button type="button" class="tip-close-btn"><i class="icon icon-tip-close"></i></button>
      </div>
    </div>
  `;

  // 이벤트 연결
  const tipWrap = wrapper.querySelector('.tip-wrap');
  const toggleBtn = tipWrap.querySelector('.tit_icon');
  const closeBtn = tipWrap.querySelector('.tip-close-btn');
  const tipBox = tipWrap.querySelector('.title_box');

  toggleBtn.addEventListener('click', () => {
    tipBox.style.display = tipBox.style.display === 'none' ? 'block' : 'none';
  });

  closeBtn.addEventListener('click', () => {
    tipBox.style.display = 'none';
  });

  return wrapper;
};


export const PopupContentTip = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="pd-flex- pd-align-center cont-tip-box">
      <i class="icon-info-file"></i>
      <span class="txt">개설할 과정을 검색 후 선택하시면 됩니다.</span>
    </div>
  `;
  return wrapper;
};

