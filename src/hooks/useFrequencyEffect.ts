import { useUpdateEffect } from 'ahooks';
import { useRef, useState } from 'react';
enum Around {
  before,
  after,
}
/**
 * 数据变化频率
 * 主要作用于数据改变后的操作可控制频率
 * @param effect 函数
 * @param frequency 频率次数
 * @param deps 依赖项
 */
export default function useFrequencyEffect(
  effect: React.EffectCallback,
  frequency = 1,
  deps?: React.DependencyList | undefined,
  around: keyof typeof Around = 'after',
) {
  const handleFrequency = useRef(0);

  useUpdateEffect(() => {
    let unmount;
    switch (around) {
      case 'after':
        if (handleFrequency?.current < frequency) {
          unmount = effect();
          handleFrequency.current++;
        }
        break;
      case 'before':
        if (handleFrequency?.current < frequency) {
          handleFrequency.current++;
        }
        if (handleFrequency?.current === frequency) {
          unmount = effect();
        }
    }
    return () => {
      unmount?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
