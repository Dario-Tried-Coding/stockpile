// Paths
export type Paths<Schema, Path extends string = ''> = Schema extends string
  ? Path
  : Schema extends object
    ? {
        [K in keyof Schema & string]: Paths<Schema[K], `${Path}${Path extends '' ? '' : '.'}${K}`>
      }[keyof Schema & string]
    : never

// Namespaces
type AppendKeyPrefix<Prefix extends string, Keys extends string> = `${Prefix & string}.${Keys}`

export type Namespaces<T, Prefix extends string = ''> = {
  [K in keyof T]-?: K extends string
    ? T[K] extends object
      ? K | AppendKeyPrefix<K, Namespaces<T[K], `${Prefix & string}${K & string}`>>
      : never
    : never
}[keyof T]