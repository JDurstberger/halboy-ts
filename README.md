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

Resources are immutable by default. This means that any operation that would change the state of a resource will return a new resource with the changes applied and leaves the previous resource untouched. 

```ts
const resource =  Resource.create('https://example.com/things/123')
//.addProperty creates a new resource and leaves 'resource' untouched
const differentResource = resource.addProperty('a', 1)
```

### Creating Resource through DSL

#### Basic example

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create('https://example.com/things/123').addProperty(
  'someProp',
  'hello, world!',
)

console.log(resource.getProperty('someProp')) // hello, world!
```

#### Adding self link

Self links can be added directly through the `create` method. This is semantically equivalent to calling `addLink` with the `self` relation.

```ts
import { Resource } from 'halboy-ts'

//both are equivalent
Resource.create('https://example.com/things/123')
Resource.create().addLink('self', 'https://example.com/things/123')
```

#### Adding links

Links can be added individually or in a batch.
Links can also be added in a simplified manner by just passing a string or as a `Link` object.  
The former exists for convenience and will create a `Link` object with the `relation` relation.

```ts
import { Resource } from 'halboy-ts'

Resource.create()
  .addLink('foo', 'https://example.com/foos/1')
  .addLink('bar', 'https://example.com/bars/2')

Resource.create()
  .batchAddLinks({
    foo: 'https://example.com/foos/1',
    bar: 'https://example.com/bars/2',
  })

//This allows for adding additional link properties as defined in the spec.
Resource.create()
  .addLink('foo', { href: 'https://example.com/foos/1' })
```


#### Adding properties
Properties can be added individually or in a batch.

```ts
import { Resource } from 'halboy-ts'

Resource.create()
  .addProperty('a', 1)
  .addProperty('b', 2)

Resource.create()
  .batchAddProperties({ a: 1, b: 2 })
```

### Accessing properties
The simplest way to access properties is through the `getProperty` method. 

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create().add('a', 1)

resource.getProperty('a')
```

Be mindful that this method returns type `Property`. Which is a built-in type. If you want to cast to a specific type
on access you can pass a type parameter to `getProperty`.

```ts
import { Resource } from 'halboy-ts'

const resource = Resource.create().add('a', 1)

const a: number = resource.getProperty<number>('a')
```

> [!CAUTION]  
> This is only to appease the type system. No checks are done to validate if the property is actually of that type.  

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

console.log(resource.toObject())

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

  - links
    - support for other link props
  - embedded
    - batch adding resources

- Navigator
  - patch
  - put
  - http options
  - support for link templates as per [RFC 6570](https://datatracker.ietf.org/doc/html/rfc6570)

- Test Support
