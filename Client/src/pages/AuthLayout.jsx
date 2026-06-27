import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FiLock, FiCloud, FiShield } from "react-icons/fi";
import assets from "../assets/assets";

const AuthLayout = () => {
    const { globalLoading } = useContext(AppContext);

    return (
        <div className="min-h-screen flex font-[Poppins] text-white bg-black">
            {/* Left Side - Branding / About App (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-neutral-900 to-black border-r border-white/5 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="z-10 max-w-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <img src={assets.home} alt="DriveLocker" className="w-10 h-10 rounded-full object-cover" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            DriveLocker
                        </h1>
                    </div>
                    
                    <h2 className="text-3xl font-semibold mb-6 leading-tight">
                        Your secure digital vault for <span className="text-red-500">Files</span> and <span className="text-red-500">Notes</span>.
                    </h2>
                    
                    <p className="text-gray-400 text-lg mb-12">
                        Experience military-grade encryption with a beautiful, intuitive interface. Access your data anywhere, anytime.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                                <FiLock size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">End-to-End Encrypted</h3>
                                <p className="text-sm text-gray-500">Your data is encrypted before it leaves your device.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <FiCloud size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Cloud Synced</h3>
                                <p className="text-sm text-gray-500">Instantly available across all your trusted devices.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                                <FiShield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Zero Knowledge</h3>
                                <p className="text-sm text-gray-500">We cannot read your files or notes, ever.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[url('/bg.png')] bg-cover bg-center">
                {/* Overlay for background image on the right */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:bg-black/90" />
                
                <div className="z-10 w-full max-w-md">
                    <Outlet />
                </div>
            </div>

            {/* Global Loader if any auth action is pending */}
            {globalLoading && <Loader />}
        </div>
    );
};

export default AuthLayout;
