// @flow
export type NodeCB = (err: ?any, result: ?any) => void

export type Buffer<T> = {
  isEmpty: () => boolean,
  put: (msg: T) => void,
  take: () => T,
}

export type Channel<T> = {
  take: (cb: (msg: T) => void) => void,
  put: (msg: T) => void,
  close: () => void,
}

// TODO (mm) it might be possible to type these better instead of just key: string
export type ChannelConfig<T> = {
  [key: string]: () => Buffer<T>,
}

export type ChannelMap<T> = {
  [key: string]: Channel<T>,
}

export type SagaMap = {
  // $FlowIssue with returning Generators from functions
  [key: string]: Generator<*, *, *>,
}