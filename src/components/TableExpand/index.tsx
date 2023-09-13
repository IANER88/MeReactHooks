import { useMount } from "ahooks";
import { Fragment, useState } from 'react'
import './index.less'
import { DndContext, useDraggable } from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSSProperties } from "react";
type onDrag = {
  /**
   * 拖动开始
   * @returns {void}
   */
  start?: () => void;
  /**
   * 拖动结束
   * @returns {void}
   */
  end?: () => void;
  /**
   * 拖动进行中
   * @returns {void}
   */
  move?: () => void;
  /**
   * 拖动结束
   * @returns {void}
   */
  over?: () => void;
  /**
   * 拖动取消
   * @returns {void}
   */
  cancel?: () => void;
}
type TableExpandProps = {
  /**
   * 拖动事件回调
   */
  onDrag?: onDrag & {
    /**
     * 拖动垂直
     */
    verticality?: onDrag,
    /**
     * 拖动横向
     */
    horizontal?: onDrag,
  },
  children: JSX.Element;
  /**
   * 是否设置边框和设置拖动
   * @param {true} 设置为全部
   * @param {false} 相反就是全不设
   * 传对象可以单独设置方向
   */
  bordered?: boolean | {
    [verticality: string]: {
      drag: boolean;
    };
    horizontal: {
      drag: boolean;
    };
  };
}
type BorderedContextType = {
  direction: 'horizontal' | 'verticality';
  dataSource: TableElement[];
  on?: onDrag;
}
type TableElement = {
  element: HTMLElement;
  offset: number;
}
type BorderedType = {
  item: TableElement;
  className: string;
  style: CSSProperties;
}
type renderType = {
  [verticality: string]: JSX.Element;
  horizontal: JSX.Element;
}
export default function TableExpand(props: TableExpandProps) {
  const {
    children,
    onDrag,
    bordered = false,
  } = props
  const [borderedVerticality, setBorderedVerticality] = useState<TableElement[]>([]);
  const [borderedHorizontal, setBorderedHorizontal] = useState<TableElement[]>([]);
  const id = crypto.randomUUID();
  /**
   * 拖动结束后洗牌
   */
  const shuffle = () => {
    const data = (select: string, bool = true) => {
      const table = document.querySelector(select) as HTMLElement
      if (table) {
        const list: TableElement[] = [];
        for (const item of table.children) {
          list.push({
            element: item,
            offset: bool ? item.offsetTop : item.offsetLeft,
          });
        }
        for (const num in list) {
          const index = Number(num)
          if (index != (list.length - 1)) {
            list[index].offset = list[index + 1].offset
          }
        }
        list.pop();
        return list
      }
      return []
    }
    setBorderedVerticality(data(`[data-table="${id}"] table tbody`))
    setBorderedHorizontal(data(`[data-table="${id}"] table thead tr`, false))
  }
  useMount(shuffle);
  const Bordered = (props: BorderedType) => {
    const { item } = props;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: item.offset,
      data: item
    })
    const style: CSSProperties = {
      transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      position: 'absolute',
      background: '#f0f0f0',
      ...props.style,
    };
    return (
      <div className={props.className} ref={setNodeRef} style={style} {...listeners} {...attributes} />
    )
  }
  const BorderedContext = (props: BorderedContextType) => {
    const { direction: direct, dataSource } = props
    const direction = direct === 'verticality';
    const onDragEnd = (event) => {
      const {
        activatorEvent: { target: { style } },
        active: { data: { current: { element } } }
      } = event
      const top = element[direction ? 'offsetHeight' : 'offsetWidth']
      const offset = event.delta[direction ? 'y' : 'x']
      if (offset > 0) {
        style[direction ? 'top' : 'left'] = top + offset + 'px';
        element.setAttribute('style', `${direction ? 'height' : 'width'}: ${top + offset}px`);
      } else {
        const math = Math.abs(offset);
        style[direction ? 'top' : 'left'] = top - math + 'px';
        element.setAttribute('style', `${direction ? 'height' : 'width'}: ${top - math}px`);
      }
      shuffle();
    }
    return (
      <DndContext onDragEnd={onDragEnd}
      modifiers={[direction ? restrictToVerticalAxis : restrictToHorizontalAxis, restrictToParentElement]} >
      {
        dataSource.map((item: TableElement) => {
          return (
            <Bordered
            className={`table-expand-bordered-${direct}`}
            item={item}
            key={item.offset}
            style={{
              left: direction ? 0 : item.offset,
              top: direction ? item.offset : 0,
              height: direction ? 1 : 'auto',
              width: direction ? 'auto' : 1,
              bottom: 0,
              right: 0
              }}
            />
          )
        })
        }
      </DndContext>
    )
  }
  const BorderedReander = () => {
    const element: {
      [key: string]: BorderedContextType;
    } = {
      verticality: {
        dataSource: borderedVerticality,
        on: onDrag?.verticality,
        direction: "verticality"
      },
      horizontal: {
        dataSource: borderedHorizontal,
        on: onDrag?.horizontal,
        direction: "horizontal"
      },
    }
    const render: renderType = {
      verticality: (
        <BorderedContext {...element.verticality} />
      ),
      horizontal: (
        <BorderedContext {...element.horizontal} />
      )
    }
    const OrdinaryRender = (props: BorderedContextType) => {
      const {
        direction: direct,
        dataSource,
      } = props
      const direction = direct === "verticality"
      return (
        <Fragment>
          {
            dataSource.map((item) => {
              return (
                <div
                  className={`table-expand-bordered-no-${direct}`}
                  key={item.offset}
                  style={{
                    position: 'absolute',
                    background: '#f0f0f0',
                    left: direction ? 0 : item.offset,
                    top: direction ? item.offset : 0,
                    height: direction ? 1 : 'auto',
                    width: direction ? 'auto' : 1,
                    bottom: 0,
                    right: 0
                  }}
                />
              )
            })
          }
        </Fragment>
      )
    }
    /**
     * 判断是对象且不能为空
     */
    if (bordered instanceof Object && Object.keys(bordered).length) {
      return Object.keys(bordered).map((item) => {
        return bordered[item].drag === true ? render[item] : <OrdinaryRender {...element[item]} />
      })
    }
    /**
     * 为了确认值的正确性所以这里 === ture
     */
    if (bordered === true) {
      return Object.keys(render).map((item) => render[item])
    }
  }

  return (
    <div
      className={`table-expand-${bordered ? 'bordered' : 'no'}-box`}
      data-table={id}
      style={{
        position: 'relative'
      }}
    > {children}
      {BorderedReander()}
    </div>
  )
}
