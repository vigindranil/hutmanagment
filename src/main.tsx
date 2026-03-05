import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// document.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
// });

// document.addEventListener('keydown', function (e) {
//   // Windows / Linux / Firefox key combinations
//   if (
//     e.keyCode === 123 || // F12
//     (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) || // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
//     (e.ctrlKey && e.keyCode === 85) // Ctrl+U
//   ) {
//     e.preventDefault();
//     return false;
//   }

//   // macOS key combinations: Option (Alt) + Command (Meta) + (I, C, J, U)
//   if (
//     e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74 || e.keyCode === 85)
//   ) {
//     e.preventDefault();
//     return false;
//   }
// });

// Attempt to detect if DevTools is open (works on most browsers)
// (function () {
//   let devtoolsOpen = false;
//   const threshold = 160;

//   const checkDevTools = function () {
//     const widthDiff = window.outerWidth - window.innerWidth;
//     const heightDiff = window.outerHeight - window.innerHeight;
//     if (widthDiff > threshold || heightDiff > threshold) {
//       if (!devtoolsOpen) {
//         devtoolsOpen = true;
//         alert('Inspect Element and Developer Tools are disabled.');
//         // Optionally redirect:
//         // window.location.href = "about:blank";
//       }
//     } else {
//       devtoolsOpen = false;
//     }
//   };

//   setInterval(checkDevTools, 1000);
// })();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter> */}
  </StrictMode>
);
