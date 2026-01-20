import { createRouter } from '@remix-run/fetch-router'
import { routes } from './routes.ts'
import { assets } from './public.ts'
import { Home } from './Home.tsx'
import { JsonPage } from './json.tsx'

export const router = createRouter()

router.get(routes.assets, assets)
router.get(routes.home, Home)
router.get(routes.json, JsonPage)
