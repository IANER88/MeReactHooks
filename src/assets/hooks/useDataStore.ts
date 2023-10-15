import { useEffect, useCallback, useMemo, useState } from "react";
import { FormInstance, message } from 'antd'
type ParamsType = {
  /**
   * antd 的表单 Form.useForm();
   */
  form: FormInstance<any>,
  /**
   * 键,设置了它的固定开头
   */
  key: `data-store-${string}`,
  /**
   * 是否开启提醒
   */
  isRemind?: boolean;
}
/**
 * 关闭页面时保存 form 数据到本地存储中
 * @param params 需要传递的参数
 */
export default function useDataStore(params: ParamsType) {
  const {
    form,
    key,
  } = params;
  const state = {
    type: 'create',
    value: {}
  };
  const onChange = (_thisValue: any, allValue: any) => {
    if (state.type === 'create') state.type = 'update';
    state.value = allValue;
  }

  const set = () => {
    if (state.type === 'update') {
      const newData = JSON.stringify(state.value);
      localStorage.setItem(key, newData);
    }
  }
  const beforeunload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    set();
    // event.returnValue = false;
    // return false;
  }
  const onSubmit = () => {
    form.validateFields().then(() => {
      localStorage.removeItem(key);
      form.resetFields();
    }).catch(() => {
      console.log(2);
    })
  };
  useEffect(() => {
    try {
      const oldData = localStorage.getItem(key);
      form.setFieldsValue(JSON.parse(oldData ?? ''));
    } catch (error) {

    }
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      set();
      window.removeEventListener("beforeunload", beforeunload);
    }
  }, []);

  return {
    onChange
  }
}