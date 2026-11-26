export type InsiderObjectValue =
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | Set<string>
    | Set<number>
    | InsiderObject;

/**
 * Native accepts at most two nesting levels (an object inside an object). A value nested any
 * deeper, an array of objects nested inside an object, and a nested object that is empty or loses
 * every key are dropped before the call and named in a console warning. Inside a `match`, any
 * dropped key refuses the whole call.
 *
 * A `Set<string>` or `Set<number>` (of finite numbers) is converted to an array; an empty or
 * mixed-type `Set`, like an empty array, is dropped and named in a console warning.
 */
export type InsiderObject = { [key: string]: InsiderObjectValue };
