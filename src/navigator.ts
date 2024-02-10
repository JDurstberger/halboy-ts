import { Resource } from './resource'
import { halHttpClient } from './hal-http-client'

export type Options = {
  headers?: { [key: string]: string }
}

export class Navigator {
  readonly status: number
  readonly resource: Resource
  private readonly options: Options

  private constructor(status: number, resource: Resource, options: Options) {
    this.status = status
    this.resource = resource
    this.options = options
  }

  static async discover(url: string, options?: Options): Promise<Navigator> {
    const response = await halHttpClient.get(url, options ?? {})
    return new Navigator(response.status, response.resource, options ?? {})
  }

  async get(relation: string): Promise<Navigator> {
    if (this.status !== 200) {
      return this
    }

    const link = this.resource.getLink(relation)
    if (!link) {
      throw Error(
        `Link with relation '${relation}' does not exist on resource.`,
      )
    }

    const response = await halHttpClient.get(link.href, this.options)
    return new Navigator(response.status, response.resource, this.options)
  }

  async post(relation: string, body: unknown): Promise<Navigator> {
    if (this.status !== 200) {
      return this
    }

    const link = this.resource.getLink(relation)
    if (!link) {
      throw Error(
        `Link with relation '${relation}' does not exist on resource.`,
      )
    }

    const response = await halHttpClient.post(link!.href, body, this.options)
    return new Navigator(response.status, response.resource, this.options)
  }
}
