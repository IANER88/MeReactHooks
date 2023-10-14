/**
 * 
 * @param priceList [[金额,数量]]
 * 
 */
const askTotalAmount = (priceList: number[][]) => {
  const total = priceList.map((num: number[]) => {
    const [price, amount] = num;
    const count = price * amount;
    return count
  })
  return total.reduce((accumulator: number, currentValue: number) => {
    return accumulator + currentValue;
  }, 0);
}

export default askTotalAmount;