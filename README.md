# halboy-ts

![ci workflow](https://github.com/JDurstberger/halboy-ts/actions/workflows/ci.yml/badge.svg)

An intuitive HAL+JSON library based on [HAL+JSON](https://datatracker.ietf.org/doc/html/draft-kelly-json-hal-11).

# Install

npm:<br/> `npm i halboy-ts`

yarn:<br/> `yarn add halboy-ts`

pnpm:<br/> `pnpm add halboy-ts`

# Usage

Creating and managing resources is very simple.

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

## TODO

- Resource

  - properties
    - batch add properties
  - links
    - support for deprecation
    - support for templated
    - support for adding link object
    - batch adding links
    - appending links to existing relation?
  - embedded
    - support for arrays of resources
    - batch adding resources
    - immutability when adding
    - immutability when returning
  - fromObject
    - support for arrays of resources
    - validation?

- Navigator

  - post
  - patch
  - put
  - http options
  - throw on error?

- Test Support

- Investigate jest retry
- ESLint not erroring when function parameter type is missing
