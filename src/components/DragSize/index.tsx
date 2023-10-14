import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSSProperties, Children, useEffect, useRef } from "react";
type DragSizeValue = {

}
type DragSizeProps = {
  defaultValue?: DragSizeValue;
  value?: DragSizeValue;
  onChange?: (value: DragSizeProps) => void;
  children: JSX.Element;
}


const DragSize = (props: DragSizeProps) => {
  const {
    defaultValue,
    value,
    onChnage,
    children,
  } = props;
  const onDragMove = () => {

  }
  return (
    <div className="drag-size-box">
      <DndContext onDragMove={onDragMove}>
        {children}
      </DndContext>
    </div>
  )
}

const DragSizeTarget = (props) => {
  const {
    id,
    children
  } = props;
  const target = useRef(null);
  const Bordered = (props) => {
    const { item } = props;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: item.offset,
      data: item
    })
    useEffect(() => {
      console.log([item.target.current]);

    }, [])
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
  return (
    <div className="drag-size-target-box" ref={target}>
      {children}
      <Bordered item={{ id, target, }} className="drag-size-bordered-horizontal" />
    </div>
  )
};


DragSize.DragSizeTarget = DragSizeTarget;
export default DragSize;