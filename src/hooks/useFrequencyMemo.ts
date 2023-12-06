import { useUpdateEffect } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
/**
 * 数据变化频率
 * 主要作用于数据改变后的操作可控制频率
 * @param factory 函数
 * @param frequency 频率次数
 * @param deps 依赖项
 */
export default function useFrequencyMemo(
  factory: () => any,
  frequency = 1,
  deps?: React.DependencyList | undefined,
) {
  const [handleFrequency, setHandleFrequency] = useState(0);
  const [data, setData] = useState('');
  useEffect(() => {
    if (handleFrequency < frequency) {
      const state = factory();
      setHandleFrequency(handleFrequency + 1);
      setData(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}
