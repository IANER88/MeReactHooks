import { Input, Select } from "antd";
import { useOnChangeValue } from "../../hooks";
import ListItem from "../ListItem";

export default function About() {
  const [list] = useOnChangeValue([]);
  const options = Array?.from({ length: 8 })?.map((item) => ({
    label: item,
    value: item,
  }))
  console.log(list);

  return (
    <ListItem {...list}>
      <Input />
      <Select options={options} />
      <Input />
      <Select options={options} />
    </ListItem>
  )
}