import { Button } from "antd";
import { useFrequencyEffect, useOnChangeValue, useSignal } from "../../hooks"

export default function Home() {
  enum DAY {
    日,
    周,
  }
  const [frequency] = useSignal<{
    unit: keyof typeof DAY;
    count: number;
    title: string;
    interval: number;
  }>({
    unit: '周',
    count: 1,
    title: '每四周一次',
    interval: 4,
  });
  const [day] = useSignal(16);
  const [dosage] = useSignal(20);

  const [amount] = useSignal('DAY');
  type FREQUENCYTYPE = {
    [key in keyof typeof DAY]: () => number;
  }
  const FREQUENCY: FREQUENCYTYPE = {
    日: () => {
      return frequency?.count;
    },
    周: () => {
      console.log(((frequency?.interval * 7) / frequency?.interval) / day?.value);
      return ((frequency?.interval * 7) / frequency?.interval) / day?.value;
    }
  };
  const dataSource = [
    {
      label: '天',
      value: 'DAY',
    },
    {
      label: '量',
      value: 'AMOUNT',
    },
    {
      label: '次',
      value: 'ORDER',
    }
  ]

  const [usage] = useSignal(10);

  const ROUNDING = {
    DAY: () => {
      /**
       * 按天取整：按天为一个取整单位
       * 不再汇总使用天数的总使用剂量
       * 而是先以每天的总用量向上取整1次
       * 然后再根据使用天数汇总应发药总量
       * 例如: 医嘱为 剂量20mg，频次BID(日频次数为2)，用药天数16天
       * 计算规则为: (20mg*2)/(10mg*30) = 0.133333；每天向上取整为1盒，16天累计发药量为1盒*16=16盒
       **/
      const DOSAGE = (dosage?.value * FREQUENCY?.[frequency?.unit]?.());
      const USAGE = (usage?.value * 30);
      console.log(DOSAGE / USAGE);
      return Math?.ceil(DOSAGE / USAGE) * day?.value;
    },
    AMOUNT: () => {
      /**
       * 按量取整：是一种最大节约用药的模式
       * 根据医生开立剂量、频次，使用天数，计算出使用天数内使用的全部用量
       * 然后与供应规格 1 个包装下的含量进行比较
       * 得到的数字向上取整就计算出应发药品数量
       * 例如: 医嘱为 剂量 20mg, 频次BID(日频次数为2), 用药天数16天
       * 计算规则为: (20mg*2*16) /(10mg*30) = 2.133333,向上取整为3盒
       */
      const DOSAGE = ((dosage?.value * FREQUENCY?.[frequency?.unit]?.()) * day?.value);
      const USAGE = (usage?.value * 30);
      return Math?.ceil(DOSAGE / USAGE);
    },
    ORDER: () => {
      /**
      * 按次取整：按每次使用作为一个取整单位
      * 不再汇总使用天数的使用剂量
      * 而是先以每次的用量向上取整
      * 然后再根据使用天数的总次数汇总应发药总量
      * 例如: 医嘱为 剂量20mg，频次BID(日频次数为2)
      * 用药天数16天
      * 计算规则为:20mg/(10mg*30) = 0.666667，每次向上取整为1盒
      * 每天累计2盒，16天累计发药量为1盒*16*2=32盒
      */
      const USAGE = (usage?.value * 30);
      const DOSAGE = (dosage?.value / USAGE);
      return Math?.ceil(DOSAGE / USAGE) * day?.value * FREQUENCY?.[frequency?.unit]?.();
    }
  }
  return (
    <div>
      <span>{ROUNDING?.[amount?.value]?.()}</span>
      {
        dataSource?.map((item) => <Button key={item?.value} onClick={() => amount.value = item?.value}>{item?.label}</Button>)
      }
    </div>
  )
}