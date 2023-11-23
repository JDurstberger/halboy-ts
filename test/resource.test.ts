import { Resource } from '../src'

describe('HAL Resource', () => {
  describe('to JSON', () => {
    test('creates empty JSON for new resource', () => {
      const resource = Resource.create()

      const json = resource.toJson()

      expect(json).toStrictEqual({})
    })
  })
})
