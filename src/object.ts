export const mapObject = <From, To>(
  obj: { [key: string]: From },
  f: (v: From, k: string) => To,
): { [key: string]: To } =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]: [string, From]): [string, To] => [
      k,
      f(v, k),
    ]),
  )
