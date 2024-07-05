// 自动根据mock.js文件生成config.json文件的脚本
// 运行该脚本后，会在当前目录下生成output-config.json文件，该文件复制到config.json文件中即可

const fs = require('fs');



const mockData = require("./src/mock.js")
const payloadProps = mockData.payload.props

const jsonArr = Object.keys(payloadProps).map((key) => {
  if (payloadProps[key].indexOf('.') > -1) {
    return {
      type: 'imguploader',
      name: key,
      label: key,
      param: {
        defaultValue: {
          value: payloadProps[key],
          lable: '默认图片',
        },
        uploadLabel: '上传图片',
        accept: 'image/jpg,image/jpeg,image/bmp,image/png,image/webp,image/gif',
      },
    };
  } else {
    return {
      type: 'text',
      name: key,
      label: key,
      defaultValue: payloadProps[key],
      param: {
        placeholder: '请输入' + key + '(必填)',
      },
    };
  }
});

jsonArr.unshift({
  type: 'text',
  name: 'floorCode',
  label: '模版ID',
  description: '模版ID(为了方便模版复制和提高加载稳定性)',
  param: {
    placeholder: '请输入模版ID(必填)',
  },
});

fs.writeFileSync('output-config.json', JSON.stringify({ configs: jsonArr }));
