import { motion } from 'framer-motion';
import { ImSpinner2 } from 'react-icons/im'; // Using a spinner icon from react-icons

const Loader = () => {
    return (
        // Overlay container for the blurred background
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                className="flex items-center justify-center p-4 rounded-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {/* Framer Motion for the spinner */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 1
                    }}
                    className="text-white text-6xl" // Adjust size and color as needed
                >
                    <ImSpinner2 /> {/* React Icon spinner */}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Loader;