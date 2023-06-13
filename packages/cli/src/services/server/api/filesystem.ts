import {Router} from 'express'
// @ts-ignore
import selectFolder from 'win-select-folder'
import path from "path";

const meta = {
  url: '/api/fs',
  router: Router()
}

meta.router.get('/home', async (req, res) => {
  const folder = await selectFolder({
    root: 'MyComputer',
    description: 'Selectionnez un dossier où sera créé le projet Kraken par la suite'
  })
  return res.json({folder: folder === 'cancelled' ? null : folder + path.sep})
})

export default meta
