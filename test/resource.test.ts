import { faker } from '@faker-js/faker'
import { Resource } from '../src'

describe('HAL Resource', () => {
  describe('links', () => {
    test('links are empty by default', () => {
      const resource = Resource.create()

      expect(resource.links).toStrictEqual({})
    })

    test('can not modify links by modifying returned links', () => {
      const relation = faker.lorem.word()
      const resource = Resource.create()

      resource.links[relation] = { href: '' }

      const link = resource.getLink(relation)
      expect(link).toBeUndefined()
    })
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

    test('adds link to resource', () => {
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
  })
})
