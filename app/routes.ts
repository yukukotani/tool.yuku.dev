import { route } from '@remix-run/fetch-router'

export const routes = route({
  assets: '/assets/*path',
  home: '/',
  json: '/json',
})
