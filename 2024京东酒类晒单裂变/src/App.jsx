import React, { useEffect, useState } from 'react';
import './App.module.css';
import testJpg from './test.jpg';
import * as http from './utils/http';
import * as tunnel from './share/tunnel';
import Home from './pages/Home';

/**
 * 渲染到ipaas-floor-app结点中的组件
 */
function App({ payload, env }) {
  return <Home {...{ payload, env }} />;
}

// 导出App组件
export default App;
