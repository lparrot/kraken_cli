import {Router} from "express";
import {normalize} from "path";

const router = Router()

router.get('/path/normalize', (req, res, next) => {
  const {path} = req.query as unknown as { path: string }

  return res.json(normalize(path))
})

export default router
