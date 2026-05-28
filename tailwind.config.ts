import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#97dffd', // 主色：按钮/标签/日期角标
          purple: '#64609e', // 中紫：选中/hover
          'purple-dark': '#48456d', // 深紫：hover/三角
          pink: '#df2050', // 点赞/赞赏
          orange: '#ff4d00',
          sky: '#00a7e0',
        },
      },
      fontFamily: {
        display: ['"Sigmar One"', 'cursive'],
      },
    },
  },
  plugins: [typography],
};

export default config;
