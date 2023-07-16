import shell from "shelljs";
import {ChildProcess} from "child_process";
import {get_project_paths} from "../utils/folders.js";
import {getAppdata} from "./app.js";
import psList from 'ps-list'

export async function gitInit(cwd: string, check = false) {
  if (!check || shell.which("git") != null) {
    return executeCommand('git init', cwd)
  }
}

export async function gitAdd(cwd: string, check = false) {
  if (!check || shell.which("git") != null) {
    return executeCommand('git add -A', cwd)
  }
}

export async function gitCommit(cwd: string, message: string = "commit", check = false) {
  if (!check || shell.which("git") != null) {
    return executeCommand(`git commit -m "${message}`, cwd)
  }
}

export async function installMavenLibraries(cwd: string, check = false) {
  if (!check || shell.which("mvn") != null) {
    return executeCommand('mvn dependency:resolve', cwd)
  }
}

export async function installNpmLibraries(cwd: string, check = false) {
  if (!check || shell.which("npm") != null) {
    return executeCommand('npm install', cwd)
  }
}

export async function runApplication(cwd: string, check = false) {
  if (!check || (shell.which("mvn") != null && shell.which("npm") != null)) {
    const paths = get_project_paths(cwd)
    const appdata = await getAppdata(cwd)

    if (appdata?.application_pid != null) {
      // const index = threads.findIndex(it => it.thread.pid === parseInt(appdata?.application_pid))
      // if (index > -1) {
      //   threads.splice(index, 1)
      // }
      const processes = await psList({all: false})
      const appPid = parseInt(appdata?.application_pid!)
      if (processes.findIndex(it => it.pid === appPid)) {
        try {
          process.kill(appPid)
        } catch (err) {
          //
        }
      }
    }

    let result: ChildProcess | undefined

    result = shell.exec('mvn spring-boot:run', {silent: true, cwd: paths?.server_root_path!, async: true})

    await executeCommand('mvn spring-boot:run', paths?.server_root_path!)

    // threads.push(new Thread('run-application', result))
  }
}

export function executeCommand(command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    let result: ChildProcess | undefined

    try {
      result = shell.exec(command, {silent: true, cwd}, (code, stdout, stderr) => {
        if (code === 0) {
          return resolve(stdout)
        } else {
          return reject(`Erreur lors de l'execution de la commande ${command}: ${stderr}`)
        }
      });
    } catch (err) {
      return reject(err)
    }
  })
}
