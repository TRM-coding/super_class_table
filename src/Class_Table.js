import React, { useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Table columns configuration
const columns = [
  { title: 'Sunday', dataIndex: 'Sunday', key: 'Sunday', render: (text) => <a>{text}</a> },
  { title: 'Monday', dataIndex: 'Monday', key: 'Monday' },
  { title: 'Tuesday', dataIndex: 'Tuesday', key: 'Tuesday' },
  { title: 'Wednesday', key: 'Wednesday', dataIndex: 'Wednesday', render: (_, { tags }) => (
    <>
      {tags.map((tag) => {
        let color = tag.length > 5 ? 'geekblue' : 'green';
        if (tag === 'loser') color = 'volcano';
        return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
      })}
    </>
  ) },
  {
    title: 'Thursday',
    key: 'Thursday',
    render: () => <></>, // Empty rendering for Thursday as delete logic is handled in DraggableRow
  },
  {
    title: 'Friday',
    key: 'Friday',
    render: () => <></>, // Empty rendering for Friday
  },
  {
    title: 'Saturday',
    key: 'Saturday',
    render: () => <></>, // Empty rendering for Saturday
  },
];

// DraggableRow component
const DraggableRow = ({ index, moveRow, handleDelete, ...restProps }) => {
  const [, drag] = useDrag({
    type: 'row',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'row',
    hover: (item) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <tr ref={(node) => drag(drop(node))} {...restProps}>
      <td>
        <Space size="middle">
          <a onClick={() => handleDelete(index)}>Delete</a>
        </Space>
      </td>
    </tr>
  );
};

function ClassTable() {
  const [data, setData] = useState([
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: ['nice', 'developer'] },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: ['loser'] },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park', tags: ['cool', 'teacher'] },
  ]);

  const [inputValue, setInputValue] = useState('');

  const handleDelete = (index) => {
    const newData = data.filter((_, idx) => idx !== index); 
    setData(newData); 
  };

  const handleAddCourse = () => {
    if (inputValue) {
      const newCourse = {
        key: Date.now().toString(), 
        name: inputValue,
        age: Math.floor(Math.random() * 50),
        address: 'Random Address', 
        tags: ['new'], 
      };
      setData([...data, newCourse]); 
      setInputValue(''); 
    }
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const draggedRow = data[dragIndex];
    const updatedData = data.filter((_, idx) => idx !== dragIndex); 
    updatedData.splice(hoverIndex, 0, draggedRow); 
    setData(updatedData); 
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Class Table</h1>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          components={{
            body: {
              row: ({ index, ...restProps }) => {
                return <DraggableRow index={index} moveRow={moveRow} handleDelete={handleDelete} {...restProps} />;
              },
            },
          }}
        />
      </div>
      <div>
        <Input
          size="large"
          placeholder="Enter course name"
          prefix={<UserOutlined />}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br />
        <Button onClick={handleAddCourse}>Add Course</Button>
      </div>
    </DndProvider>
  );
}

export default ClassTable;
