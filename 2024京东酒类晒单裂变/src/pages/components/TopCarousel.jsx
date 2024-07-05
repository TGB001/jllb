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

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/swiper.min.css';

const TopCarousel = () => {
  const payloadProps = useContext(MockDataContext);
  const showText = [
    'J****3获得21-20优惠券',
    'M****R获得21-20优惠券',
    'J****G获得21-10优惠券',
    'A****Y获得21-20优惠券',
    'J****Y获得21-20优惠券',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: getRpx(50),
        left: getRpx(30),
        width: getRpx(1000),
      }}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1.4}
        spaceBetween={getRpx(25)}
        autoplay={{
          delay: 2000,
        }}
        allowTouchMove={false}
        loop={true}
      >
        {showText.map((text, index) => {
          return (
            <SwiperSlide key={text}>
              <div
                style={{
                  width: getRpx(715),
                  height: getRpx(82),
                  textWrap: 'nowrap',
                  fontSize: getRpx(36),
                  boxSizing: 'border-box',
                  color: 'rgb(213, 223, 241)',
                  position: 'relative',
                }}
              >
                <img
                  style={{
                    position: 'absolute',
                    width: getRpx(715),
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopCarousel;
