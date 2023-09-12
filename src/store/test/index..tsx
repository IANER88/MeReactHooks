import {
  compose,
  Form,
  Section,
  SelectProps,
  useControllableState,
  VSForm,
  VSFormItem,
  withField,
  withPreview,
} from '@vs/vsf-kit';
import { useMount } from 'ahooks';
import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
type DataSourceType = {
  label: string | number;
  value: string | number;
};
export type SelectFormProps = {
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 值单选为字符串，多选为字符
   * initialValues 初始值
   */
  value?: DataSourceType[] | [] | string | (() => Promise<any>);
  /**
   * 值变化回调
   */
  onChange?: (value?: string) => void;
  /**
   * 选择的数据源
   * 不可传请求函数
   */
  dataSource: DataSourceType[] | [];
  /**
   * 多选还是单选默认单选
   */
  mode: SelectProps['mode'];
  children: JSX.Element;
  label: string;
};

/**
 * 选择表单
 */
const SelectForm = (props: SelectFormProps) => {
  const {
    defaultValue,
    value = [],
    onChange,
    dataSource,
    mode = 'multiple',
    children,
    ...rest
  } = props;
  const [values, setValue] = useControllableState({
    defaultValue,
    onChange,
  });

  const [id, setId] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    setData(value);
    setId(value);
  }, [value]);
  /**
   * id 存 select 选择
   * data 存表单信息
   * 这样做到原因是，当用户取消该select选项不会清除 data 对应选项
   * 在用户选择回去的时候可以保留之前的数据
   * 数据会经过这个函数过滤后 onChange 回去
   */
  const getFilterData = useCallback(
    (allVale?: []) => {
      if (Array.isArray(allVale || id)) {
        const newId = (allVale || id || []).map((item) => item.value);
        const list = data.filter((item) => {
          return newId.includes(item.value);
        });
        return list;
      }
    },
    [id, data],
  );
  const NewForm = (props) => {
    const { item, index } = props;
    const ant = (data || []).findIndex(
      (el: DataSourceType) => el.value === item.value,
    );
    const [form] = Form.useForm();

    return (
      <Section title={item.label}>
        <VSForm
          form={form}
          initialValues={data[ant]}
          onValuesChange={(values, allValue) => {
            data[index] = {
              ...data[index],
              ...allValue,
            };
            onChange && onChange(data);
          }}
        >
          {cloneElement(children, {
            form: { value: data[ant], ref: form },
          })}
        </VSForm>
      </Section>
    );
  };
  return (
    <>
      <VSFormItem
        valueType="select"
        dataSource={dataSource}
        label={props.label}
        fieldProps={{
          mode,
          value: id,
          onSelect: (s, self) => {
            /**
             * 用于判断是否存在过找出下标
             */
            const ant = (data || []).findIndex((el: DataSourceType) => {
              return el.value === self.value;
            });
            /**
             * 如果不存在记录
             */
            if (ant === -1) {
              data.push(self);
              onChange && onChange(data);
              // setData((list) => {
              //   list.push(self);
              //   onChange && onChange(list);
              //   return list;
              // });
            }
          },
          onChange: (value, allVale) => {
            setId(allVale);
            /**
             * 有值才过滤
             */
            if (data.length) {
              setValue(getFilterData(allVale));
            }
          },
        }}
      />
      {Array.isArray(id) &&
        id.map((item, index) => (
          <NewForm key={item && item.value} item={item} index={index} />
        ))}
    </>
  );
};
SelectForm.displayName = 'SelectForm';

export default compose(
  withField<SelectFormProps>({
    name: 'SelectForm',
  }),
  withPreview<SelectFormProps>({
    renderPreview: (props) => {
      const { value } = props;

      /** 返回预览模式下的dom */
      return <>预览值：{value}</>;
    },
  }),
)(SelectForm);
