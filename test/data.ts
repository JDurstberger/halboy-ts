import { Property } from '../src/resource'
import { faker } from '@faker-js/faker'

const randomItem = <T>(array: Array<T>): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const randomProperty = (): Property => {
  const simpleProperties: Property[] = [
    faker.string.sample(),
    faker.number.int(),
    faker.number.float(),
    faker.datatype.boolean(),
  ]
  const randomSimpleProperty = randomItem(simpleProperties)

  return randomItem([
    ...simpleProperties,
    [randomSimpleProperty],
    { key: randomSimpleProperty },
  ])
}
