import React, { useEffect, useState, useContext } from 'react';
import {
  getRpx,
  imgUri,
  addCart,
  reportWithoutJump,
  jumpSku,
  isJDApp,
  isAndroid,
  jumpOther,
} from '@/utils';
import { MockDataContext } from '../Home';
export default (props) => {
  const { productInfo, inCart, showToast } = props;
  const [isInCart, setIsInCart] = useState(inCart);
  const payloadProps = useContext(MockDataContext);

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        width: getRpx(1065),
        height: getRpx(273),
        bottom: getRpx(20),
        left: getRpx(25),
        overflow: 'hidden',
      }}
    >
      <img
        style={{
          position: 'absolute',
          width: getRpx(1065),
          height: getRpx(273),
        }}
        src={payloadProps.shopSkuImg}
        alt="商品背景"
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          // left: getRpx(93),
          // top: getRpx(18),
          // height: getRpx(759),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: getRpx(15),
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              width: getRpx(245),
              height: getRpx(245),
              flex: `0 0 ${getRpx(245)}px`,
              marginRight: getRpx(57),
              borderRadius: getRpx(33),
            }}
          >
            <img
              style={{
                borderRadius: getRpx(33),
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              src={imgUri(productInfo.image)}
              alt="商品图片"
            />
          </div>
          <div
            style={{
              flex: 1,
              width: 0,
              height: '100%',
              overflow: 'hidden',
              paddingRight: getRpx(21),
            }}
          >
            <div
              style={{
                color: 'rgba(108, 29, 26, 1)',
                fontWeight: 500,
                fontSize: getRpx(42),
                lineHeight: getRpx(42 * 1.3) + 'px',
                display: '-webkit-box', //对象作为弹性伸缩盒子模型显示
                '-webkit-box-orient': 'vertical', //设置或检索伸缩盒对象的子元素的排列方式
                '-webkit-line-clamp': '2', //溢出省略的界限
                overflow: 'hidden', //设置隐藏溢出元素
                marginTop: getRpx(30),
              }}
            >
              {productInfo.name}
            </div>
            <div
              style={{
                marginTop: getRpx(20),
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 81, 70, 1)',
                  fontSize: getRpx(24),
                }}
              >
                预估到手
              </div>
              <div
                style={{
                  color: 'rgb(255, 123, 114)',
                }}
              >
                <span
                  style={{
                    fontSize: getRpx(38.9),
                    fontWeight: 600,
                    fontFamily: 'MyCustomFont'
                  }}
                >
                  ¥
                </span>
                <span
                  style={{
                    fontFamily: 'MyCustomFont',
                    fontSize: getRpx(58.3),
                  }}
                >
                  {productInfo.pPrice.split('.')[0]}
                </span>
                {productInfo.pPrice.split('.')[1] && (
                  <span
                    style={{
                      fontSize: getRpx(40.3),
                    }}
                  >
                    .{productInfo.pPrice.split('.')[1]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        style={{
          position: 'absolute',
          width: getRpx(100),
          height: getRpx(100),
          left: getRpx(40),
          top: getRpx(0),
        }}
        src={payloadProps.recentImg}
        alt="近期热门"
      />
      <div
        style={{
          position: 'absolute',
          width: getRpx(318),
          height: getRpx(99),
          bottom: getRpx(21),
          right: getRpx(21),
        }}
      >
        {isInCart ? (
          <img
            style={{
              width: '100%',
              height: '100%',
            }}
            onClick={(e) => {
              e.stopPropagation()
              window.jmfe?.isApp("jd") && window.jmfe.toMyCart()
            }}
            src={payloadProps.goShopBtnImg}
            alt="去购物车按钮"
          />
        ) : (
          <img
            style={{
              width: '100%',
              height: '100%',
            }}
            onClick={(e) => {
              console.log(e.defaultPrevented);
              e.stopPropagation()
              addCart([productInfo.skuId]).then(
                () => {
                  showToast('加入购物车成功！');
                  reportWithoutJump('Babel_dev_other_gehuproduct')
                  setIsInCart(true);
                },
                () => {
                  showToast('加入购物车失败! ');
                },
              );
            }}
            src={payloadProps.shopBtnImg}
            alt="抄购物车按钮"
          />
        )}
      </div>
    </div>
  );
};
