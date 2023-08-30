import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  Form,
  Input
} from 'antd'
import useDataStore from './assets/hooks/useDataStore'
function App() {
  const { onChange } = useDataStore();
  return (
    <div>
      <Form onValuesChange={(changeValue, allValue) => {
        console.log(allValue);
      }}>
        <Form.Item label="name">
          <Input />
        </Form.Item>
        <Form.Item label="label">
          <Input />
        </Form.Item>
      </Form>
    </div>
  )
}

export default App
