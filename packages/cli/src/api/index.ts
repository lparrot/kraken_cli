import cors from 'cors'
import express from 'express'
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {UnknownRoutesHandler} from "./middlewares/unknownRoutes.handler.js";
import {ExceptionsHandler} from "./middlewares/exceptions.handler.js";
import {logger} from "../utils/logger.js";
import {config} from '../config.js'
import {db} from "../db/index.js";
import {getModules} from "../utils/folders.js";

const www = path.resolve(dirname(fileURLToPath(import.meta.url)), '..', 'www')

interface ServerOptions {
  port: number
  web: boolean
  cwd: string | null
}

export async function createServer(options: Partial<ServerOptions> = {}) {
  try {
    await db.authenticate()
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }

  options = Object.assign({}, {port: config.API_PORT, web: true}, options)

  if (options.cwd != null) {
    try {
      process.chdir(options.cwd)
      logger('success', 'Positionnement dans le dossier ' + options.cwd)
    } catch (err) {
      logger('error', 'Erreur lors du positionnement dans le dossier ' + options.cwd)
    }
  }

  /**
   * On créé une nouvelle "application" express
   */
  const app = express()

  if (options.web) {
    app.use(express.static(www))
  }

  /**
   * On dit à Express que l'on souhaite parser le body des requêtes en JSON
   * @example app.post('/', (req) => req.body.prop)
   */
  app.use(express.json())

  /**
   * On dit à Express que l'on souhaite autoriser tous les noms de domaines
   * à faire des requêtes sur notre API.
   */
  app.use(cors())
  app.options('*', cors())

  await getModules('routes/*.js', (module: any) => {
    app.use(module.default.url, module.default.router)
  })

  /**
   * Pour toutes les autres routes non définies, on retourne une erreur
   */
  app.all('*', UnknownRoutesHandler)

  /**
   * Gestion des erreurs
   * /!\ Cela doit être le dernier `app.use`
   */
  app.use(ExceptionsHandler)

  const server = app.listen(options.port, () => {
    logger('success', `Accès au serveur : http://localhost:${options.port}`)
  })

  for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => {
      console.info(`${signal} signal received.`);
      console.log("Closing http server.");
      server.close((err) => {
        console.log("Http server closed.");
        process.exit(err ? 1 : 0);
      });
    });
}
