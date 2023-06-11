import {Router} from 'express'
import {get_project_paths} from "../../../utils/folders.js";
import {generatePage} from "../../../commands/generate/page.js";

export const GenerateController = Router()

GenerateController.post('/page', async (req, res) => {
  let project_paths = get_project_paths();

  await generatePage({targetPath: project_paths?.web_pages_path!, data: req.body})

  return res.status(200).json({success: true})
})
