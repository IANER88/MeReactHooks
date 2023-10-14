import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  Modifier
} from '@dnd-kit/core';

import type { DragEndEvent } from '@dnd-kit/core/dist/types/index';

import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import './index.less'
import { CSSProperties, cloneElement, useCallback, useEffect, useState } from 'react';

/**
 * 值的类型定义
 */

type ValueType = {
  label: string | number | JSX.Element;
  value: string | number;
}
type columnsType = {
  /**
   * 列数
   */
  amount: number;
  /**
   * 可拖拽的盒子的宽度
   */
  width?: number;
  /**
   * 盒子的间隙
   */
  gap?: number;
}
/**
 * 限制移动修饰符类型
 */
const enum ModifiersType {
  /**
   * 将拖拽限制为仅水平轴
   */
  restrictToHorizontalAxis,
  /**
   * 将拖拽限制为仅垂直轴
   */
  restrictToVerticalAxis,
  /**
   * 将拖拽范围限制对窗口边缘的移动，可防止拖拽出窗口外
   */
  restrictToWindowEdges,
  /**
   * 将拖拽限范围制移动在父元素盒子里
   */
  restrictToParentElement,
  /**
   * 将拖拽限制为拾取的可拖动项目的第一个可滚动父元素
   */
  restrictToFirstScrollableAncestor,
}

/**
 * 修饰符模块类型
 */
type ModifiersModelType = {
  [key in keyof typeof ModifiersType]: Modifier;
};

export type DragDropPropsType = {
  /**
   * 值变化回调
   * @param allValue 全部值
   * @param oldIndex 旧数组索引/下标
   * @param newIndex 新数组索引/下标
   * @returns {void}
   */
  onChange?: (allValue: ValueType[], oldIndex: number, newIndex: number) => void;
  /**
   * 值/数据源
   */
  value?: ValueType[];
  /**
   * 拖拽配置
   */
  columns?: columnsType;
  /**
   * 可以以 JSX 形式放置，但是必须是 value.map 的
   */
  children?: React.ReactNode;
  /**
   * 限制移动修饰符
   * @pram restrictToHorizontalAxis 将拖拽限制为仅水平轴
   * @pram restrictToVerticalAxis 将拖拽限制为仅垂直轴
   * @pram restrictToWindowEdges 将拖拽范围限制对窗口边缘的移动，可防止拖拽出窗口外
   * @pram restrictToParentElement 将拖拽限范围制移动在父元素盒子里
   * @pram restrictToFirstScrollableAncestor 将拖拽限制为拾取的可拖动项目的第一个可滚动父元素
   */
  modifier?: keyof typeof ModifiersType;
  /**
   * 样式类
   */
  className?: string;
  /**
   * 内联样式
   */
  style?: CSSProperties;
}
/**
 * 拖拽数组 props 类型定义
 */
type DragDropGridPropsType = {
  /**
   * 类型约束
   */
  item: ValueType;
  children?: JSX.Element
}

/**
 * 搭配 dnd-kit 实现的拖拽组件
 * @param props 
 * @returns JSX.Element
 */
export default function DragDrop(props: DragDropPropsType) {
  const {
    value = [],
    columns = {
      amount: 3,
      width: 200,
      gap: 15
    },
    onChange,
    children,
    modifier = 'restrictToParentElement',
    className,
    style,
  } = props

  const sensors = useSensors(useSensor(PointerSensor));
  /**
   * 修饰符函数数组
   */
  const [modifiers, setModifiers] = useState<Modifier[]>([])
  /**
   * 拖拽结束-函数
   * @param event 
   * @returns 
   */
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      /**
       * @oldIndex 旧索引 
       * @newIndex 新索引
       * @newData 新数据/新数组
       */
      const oldIndex = value.findIndex((item) => item.value === active.id);
      const newIndex = value.findIndex((item) => item.value === over.id);
      const newData = arrayMove(value, oldIndex, newIndex);
      onChange && onChange(newData, oldIndex, newIndex)
    }
  };
  /**
   * 动态引入修饰符函数
   */
  const getModifier = useCallback(async () => {
    const module: ModifiersModelType = await import('@dnd-kit/modifiers')
    setModifiers([module[modifier]])
  }, [modifier]);

  useEffect(() => {
    getModifier()
  }, [getModifier])

  return (
    <div
      className={`drag-drop-box${className ? ' ' + className : ''}`}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${columns.amount}, ${columns.width || 200}px)`,
        gap: columns.gap,
      }}>
      <DndContext
        sensors={sensors}
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
        modifiers={modifiers}
      >
        <SortableContext
          items={value.map(item => ({ id: item.value }))}
          strategy={rectSortingStrategy}>
          {
            value.map((item, index) => {
              return (
                <DragDropGrid
                  key={item.value}
                  item={item}
                  children={Array.isArray(children) ? children[index] : null}
                />
              )
            })
          }
        </SortableContext>
      </DndContext>
    </div>
  )
}

const DragDropGrid = (props: DragDropGridPropsType) => {
  const { item, children } = props
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    attributes,
    isDragging
  } = useSortable({ id: item.value });

  const commonStyle = {
    cursor: 'move',
    transition: 'unset',
  };
  const style = transform
    ? {
      ...commonStyle,
      /**
       * 获取当前拖拽 x/y 的位置
       * 设置动画效果
       */
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      transition: isDragging ? 'unset' : transition,
    }
    : commonStyle;

  return children ?
    cloneElement(children, { style, ref: setNodeRef, ...listeners, ...attributes }) :
    (
      <div
        className="drag-drop-drid"
        style={style}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >{item.label}</div>
    )

}