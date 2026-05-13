import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react';

const SuccessAnimation = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="relative">
        {/* Animated Background Rings */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-secondary/30"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
        
        {/* Main Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative bg-gradient-to-br from-secondary to-secondary-dark p-8 rounded-full shadow-2xl shadow-secondary/40"
        >
          <CheckCircle className="w-20 h-20 text-white" />
        </motion.div>
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 100 + 50),
              y: (i < 3 ? -1 : 1) * (Math.random() * 100 + 50)
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary"
          />
        ))}
      </div>

      <div className="text-center space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white flex items-center justify-center gap-3"
        >
          Migration Successful! <PartyPopper className="text-primary" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-lg max-w-md mx-auto"
        >
          All data has been successfully mirrored to your destination database with full integrity.
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onReset}
        className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all group"
      >
        Go Back to Dashboard
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
};

export default SuccessAnimation;
