import {Router} from "express";
import {normalize} from "path";
import {Project} from "../../../db/index.js";

const meta = {
  url: '/api/projects',
  router: Router()
}

meta.router.get('/', async (req, res) => {
  return res.json({projects: await Project.findAll()})
})

meta.router.post('/', async (req, res) => {
  const {name, path} = req.body

  const projects = await Project.findAll({where: {path: normalize(path)}})

  if (projects.length > 0) {
    return res.status(400).json({message: 'Project déjà enregistré'})
  }

  await Project.create({name, path: normalize(path)})
  return res.json({projects: await Project.findAll()})
})

export default meta
