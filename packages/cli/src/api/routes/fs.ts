import {Router} from 'express'
// @ts-ignore
import selectFolder from 'win-select-folder'
import path from "path";
import {body} from "express-validator";

const meta = {
  url: '/api/fs',
  router: Router()
}

meta.router.get('/folder', async (req, res) => {
  const folder = await selectFolder({
    root: 'MyComputer',
    description: 'Selectionnez un dossier où sera créé le projet Kraken par la suite'
  })
  return res.json(folder === 'cancelled' ? null : folder + path.sep)
})

meta.router.put('/cwd', body('path').notEmpty({ignore_whitespace: true}), async (req, res) => {
  const cwd = req.body.path
  process.chdir(cwd)
  return res.status(200).send()
})

export default meta
