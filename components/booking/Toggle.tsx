import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaCalendar } from 'react-icons/fa';

const Toggle: React.FC<ToggleProps> = ({ isOn, setIsOn }) => {
  const STYLES = {
    container: {
      height: '40px',
      width: '100px',
      backgroundColor: isOn ? '#1F407B' : '#386DCD',
      borderRadius: '25px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 5px',
      cursor: 'pointer',
      transition: 'all .3s',
      justifyContent: isOn ? 'flex-end' : 'flex-start',
    },
    handle: {
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    icon: {
      color: isOn ? '#1F407B' : '#386DCD',
    },
  };

  return (
    <div className='container' onClick={() => setIsOn(!isOn)} style={STYLES['container']}>
      <motion.div layout className='handle' style={STYLES.handle}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.span
            className={`icon`}
            style={STYLES.icon}
            key={isOn ? 'moon' : 'sun'}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOn ? <FaCalendar /> : <FaSun />}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Toggle;
