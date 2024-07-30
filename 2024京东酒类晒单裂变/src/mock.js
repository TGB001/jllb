/**
 * 详情请参考ipaas楼层共建标准
 * @seee http:// ipaas.jd.com/wiki/docs/layer-standard/%E6%A5%BC%E5%B1%82%E6%A0%87%E5%87%86#44-%E5%85%B1%E5%BB%BA%E6%A5%BC%E5%B1%82%E6%95%B0%E6%8D%AE%E5%8F%8Aapi%E6%A0%87%E5%87%86
 * @description
 * 下面的数据一部分用于C端共建楼层、一部分用于B端预览组件
 *
 * 其中, C端指的是src/index.js, B端指的是CMS预览区域
 * 每一个字段注释的最后都标注了是C端还是B端使用, 例如：
 * [C]:   C端组件使用
 * [B]:   B端组件使用
 * [C&B:  C端与B端组件使用
 */
const mock = {
  // 楼层关联数据， [C&B]
  payload: {
    // 广告组, [C]
    advIds: [
      {
        advGrpName: 'D11第二波',
        advGrpId: '05084738',
      },
    ],
    // 组件, [C]
    cmpIds: [
      {
        cmpGrpId: '04788746',
        cmpGrpName: '国家地理',
        type: '11',
      },
    ],
    // 返回Object表示用户所配置的自定义表单的值, [C&B]
    props: {
      // "homePopupImg": "//m.360buyimg.com/babel/jfs/t1/196545/40/44308/227602/663e025dF64b7cf68/180e4f6ca53fa4f0.png",
      "crossImg":"//m.360buyimg.com/babel/jfs/t1/192271/36/44695/1948/663e01dbF21570e06/8dc6f81140533e28.png",
      "trumpetImg": "//img30.360buyimg.com/zx/jfs/t1/174573/24/45869/731/6642c537Fac7337be/6e985accf777daf9.png",
      // "ruleBtnImg": "//m.360buyimg.com/babel/jfs/t1/150585/8/39879/8252/6642bc2eFe4390ed4/0451ef08f6bd0535.png",
      "rulePop": "//m.360buyimg.com/babel/jfs/t1/93811/19/41076/133606/663e0323F10ab85fd/9d21b7a6aa4a281f.png",
      "ruleWord": "//m.360buyimg.com/babel/jfs/t1/235543/33/17798/466246/664edaceF953fbb8d/2c7afb8d49bedfb0.png",
      "guideImg": "//m.360buyimg.com/babel/jfs/t1/245437/4/8391/117684/6642f5d5F3670f3d8/274c58c439f1561c.png",
      "bgImg": "//m.360buyimg.com/babel/jfs/t1/163734/8/45790/9016/66508498F4b1f3f7b/ca4b63ef35fe7c2f.jpg",
      "BdImg": "//m.360buyimg.com/babel/jfs/t1/159441/6/45944/52553/663d86efF76ba772f/a5cee0ef99a08863.png",
      "BdGoImg": "http://m.360buyimg.com/babel/jfs/t1/237241/37/20191/12469/66987b96F3db7a579/285ff7a06d5287ec.png",
      "BdNoImg": "http://m.360buyimg.com/babel/jfs/t1/51179/29/25484/11965/66987b97Fbe3489ee/44057fc1c1880328.png",
      "phyPriceImg": "//m.360buyimg.com/babel/jfs/t1/222370/38/40858/67043/663d881fF32ee268c/d8aba581cf9438bd.png",
      "getImg": "//m.360buyimg.com/babel/jfs/t1/238381/14/17121/20886/664d8ca9Fadf2ef05/ba693e96639b17ac.png",
      "clickPutImg1": "http://m.360buyimg.com/babel/jfs/t1/237241/37/20191/12469/66987b96F3db7a579/285ff7a06d5287ec.png",
      "shipImg1": "http://m.360buyimg.com/babel/jfs/t1/238385/5/23006/14326/66987b99F0b15d090/ff92a20a93004a5d.png",
      "sharPriceImg": "http://m.360buyimg.com/babel/jfs/t1/149598/12/37751/57354/66987b97F71df82c6/6368971c9e8895aa.png",
      "useImg": "//m.360buyimg.com/babel/jfs/t1/238381/14/17121/20886/664d8ca9Fadf2ef05/ba693e96639b17ac.png",
      "clickPutImg": "//m.360buyimg.com/babel/jfs/t1/207758/29/32208/18211/663efdf9F49e0adf1/99a8f6311329a7a5.png",
      "shipImg": "//m.360buyimg.com/babel/jfs/t1/236171/9/16357/17915/663efdf4F3fe265b8/26b2dd7f308e083b.png",
      "MyPriceWineGif":"//m.360buyimg.com/babel/jfs/t1/246041/2/8029/177583/6641df9dFf2835468/a02ee91a8fe71017.gif",
      // "orderImg":"//m.360buyimg.com/babel/jfs/t1/215920/26/39215/35033/663dad04F1ffb9e6f/f138b2c261567ede.png",
      "goOrderImg":"//m.360buyimg.com/babel/jfs/t1/109070/32/46400/5380/6641d360Fbf5444a4/eaec6386f0ebe260.png",
      "alOrderImg":"http://m.360buyimg.com/babel/jfs/t1/42066/26/22789/10467/6699c0f1F1f9b9d9c/02e633e6f8fdd3b2.png",
      "shareBtnImg":"//m.360buyimg.com/babel/jfs/t1/238632/11/8054/262923/6642f53cF048607e0/0fa6c05d228c12c1.png",
      "dpsImg":"//m.360buyimg.com/babel/jfs/t1/245052/13/8278/45351/663f214eF9f02f014/065d857715d8c124.png",
      // "orderBgImg":"//m.360buyimg.com/babel/jfs/t1/192124/29/45410/24464/663d8a2fFaf86d371/41e1d0b347fbbb74.png",
      "orderBottomImg":"//m.360buyimg.com/babel/jfs/t1/248345/39/8771/18487/663f0088Ff0ce4827/3cf1d049f523da16.png",
      "newUserCoupon":"//m.360buyimg.com/babel/jfs/t1/227862/17/18265/27038/6642c357Fa8044e3c/a2780e151935a04a.png",
      "usedNewUserCoupon":"//m.360buyimg.com/babel/jfs/t1/172763/17/42194/25469/6642c34eF18d702a4/6b0ddc7fcec1b573.png",
      "newUserCloseImg":"//m.360buyimg.com/babel/jfs/t1/135951/18/42815/1657/66431b8eF9d4107b8/da4aff62c17dec44.png",
      "shopSkuImg":"//m.360buyimg.com/babel/jfs/t1/150612/9/24644/51563/664edde9Fa197c662/48016efa14676c08.png",
      "recentImg":"//m.360buyimg.com/babel/jfs/t1/227671/21/19089/8471/664ed4a6Fbc5739ba/198cb4d2d95858c7.png",
      "shopBtnImg":"//m.360buyimg.com/babel/jfs/t1/246390/36/8493/9341/663d8e6dF93473e51/1599a2fce39fd6e3.png",
      "goShopBtnImg":"//m.360buyimg.com/babel/jfs/t1/129588/10/44035/10066/663d8e6dF68cc710a/7867143bbe0e05ad.png",
      "wordImg":"//img30.360buyimg.com/zx/jfs/t1/196856/6/43810/11659/6641deedF651f97b7/4bcc60f681acb7da.png",
      "shopBgImg":"//m.360buyimg.com/babel/jfs/t1/226983/8/16272/11907/663f2bcaFb2d13eed/37dca2d35f6dd6cb.png",
      "commentCartBgImg":"//m.360buyimg.com/babel/jfs/t1/189851/12/44989/147930/663d8d13F795bc1e0/ada85428c31cb930.png",
      "videoPlayImg":"//m.360buyimg.com/babel/jfs/t1/182087/39/45955/1391/6641e6c7Fd99a43a2/dceec2ca694e9f76.png",
      "sharPriceImg": "http://m.360buyimg.com/babel/jfs/t1/149598/12/37751/57354/66987b97F71df82c6/6368971c9e8895aa.png",
      "shaiPriceImg":"http://m.360buyimg.com/babel/jfs/t1/246093/7/15356/52795/66987b98F9a50d876/655803dd9ccde447.png",
      "invitePriceImg":"//m.360buyimg.com/babel/jfs/t1/185437/29/45310/56910/664d8d46F8e986a06/2f41a60856300cc3.png",
      "priceBgImg":"http://m.360buyimg.com/babel/jfs/t1/247973/34/15719/171448/669f2018F67ff538b/9fe20fe5e5d301dc.png",
      "orderBgImg":"//m.360buyimg.com/babel/jfs/t1/221894/2/40784/27376/664b109bF27a168aa/74c99f9f80da7cdc.jpg",
      "orderImg":"//m.360buyimg.com/babel/jfs/t1/247344/37/7081/30557/66471c5eF394fe55d/666cf89aa37d4aaa.png",
      "lampImg":"//m.360buyimg.com/babel/jfs/t1/247720/16/9756/4368/664d8f50F6e1fac9d/a420ce02bc559f7f.png",
      "coverImg":"//m.360buyimg.com/babel/jfs/t1/242902/27/9313/72424/66472d13F914232b5/b8f3888ac4aaf71e.png",
      "ruleImg":"//m.360buyimg.com/babel/jfs/t1/236238/2/17393/15661/664ab888F7b795faf/f7f08b5d1cf25c34.png",
      "qpsImg":"//m.360buyimg.com/babel/jfs/t1/244757/13/8294/46587/664b1099F670ed516/04a94f5889877be8.jpg",
      "orderBlackImg":"//m.360buyimg.com/babel/jfs/t1/225904/37/17096/39284/664edb35F7b21c0ae/5cfee66690d484cf.jpg",
      "skipImg":"//m.360buyimg.com/babel/jfs/t1/246739/29/9567/487134/664ac068Fd8f2bf7a/3e1b73df4bf4cd12.png",
      "homePopupImg":"//m.360buyimg.com/babel/jfs/t1/228505/10/16586/208444/664adb7dF1d745522/3dde37903d02da2e.png",
      "guideImg":"//m.360buyimg.com/babel/jfs/t1/173980/30/46590/146453/664ae5e3F84f1285e/71497ff772801031.png",
      "countDownTime": "3",
      "mainBackgroundColor":"#141425",
      "placeHolderAdId": "07456625",
      "navListAdId": "07441755",
      "maoTaiAdId": "07456518",
      "newUserAdID":"07454115",
      "shareAdID":"07464135",
      "shareAdID1": "07535357",
      "shaiAdID":"07464144",
      "inviteAdID":"07464148",
      "shaiDanID": "07533580",
      "shareImg": "https://m.360buyimg.com/babel/jfs/t1/151713/14/44134/23802/6644c434F5697efd0/e931a1d6112a8e8d.png",
      "shareQrImg": "https://m.360buyimg.com/babel/jfs/t1/200435/28/44263/156970/664da689Fbfd68e95/3cf6c7e79e9a43cd.png",
      "shareKeyImg": "https://m.360buyimg.com/n1/s120x120_jfs/t2566/341/1119128176/23675/6356333b/568e3d86Naa36a750.jpg",
      "LaXingCouponEncryptAssignmentId":"kWU3Ldr9Ssqjqqk9Rm9NQnMiLdz",
      "shareHasGotToday": "http://m.360buyimg.com/babel/jfs/t1/149598/12/37751/57354/66987b97F71df82c6/6368971c9e8895aa.png",
      "shaiDanHasGotToday":"http://m.360buyimg.com/babel/jfs/t1/246093/7/15356/52795/66987b98F9a50d876/655803dd9ccde447.png",
      "noSkuImg":"//m.360buyimg.com/babel/jfs/t1/192265/13/46408/53536/664ece02F2b0402b7/91da63c0a8772a48.png",
      "riskImg":"//m.360buyimg.com/babel/jfs/t1/205379/13/43424/29538/664c2e43Fbaf0b2ce/ffcec8e9182bce15.jpg",
      "moreImg":"//m.360buyimg.com/babel/jfs/t1/235247/16/18581/3627/66544df9F7609a5c9/7e613699f81942cc.png",
      "priceBgImgHeight": "1209",
    },
    //素材配置面板数据, 对象字段来源: config.json/material.name, [C]
    materialParams: {
      "productId2": [{ "godGrpId": "06840739" }],
      "advId1": [{ "advGrpId": "01240803" }],
      "productId1": [{ "godGrpId": "06839600" }],
    },
    //只适用于src/Preview.js组件, 素材配置面板数据, 对象字段来源: config.json/material.name, [B]
    previewMaterialIds: {
      "advId1": '01240803',
    },
    // 商品组, [C]
    godIds: [{ godGrpName: '超值爆品', godGrpId: '14613855' }],
  },
  // 页面容器环境信息
  env: {
    moduleId: 52248822, // 返回string表示当前楼层id。[C]
    activityId: '00892104', // 返回string表示当前活动id。[C]
    pageId: '2449245', // 返回string表示当前页面id。[C]
    ofn: '2', // 返回number表示当前楼层在搭建系统中的原始序号，通常用于埋点上报信息中的楼层序号。[C]
    materialEnv: 'beta' //只适用于src/Preview.js组件, 标识素材环境变量, [B]
  },
  //只适用于C端楼层组件(src/index.js)，B端预览组件(src/Preview.js)中不适用, [C]
  bridge: Promise.resolve({
    // 跳登陆方法
    goLogin() {
      window.location.href = `// passport.m.jd.com/user/login.action?returnurl=${encodeURIComponent(
        window.location.href,
      )}`;
    },
    // 导航到楼层
    jumpToTargetFloor() {
      alert('我是mock的数据');
    },
    // mock 埋点方法, 本地开发生效，楼层发布后线上注入真实的方法， 使用请参考App.js
    tracking: {
      // 监听用户点击事件后，调用后即可上报
      tracking(param) {
        // 只打印，不做真实上报
        console.log(param);
      },
    },
  }),
};
module.exports = mock;
// export default mock;

