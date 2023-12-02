import { useState, useCallback, useRef } from "react";

type set = (state?: unknown) => void;

type get<T> = () => T;

type rest = () => void;

type Signal<T> = T extends object ? [T, set, get<T>, rest] : [
  { value: T },
  set, get<T>, rest
]
/**
 * 一个涵盖数据劫持和 / useGetState / useRestState
 * @param initialState 初始值
 * @returns 返回 [状态, 修改状态方法, 获取最新值方法, 恢复初始值方法]
 */
export default function useSignal<T>(initialState?: T): Signal<T> {
  const is = typeof initialState === 'object' && initialState !== null;
  const [state, setState] = useState(is ? initialState : { value: initialState });
  if (is) {
    if (Array?.isArray(state)) {
      const proto = Object?.create(Array?.prototype);
      const method: { [key: string]: (args: any) => void } = {
        push: (args) => {
          setState([...state, ...args] as any)
        },
        pop: () => {
          setState((state as any)?.toSpliced(state?.length - 1, 1))
        },
        unshift: (args) => {
          setState([...args, ...state] as any)
        },
        shift: () => {
          setState((state as any)?.toSpliced(0, 1))
        },
        splice: (args) => {
          setState((state as any)?.toSpliced(...args))
        },
        reverse: () => {
          setState((state as any)?.toReversed())
        },
        sort: () => {
          setState((state as any)?.toSorted())
        },
        with: (args) => {
          setState(([...state] as any).with(...args));
        }
      }
      const array: any = [];
      Object?.getOwnPropertyNames(Array?.prototype)?.forEach((key) => {
        if (typeof proto[key] === 'function') {
          array[key] = function (...args: any[]) {
            method?.[key]?.(args);
            return proto[key].apply(this, args);
          }
        } else {
          array[key] = proto[key]
        }
      });
      (state as any).__proto__ = array;
    }
  }
  const rest = useCallback(() => {
    setState(is ? initialState : { value: initialState })
  }, []);
  const stateRef = useRef(state);
  stateRef.current = state;
  const get = useCallback(() => stateRef.current, []);
  const proxy = new Proxy(state, {
    get(target, key) {
      return (target as any)?.[key];
    },
    set(target, key, value) {
      if (typeof target === 'function' || Array?.isArray(target)) return true;
      setState({
        ...target,
        [key]: value
      });
      return true;
    },
  })
  return [
    proxy,
    setState,
    get,
    rest,
  ] as Signal<T>
}