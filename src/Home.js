import React from 'react';
import logo from './logo.svg';
import {Link} from 'react-router-dom';  // 导入 Link 组件
import './App.css';  // 导入样式文件
function Home() {
  return (
    <div className="App">
        
        <header className="App-header">
          <nav>
            {/* 使用 Link 进行页面跳转 */}
            <ul>
              <li>
                <Link to="/table">Class_Table</Link>  {/* 跳转到主页 */}
              </li>
              <li>
                <Link to="/about">About</Link>  {/* 跳转到 About 页 */}
              </li>
            <ul/>
            </ul>
          </nav>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            超级课表.
          </p>
        </header>
    </div>
  );
}

export default Home;  // 默认导出
