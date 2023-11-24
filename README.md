# halboy-ts

![ci workflow](https://github.com/JDurstberger/halboy-ts/actions/workflows/ci.yml/badge.svg)

An intuitive HAL+JSON library.

# Usage

## Resource Management

Creating and managing resources is very simple.

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create().addLink(
  'someRelation',
  'https://example.com',
)
```

## TODO

- Resource

  - links
    - serialisation
    - support for deprecation
    - support for templated
  - properties
  - embedded
  - toJson
    - links
    - embedded
    - properties
  - fromJson

- Navigator
- Test Support
