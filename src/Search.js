import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Select } from 'antd';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [todayResults, setTodayResults] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [dayResults, setDayResults] = useState([]);

  // 子序列匹配函数
  const isSubsequence = (str, pattern) => {
    let i = 0, j = 0;
    while (i < str.length && j < pattern.length) {
      if (str[i].toLowerCase() === pattern[j].toLowerCase()) j++;
      i++;
    }
    return j === pattern.length;
  };

  useEffect(() => {
    const raw = localStorage.getItem('classSchedulerData') || '[]';
    const data = JSON.parse(raw);
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const matched = [];
    if (query) {
      data.forEach((row, rowIndex) => {
        DAYS.forEach((day) => {
          const lec = row[day];
          if (lec.name !== '—' && isSubsequence(lec.name, query)) {
            matched.push({
              key: `${day}-${rowIndex}`,
              name: lec.name,
              day,
              period: `第${rowIndex + 1}节课`,
              location: lec.location,
            });
          }
        });
      });
    }
    setResults(matched);
  }, [query]);

  // 搜索当日课程
  const searchToday = () => {
    const raw = localStorage.getItem('classSchedulerData') || '[]';
    const data = JSON.parse(raw);
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayIdx = new Date().getDay();
    const dayKey = DAYS[todayIdx];
    const matched = data.map((row, rowIndex) => {
      const lec = row[dayKey];
      return { 
        key: rowIndex, 
        name: lec.name !== '—' ? lec.name : '', 
        period: `第${rowIndex + 1}节课`, 
        location: lec.location, 
        teacher: lec.teacher 
      };
    }).filter(item => item.name);
    setTodayResults(matched);
  };

  // 搜索指定周几课程
  const searchByDay = () => {
    const raw = localStorage.getItem('classSchedulerData') || '[]';
    const data = JSON.parse(raw);
    const matched = data.map((row, rowIndex) => {
      const lec = row[selectedDay];
      return {
        key: rowIndex,
        name: lec.name !== '—' ? lec.name : '',
        period: `第${rowIndex + 1}节课`,
        location: lec.location,
        teacher: lec.teacher,
      };
    }).filter(item => item.name);
    setDayResults(matched);
  };

  const columns = [
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '星期',       dataIndex: 'day',  key: 'day'  },
    { title: '节次',       dataIndex: 'period', key: 'period' },
    { title: '教室',       dataIndex: 'location', key: 'location' },
  ];

  const todayColumns = [
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '节次',     dataIndex: 'period', key: 'period' },
    { title: '教室',     dataIndex: 'location', key: 'location' },
    { title: '老师',     dataIndex: 'teacher', key: 'teacher' },
  ];

  return (
    <div className="search-page">
      <h1 className="search-title">课程搜索</h1>
      <div className="search-controls">
        <Input.Search
          className="search-input"
          placeholder="输入课程名称搜索"
          value={query}
          onChange={e => setQuery(e.target.value)}
          allowClear
        />
        <Button className="search-btn" onClick={searchToday}>
          搜索当日课程
        </Button>
        <Select
          className="day-select"
          placeholder="选择星期"
          value={selectedDay}
          onChange={v => setSelectedDay(v)}
          options={['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => ({ value: d, label: d }))}
          allowClear
        />
        <Button className="search-btn" onClick={searchByDay} disabled={!selectedDay}>
          搜索指定星期课程
        </Button>
      </div>
      <div className="tables-container">
        <Table
          className="search-table"
          dataSource={results}
          columns={columns}
          pagination={false}
          locale={{ emptyText: '无匹配课程' }}
        />
        <Table
          className="search-table"
          dataSource={todayResults}
          columns={todayColumns}
          pagination={false}
          locale={{ emptyText: '今日无课程' }}
        />
        <Table
          className="search-table"
          dataSource={dayResults}
          columns={todayColumns}
          pagination={false}
          locale={{ emptyText: '该天无课程' }}
        />
      </div>
    </div>
  );
}

export default Search;
