export type Link = {
  href: string
}
export type Links = { [key: string]: Link }
export type Property =
  | string
  | number
  | boolean
  | Property[]
  | { [key: string]: Property }
export type Properties = { [key: string]: Property }

export class Resource {
  private readonly _links: Links
  private readonly _properties: Properties

  constructor(links: Links, properties: Properties) {
    this._links = links
    this._properties = properties
  }

  static create(selfUrl?: string): Resource {
    const resource = new Resource({}, {})

    return selfUrl ? resource.addLink('self', selfUrl) : resource
  }

  addLink(relation: string, href: string): Resource {
    return new Resource({ [relation]: { href: href } }, this._properties)
  }

  getLink(relation: string): Link | undefined {
    const link = this._links[relation]
    if (link) {
      return { ...link }
    }
  }

  getHref(relation: string): string | undefined {
    const link = this._links[relation]
    if (link) {
      return link.href
    }
  }

  addProperty(key: string, value: Property): Resource {
    return new Resource(this._links, { ...this._properties, [key]: value })
  }

  getProperty(key: string): Property {
    return this._properties[key]
  }

  toJson(): object {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const json: Record<string, any> = {
      ...this._properties,
    }
    if (!isEmpty(this._links)) json['_links'] = this._links

    return json
  }
}

const isEmpty = (o: object): boolean => Object.keys(o).length === 0
