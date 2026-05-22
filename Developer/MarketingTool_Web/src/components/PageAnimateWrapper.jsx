import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// @third-party
import { motion } from 'motion/react';

// @project
import { varSlide } from '@/components/third-party/motion/animate/dialog';

// @types

/***************************  ANIMATION - WRAPPER  ***************************/

export default function PageAnimateWrapper({ children }) {
  const location = useLocation();

  // Use location to ensure the motion container re-keys on route changes
  // which causes the animation to run on each Outlet render/navigation.
  // We use pathname here so the animation runs when the path changes.
  const outletKey = location.pathname;

  return (
    <motion.div key={outletKey} variants={varSlide('slideInDown', { distance: 50 })} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}

PageAnimateWrapper.propTypes = { children: PropTypes.any };
