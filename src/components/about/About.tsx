import { Button } from "antd";
import useSignal from "../../assets/hooks/uesSiangl";
import { useCallback } from 'react'
export default function About() {
  const [state, set, get, rest] = useSignal([
    {
      label: 1,
      value: '一',
    }
  ]);
  const method = [
    {
      label: 'push',
      onClick: () => {
        state?.push({
          label: 2,
          value: '二',
        })
      }
    },
    {
      label: 'pop',
      onClick: () => {
        state?.pop();
      }
    },
    {
      label: 'unshift',
      onClick: () => {
        state?.unshift({
          label: 2,
          value: '二',
        })
      }
    },
    {
      label: 'shift',
      onClick: () => {
        state?.shift();
      } 
    },
    {
      label: 'splice',
      onClick: () => {
        state?.splice(1, 1, {
          label: 3,
          value: '三',
        });
      } 
    },
    {
      label: 'reverse',
      onClick: () => {
        state?.reverse();
      }
    },
    {
      label: 'sort',
      onClick: () => {
        state?.sort();
      }
    },
  ]
  const [data] = useSignal(undefined);
  const gets = useCallback(() => {
    console.log(state, get());
  }, [])
  return (
    <div>
      {
        method?.map((item) => {
          return (
            <Button type="primary" onClick={item?.onClick}>
              {item?.label}
            </Button>
          )
        })
      }
      <span>{state?.map((item) => <span key={item?.label}>{item?.value}</span>)}</span>
      <Button onClick={() => state?.with(0, {
        label: 2,
        value: '二',
      })}>with</Button>
      <Button onClick={rest}>rest</Button>
      <Button onClick={gets}>get</Button>
      <Button onClick={() => set([...state, {
        label: 4,
        value: '四'
      }])}>set</Button>
    </div>
  )
}