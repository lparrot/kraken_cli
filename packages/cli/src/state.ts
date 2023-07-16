import {Thread} from "./dto/thread.js";

export let threads: Thread[] = []

export function getThreadByName(name: string) {
  const threadsByName = threads.filter(it => it.name === name)
  return threadsByName.length > 0 ? threadsByName[0] : null
}

export function getThreadByPid(pid: string | number) {
  const threadsByPid = threads.filter(it => it.thread.pid === pid)
  return threadsByPid.length > 0 ? threadsByPid[0] : null
}
