import dotenv from 'dotenv'
import {createServer} from "./services/server/index.js";
import {isBlank} from "./utils/string.js";

dotenv.config()

await createServer({web: false, cwd: isBlank(process.env.EXPRESS_DEV_CWD) ? null : process.env.EXPRESS_DEV_CWD})
