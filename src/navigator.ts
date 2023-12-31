import { Resource } from './resource'
import { halHttpClient } from './hal-http-client'

export type Options = {
  headers?: { [key: string]: string }
}

export class Navigator {
  readonly status: number
  readonly resource: Resource
  private constructor(status: number, resource: Resource) {
    this.status = status
    this.resource = resource
  }

  static async discover(url: string, options?: Options): Promise<Navigator> {
    const response = await halHttpClient.get(url, options)
    return new Navigator(response.status, response.resource)
  }

  async get(relation: string): Promise<Navigator> {
    const link = this.resource.getLink(relation)

    if (!link) {
      throw Error(
        `Link with relation '${relation}' does not exist on resource.`,
      )
    }

    const response = await halHttpClient.get(link.href)
    return new Navigator(response.status, response.resource)
  }
}
