import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Toggle: React.FC<ToggleProps> = ({ isOn, setIsOn }) => {
  const STYLES = {
    container: {
      height: '40px',
      width: '125px',
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
      width: '50%',
      borderRadius: '25px',
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    icon: {
      color: isOn ? '#1F407B' : '#386DCD',
    },
  }

  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className='container'
      onClick={() => {
        setTimeout(
          () =>
            window.scrollTo({
              top: 0.1 * document.documentElement.clientHeight,
              behavior: 'smooth',
            }),
          0,
        )
        setIsOn(!isOn)
      }}
      style={STYLES.container}
      ref={ref}
    >
      <motion.div layout className='handle' style={STYLES.handle}>
        <AnimatePresence mode='wait' initial={false}>
          <motion.span
            style={STYLES.icon}
            key={isOn ? 'month' : 'day'}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isOn ? 'Month' : 'Day'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Toggle
