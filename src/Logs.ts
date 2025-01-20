import { GetState, SetState, Share, ShareClass } from "./madoi/madoi";

@ShareClass({className: "Logs"})
export class Logs{
  private logs: string[] = [];
  @Share()
  add(log: string){
    this.logs = [...this.logs, log];
  }
  @GetState()
  getLogs(){
    return this.logs;
  }
  @SetState()
  setLogs(logs: string[]){
    this.logs = logs;
  }
}
