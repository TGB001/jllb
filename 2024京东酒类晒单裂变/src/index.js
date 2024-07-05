import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { setBabelTunnel } from './share/tunnel';
import { setBabelEnv } from './share/env.js';
import * as dra from './share/dra';
import { initUtils } from './utils/index.js';

/**
 * ipass 共建楼层入口文件, 本地开发阶段可以使用src/mock.js中导出的模块
 * 上线后mock.js内容系统自动注入
 */
export default function ({
  // 不能修改, 由系统查询后注入
  bridge,
  env,
  payload,
  tunnel,
  containerElement,
}) {
  setBabelTunnel(tunnel);
  setBabelEnv(env)
  initUtils({
    bridge,
  })
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      ReactDOM.render(
        <React.StrictMode>
          <App bridge={bridge} payload={payload} env={env} />
        </React.StrictMode>,
        containerElement,
        resolve,
      );
    });
  } else {
    const { floorCode } = payload.props
    if (process.env.REACT_APP_FLOOR_CODE + window.babelShareData.encodeActivityId === floorCode) {
      return new Promise((resolve) => {
        ReactDOM.render(
          <React.StrictMode>
            <App bridge={bridge} payload={payload} env={env} />
          </React.StrictMode>,
          containerElement,
          resolve,
        );
      });
    }
  }
}


// 开启B端预览, 开启后自动导入src/Preview.js组件，请确保文件的存在
export const IFLOOR_PREVIEW_ENABLE = false;
