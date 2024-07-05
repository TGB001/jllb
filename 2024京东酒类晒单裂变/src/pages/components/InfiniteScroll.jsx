import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import {
  getRpx,
} from '@/utils';
import { MockDataContext } from '../Home';

 const InfiniteScroll = () => {
  const payloadProps = useContext(MockDataContext);
  const scrollContainerRef = useRef(null);
  // 滚动文案
  const [showText, setShowText] = useState([
    'J****3获得21-20优惠券',
    'M****R获得21-20优惠券',
    'J****G获得21-10优惠券',
    'A****Y获得21-20优惠券',
    'J****Y获得21-20优惠券',
  ]);
  // 文字背景图片宽度
  const imgWidth = getRpx(568);

  useEffect(() => {
    let timer = null;
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      // 阻止默认事件触发主页面滚动到底部事件
      el.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      timer = setInterval(() => {
        el.scrollLeft = el.scrollLeft + 1;

        if (el.scrollLeft >= imgWidth + getRpx(25)) {
          const text = showText.shift();
          showText.push(text);
          el.scrollLeft = 0;
          setShowText([...showText]);
        }
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          el.scrollLeft = 0;
        }
      }, 20);
    }
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div
      ref={scrollContainerRef}
      style={{
        position: 'absolute',
        top: getRpx(50),
        left: getRpx(30),
        width: getRpx(1000),
        overflow: 'hidden',
        overflowX: 'auto',
        display: 'flex',
      }}
      onScroll={(e) => {
        // 阻止事件冒泡 防止滚动穿透 否者会触发主页面滚动到底部事件
        e.stopPropagation();
      }}
    >
      {showText.map((text, index) => {
        return (
          <div
            key={text}
            style={{
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: imgWidth,
              width: imgWidth,
              height: getRpx(82),
              textWrap: 'nowrap',
              fontSize: getRpx(36),
              boxSizing: 'border-box',
              color: 'rgb(213, 223, 241)',
              position: 'relative',
              marginRight: getRpx(25),
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: imgWidth,
                height: getRpx(82),
              }}
              src={payloadProps.lampImg}
              alt="喇叭icon"
            />
            <span
              style={{
                position: 'absolute',
                left: getRpx(90),
                top: getRpx(20),
              }}
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default InfiniteScroll;
