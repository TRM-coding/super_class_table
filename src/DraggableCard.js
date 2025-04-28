import React, { useRef, useEffect } from 'react';
import './DraggableCard.css';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const ITEM_TYPE = 'CARD';

export default function DraggableCard({ lesson, day, rowIndex, moveCard, removeCard }) {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: () => ({ day, rowIndex }),
      collect: monitor => {
        return { isDragging: monitor.isDragging() };
      },
      end: () => {},
    }),
    [day, rowIndex]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: item => {
        if (item.day !== day || item.rowIndex !== rowIndex) {
          moveCard(item.day, item.rowIndex, day, rowIndex);
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [day, rowIndex, moveCard]
  );

  const isActive = isOver && canDrop;

  drag(drop(ref));

  const isEmpty = !lesson || lesson.name === '—';
  return (
    <div
      ref={ref}
      onDragOver={e => e.preventDefault()}
      className={`draggable-card${isEmpty ? ' empty' : ''}${isActive ? ' drop-highlight' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {!isEmpty && (
        <Card
          size="small"
          className="lesson-card"
          extra={
            <DeleteOutlined
              onClick={e => {
                e.stopPropagation();
                removeCard(day, rowIndex);
              }}
            />
          }
        >
          <p>{lesson.name}</p>
          <p>{lesson.teacher}</p>
          <p>{lesson.location}</p>
        </Card>
      )}
    </div>
  );
}
