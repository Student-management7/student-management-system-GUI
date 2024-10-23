# React + Vite

1:-

npm create vite@latest frontend -- --template react

2:-

Install Tailwind CSS

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

3:- 

Configure Tailwind by adding the following content to your tailwind.config.js:

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}




4:-  

Create a src/index.css file and include Tailwind’s base, components, and utilities:

@tailwind base;
@tailwind components;
@tailwind utilities;



5:-


npm install @emotion/react @emotion/styled @mui/material @mui/x-data-grid-premium axios formik framer-motion react react-dom react-hook-form react-router-dom yup



6:- 

npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals tailwindcss vite postcss autoprefixer



7:-

npm run dev




----------------------------------------------------------

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
