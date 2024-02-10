export type JsonValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray

export type JsonObject = {
  [x: string]: JsonValue
}

export type JsonArray = JsonValue[]

export type JsonResource = {
  _links?: JsonValue
  _embedded?: { [key: string]: JsonObject | JsonObject[] }
  [key: string]: JsonValue
}

export const isJsonObject = (o: JsonValue): o is JsonObject =>
  typeof o === 'object' && !Array.isArray(o)

export const isJsonArray = (o: JsonValue): o is JsonArray =>
  typeof o === 'object' && Array.isArray(o)

export const isString = (o: JsonValue): o is string => typeof o === 'string'
