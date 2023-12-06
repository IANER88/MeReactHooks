import { useGetState } from 'ahooks';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import useFrequencyEffect from './useFrequencyEffect';
type GetStateAction<S> = () => S;
type RestStateAction = () => void;

type GetInitStateAction<S> = () => S;

type State<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  GetStateAction<S>,
  RestStateAction,
  GetInitStateAction<S>,
];
/**
 * 一次满足 useGetState 和 useRestState 和 useInitState
 * @param initialState 初始值
 * @returns {State}
 */
export default function useGetRestInitState<S>(initialState: S): State<S> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const RestState = useCallback(() => initialState, []);
  const [state, setState, getState] = useGetState(initialState);
  const data = useRef<any>(null);
  const restState = () => {
    setState(RestState());
  };
  useFrequencyEffect(
    () => {
      data.current = state as S;
    },
    1,
    [state],
  );
  const getInitState = () => data?.current as S;
  return [state, setState, getState, restState, getInitState];
}
