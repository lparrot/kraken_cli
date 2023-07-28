import {Inject, Injectable} from "@nestjs/common";
import * as child_process from "child_process";
import {ProjectProvider} from "./project.provider";
import {ParsedItem} from "node-netstat";
import {WebsocketProvider} from "src/app/websocket.provider";
import {AppProvider} from "src/app/app.provider";
import {InjectorProvider} from "src/services/injector.provider";

const shell = require('shelljs')
const Convert = require('ansi-to-html');

@Injectable()
export class ShellCommandsProvider {

    @Inject(ProjectProvider) projectProvider: ProjectProvider;

    websocketProvider?: WebsocketProvider;
    appProvider?: AppProvider;

    constructor(injectorProvider: InjectorProvider) {
        this.websocketProvider = injectorProvider.getProvider(WebsocketProvider);
        this.appProvider = injectorProvider.getProvider(AppProvider);
    }

    getVersions() {
        const is_node_installed = shell.which('node') != null
        const is_mvn_installed = shell.which('mvn') != null
        const last_npm_version = shell.exec('npm view @socle/core version', {silent: true}).replace(/[\n\r]+/g, '')
        const node_version = shell.exec('node -v', {silent: true}).stdout.replace(/[\n\r]+/g, '')

        return {
            is_node_installed,
            is_mvn_installed,
            last_npm_version,
            node_version
        }
    }

    async gitInit(cwd: string, check = false) {
        if (!check || shell.which("git") != null) {
            return this.executeCommand('git init', cwd)
        }
    }

    async gitAdd(cwd: string, check = false) {
        if (!check || shell.which("git") != null) {
            return this.executeCommand('git add -A', cwd)
        }
    }

    async gitCommit(cwd: string, message: string = "commit", check = false) {
        if (!check || shell.which("git") != null) {
            return this.executeCommand(`git commit -m "${message}`, cwd)
        }
    }

    async installMavenLibraries(cwd: string, check = false) {
        if (!check || shell.which("mvn") != null) {
            return this.executeCommand('mvn dependency:resolve', cwd)
        }
    }

    async installNpmLibraries(cwd: string, check = false) {
        if (!check || shell.which("npm") != null) {
            return this.executeCommand('npm install', cwd)
        }
    }

    async runApplication(cwd: string, profile = 'default', check = false) {
        this.appProvider?.clearLogs()

        if (!check || (shell.which("mvn") != null && shell.which("npm") != null)) {
            const paths = this.projectProvider.getProjectPaths(cwd)
            const appdata = await this.projectProvider.getAppdata(cwd)

            const netstat = require('node-netstat')
            let processes: ParsedItem[]

            netstat({sync: true, filter: {local: {port: appdata?.port}}}, (item: any) => {
                processes = item
            });

            if (processes != null && processes.length > 0) {
                try {
                    process.kill(processes[0].pid, 0)
                } catch (err) {
                    //
                }
            }

            const mvn = child_process.spawn(`mvn clean spring-boot:run -q -Dspring-boot.run.arguments="--spring.output.ansi.enabled=always --spring.profiles.active=${profile}"`, {cwd: paths?.server_root_path, shell: true})
            const npm = child_process.spawn('npm run dev', {cwd: paths?.web_root_path, shell: true})

            mvn.stdout.setEncoding('latin1')
            npm.stdout.setEncoding('latin1')

            this.appProvider?.addThread('mvn', mvn)
            this.appProvider?.addThread('npm', npm)

            if (this.websocketProvider != null) {
                const convert = new Convert({fg: '#000'})
                mvn.stdout.on('data', data => {
                    this.appProvider?.addLog(convert.toHtml(data.toString()))
                })

                npm.stdout.on('data', data => {
                    this.appProvider?.addLog(convert.toHtml(data.toString()))
                })
            }
        }
    }

    executeCommand(command: string, cwd: string) {
        return new Promise((resolve, reject) => {
            let result: child_process.ChildProcess | undefined

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
}
