import { useCreation } from 'ahooks';
import { useEffect, useRef } from 'react';

export default function useUpdateAsyncEffect(
  effect: () => Promise<void>,
  deps: any[],
) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  const depsRef = useRef(deps);
  depsRef.current = deps;

  const count = useRef(0);

  useEffect(() => {
    let isMounted = true;
    count.current += 1;
    const currentCount = count.current;

    const asyncEffect = async () => {
      await effectRef.current();
    };

    if (currentCount > 1) {
      asyncEffect();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsRef.current);
}
