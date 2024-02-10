import { Link, Links, Properties, Resource } from './resource'
import {
  isJsonArray,
  isJsonObject,
  isString,
  JsonObject,
  JsonResource,
  JsonValue,
} from './json'
import { mapObject } from './object'

export const fromObject = (json: JsonResource): Resource => {
  const links = rawLinksToLinks(json._links)
  const embedded: { [key: string]: JsonObject | JsonObject[] } =
    json._embedded ?? {}
  const properties: Properties = { ...json }
  delete properties['_links']
  delete properties['_embedded']
  const resources = mapObject(
    embedded,
    (embeddedResource: JsonObject | JsonObject[]): Resource | Resource[] =>
      Array.isArray(embeddedResource)
        ? embeddedResource.map((e: JsonObject) => fromObject(e))
        : fromObject(embeddedResource),
  )
  return new Resource(links, properties, resources)
}

const rawLinksToLinks = (rawLinks?: JsonValue): Links => {
  if (!rawLinks) {
    return {}
  }

  if (!isJsonObject(rawLinks)) {
    throw Error(`_links must be an object, but got ${typeof rawLinks}`)
  }

  return mapObject(
    rawLinks,
    (rawLink: JsonValue, relation: string): Link | Link[] => {
      if (isJsonObject(rawLink)) {
        return rawLinkToLink(relation, rawLink)
      }

      if (isJsonArray(rawLink))
        return rawLink.map((rawLink) => {
          if (!isJsonObject(rawLink))
            throw new Error(
              `Item in relation ${relation} must be a link, but got string`,
            )

          return rawLinkToLink(relation, rawLink)
        })

      throw new Error(
        `Link relation ${relation} must be a link or an array of links, but got string`,
      )
    },
  )
}

const rawLinkToLink = (relation: string, rawLink: JsonObject): Link => {
  if (!isString(rawLink.href))
    throw new Error(
      `href of relation ${relation} must be a string, but got number`,
    )

  return { href: rawLink.href }
}
