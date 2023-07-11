import { Router } from "express";
import { request } from "http";

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({message: "Hello"})
})

export default routes
