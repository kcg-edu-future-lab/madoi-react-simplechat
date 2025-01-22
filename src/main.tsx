import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Madoi } from './madoi/madoi.ts';

const roomId = "madoiChat_2rnieg"; // 任意の文字列
const apikey = "ahfuTep6ooDi7Oa4"; // apikey
export const MadoiContext = createContext(new Madoi(
  `ws://localhost:8080/madoi/rooms/${roomId}`,
  apikey));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
