import shell from "shelljs";
import {ChildProcess} from "child_process";

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
