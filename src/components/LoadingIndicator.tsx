
import { motion } from "framer-motion";
import { Blocks, Box } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Spinning cube animation */}
          <motion.div 
            className="w-24 h-24 flex items-center justify-center"
            animate={{ 
              rotateY: [0, 360],
              rotateX: [0, 360]
            }}
            transition={{ 
              duration: 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className="w-16 h-16 relative">
              {/* Main cube */}
              <div className="absolute top-0 left-0 w-full h-full">
                <Box className="w-16 h-16 text-minecraft-secondary" strokeWidth={1.5} />
              </div>
              
              {/* Spinning border */}
              <motion.div
                className="absolute w-full h-full rounded-md border-2 border-minecraft-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          
          {/* Small blocks that float around */}
          <motion.div 
            className="absolute -bottom-4 -left-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <Blocks className="w-8 h-8 text-minecraft-primary/80" />
          </motion.div>
          
          <motion.div 
            className="absolute -top-4 -right-4"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -45, 0]
            }}
            transition={{ 
              duration: 3.2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <Blocks className="w-8 h-8 text-minecraft-secondary/80" />
          </motion.div>
        </div>
        
        <motion.p 
          className="mt-6 text-white font-bold text-lg"
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Loading
        </motion.p>
      </motion.div>
    </div>
  );
}
