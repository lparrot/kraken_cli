import {Router} from 'express'
import {get_project_paths} from "../../../utils/folders.js";

export const ApiController = Router()

ApiController.get('/paths', (req, res) => {
  return res.status(200).json({...get_project_paths()})
})
