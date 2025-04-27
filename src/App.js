import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom'; // 使用 BrowserRouter
import Home from './Home';
import About from './About';
import Class_Table from './Class_Table';

function App() {
  return (
    <Router> {/* 使用 BrowserRouter 作为 Router */}
        <Routes>
          <Route path="/" element={<Home />} />  {/* 主页路由 */}
          <Route path="/about" element={<About />} />  {/* About 页路由 */}
          <Route path="/table" element={<Class_Table />} />  {/* 跳转到主页路由 */}
        </Routes>
      
    </Router>
  );
}

export default App;
