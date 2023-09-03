import { Tag, TagProps } from 'antd';
import React, { cloneElement, useState } from 'react';
import { motion } from 'framer-motion';

type DataSourceType = {
  label: number | string;
  value: number | string;
};
type ColorPropsType = {
  /**
   * 激活
   */
  active?: TagProps['color'];
  /**
   * 未激活
   */
  inactivated?: TagProps['color'];
};
/**
 * 选择组件 props 类型定义
 */
type SelectTagProps = React.FC &
  TagProps & {
    /**
     * 颜色选择激活和未激活
     */
    color?: ColorPropsType;
    /**
     * 关闭图标
     */
    closeIcon?: TagProps['closeIcon'];
    /**
     * 数据源
     */
    dataSource: DataSourceType[];
    /**
     * 不受控时候的初始值
     */
    initialValue?: DataSourceType['value'][] | [];
    /**
     * 受控值
     */
    value?: DataSourceType['value'][] | [];
    /**
     * 点击事件
     * @param value 点击的值
     * @returns 空
     */
    onClick?: (value: DataSourceType) => void;
    /**
     * 值变化回调
     * @param selfValue 当前变化值
     * @param allValue 全部值
     * @returns 空
     */
    onChange: (
      selfValue: DataSourceType,
      allValue?: DataSourceType['value'][],
    ) => void;
  };
/**
 * 好看的标签选择组件
 * @param props 标签选择支柱
 * @returns {React.ReactNode} JSX
 */
export default function SelectTag(props: SelectTagProps): JSX.Element {
  const {
    dataSource,
    color = { active: 'blue', inactivated: 'default' },
    onClick,
    onChange,
    value,
    closeIcon = null,
    initialValue = [],
  } = props;
  const { active, inactivated } = color;
  const [data, setData] = useState<DataSourceType['value'][]>(initialValue);
  const [framer, setFramer] = useState<number>();
  return (
    <div className="aspirin-select-tag-box">
      {dataSource.map((item: DataSourceType) => {
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: data?.includes(framer) ? 180 : 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            key={item.value}
          >
            <Tag
              style={{
                ...props.style,
              }}
              color={(value ?? data)?.includes(item.value) ? active : inactivated}
              onClick={() => {
                setFramer(item.value)
                if (!value) {
                  if (data.includes(item.value)) {
                    const newValue = data.filter((hove) => hove !== item.value);
                    setData(newValue);
                    onChange && onChange(item, newValue);
                  } else {
                    setData([...data, item.value]);
                    onChange && onChange(item, [...data, item.value]);
                  }
                }
                onClick && onClick(item);
                onChange && onChange(item);
              }}
            >
              {item.label}
              {(value ?? data)?.includes(item.value) && closeIcon}
            </Tag>
          </motion.div>
        );
      })}
    </div>
  );
}
