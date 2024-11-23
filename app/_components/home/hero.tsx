"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative h-[400px] overflow-hidden z-0">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww"
          alt="Beautiful house"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Journey To Your Perfect Home
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let our expert team guide you through the magic of real estate
        </motion.p>
      </div>
    </div>
  );
}
