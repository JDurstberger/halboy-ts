export type Link = {
  href: string
}
export type Links = { [key: string]: Link | Link[] }
export type Property =
  | string
  | number
  | boolean
  | Property[]
  | { [key: string]: Property }
export type Properties = { [key: string]: Property }
export type EmbeddedResources = { [key: string]: Resource }
export class Resource {
  private readonly _links: Links
  private readonly _properties: Properties
  private readonly _embedded: EmbeddedResources

  constructor(
    links: Links,
    properties: Properties,
    resources: EmbeddedResources,
  ) {
    this._links = links
    this._properties = properties
    this._embedded = resources
  }

  static create(selfUrl?: string): Resource {
    const resource = new Resource({}, {}, {})

    return selfUrl ? resource.addLink('self', selfUrl) : resource
  }

  addLink(relation: string, href: string): Resource {
    return new Resource(
      { [relation]: hrefToLink(href) },
      this._properties,
      this._embedded,
    )
  }

  addLinks(relation: string, hrefs: string[]): Resource {
    return new Resource(
      { [relation]: hrefs.map(hrefToLink) },
      this._properties,
      this._embedded,
    )
  }

  getLink(relation: string): Link | undefined {
    const link = this._links[relation]
    if (link) {
      if (Array.isArray(link)) {
        throw Error(`${relation} is an array of links.`)
      }
      return {
        ...link,
      }
    }
  }

  getLinks(relation: string): Link[] | undefined {
    const link = this._links[relation]
    if (link) {
      if (Array.isArray(link)) {
        return link.map((l) => ({ ...l }))
      }
      throw Error(`${relation} is not an array of links.`)
    }
  }

  getHref(relation: string): string | undefined {
    return this.getLink(relation)?.href
  }

  getHrefs(relation: string): string[] | undefined {
    return this.getLinks(relation)?.map((link) => link.href)
  }

  addProperty(key: string, value: Property): Resource {
    return new Resource(
      this._links,
      { ...this._properties, [key]: value },
      this._embedded,
    )
  }

  getProperty(key: string): Property {
    return this._properties[key]
  }

  addResource(key: string, resource: Resource): Resource {
    return new Resource(this._links, this._properties, {
      ...this._embedded,
      [key]: resource,
    })
  }

  getResource(key: string): Resource | undefined {
    return this._embedded[key]
  }

  toJson(): object {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const json: Record<string, any> = {
      ...this._properties,
    }
    if (!isEmpty(this._links)) {
      json['_links'] = this._links
    }

    if (!isEmpty(this._embedded))
      json['_embedded'] = mapObject(this._embedded, (resource) =>
        resource.toJson(),
      )

    return json
  }
}

const isEmpty = (o: object): boolean => Object.keys(o).length === 0

const mapObject = <T, R>(
  obj: { [key: string]: T },
  f: (v: T) => R,
): { [key: string]: R } =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]: [string, T]): [string, R] => [k, f(v)]),
  )

const hrefToLink = (href: string): Link => ({
  href,
})
