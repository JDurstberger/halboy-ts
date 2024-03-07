import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { Resource } from '../src'
import { randomProperty } from './data'

describe('HAL Resource', () => {
  test('adding to a resource does not mutate old resource', () => {
    const resource1 = Resource.create()
    const resource2 = resource1
      .addLink('2', 'link')
      .addProperty('2', 'property')
      .addResource('2', Resource.create())
    const resource3 = resource1
      .addLink('3', 'link')
      .addProperty('3', 'property')
      .addResource('2', Resource.create())

    const resource1Json = resource1.toObject()
    const resource2Json = resource2.toObject()
    const resource3Json = resource3.toObject()

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

    test('returns links for batch added links', () => {
      const relation1 = faker.lorem.word()
      const url1 = faker.internet.url()
      const relation2 = faker.lorem.word()
      const url2 = faker.internet.url()

      const resource = Resource.create().batchAddLinks({
        [relation1]: url1,
        [relation2]: url2,
      })

      const link1 = resource.getLink(relation1)
      const link2 = resource.getLink(relation2)
      expect(link1).toStrictEqual({ href: url1 })
      expect(link2).toStrictEqual({ href: url2 })
    })

    test('returns link for added complex link', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()

      const resource = Resource.create().addLink(relation, { href: url })

      const link = resource.getLink(relation)
      expect(link).toStrictEqual({ href: url })
    })

    test('returns links for batch added complex links', () => {
      const relation1 = faker.lorem.word()
      const url1 = faker.internet.url()
      const relation2 = faker.lorem.word()
      const url2 = faker.internet.url()

      const resource = Resource.create().batchAddLinks({
        [relation1]: { href: url1 },
        [relation2]: { href: url2 },
      })

      const link1 = resource.getLink(relation1)
      const link2 = resource.getLink(relation2)
      expect(link1).toStrictEqual({ href: url1 })
      expect(link2).toStrictEqual({ href: url2 })
    })

    test('returns links for added links', () => {
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

      resource.getLink(relation)!.href = faker.internet.url()

      const link = resource.getLink(relation)
      expect(link).toStrictEqual({ href: originalUrl })
    })

    test('has previous links when adding new link', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()
      const relation2 = faker.lorem.word()
      const url2 = faker.internet.url()

      const resource = Resource.create()
        .addLink(relation, url)
        .addLink(relation2, url2)

      const href = resource.getHref(relation)
      const href2 = resource.getHref(relation2)
      expect(href).toBe(url)
      expect(href2).toBe(url2)
    })

    test('has previous links when adding new links', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()
      const relation2 = faker.lorem.word()
      const url2 = faker.internet.url()

      const resource = Resource.create()
        .addLink(relation, url)
        .addLinks(relation2, [url2])

      const href = resource.getHref(relation)
      const hrefs = resource.getHrefs(relation2)
      expect(href).toBe(url)
      expect(hrefs).toStrictEqual([url2])
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

    test('returns value with type for added property', () => {
      const key = faker.lorem.word()
      const value = 'aString'
      const resource = Resource.create().addProperty(key, value)

      const property = resource.getProperty<string>(key)

      expect(property).toStrictEqual(value)
    })

    test('returns values for batch added properties', () => {
      const key1 = faker.lorem.word()
      const value1 = randomProperty()
      const key2 = faker.lorem.word()
      const value2 = randomProperty()
      const resource = Resource.create().batchAddProperties({
        [key1]: value1,
        [key2]: value2,
      })

      const property1 = resource.getProperty(key1)
      const property2 = resource.getProperty(key2)

      expect(property1).toStrictEqual(value1)
      expect(property2).toStrictEqual(value2)
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
      expect(embeddedResource).toStrictEqual(expectedEmbeddedResource)
    })

    test('throws when accessing array of resources with getResource', () => {
      const key = faker.lorem.word()
      const resources = [
        Resource.create(faker.internet.url()),
        Resource.create(faker.internet.url()),
      ]

      const resource = Resource.create().addResources(key, resources)

      expect(() => resource.getResource(key)).toThrow(
        `${key} is an array of resources.`,
      )
    })

    test('returns array of resources for added array of resources', () => {
      const key = faker.lorem.word()
      const embeddedResource1 = Resource.create(faker.internet.url())
      const embeddedResource2 = Resource.create(faker.internet.url())

      const resource = Resource.create().addResources(key, [
        embeddedResource1,
        embeddedResource2,
      ])

      const embeddedResources = resource.getResources(key)
      expect(embeddedResources).toStrictEqual([
        embeddedResource1,
        embeddedResource2,
      ])
    })

    test('throws when accessing resource with getResources', () => {
      const key = faker.lorem.word()
      const embeddedResource = Resource.create(faker.internet.url())

      const resource = Resource.create().addResource(key, embeddedResource)

      expect(() => resource.getResources(key)).toThrow(
        `${key} is not an array of resources.`,
      )
    })
  })

  describe('to object', () => {
    test('creates empty object for new resource', () => {
      const resource = Resource.create()

      const object = resource.toObject()

      expect(object).toStrictEqual({})
    })

    test('creates object with link in _links', () => {
      const relation = 'relation'
      const uri = 'https://example.com'
      const resource = Resource.create().addLink(relation, uri)

      const object = resource.toObject()

      expect(object).toStrictEqual({
        _links: {
          relation: { href: uri },
        },
      })
    })

    test('creates object with link array in _links', () => {
      const relation = 'relation'
      const uri = 'https://example.com'
      const resource = Resource.create().addLinks(relation, [uri, uri])

      const object = resource.toObject()

      expect(object).toStrictEqual({
        _links: {
          relation: [{ href: uri }, { href: uri }],
        },
      })
    })

    test('creates object with property', () => {
      const key = 'key'
      const value = 'value'
      const resource = Resource.create().addProperty(key, value)

      const object = resource.toObject()

      expect(object).toStrictEqual({
        [key]: value,
      })
    })

    test('creates object with embeddedResource', () => {
      const key = 'key'
      const embeddedResource = Resource.create(faker.internet.url())
      const resource = Resource.create().addResource('key', embeddedResource)

      const object = resource.toObject()

      expect(object).toStrictEqual({
        _embedded: {
          [key]: embeddedResource.toObject(),
        },
      })
    })
  })

  describe('from object', () => {
    test('creates empty Resource from empty object', () => {
      const object = {}

      const resource = Resource.fromObject(object)

      expect(resource.toObject()).toStrictEqual(object)
    })

    test('creates Resource with property from object', () => {
      const key = faker.lorem.word()
      const value = randomProperty()
      const object = { [key]: value }

      const resource = Resource.fromObject(object)

      expect(resource.toObject()).toStrictEqual(object)
      expect(resource.getProperty(key)).toStrictEqual(value)
    })

    test('throws when creating Resource with _links not being an object', () => {
      const action = () => Resource.fromObject({ _links: 'not an object' })

      expect(action).toThrow('_links must be an object, but got string')
    })

    test('throws when creating Resource with link that is not Link or array of Links', () => {
      const relation = faker.lorem.word()
      const action = () =>
        Resource.fromObject({
          _links: {
            [relation]: 'abc',
          },
        })

      expect(action).toThrow(
        `Link relation ${relation} must be a link or an array of links, but got string`,
      )
    })

    test('throws when creating Resource with link with href that is not a string', () => {
      const relation = faker.lorem.word()
      const action = () =>
        Resource.fromObject({
          _links: {
            [relation]: { href: 123 },
          },
        })

      expect(action).toThrow(
        `href of relation ${relation} must be a string, but got number`,
      )
    })

    test('throws when creating Resource with link array which does not contain link', () => {
      const relation = faker.lorem.word()
      const action = () =>
        Resource.fromObject({
          _links: {
            [relation]: ['abc'],
          },
        })

      expect(action).toThrow(
        `Item in relation ${relation} must be a link, but got string`,
      )
    })

    test('creates Resource with link from object', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()
      const object = {
        _links: {
          [relation]: { href: url },
        },
      }

      const resource = Resource.fromObject(object)

      expect(resource.toObject()).toStrictEqual(object)
      expect(resource.getHref(relation)).toStrictEqual(url)
    })

    test('does not add _links as property', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()
      const object = {
        _links: {
          [relation]: { href: url },
        },
      }

      const resource = Resource.fromObject(object)

      expect(resource.getProperty('_links')).toBeUndefined()
    })

    test('creates Resource with links from object', () => {
      const relation = faker.lorem.word()
      const url = faker.internet.url()
      const object = {
        _links: {
          [relation]: [{ href: url }],
        },
      }

      const resource = Resource.fromObject(object)

      expect(resource.toObject()).toStrictEqual(object)
      expect(resource.getHrefs(relation)).toStrictEqual([url])
    })

    test('creates Resource with embedded resource from object', () => {
      const embeddedResourceKey = faker.lorem.word()
      const embeddedResourceRelation = faker.lorem.word()
      const embeddedResourceUrl = faker.internet.url()
      const embeddedResourcePropertyKey = faker.lorem.word()
      const embeddedResourcePropertyValue = randomProperty()
      const json = {
        _embedded: {
          [embeddedResourceKey]: {
            [embeddedResourcePropertyKey]: embeddedResourcePropertyValue,
            _links: {
              [embeddedResourceRelation]: { href: embeddedResourceUrl },
            },
          },
        },
      }

      const resource = Resource.fromObject(json)

      const embeddedResource = resource.getResource(embeddedResourceKey)
      expect(resource.toObject()).toStrictEqual(json)
      expect(resource.getProperty('_links')).toBeUndefined()
      expect(resource.getProperty('_embedded')).toBeUndefined()
      expect(embeddedResource!.getHref(embeddedResourceRelation)).toStrictEqual(
        embeddedResourceUrl,
      )
      expect(
        embeddedResource!.getProperty(embeddedResourcePropertyKey),
      ).toStrictEqual(embeddedResourcePropertyValue)
    })

    test('creates Resource with embedded array of resources from object', () => {
      const embeddedResourceKey = faker.lorem.word()
      const embeddedResourcePropertyKey = faker.lorem.word()
      const embeddedResourcePropertyValue = randomProperty()
      const json = {
        _embedded: {
          [embeddedResourceKey]: [
            {
              [embeddedResourcePropertyKey]: embeddedResourcePropertyValue,
            },
          ],
        },
      }

      const resource = Resource.fromObject(json)

      const embeddedResources = resource.getResources(embeddedResourceKey)
      expect(embeddedResources).toHaveLength(1)
      expect(
        embeddedResources![0].getProperty(embeddedResourcePropertyKey),
      ).toStrictEqual(embeddedResourcePropertyValue)
    })
  })
})
