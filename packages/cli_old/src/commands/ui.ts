import {Argv as YargsOptions} from "yargs";
import shell from "shelljs";
import {config} from "../config.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {createServer} from "../api/index.js";

const ui_server_path = path.resolve(dirname(fileURLToPath(import.meta.url)), '..', 'www', 'server')

export default {
  command: 'ui',
  description: 'Ouvre une interface utilisateur dans le navigateur',
  builder(yargs: YargsOptions) {
    yargs.option('open', {alias: 'o', describe: `Ouvre directement le navigateur`, type: 'string'})
  },
  async handler(options: any) {
    await createServer()

    shell.exec(`node ${path.join(ui_server_path, 'index.mjs')}`, {
      async: true, env: {
        API_PORT: config.API_PORT.toString(),
        NITRO_PORT: config.NUXT_PORT.toString(),
        NITRO_HOST: 'localhost',
        NITRO_SHUTDOWN: 'true',
        NITRO_SHUTDOWN_FORCE: 'false',
        ...process.env
      }
    })

    if (options['o'] != null) {
      shell.exec(`start http://localhost:${config.NUXT_PORT}`)
    }
  }
}
