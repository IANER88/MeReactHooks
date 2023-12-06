/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance, message } from 'antd';
import { useCallback, useEffect } from 'react';

type ParamsType = {
  /**
   * antd 的表单 Form.useForm();
   */
  form: FormInstance<any>;
  /**
   * 键,设置了它的固定开头
   */
  key: `data-store-${string}`;
  /**
   * 回显数据提醒
   * 函数为自定义提醒（GetAndSet）是设置数据的函数
   * @param {GetAndSet} 是从本地获取数据回显表单
   * null 为不提醒
   * 不传/undefined为默认行为提醒
   */
  echoRemind?: ((GetAndSet: () => void, cancel: () => void) => void) | null;
  /**
   * 退出提醒（如果是浏览器刷新/关闭）的行为弹框是无法改变的
   * 函数（GetAndSet）是设置数据的函数
   * @param {GetAndSet} 是从本表单获取数据存本地
   * null 为不提醒
   * 不传/undefined为默认行为提醒
   */
  abortRemind?: ((GetAndSet: () => void, cancel: () => void) => void) | null;
};

type RETURN = {
  /**
   * 给 form onValuesChange 用的必须
   * @param arr;
   * @returns;
   */
  onChange: (...arr: unknown[]) => void;
  /**
   * 删除本地存储
   * @returns {void}
   */
  onCancel: () => void;
};

/**
 * 关闭页面时保存 form 数据到本地存储中
 * @param params 需要传递的参数
 */
export default function useDataStore(params: ParamsType): RETURN {
  const { form, key, echoRemind, abortRemind } = params;
  const state: any = {
    type: 'create',
    value: {},
  };
  const onChange = useCallback((allValue: unknown) => {
    if (state.type === 'create') state.type = 'update';
    state.value = allValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = useCallback(() => {
    if (state.type === 'update') {
      const newData = JSON.stringify(state.value);
      localStorage.setItem(key, newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  const get = () => {
    const oldData = localStorage.getItem(key);
    form?.setFieldsValue(JSON.parse(oldData ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const onCancel = () => {
    localStorage.removeItem(key);
    state.type = 'cancel';
  };

  const beforeunload = async (event: BeforeUnloadEvent) => {
    event.preventDefault();
    switch (typeof abortRemind) {
      case 'function':
        abortRemind?.(set, onCancel);
        break;
      case 'undefined':
        set();
        event.returnValue = '';
        break;
      default:
        set();
    }
  };

  useEffect(() => {
    try {
      /**
       * 回显数据提醒
       */
      const data = localStorage.getItem(key);
      if (data) {
        switch (typeof echoRemind) {
          case 'function':
            echoRemind?.(get, onCancel);
            break;
          case 'undefined':
            get();
            message.success('上次未提交的数据已恢复');
            break;
          default:
            get();
        }
      }
      window.addEventListener('beforeunload', beforeunload);
    } catch (error) {
      console.log(error);
      localStorage.setItem(key, '');
    }
    return () => {
      set();
      window.removeEventListener('beforeunload', beforeunload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onChange,
    onCancel,
  };
}
