import { motion, Variants } from 'framer-motion';
import React from 'react';

interface InViewAnimatorProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  tag?: keyof typeof motion;
}

const InViewAnimator: React.FC<InViewAnimatorProps> = ({
  children,
  className,
  direction = 'up',
  delay = 0,
  tag = 'div',
}) => {
  const MotionComponent = motion[tag] || motion.div;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
      },
    },
  };

  return (
    <MotionComponent
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </MotionComponent>
  );
};

export default InViewAnimator;
