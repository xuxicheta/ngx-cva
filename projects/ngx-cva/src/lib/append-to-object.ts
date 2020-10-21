export function appendToObject<O, K extends keyof O>(object: O, key: K, value: O[K]): O {
  object[key] = value;
  return object;
}

