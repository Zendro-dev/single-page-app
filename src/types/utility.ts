/**
 * From an arbitrary object, allow only one of its containing keys.
 *
 * How to use:
 *
 *  type Base {
 *    maybeKey?: unknown
 *  } & OneOf<{
 *    thisKey: unknown,
 *    orThisOther: unknown
 *  }>
 */

type ValueOf<Obj> = Obj[keyof Obj];
type OneOnly<Obj, Key extends keyof Obj> = {
  [key in Exclude<keyof Obj, Key>]+?: undefined;
} & Pick<Obj, Key>;
type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };

export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;
