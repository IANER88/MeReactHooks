import { useEffect } from "react";
import { FormInstance } from 'antd'
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
  const beforeunload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    const newData = JSON.stringify(form.getFieldsValue());
    localStorage.setItem(key, newData);
    event.returnValue = false;
    return false;
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
      window.removeEventListener("beforeunload", beforeunload)
    }
  }, []);

  return onSubmit;
}