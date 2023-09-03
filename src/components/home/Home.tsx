import DragDrop, { DragDropPropsType } from "../DragDrop/DragDrop";
import '../../App.css'
import { useState } from "react";
export default function Home() {
  const [data, setData] = useState<DragDropPropsType['value']>([
    {
      label: '流感病毒快速检测(甲+乙)',
      value: 1
    },
    {
      label: '血常规自动分析(五分类)',
      value: 2
    },
    {
      label: '快速超敏C反应蛋白测定',
      value: 3
    },
    {
      label: '外周血细胞形态分析',
      value: 4
    },
    {
      label: '尿液分析+尿沉渣定量',
      value: 5
    },
    {
      label: '尿液分析（急诊）',
      value: 6
    },
    {
      label: '大便常规(仪器法)',
      value: 7
    },
    {
      label: '大便隐血试验',
      value: 8
    },
    {
      label: '论状病毒检测',
      value: 9
    },
  ])
  // const {
  //   restrictToFirstScrollableAncestor
  // } = ModifiersType
  return (
    <div className="home-box">
      <DragDrop
        value={data}
        columns={{
          amount: 2,
        }}
        onChange={(newData) => {
          setData(newData)
        }}
        modifier="restrictToParentElement"
      >
        {/* {
          data?.map(item => <div key={item.value}>{item.label}</div>)
        } */}
      </DragDrop>
    </div>
  )
}