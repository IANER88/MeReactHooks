import { Form, Select, Input, Button } from "antd"
import { useDataStore } from "../../assets/hooks";
import { useRef } from "react"
export default function Home() {
  const options = Array.from({ length: 7 }).map((item, index) => ({ label: index, value: index }));
  const [form] = Form.useForm();
  const onSubmit = useDataStore({
    form,
    key: 'data-store-id'
  });
  return (
    <Form form={form}>
      <Form.Item label="年龄" name="select">
        <Select options={options} />
      </Form.Item>
      <Form.Item label="名字" name="text" rules={[
        {
          required: true
        }
      ]}>
        <Input type="text" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" onClick={onSubmit}>提交</Button>
      </Form.Item>
    </Form>
  )
}