import {Router} from "express";
import {generatePage} from "../../../commands/generate/page.js";

const router = Router()

router.post('/', async (req, res) => {
  const {cwd, name, title} = req.body
  await generatePage({
    cwd,
    data: {
      name,
      title
    }
  })
  return res.status(200).json({success: true})
})

export default router
