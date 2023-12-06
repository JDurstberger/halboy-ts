import axios from 'axios'
import { Resource } from './resource'

export type Response = {
  status: number
  resource: Resource
}

export type Options = {
  headers?: { [key: string]: string }
}

const get = async (url: string, options?: Options): Promise<Response> => {
  try {
    const response = await axios.get(url, options)
    return {
      status: response.status,
      resource: Resource.fromObject(response.data),
    }
  } catch (rawError) {
    const error = rawError.toJSON()
    return {
      status: error.status,
      resource: Resource.create(),
    }
  }
}

export const halHttpClient = {
  get,
}
