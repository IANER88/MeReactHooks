import { Select } from "antd";
import { Form } from "react-router-dom";

export default function SelectInfo(props) {
  const {
    dataSource,
    children
  } = props
  return (
    <Form>
      <Form.Item name={['select']}>
        <Select options={dataSource} />
      </Form.Item>
      {
        value.select.map((item) => {
          return <Form.Item name={['form']} item={item}>
            <Form>{children}</Form>
          </Form.Item>
        })
      }
    </Form>
  )
}