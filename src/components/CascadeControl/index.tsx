import { Cascader } from "antd"
import { JSXElementConstructor, ReactElement } from "react";

type CascadeControValue = {

}

type dataSourceType = {
  label: number | string | React.ReactNode;
  value: number | string | boolean;
  /**
   * 注意这是设置下一级的不是当前的
   */
  type?: 'single' | 'multiple';
  children?: dataSourceType[]
}
export type CascadeControlProps = {
  value?: CascadeControValue;
  onChange?: () => void;
  dataSource: dataSourceType[];
}
const CascadeControl = (props: CascadeControlProps) => {
  const {
    dataSource,
  } = props;
  const change = (...arr) => {
    console.log(arr);
  }

  return (
    <Cascader
      options={dataSource}
      onChange={change}
      multiple
    />
  )
}

export default CascadeControl;