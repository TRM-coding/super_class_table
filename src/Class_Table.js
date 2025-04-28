import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Select, Button } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import DraggableCard, { ITEM_TYPE } from './DraggableCard';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Scheduler() {
  const [form] = Form.useForm();
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('classSchedulerData');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 7 }, (_, row) => {
      const rowData = { key: row };
      DAYS.forEach((d) => {
        rowData[d] = { name: '—', teacher: '', location: '' };
      });
      return rowData;
    });
  });

  useEffect(() => {
    localStorage.setItem('classSchedulerData', JSON.stringify(data));
  }, [data]);

  const handleAddCourse = () => {
    form
      .validateFields()
      .then(({ name, teacher, location, day }) => {
        const rowIdx = data.findIndex((r) => r[day].name === '—');
        if (rowIdx === -1) {
          alert('该天没有空余时间！');
          return;
        }
        const updated = [...data];
        updated[rowIdx] = {
          ...updated[rowIdx],
          [day]: { name, teacher, location },
        };
        setData(updated);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const moveCard = (sourceDay, sourceRow, targetDay, targetRow) => {
    const updated = [...data];
    const srcKey = DAYS[sourceDay];
    const tgtKey = DAYS[targetDay];
    const sourceLesson = updated[sourceRow][srcKey];
    if (updated[targetRow][tgtKey].name !== '—') return;
    updated[sourceRow] = {
      ...updated[sourceRow],
      [srcKey]: { name: '—', teacher: '', location: '' },
    };
    updated[targetRow] = {
      ...updated[targetRow],
      [tgtKey]: sourceLesson,
    };
    setData(updated);
  };

  const removeCard = (dayIndex, rowIndex) => {
    const updated = [...data];
    const key = DAYS[dayIndex];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [key]: { name: '—', teacher: '', location: '' },
    };
    setData(updated);
  };

  const columns = DAYS.map((day) => ({
    title: day,
    dataIndex: day,
    key: day,
    render: (lesson, record, rowIndex) => (
      <DraggableCard
        lesson={lesson}
        day={DAYS.indexOf(day)}
        rowIndex={rowIndex}
        moveCard={moveCard}
        removeCard={removeCard}
      />
    ),
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: 16 }}>
        <h1>Class Scheduler</h1>
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
            <Input placeholder="Course name" prefix={<UserOutlined />} allowClear />
          </Form.Item>
          <Form.Item name="teacher">
            <Input placeholder="Teacher" prefix={<TeamOutlined />} allowClear />
          </Form.Item>
          <Form.Item name="location">
            <Input placeholder="Location" prefix={<EnvironmentOutlined />} allowClear />
          </Form.Item>
          <Form.Item name="day" rules={[{ required: true, message: '请选择星期' }]}>
            <Select placeholder="Select day" style={{ width: 140 }} options={DAYS.map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleAddCourse}>
              Add Course
            </Button>
          </Form.Item>
        </Form>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="key"
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          style={{ userSelect: 'none' }}
        />
      </div>
    </DndProvider>
  );
}
