import axios from 'axios'

export class Navigator {
  readonly status: number | undefined

  private constructor(status: number) {
    this.status = status
  }

  static async discover(url: string): Promise<Navigator> {
    try {
      const response = await axios.get(url)
      return new Navigator(response.status)
    } catch (rawError) {
      const error = rawError.toJSON()
      return new Navigator(error.status)
    }
  }
}
