import React, {
  useEffect,
  useState,
  useContext,
} from 'react';
import { MockDataContext } from '../Home';
import styles from '../Home.module.css'

const GuideLayer = ({ isShowGuide, handleGuideClose }) => {
  const payloadProps = useContext(MockDataContext);
  const [showGuide, setShowGuide] = useState(true);
  const [destroyGuide, setDestroyGuide] = useState(!isShowGuide);
  useEffect(() => {
    setDestroyGuide(!isShowGuide);
  }, [isShowGuide]);

  return (
    // !destroyGuide &&
    <div
      className={`${styles.guideLayer} ${!showGuide ? styles.guideClose : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 200,
        display: destroyGuide ? 'none' : 'block',
      }}
      onClick={() => {
        setShowGuide(false);
        setTimeout(() => {
          setDestroyGuide(true);
          handleGuideClose();
        }, 600);
      }}
    >
      <div className={styles.guideBlur}></div>
      <img
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        src={payloadProps.guideImg}
        alt=""
      />
    </div>
  );
};

export default GuideLayer;
