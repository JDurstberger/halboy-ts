import { describe, test, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { Navigator } from '../src'
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'
import { randomProperty } from './data'
import { MockServer } from './server'

const server = new MockServer()

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => server.reset())

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
      expect(JSON.stringify(navigator.resource.getProperty(key))).toStrictEqual(
        JSON.stringify(value),
      )
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
      server.use(
        http.get(url, () => HttpResponse.json(resource)),
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

      expect(JSON.stringify(navigator.resource.getProperty(key))).toStrictEqual(
        JSON.stringify(value),
      )
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

    test('returns discovery error and does not attempt get when discovery fails before get', async () => {
      const relation = 'non-existent-relation'
      const url = 'https://example.com'
      server.use(http.get(url, () => HttpResponse.json({}, { status: 500 })))

      const navigator = await Navigator.discover(url).then((navigator) =>
        navigator.get(relation),
      )

      expect(navigator.status).toBe(500)
    })

    test('carries headers from discovery over to get call', async () => {
      const relation = faker.lorem.word()
      const url = 'https://example.com'
      const linkUrl = 'https://example.com/somethings/123'
      const resource = {
        _links: {
          [relation]: { href: linkUrl },
        },
      }
      const headerKey = faker.lorem.word()
      const headerValue = faker.lorem.word()
      const headers = { [headerKey]: headerValue }
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(http.get(linkUrl, () => HttpResponse.json({})))

      await Navigator.discover(url, { headers }).then((n) => n.get(relation))

      expect(server.recordedRequests).toHaveLength(2)
      expect(server.recordedRequests[1].headers.get(headerKey)).toStrictEqual(
        headerValue,
      )
    })
  })

  describe('post', () => {
    test('status is 201 when posting to relation succeeds', async () => {
      const relation = 'createThing'
      const url = 'https://example.com'
      const createThingUrl = 'https://example.com/somethings/'
      const resource = {
        _links: {
          [relation]: { href: createThingUrl },
        },
      }
      const body = { name: faker.lorem.word() }
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(
        http.post(createThingUrl, () => HttpResponse.json({}, { status: 201 })),
      )

      const navigator = await Navigator.discover(url).then((navigator) =>
        navigator.post(relation, body),
      )

      const createRequest = server.recordedRequests[1]
      expect(server.recordedRequests).toHaveLength(2)
      expect(navigator.status).toBe(201)
      expect(createRequest.method).toBe('POST')
    })

    test('status is status from response when posting to relation returns client or server error', async () => {
      const relation = 'createThing'
      const url = 'https://example.com'
      const createThingUrl = 'https://example.com/somethings/'
      const resource = {
        _links: {
          [relation]: { href: createThingUrl },
        },
      }
      const statusCode = faker.internet.httpStatusCode({
        types: ['clientError', 'serverError'],
      })
      server.use(
        http.get(url, () => HttpResponse.json(resource)),
        http.post(createThingUrl, () =>
          HttpResponse.json({}, { status: statusCode }),
        ),
      )

      const navigator = await Navigator.discover(url).then((navigator) =>
        navigator.post(relation, {}),
      )

      expect(navigator.status).toBe(statusCode)
    })

    test('throws when attempting to post to relation that does not exist on resource', async () => {
      const relation = 'non-existent-relation'
      const url = 'https://example.com'
      server.use(http.get(url, () => HttpResponse.json({})))
      const navigator = await Navigator.discover(url)

      const action = async () => await navigator.post(relation, {})

      expect(action).rejects.toThrow(
        `Link with relation '${relation}' does not exist on resource.`,
      )
    })

    test('returns discovery error and does not attempt get when discovery fails before post', async () => {
      const relation = 'non-existent-relation'
      const url = 'https://example.com'
      server.use(http.get(url, () => HttpResponse.json({}, { status: 500 })))

      const navigator = await Navigator.discover(url).then((navigator) =>
        navigator.post(relation, {}),
      )

      expect(navigator.status).toBe(500)
    })

    test('carries headers from discovery over to post call', async () => {
      const relation = faker.lorem.word()
      const url = 'https://example.com'
      const linkUrl = 'https://example.com/somethings/123'
      const resource = {
        _links: {
          [relation]: { href: linkUrl },
        },
      }
      const headerKey = faker.lorem.word()
      const headerValue = faker.lorem.word()
      const headers = { [headerKey]: headerValue }
      server.use(http.get(url, () => HttpResponse.json(resource)))
      server.use(http.post(linkUrl, () => HttpResponse.json({})))

      await Navigator.discover(url, { headers }).then((n) =>
        n.post(relation, {}),
      )

      expect(server.recordedRequests).toHaveLength(2)
      expect(server.recordedRequests[1].headers.get(headerKey)).toStrictEqual(
        headerValue,
      )
    })
  })
})
