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
import styles from '../Home.module.css'
import Lottie from 'lottie-react';
import frameData from '../data.json';

const HomePopup = ({ isShowPopup, handleHomePopupClose }) => {
  const payloadProps = useContext(MockDataContext);
  const [showPopup, setShowPopup] = useState(isShowPopup);
  const [closePopup, setClosePopup] = useState(false);
  const lottieRef = useRef(null);

  const countDownTime = payloadProps.countDownTime;
  const time = useRef(countDownTime);
  const timer = useRef(null);

  const [timeChange, setTimeChange] = useState({});

  const handleClosePopup = () => {
    setClosePopup(true);
    setTimeout(() => {
      handleHomePopupClose();
      setShowPopup(false);
    }, 600);
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  const handleCountDown = () => {
    if (time.current <= 0) {
      handleClosePopup();
      return;
    }
    time.current = time.current - 1;
    setTimeChange({});
  };

  useEffect(() => {
    timer.current = setInterval(handleCountDown, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!lottieRef.current) return;
    lottieRef.current.play();
  }, []);

  return showPopup ? (
    <div className={styles.popup}>
      <div
        style={{
          width: getRpx(887),
          height: getRpx(1357),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          transition: 'opacity 500ms ease-in-out',
          opacity: !closePopup ? 1 : 0,
        }}
        onClick={() => {
          handleClosePopup();
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={frameData}
          style={{
            width: '100%',
            height: '100%',
            transform: 'scale(1.2)',
          }}
        />
        <img
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          src={payloadProps.homePopupImg}
        />
        <div
          style={{
            fontSize: getRpx(42),
            textAlign: 'center',
            color: 'rgba(255, 238, 195, 1)',
            position: 'absolute',
            zIndex: 100,
            top: getRpx(971),
            left: getRpx(542),
          }}
        >
          {time.current}S
        </div>
      </div>
    </div>
  ) : null;
};

export default HomePopup;
