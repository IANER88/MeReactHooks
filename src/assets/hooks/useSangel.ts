 import { useCallback, useState } from 'react';

type useSignalMethod<T> = {
  /**
   * 设置方法
   * @param state 状态
   * @returns {void}
   */
  _set: (state: T) => void;
  /**
   * 拿到最新值
   * @returns 最新值
   */
  _get: () => T;
  /**
   * 清空最新值
   * @returns {void}
   */
  _rest: () => void;
};

export default function useSignal<T>(initialState: T): useSignalMethod<T> {
  let init = initialState;
  if (typeof initialState === 'object' && initialState !== null) {
    if (Array?.isArray(initialState)) {
      const proto = Object?.create(Array?.prototype);
      initialState.__proto__ = proto;
    }
  } else {
    init = { value: initialState };
  }
  const _set = () => {};
  const _get = () => {};
  const _rest = useCallback(() => {
    setState(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [state, setState] = useState(init);
  return new Proxy(state, {
    get() {},
    set() {},
    _set,
    _get,
    _rest,
  });
}
