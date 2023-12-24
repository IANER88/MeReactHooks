import { Dispatch, useState } from 'react';

type Method<S> = {
  onChange: (value?: S) => void;
  value: S;
};

type SetStateAction<S> = (value: S) => void;

type UseOnChangeValue<S> = [Method<S>, Dispatch<SetStateAction<S>>];
/**
 * 简化 onChange -> value
 * @param initialState 初始值
 * @returns []
 */
export default function useOnChangeValue<S>(
  initialState?: S,
  onChange?: (value: S) => S,
): UseOnChangeValue<S> {
  const [value, setValue] = useState(initialState);
  const method = {
    value,
    onChange: (value: S) => {
      if (onChange) {
        const state = onChange?.(value);
        setValue(state)
      } else {
        setValue(value);
      }
    },
  };

  return [method, setValue] as UseOnChangeValue<S>;
}
