import {Router} from "express";
import {generateTimer} from "../../../commands/generate/timer.js";

const router = Router()

router.post('/', async (req, res) => {
  const {cwd, data} = req.body
  await generateTimer({cwd, data})
  return res.status(200).send()
})

export default router
