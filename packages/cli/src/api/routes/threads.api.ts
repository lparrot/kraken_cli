import {Router} from "express";
import {threads} from "../../state.js";

const router = Router()

router.get('/', (req, res) => {
  return res.json(threads)
})

export default router
