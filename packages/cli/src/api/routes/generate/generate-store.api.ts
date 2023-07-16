import {Router} from "express";
import {generateStore} from "../../../commands/generate/store.js";

const router = Router()

router.post('/', async (req, res) => {
  const {cwd, name} = req.body
  await generateStore({
    cwd,
    data: {
      filename: name
    }
  })
  return res.status(200).json({success: true})
})

export default router
