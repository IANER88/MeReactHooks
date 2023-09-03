import {
  Form,
  Input,
  Button
} from 'antd'
import useDataStore from '../../assets/hooks/useDataStore'
import React from 'react';
export default function Test() {
  const { onChange, value, DataStore } = useDataStore()
  return (
    <div>
      <DataStore>
        <Form onValuesChange={(changeValue, allValue) => {
          onChange(allValue)
        }} initialValues={value}>
          <Form.Item name="name" label="name">
            <Input />
          </Form.Item>
          <Form.Item name="label" label="label">
            <Input />
          </Form.Item>
        </Form>
      </DataStore>
    </div>
  )
}