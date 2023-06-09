import {Router} from 'express'

export const ApiController = Router()

ApiController.get('/', (req, res) => {
  return res.status(200).json({success: true})
})
