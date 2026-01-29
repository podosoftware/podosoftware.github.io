const jQueryJS = "/js/jquery/jquery-3.7.1.min.js";
const kendoJS = "/js/kendo/2025.1.211/kendo.custom.min.js";
const kendoLicenseJS = "/js/kendo/2025.1.211/telerik-license.js";

// <head>에 link / script 추가
const appendHeadElement = (tagName, attributes) => {
    const tag = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
    document.head.appendChild(tag);
};

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;

// 스토리북 실행 시 1회만 실행
appendHeadElement("script", {
    src: jQueryJS,
});

appendHeadElement("script", {
    src: kendoJS,
});

appendHeadElement("script", {
    src: kendoLicenseJS,
});