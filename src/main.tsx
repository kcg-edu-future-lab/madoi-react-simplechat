import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Madoi } from './madoi/madoi.ts';

console.log("main.tsx");
export const MadoiContext = createContext(new Madoi(
    "wss://fungo.kcg.edu/madoi-20240628/rooms/madoiChat_2rnieg",
    "Shei3z8cohg0quei"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
