import{c as s}from"./Header-DIN8LOJ2.js";import"./Button-DfetVkf1.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,c={title:"Components/User/Header",tags:["autodocs"],render:a=>s(a),parameters:{layout:"fullscreen"},args:{onLogin:o(),onLogout:o(),onCreateAccount:o()}},e={args:{user:{name:"Jane Doe"}}},r={};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      name: 'Jane Doe'
    }
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};const d=["LoggedIn","LoggedOut"];export{e as LoggedIn,r as LoggedOut,d as __namedExportsOrder,c as default};
