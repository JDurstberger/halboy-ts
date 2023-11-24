export type Link = {
  href: string
}
export type Links = Record<string, Link>

export class Resource {
  private readonly _links: Links

  public get links() {
    return { ...this._links }
  }

  constructor(links: Links) {
    this._links = links
  }

  static create(selfUrl?: string): Resource {
    const resource = new Resource({})

    return selfUrl ? resource.addLink('self', selfUrl) : resource
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

  toJson(): object {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const json: Record<string, any> = {}
    if (!isEmpty(this._links)) json['_links'] = this.links

    return json
  }

  addLink(relation: string, href: string) {
    return new Resource({ [relation]: { href: href } })
  }
}

const isEmpty = (o: object): boolean => Object.keys(o).length === 0
