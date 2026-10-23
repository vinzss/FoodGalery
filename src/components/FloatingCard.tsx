import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  glowVariant?: 'terracotta' | 'olive' | 'neutral';
  delay?: number;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  glowVariant = 'terracotta',
  delay = 0,
  onClick,
  as = 'div',
}) => {
  const borderClasses = {
    terracotta: 'hover:border-terracotta/50 hover:shadow-warm-hover',
    olive: 'hover:border-olive/50 hover:shadow-warm-lg',
    neutral: 'hover:border-cream-300 hover:shadow-warm-lg',
  }[glowVariant];

  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 320, damping: 24 } }}
      onClick={onClick}
      className={`warm-card rounded-2xl transition-all duration-300 ${borderClasses} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </MotionTag>
  );
};
