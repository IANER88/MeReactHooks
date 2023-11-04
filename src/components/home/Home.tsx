import { Button, Form, Input } from 'antd'
import { useEffect } from 'react';
export default function Home() {
  const VSForm = (props: any) => {
    const { status } = Form.Item.useStatus();
    const [form] = Form.useForm();

    useEffect(() => {
      if (status === 'error') {
        form?.validateFields();
      }
    }, [status])

    return (
      <Form form={form} onValuesChange={(...[, value]) => {
        props?.onChange(value)
      }}>
        <Form.Item label="name" name="name" rules={[
          {
            required: true
          }
        ]}>
          <Input />
        </Form.Item>
      </Form>
    )
  }
  return (
    <Form onValuesChange={(value, allValue) => {
      console.log(allValue);
    }}>
      <Form.Item label="name" name="name" rules={[
        {
          required: true
        }
      ]}>
        <Input />
      </Form.Item>
      <Form.Item name="age" rules={[
        {
          required: true,
          message: ''
        }
      ]}>
        <VSForm />
      </Form.Item>
      <Button htmlType="submit">提交</Button>
    </Form>
  )
}