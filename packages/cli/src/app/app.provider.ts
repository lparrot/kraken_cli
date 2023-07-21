import {Inject, Injectable} from "@nestjs/common";
import {WebsocketProvider} from "src/app/websocket.provider";
import * as child_process from "child_process";

@Injectable()
export class AppProvider {
  @Inject(WebsocketProvider) websocketProvider: WebsocketProvider;

  logs: string[] = []
  threads: Map<string, child_process.ChildProcess> = new Map()

  addLog(log: string) {
    this.logs.push(log)
    this.websocketProvider.emit('log:message', {})
  }

  clearLogs() {
    this.logs = []
    this.websocketProvider.emit('log:message', {})
  }

  addThread(name: string, thread: child_process.ChildProcess) {
    if (this.threads.has(name)) {
      this.threads.get(name).kill(0);
    }
    this.threads.set(name, thread)
  }
}
