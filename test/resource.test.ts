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

    test('returns links when accessing array of links with getLinks', () => {
      const relation = faker.lorem.word()
      const url1 = faker.internet.url()
      const url2 = faker.internet.url()
      const urls = [url1, url2]

      const resource = Resource.create().addLinks(relation, urls)

      const links = resource.getLinks(relation)
      expect(links).toStrictEqual([{ href: url1 }, { href: url2 }])
    })

    test('throws when accessing array of links with getLink', () => {
      const relation = faker.lorem.word()
      const urls = [faker.internet.url(), faker.internet.url()]

      const resource = Resource.create().addLinks(relation, urls)

      expect(() => resource.getLink(relation)).toThrow(
        `${relation} is an array of links.`,
      )
    })

    test('returns href for added link', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()

      const resource = Resource.create().addLink(relation, url)

      const href = resource.getHref(relation)
      expect(href).toBe(url)
    })

    test('returns hrefs when accessing array of links with getHrefs', () => {
      const relation = faker.lorem.word()
      const urls = [faker.internet.url(), faker.internet.url()]

      const resource = Resource.create().addLinks(relation, urls)

      const hrefs = resource.getHrefs(relation)
      expect(hrefs).toStrictEqual(urls)
    })

    test('throws when accessing array of links with getHref', () => {
      const relation = faker.lorem.word()
      const urls = [faker.internet.url(), faker.internet.url()]

      const resource = Resource.create().addLinks(relation, urls)

      expect(() => resource.getHref(relation)).toThrow(
        `${relation} is an array of links.`,
      )
    })

    test('throws when accessing link with getHrefs', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()

      const resource = Resource.create().addLink(relation, url)

      expect(() => resource.getHrefs(relation)).toThrow(
        `${relation} is not an array of links.`,
      )
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

  describe('embedded resource', () => {
    test('embedded resource does not exist by default', () => {
      const key = faker.lorem.word()
      const resource = Resource.create()

      const embeddedResource = resource.getResource(key)

      expect(embeddedResource).toBeUndefined()
    })

    test('returns resource for added resource', () => {
      const key = faker.lorem.word()
      const expectedEmbeddedResource = Resource.create(faker.internet.url())

      const resource = Resource.create().addResource(
        key,
        expectedEmbeddedResource,
      )

      const embeddedResource = resource.getResource(key)
      expect(embeddedResource.toJson()).toStrictEqual(
        expectedEmbeddedResource.toJson(),
      )
    })
  })

  describe('to JSON', () => {
    test('creates empty JSON for new resource', () => {
      const resource = Resource.create()

      const json = resource.toJson()

      expect(json).toStrictEqual({})
    })

    test('creates JSON with link in _links', () => {
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

    test('creates JSON with link array in _links', () => {
      const relation = 'relation'
      const uri = 'https://example.com'
      const resource = Resource.create().addLinks(relation, [uri, uri])

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _links: {
          relation: [{ href: uri }, { href: uri }],
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

    test('creates JSON with embeddedResource', () => {
      const key = 'key'
      const embeddedResource = Resource.create(faker.internet.url())
      const resource = Resource.create().addResource('key', embeddedResource)

      const json = resource.toJson()

      expect(json).toStrictEqual({
        _embedded: {
          [key]: embeddedResource.toJson(),
        },
      })
    })
  })
})
