import {Router} from "express";
import {normalize} from "path";
import {Project} from "../../db/index.js";

const meta = {
  url: '/api/projects',
  router: Router()
}

meta.router.get('/', async (req, res) => {
  return res.json(await Project.findAll())
})

meta.router.get('/:id', async (req, res) => {
  const id = req.params.id
  return res.json(await Project.findByPk(id))
})

meta.router.post('/', async (req, res) => {
  const {name, path} = req.body

  const projects = await Project.findAll({where: {path: normalize(path)}})

  if (projects.length > 0) {
    return res.status(400).json({message: 'Project déjà enregistré'})
  }

  await Project.create({name, path: normalize(path)})
  return res.json(await Project.findAll())
})

meta.router.delete('/:id', async (req, res) => {
  await Project.destroy({
    where: {
      id: req.params.id
    }
  })
  return res.status(200).send()
})

export default meta
