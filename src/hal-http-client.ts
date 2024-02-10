import { Resource } from './resource'

export type Response = {
  status: number
  resource: Resource
}

export type Options = {
  headers?: { [key: string]: string }
}

const get = async (url: string, options: Options): Promise<Response> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...options?.headers,
    },
  })
  const jsonBody = await response.json()
  return {
    status: response.status,
    resource: Resource.fromObject(jsonBody),
  }
}

const post = async (
  url: string,
  body: unknown,
  options: Options,
): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...options.headers,
    },
  })
  const jsonBody = await response.json()
  return {
    status: response.status,
    resource: Resource.fromObject(jsonBody),
  }
}

export const halHttpClient = {
  get,
  post,
}
