import 'express-async-errors'

import cors from 'cors'
import express from 'express'
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {UnknownRoutesHandler} from "./middlewares/unknownRoutes.handler.js";
import {ExceptionsHandler} from "./middlewares/exceptions.handler.js";
import {logger} from "../utils/logger.js";
import {config} from '../config.js'
import * as http from "http";
import {Server, Socket} from "socket.io";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "@kraken/types";
import {ChildProcess} from "child_process";
import {initDb} from "../db/index.js";
import {initState} from "../state.js";

const www = path.resolve(dirname(fileURLToPath(import.meta.url)), '..', 'www')
export let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export let socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export let thread: ChildProcess | undefined = undefined


export function setThread(_thread?: ChildProcess) {
  thread = _thread
}

interface ServerOptions {
  port: number
  web: boolean
  cwd: string | null
}

export async function createServer(options: Partial<ServerOptions> = {}) {
  await initDb()
  await initState()

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

  app.use(function (req, res, next) {
    if (/.*\.js/.test(req.path)) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
  });

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

  app.use('/api', (await import('./routes/index.js')).default)
  app.use('/api/shell', (await import('./routes/shell.api.js')).default)
  app.use('/api/projects', (await import('./routes/projects.api.js')).default)
  app.use('/api/fs', (await import('./routes/fs.api.js')).default)
  app.use('/api/generate/init', (await import('./routes/generate/generate-init.api.js')).default)
  app.use('/api/generate/page', (await import('./routes/generate/generate-page.api.js')).default)
  app.use('/api/generate/store', (await import('./routes/generate/generate-store.api.js')).default)
  app.use('/api/generate/timer', (await import('./routes/generate/generate-timer.api.js')).default)
  app.use('/api/generate/controller', (await import('./routes/generate/generate-controller.api.js')).default)
  app.use('/api/generate/ref', (await import('./routes/generate/generate-ref.api.js')).default)
  app.use('/api/utils', (await import('./routes/utils.api.js')).default)

  /**
   * Pour toutes les autres routes non définies, on retourne une erreur
   */
  app.all('*', UnknownRoutesHandler)

  /**
   * Gestion des erreurs
   * /!\ Cela doit être le dernier `app.use`
   */
  app.use(ExceptionsHandler)

  const server = http.createServer(app)
  io = new Server(server, {cors: {origin: '*'},})

  io.on('connection', (args: Socket) => {
    // connect
    socket = args
    socket.on('disconnect', () => {
      // disconnect
    })
  });

  server.listen(options.port, () => {
    logger('success', `API : http://localhost:${options.port}`)
  })

  for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => {
      logger('success', "Coupure du serveur en cours ...");
      // console.info(`${signal} signal received.`);
      // console.log("Closing http server.");
      server.close((err) => {
        logger('success', "Accès à l'API: Coupé");
        process.exit(err ? 1 : 0);
      });
    });
}
