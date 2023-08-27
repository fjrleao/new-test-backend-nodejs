import { Router } from 'express'
import { testCatalog } from '../controllers/catalog.routes'

const catalogRoutes = Router()

catalogRoutes.get('/:owner', testCatalog)

export default catalogRoutes
