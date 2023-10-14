import { Button, Checkbox, Form, Input } from 'antd';
import SelectInfo from './SelectInfo';

export default function SelectForm(props) {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFieldsChange={(value) => {
        console.log(value);
        props.onChange(value)
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}

      >
        <SelectInfo />
      </Form.Item>
    </Form>
  )
}