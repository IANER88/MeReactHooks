import { JSXElementConstructor, ReactElement, cloneElement, forwardRef, useImperativeHandle, useState } from "react";
import { useGetResetInitState, useSignal } from "../../hooks";
import React from "react";
import './index.less'
import Determine from "../Determine";
import { useGetState } from "ahooks";
type ListItemValue = {

}

type ListItemProps = {
  value: ListItemValue;
  onChange: (value: ListItemValue) => void;
  children: React.ReactNode;
}

const ListItem = forwardRef((props: ListItemProps, ref) => {
  const {
    value,
    onChange,
    children,
  } = props;

  const [list, setList, getValue] = useGetState([
    {
      value: ''
    }
  ]);

  const onAdd = () => {
    const value = [...list, {
      value: ''
    }];
    setList(value);
    onChange?.(value);
  }

  const onRemove = (index: number) => {
    const value = (list as any)?.toSpliced(index, 1);
    setList(value)
    onChange?.(value);
  }

  useImperativeHandle(ref, () => ({
    onAdd,
    onRemove,
    getValue,
  }));

  return (
    <div className="list-item-main-box">
      {
        list?.map((item: unknown, index: number) => {
          return (
            <div className="list-item-option-box" key={index}>
              <div className="list-item-option-form-box">
                {
                  React?.Children?.map(children, (option) => {
                    return (
                      cloneElement(option, {
                        onChange,
                        value: item,
                      })
                    )
                  })
                }
              </div>
              <div className="lsit-item-option-edit-box">
                <Determine condition={(index + 1) === list?.length}>
                  <span onClick={onAdd}>添加</span>
                </Determine>
                <Determine condition={(index + 1) !== list?.length || index !== 0}>
                  <span onClick={() => onRemove(index)}>删除</span>
                </Determine>
              </div>
            </div>
          )
        })
      }
    </div>
  )
})

export default ListItem;