const B=({primary:a=!1,size:i="medium",backgroundColor:l,label:c,type:D,onClick:m})=>{const u=document.createElement("button");u.type="button",u.innerText=c,u.addEventListener("click",m);const p=a?"storybook-button--primary":"storybook-button--secondary";return u.className=["storybook-button",`storybook-button--${i}`,p].join(" "),u.style.backgroundColor=l,u},{fn:d}=__STORYBOOK_MODULE_TEST__,b={title:"Components/Admin/Button/콘텐츠 버튼",tags:["autodocs"],render:({label:a,...i})=>B({label:a,...i}),argTypes:{backgroundColor:{control:"color"},label:{control:"text"},onClick:{action:"onClick"},primary:{control:"boolean"},size:{control:{type:"select"},options:["small","medium","large"]}},args:{onClick:d()}},e={args:{label:"최상단 버튼",type:"top",size:"medium"}},C={args:{label:"최하단 버튼",type:"bottom",size:"medium"}},r={args:{label:"최상단 검색 버튼",type:"top search",size:"medium"}},o={args:{label:"테이블 상단 버튼",type:"top table",size:"medium"}},s={args:{label:"검색 버튼",type:"search",size:"medium"}},t={args:{label:"팝업 최 하단 버튼",type:"bottom popup",size:"medium"}},n={name:"📘 Docs",render:()=>`
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
  `,parameters:{controls:{hideNoControlsWarning:!0}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: '최상단 버튼',
    type: "top",
    size: 'medium'
  }
}`,...e.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    label: '최하단 버튼',
    type: "bottom",
    size: 'medium'
  }
}`,...C.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: '최상단 검색 버튼',
    type: "top search",
    size: 'medium'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: '테이블 상단 버튼',
    type: "top table",
    size: 'medium'
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: '검색 버튼',
    type: "search",
    size: 'medium'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: '팝업 최 하단 버튼',
    type: "bottom popup",
    size: 'medium'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: '📘 Docs',
  render: () => \`
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
  \`,
  parameters: {
    controls: {
      hideNoControlsWarning: true
    } // 제어 패널 숨기기
  }
}`,...n.parameters?.docs?.source}}};const E=["최상단","최하단","최상단검색","테이블상단","검색","팝업최하단","Docs"];export{n as Docs,E as __namedExportsOrder,b as default,s as 검색,e as 최상단,r as 최상단검색,C as 최하단,o as 테이블상단,t as 팝업최하단};
