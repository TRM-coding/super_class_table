import React from 'react';
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate
import { Button } from 'antd';
import { RocketOutlined, FireFilled } from '@ant-design/icons';
import 'antd/dist/reset.css';  // AntD v5 重置样式
import logo from './logo.svg';  // 补充 logo 引入
import './App.css';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">欢迎使用南鸣的超级课程管理系统</h1>
        <div className="nav-buttons">
          <Button
            className="fancy-btn"
            type="primary" shape="round" size="large"
            icon={<RocketOutlined spin />}
            onClick={() => navigate('/table')}
          >
            进入课程表
          </Button>
          <Button
            className="fancy-btn"
            type="primary" shape="round" size="large"
            icon={<FireFilled />}
            onClick={() => navigate('/about')}
          >
            前往搜索页
          </Button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>超级课表.</p>
      </header>
    </div>
  );
}

export default Home;  // 默认导出
