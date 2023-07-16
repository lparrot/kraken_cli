import {ChildProcess} from "child_process";
import {io} from "../api/index.js";

export class Thread {
  thread: ChildProcess;
  name: string;
  stdout: string[] = []
  stderr: string[] = []

  state: boolean

  constructor(name: string, thread: ChildProcess) {
    this.name = name;
    this.thread = thread;
    this.state = true

    thread.stdout?.on('data', (data: string) => {
      io.emit('thread', this)
      this.stdout.push(data)
    })

    thread.stderr?.on('data', (data: string) => {
      this.stderr.push(data)
    })

    thread.on('close', code => {
      this.state = false
    })

    thread.on('exit', code => {
      this.state = false
    })
  }
}
