import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const ITEM_TYPE = 'CARD';

export default function DraggableCard({ lesson, day, rowIndex, moveCard, removeCard }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: () => ({ day, rowIndex }),
      collect: monitor => {
        setDragging(monitor.isDragging());
        return { isDragging: monitor.isDragging() };
      },
      end: () => setDragging(false),
    }),
    [day, rowIndex]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: item => {
        if (item.day !== day || item.rowIndex !== rowIndex) {
          moveCard(item.day, item.rowIndex, day, rowIndex);
        }
      },
    }),
    [day, rowIndex, moveCard]
  );

  drag(drop(ref));

  const isEmpty = !lesson || lesson.name === '—';
  return (
    <div
      ref={ref}
      onDragOver={e => e.preventDefault()}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        minHeight: 80,
        border: isEmpty ? '1px dashed #ccc' : 'none',
      }}
    >
      {!isEmpty && (
        <Card
          size="small"
          style={{ width: '100%' }}
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
