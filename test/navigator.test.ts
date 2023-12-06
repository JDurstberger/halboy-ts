import { Navigator } from '../src'
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'
import { randomProperty } from './data'
import { MockServer } from './server'

const server = new MockServer()

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => server.resetHandlers())

describe('navigator', () => {
  describe('discover', () => {
    test('passes headers when discovering endpoint', async () => {
      const url = 'https://example.com'
      const headerKey = faker.lorem.word()
      const headerValue = faker.lorem.word()
      const headers = { [headerKey]: headerValue }
      server.use(http.get(url, () => HttpResponse.json({})))

      await Navigator.discover(url, { headers })

      expect(server.recordedRequests).toHaveLength(1)
      expect(server.recordedRequests[0].headers.get(headerKey)).toStrictEqual(
        headerValue,
      )
    })

    test('status is 200 when discovering endpoint succeeds', async () => {
      const url = 'https://example.com'
      server.use(http.get(url, () => HttpResponse.json({})))

      const navigator = await Navigator.discover(url)

      expect(navigator.status).toBe(200)
    })

    test('resource is empty resource when discovering endpoint returns empty json object', async () => {
      const url = 'https://example.com'
      const resource = {}
      server.use(http.get(url, () => HttpResponse.json(resource)))

      const navigator = await Navigator.discover(url)

      expect(navigator.status).toBe(200)
      expect(navigator.resource.toObject()).toStrictEqual(resource)
    })

    test('resource has property when discovering endpoint succeeds with json with property', async () => {
      const key = faker.lorem.word()
      const value = randomProperty()
      const url = 'https://example.com'
      const resource = { [key]: value }
      server.use(http.get(url, () => HttpResponse.json(resource)))

      const navigator = await Navigator.discover(url)

      expect(navigator.status).toBe(200)
      expect(navigator.resource.getProperty(key)).toStrictEqual(value)
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

  describe('get', () => {
    test('status is 200 when getting relation succeeds', async () => {
      const relation = faker.lorem.word()
      const url = 'https://example.com'
      const linkUrl = 'https://example.com/somethings/123'
      const resource = {
        _links: {
          [relation]: { href: linkUrl },
        },
      }
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(http.get(linkUrl, () => HttpResponse.json({})))
      const discoveryNavigator = await Navigator.discover(url)

      const navigator = await discoveryNavigator.get(relation)

      expect(navigator.status).toBe(200)
    })

    test('status is status from response when getting relation returns client or server error', async () => {
      const relation = faker.lorem.word()
      const url = 'https://example.com'
      const linkUrl = 'https://example.com/somethings/123'
      const resource = {
        _links: {
          [relation]: { href: linkUrl },
        },
      }
      const statusCode = faker.internet.httpStatusCode({
        types: ['clientError', 'serverError'],
      })
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(
        http.get(linkUrl, () => HttpResponse.json({}, { status: statusCode })),
      )
      const discoveryNavigator = await Navigator.discover(url)

      const navigator = await discoveryNavigator.get(relation)

      expect(navigator.status).toBe(statusCode)
    })

    test('linked resource has property when getting relation succeeds with json with property', async () => {
      const relation = faker.lorem.word()
      const url = 'https://example.com'
      const linkUrl = 'https://example.com/somethings/123'
      const resource = {
        _links: {
          [relation]: { href: linkUrl },
        },
      }
      const key = faker.lorem.word()
      const value = randomProperty()
      const linkedResource = { [key]: value }
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(http.get(linkUrl, () => HttpResponse.json(linkedResource)))
      const discoveryNavigator = await Navigator.discover(url)

      const navigator = await discoveryNavigator.get(relation)

      expect(navigator.resource.getProperty(key)).toStrictEqual(value)
    })

    test('throws when attempting to get link that does not exist on resource', async () => {
      const relation = 'non-existent-relation'
      const url = 'https://example.com'
      server.use(http.get(url, () => HttpResponse.json({})))
      const navigator = await Navigator.discover(url)

      const action = async () => await navigator.get(relation)

      expect(action).rejects.toThrow(
        `Link with relation '${relation}' does not exist on resource.`,
      )
    })
  })
})
