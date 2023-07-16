import {Router} from "express";
import {generateReferentiel} from "../../../commands/generate/ref.js";

const router = Router()

router.post('/', async (req, res) => {
  const {cwd, ...data} = req.body

  await generateReferentiel({cwd, data})

  return res.status(200).send()
})

export default router
