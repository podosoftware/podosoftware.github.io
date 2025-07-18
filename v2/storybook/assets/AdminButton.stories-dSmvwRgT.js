const i=({primary:s=!1,size:n="medium",backgroundColor:c,label:l,onClick:u})=>{const r=document.createElement("button");r.type="button",r.innerText=l,r.addEventListener("click",u);const m=s?"storybook-button--primary":"storybook-button--secondary";return r.className=["storybook-button",`storybook-button--${n}`,m].join(" "),r.style.backgroundColor=c,r},{fn:d}=__STORYBOOK_MODULE_TEST__,p={title:"Components/Admin/Button",tags:["autodocs"],render:({label:s,...n})=>i({label:s,...n}),argTypes:{backgroundColor:{control:"color"},label:{control:"text"},onClick:{action:"onClick"},primary:{control:"boolean"},size:{control:{type:"select"},options:["small","medium","large"]}},args:{onClick:d()}},e={args:{primary:!0,label:"Button"}},o={args:{label:"Button"}},t={args:{size:"large",label:"Button"}},a={args:{size:"small",label:"Button"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    primary: true,
    label: 'Button'
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Button'
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'large',
    label: 'Button'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    label: 'Button'
  }
}`,...a.parameters?.docs?.source}}};const b=["Primary","Secondary","Large","Small"];export{t as Large,e as Primary,o as Secondary,a as Small,b as __namedExportsOrder,p as default};
