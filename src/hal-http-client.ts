import axios from 'axios'
import { Resource } from './resource'

export type Response = {
  status: number
  resource: Resource
}

const get = async (url: string): Promise<Response> => {
  try {
    const response = await axios.get(url)
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
