# halboy-ts

An intuitive [HAL+JSON](https://datatracker.ietf.org/doc/html/draft-kelly-json-hal-11) library.

---

![ci workflow](https://github.com/JDurstberger/halboy-ts/actions/workflows/ci.yml/badge.svg)

# Install

npm:<br/> `npm i halboy-ts`

yarn:<br/> `yarn add halboy-ts`

pnpm:<br/> `pnpm add halboy-ts`

# Usage

## Resources

### Creating Resource through DSL

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create('https://example.com/things/123').addProperty(
  'someProp',
  'hello, world!',
)

console.log(resource.getProperty('someProp')) // hello, world!
```

### Creating Resource from JSON

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.fromObject({
  someProp: 'hello, world!',
  _links: {
    otherThing: { href: 'https://example.com/other-things/456' },
  },
})

console.log(resource.getProperty('someProp')) // hello, world!
console.log(resource.getHref('otherThing')) //https://example.com/other-things/456
```

### Creating object from Resource for usage on wire

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create('https://example.com/things/123')
  .addLink('otherThing', 'https://example.com/other-things/456')
  .addProperty('someProp', 'hello, world!')

console.log(resource.toJson())

//output
//{
//  someProp: 'hello, world!',
//  _links: {
//    otherThing: { href: 'https://example.com/other-things/456' }
//  }
//}
```

# TODO

- Resource

  - properties
    - batch add properties
  - links
    - batch adding links
    - support for other link props
    - appending links to existing relation?
  - embedded
    - batch adding resources

- Navigator

  - post
  - patch
  - put
  - http options
  - support for path parameters
  - support for query parameters

- Test Support
