import { Form, Select, Input, Button, Segmented } from "antd"
import { useDataStore } from "../../assets/hooks";
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Segmented options={['main', 'about', 'store']} onChange={(value) => {
        navigate(`/home/${value}`)
      }}></Segmented>
      <Outlet />
    </>
  )
}

Home.Main = () => {
  const options = Array.from({ length: 7 }).map((item, index) => ({ label: index, value: index }));
  const [form] = Form.useForm();
  const [state, setState] = useState(false)
  const { onChange } = useDataStore({
    form,
    key: 'data-store-id'
  });
  return (
    <>
      <Button onClick={() => {
        setState(!state)
      }}>测试</Button>
      <span style={{ color: state ? 'rebeccapurple' : 'red' }}>难道</span>
      <Form form={form} onValuesChange={onChange}>
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
          <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
    </>
  )
}


Home.About = () => {
  return <span>about</span>
}


Home.Store = () => {
  return <span>store</span>
}