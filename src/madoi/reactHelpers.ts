import { useEffect, useRef, useState } from "react";
import { GetState, Madoi, SetState, Share, ShareClass } from "./madoi";

type Factory<T> = ()=>T;
type ValueOrFactory<T> = T | Factory<T>;
function getValue<T>(vof: ValueOrFactory<T>): T{
  if(typeof vof === "function"){
    return (vof as Factory<T>)();
  }
  return vof;
}

type Function<T> = (perv: T)=>T;
type ValueOrFunction<T> = T | Function<T>;
function getOrApplyValue<T>(prev: T, vof: ValueOrFunction<T>){
  if(typeof vof === "function"){
    return (vof as Function<T>)(prev);
  }
  return vof;
}

@ShareClass({className: "State"})
class State<T>{
  constructor(private state: T){
  }

  @Share()
  updateState(value: T){
    this.state = value;
  }

  @SetState()
  setState(value: T){
    this.state = value;
  }

  @GetState()
  getState(){
    return this.state;
  }
}

export function useMadoiState<T>(madoi: Madoi, initial: ValueOrFactory<T>): [T, (v: ValueOrFunction<T>)=>void]{
  const initialValue = useRef<T>(null!);
  const target = useRef<State<T>>(null!);
  const [_state, setState] = useState<any>();

  if(initialValue.current === null){
    initialValue.current = getValue(initial);
  }

  const rerenderOnStateChange = true;
  useEffect(()=>{
    if(target.current !== null) return;
    const obj = new State(initialValue.current) as any;
    target.current = obj;
    let getStateMethod = null;
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["getState"]){
        getStateMethod = obj[p];
      }
    }
    if(getStateMethod == null){
      throw new Error(`${typeof obj} must declare @GetState method.`);
    }
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["share"]){
        const shareMethod = obj[p];
        const f = function(){
          shareMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      } else if(cfg["setState"]){
        const setStateMethod = obj[p];
        const f = function(){
          setStateMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      }
    }
    madoi.register(obj);
    setState(getStateMethod.apply(obj));
  }, []);

  return [target.current?.getState() || initialValue.current,
    (vof: ValueOrFunction<T>)=>{target.current?.updateState(
      getOrApplyValue(target.current?.getState(), vof))}];
}

export function useMadoiObject<T>(madoi: Madoi, obj: ValueOrFactory<T>, rerenderOnStateChange = true): T {
  const target = useRef<T>(null!);
  const registered = useRef(false);
  const [_state, setState] = useState<any>();

  if(target.current === null){
    target.current = getValue(obj);
  }

  useEffect(()=>{
    if(registered.current) return;
    const obj = target.current as any;
    let getStateMethod = null;
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["getState"]){
        getStateMethod = obj[p];
      }
    }
    if(getStateMethod == null){
      throw new Error(`${typeof obj} must declare @GetState method.`);
    }
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["share"]){
        const shareMethod = obj[p];
        const f = function(){
          shareMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      } else if(cfg["setState"]){
        const setStateMethod = obj[p];
        const f = function(){
          setStateMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      }
    }
    madoi.register(obj);
    registered.current = true;
    setState(getStateMethod.apply(obj));
  }, []);

  return target.current;
}
