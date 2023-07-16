import dotenv from 'dotenv'
import {isBlank} from "./utils/string.js";
import {createServer, thread} from "./api/index.js";

dotenv.config()

await createServer({web: false, cwd: isBlank(process.env.EXPRESS_DEV_CWD) ? null : process.env.EXPRESS_DEV_CWD})

process.on('beforeExit', code => {
  thread?.kill()
})
