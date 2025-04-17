import React from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import './index.css'; // Tailwind directives + global styles

/**
 * Entry point – bootstraps React app into #root.
 * Separated to keep Vite HMR clean and allow Jest/Vitest to mount components.
 */
const container = document.getElementById('root');
if (!container) throw new Error("#root element missing in index.html");

createRoot(container).render(
    <React.StrictMode>
        <Layout />
    </React.StrictMode>,
);
