import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ThemeProvider} from "@/components/theme-provider.jsx";
import {PromptProvider} from "@/context/prompt-context.js";

createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App/>
  </ThemeProvider>,
)
