import { Hono } from 'hono'
import { router } from './app/router.ts'

const app = new Hono()

// fetch-router に全リクエストを委譲
app.all('*', async (c) => {
  try {
    return await router.fetch(c.req.raw)
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
})

export default app;
