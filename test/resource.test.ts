import { faker } from '@faker-js/faker'
import { Resource } from '../src'
import { randomProperty } from './data'

describe('HAL Resource', () => {
  test('adding to a resource does not mutate old resource', () => {
    const resource1 = Resource.create()
    const resource2 = resource1
      .addLink('2', 'link')
      .addProperty('2', 'property')
    const resource3 = resource1
      .addLink('3', 'link')
      .addProperty('3', 'property')

    const resource1Json = resource1.toJson()
    const resource2Json = resource2.toJson()
    const resource3Json = resource3.toJson()

    expect(resource1Json).not.toStrictEqual(resource2Json)
    expect(resource1Json).not.toStrictEqual(resource3Json)
    expect(resource2Json).not.toStrictEqual(resource3Json)
  })

  describe('link', () => {
    test('link does not exists by default', () => {
      const resource = Resource.create()

      const link = resource.getLink('key')

      expect(link).toBeUndefined()
    })

    test('adds self link to resource with create', () => {
      const url = faker.internet.url()

      const resource = Resource.create(url)

      const link = resource.getLink('self')
      expect(link).toStrictEqual({ href: url })
    })

    test('returns link for added link', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()

      const resource = Resource.create().addLink(relation, url)

      const link = resource.getLink(relation)
      expect(link).toStrictEqual({ href: url })
    })

    test('returns href for added link', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()

      const resource = Resource.create().addLink(relation, url)

      const href = resource.getHref(relation)
      expect(href).toBe(url)
    })

    test('can not modify link by modifying returned link', () => {
      const relation = faker.lorem.word()
      const originalUrl = faker.internet.url()
      const resource = Resource.create().addLink(relation, originalUrl)

      resource.getLink(relation).href = faker.internet.url()

      const link = resource.getLink(relation)
      expect(link).toStrictEqual({ href: originalUrl })
    })
  })

  describe('property', () => {
    test('property does not exist by default', () => {
      const key = faker.lorem.word()
      const resource = Resource.create()

      const property = resource.getProperty(key)

      expect(property).toBeUndefined()
    })

    test('returns value for added property', () => {
      const key = faker.lorem.word()
      const value = randomProperty()
      const resource = Resource.create().addProperty(key, value)

      const property = resource.getProperty(key)

      expect(property).toStrictEqual(value)
    })
  })

  describe('to JSON', () => {
    test('creates empty JSON for new resource', () => {
      const resource = Resource.create()

      const json = resource.toJson()

      expect(json).toStrictEqual({})
    })

    test('creates JSON with _links', () => {
      const relation = 'relation'
      const uri = 'https://example.com'
      const resource = Resource.create().addLink(relation, uri)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _links: {
          relation: { href: uri },
        },
      })
    })

    test('creates JSON with property', () => {
      const key = 'key'
      const value = 'value'
      const resource = Resource.create().addProperty(key, value)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        [key]: value,
      })
    })
  })
})
