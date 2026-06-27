import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiFileText, FiHardDrive, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    const notesClick = () => navigate("/notes");
    const filesClick = () => {
        if (userData) {
            navigate(userData.hasPasskey ? "/files" : "/create-passkey");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
            {/* Header Section */}
            <motion.div
                className="text-left mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Your Secure <span className="text-red-500">Vaults</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl">
                        Choose a service below to access your encrypted data. Everything is protected with your custom passkey and zero-knowledge architecture.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-300">End-to-End Encrypted</span>
                </div>
            </motion.div>

            {/* Services Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Notes Service Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="h-full"
                >
                    <Card
                        className="rounded-3xl p-8 md:p-10 border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[380px] h-full cursor-pointer hover:border-red-500/40 group transition-all relative overflow-hidden"
                        onClick={notesClick}
                    >
                        {/* Decorative background flair */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors pointer-events-none" />
                        
                        <CardHeader className="p-0 mb-6 relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 w-fit group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                    <FiFileText size={40} />
                                </div>
                                <div className="hidden sm:flex px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 font-medium">
                                    Unlimited Notes
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-white mb-2">
                                Notes Vault
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mb-4 relative z-10 flex-grow">
                            <CardDescription className="text-base text-gray-400 leading-relaxed max-w-sm">
                                Write, store, and edit encrypted text notes. Ideal for private credentials, journals, or confidential reminders.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-0 relative z-10 mt-auto">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    notesClick();
                                }}
                                className="w-full md:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/10 hover:bg-red-600 border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-3 mt-4 mb-2"
                            >
                                <span>Open Notes Vault</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* File Storage Service Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="h-full"
                >
                    <Card
                        className="rounded-3xl p-8 md:p-10 border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[380px] h-full cursor-pointer hover:border-blue-500/40 group transition-all relative overflow-hidden"
                        onClick={filesClick}
                    >
                        {/* Decorative background flair */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors pointer-events-none" />
                        
                        <CardHeader className="p-0 mb-6 relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                                    <FiHardDrive size={40} />
                                </div>
                                <div className="hidden sm:flex px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 font-medium">
                                    End-to-End Encrypted
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-white mb-2">
                                Secure File Locker
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mb-4 relative z-10 flex-grow">
                            <CardDescription className="text-base text-gray-400 leading-relaxed max-w-sm">
                                Lock and upload documents, photos, or other media files. Everything is securely stored using a robust passkey encryption standard.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-0 relative z-10 mt-auto">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    filesClick();
                                }}
                                className={`w-full md:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white border transition-all flex items-center justify-center gap-3 mt-4 mb-2 ${
                                    userData?.hasPasskey 
                                    ? 'bg-white/10 border-white/10 hover:bg-blue-600 hover:border-transparent' 
                                    : 'bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-transparent'
                                }`}
                            >
                                {userData && !userData.hasPasskey && <FiLock size={16} />}
                                <span>{userData?.hasPasskey ? "Open File Locker" : "Setup Required Passkey"}</span>
                                {userData?.hasPasskey && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;