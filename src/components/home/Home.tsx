import { Button, Form, Input, Select } from 'antd'
import { useEffect } from 'react';
export default function Home() {
  const VSForm = (props: any) => {
    // const { status } = Form.Item.useStatus();
    // const [form] = Form.useForm();

    // useEffect(() => {
    //   if (status === 'error') {
    //     form?.validateFields();
    //   }
    // }, [status])
    const form = Form.useFormInstance();
    const watch = Form.useWatch(['list', 'select'], form);
    console.log(watch);
    const SelectOption = (props) => {
      console.log(props);
      return <Select
        options={Array.from({ length: 7 }).map((item, index) => ({ label: index, value: index }))}
      />
    }
    return (
      <Form.List name="list">
        {
          () => {
            return (
              <>
                <Form.Item label="name" name="name"
                  rules={[
                    {
                      required: true
                    }
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="select" name="select"
                  rules={[
                    {
                      required: true
                    }
                  ]}>
                  <SelectOption />
                </Form.Item>
              </>
            )
          }
        }
      </Form.List>
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
      <VSForm />
      <Button htmlType="submit">提交</Button>
    </Form>
  )
}