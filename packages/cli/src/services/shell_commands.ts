import shell from "shelljs";
import {ChildProcess} from "child_process";

export function gitInit(cwd: string) {
  return executeCommand('git init', cwd)
}

export function gitAdd(cwd: string) {
  return executeCommand('git add -A', cwd)
}

export function gitCommit(cwd: string, message: string = "commit") {
  return executeCommand(`git commit -m "${message}`, cwd)
}

export async function installMavenLibraries(cwd: string) {
  return executeCommand('mvn dependency:resolve', cwd)
}

export async function installNpmLibraries(cwd: string) {
  return executeCommand('npm install', cwd)
}

export function executeCommand(command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    let result: ChildProcess | undefined

    try {
      result = shell.exec(command, {silent: true, cwd}, (code, stdout, stderr) => {
        if (code === 0) {
          return resolve(stdout)
        } else {
          return reject(`Erreur lors de l'execution de la commande ${command}`)
        }
      });
    } catch (err) {
      return reject(err)
    }
  })
}
