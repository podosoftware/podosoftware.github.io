import { viteStaticCopy } from 'vite-plugin-static-copy';

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/html-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
        viteStaticCopy({
          targets: [
            {
              src: '../../js/kendo',   // 실제 Kendo 파일 위치
              dest: 'js/kendo',        // http://localhost:6006/js/kendo/ 로 접근 가능
            },
            {
              src: '../../js/jquery',   // jQuery 폴더도 추가
              dest: 'js/jquery',
            },
          ],
        })
    );
    return config;
  },
};
export default config;