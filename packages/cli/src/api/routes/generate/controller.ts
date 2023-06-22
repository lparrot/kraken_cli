import {Router} from "express";
import {generateControlleur} from "../../../commands/generate/controller.js";

const router = Router()

router.post('/', async (req, res) => {
  const {cwd, ...data} = req.body as unknown as { cwd: string, name: string, url: string }

  await generateControlleur({cwd, data})

  return res.status(200).send()
})

export default router
