import { Navigator } from '../src'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const server = setupServer()

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => server.resetHandlers())

describe('navigator', () => {
  test('status is 200 when discovering endpoint succeeds', async () => {
    const url = 'https://example.com'
    server.use(http.get(url, () => HttpResponse.json({})))

    const navigator = await Navigator.discover(url)

    expect(navigator.status).toBe(200)
  })

  test('status is status from response when service returns client or server error', async () => {
    const statusCode = faker.internet.httpStatusCode({
      types: ['clientError', 'serverError'],
    })
    const url = 'https://example.com'
    server.use(
      http.get(url, () => HttpResponse.json({}, { status: statusCode })),
    )

    const navigator = await Navigator.discover(url)

    expect(navigator.status).toBe(statusCode)
  })
})
