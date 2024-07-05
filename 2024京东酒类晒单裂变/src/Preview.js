import React from 'react';

export default function ({
  payload: {
     //预览自定义配置
     props,
     //预览素材id
     previewMaterialIds 
  },
  env: {
    //预览素材环境，beta或者production
    materialEnv
  }
}) {
  return <div>我是预览组件</div>;
}