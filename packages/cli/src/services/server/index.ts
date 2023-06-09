import cors from 'cors'
import express from 'express'
import {ApiController} from "./api/api.js";
import {config} from "../config.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";

export function createServer(options = {port: config.API_PORT}) {
  const app = express()

  const www = path.resolve(dirname(fileURLToPath(import.meta.url)), '..', 'www')

  app.use(express.json())

  app.use(express.static(www))

  app.use(cors())

  app.use('/api', ApiController)

  const server = app.listen(options.port, () => {
    // logger('success', `Accès au serveur : http://localhost:${options.port}`)
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
