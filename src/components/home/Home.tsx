export default function Home() {
  type ArrayType = {
    exportAmount?: number;
    amount?: number;
    num?: number
  }
  const arr: ArrayType[] = [
    {
      exportAmount: 0,
      amount: 10,
    },
    {
      exportAmount: 0,
      amount: 2,
    },
    {
      exportAmount: 0,
      amount: 3,
    },
    {
      exportAmount: 0,
      amount: 0,
    },
    {
      exportAmount: 0,
      amount: 10,
    },
    {
      exportAmount: 0,
      amount: 10,
    },
  ]

  // function* nearby(array: unknown[]) {
  //   for (const i in array) {
  //     yield [array[i - 1], array[i], array[i + 1]]
  //   }
  // }

  // for (const item of arr) {
  //   const amount = Math?.abs(item?.exportAmount - item?.amount);
  //   if (item?.exportAmount >= item?.amount) {
  //     item.exportAmount = item?.amount;
  //   }
  // }

  // console.log(arr);

  const count = arr.reduce((previous, current) => previous + current?.amount, 0)
  const num = 40
  console.log(count);

  arr?.reduce((previous: ArrayType, current: ArrayType) => {
    if (previous?.num) {
      /**
       * 计算插值
       */
      const num = Math.abs(previous?.num - current.amount);
      /**
         * 判断差值/出口值是否大于库存量
         */
      if ((previous?.num ?? current?.exportAmount) >= current?.amount) {
        /**
         * 是就把出口数量修改为最大库存量
         */
        current.exportAmount = current.amount;
        /**
         * 记录下差值
         */
        current.num = num;
      } else {
        /**
         * 如果大于差值直接等于差值
         */
        current.exportAmount = previous?.num ?? 0;
      }
    }
    return current;
  }, {
    num
  })

  console.log(arr);


  // for (const [previous, current, next] of nearby(arr)) {
  //   console.log(previous, current, next);
  // }s

  return (
    <div>

    </div>
  )
}