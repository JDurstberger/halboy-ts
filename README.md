# halboy-ts

![ci workflow](https://github.com/JDurstberger/halboy-ts/actions/workflows/ci.yml/badge.svg)

An intuitive HAL+JSON library based on [HAL+JSON](https://datatracker.ietf.org/doc/html/draft-kelly-json-hal-11).

# Usage

## Resource Management

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

  - links
    - support for deprecation
    - support for templated
  - embedded
    - support for arrays of resources
  - fromJson

- Navigator
- Test Support
