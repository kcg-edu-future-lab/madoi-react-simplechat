import { FormEventHandler, useContext, useRef } from 'react'
import './App.css'
import { MadoiContext } from './main';
import { useMadoiObject } from './madoi/reactHelpers';
import { Logs } from './Logs';

export default function App() {
  const madoi = useContext(MadoiContext);
  const logs = useMadoiObject(madoi, new Logs());
  const input = useRef<HTMLInputElement>(null!);
  const onSubmit: FormEventHandler = e=>{
    e.preventDefault();
    logs.add(input.current.value);
  };
  return <>
    <form onSubmit={onSubmit}>
      <input ref={input} />
      <button>送信</button>
    </form>
    <div>
      {logs.getLogs().map(
        (log, index)=><div key={index}>{log}</div>        
      )}
    </div>
  </>;
}
