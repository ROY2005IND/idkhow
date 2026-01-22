import { motion, Variants } from 'framer-motion'

export const blockchainVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
    rotate: -180
  },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: 'spring',
      bounce: 0.4
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 }
  }
}

export const blockFloatVariants: Variants = {
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      delay: i * 0.2,
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  })
}

export const glowPulseVariants: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.7)'
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(14, 165, 233, 0.7)',
      '0 0 0 20px rgba(14, 165, 233, 0)',
      '0 0 0 0 rgba(14, 165, 233, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut'
    }
  }
}

export const connectionLineVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 1.5, bounce: 0 },
      opacity: { duration: 0.5, delay: 0.5 }
    }
  }
}

export const slideInUpVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
}

export const slideInRightVariants: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
}

export const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
}

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

export const bounceVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.3,
      repeat: 1
    }
  }
}

export const shakeVariants: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}
