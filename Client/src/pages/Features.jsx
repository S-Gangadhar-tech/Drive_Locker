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
        <div className="w-full max-w-4xl mx-auto">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
                    Select a Service
                </h1>
                <p className="text-sm md:text-base text-gray-400">
                    Access your secured notes and files, encrypted with custom passkeys.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 justify-center">
                {/* Notes Service Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    whileHover={{ y: -6 }}
                    className="h-full"
                >
                    <Card
                        className="rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full cursor-pointer hover:border-red-500/30 group transition-all"
                        onClick={notesClick}
                    >
                        <CardHeader className="p-0 mb-4">
                            <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 mb-4 border border-red-500/20 w-fit group-hover:scale-110 transition-transform">
                                <FiFileText size={32} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Notes Vault
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mb-6">
                            <CardDescription className="text-sm text-gray-400 leading-relaxed">
                                Write, store, and edit encrypted text notes. Ideal for private credentials, journals, or confidential reminders.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-0">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    notesClick();
                                }}
                                variant="outline"
                                className="w-full py-6 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 group-hover:bg-red-600 group-hover:border-transparent transition-all flex items-center justify-center gap-2"
                            >
                                <span>Open Notes</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* File Storage Service Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    whileHover={{ y: -6 }}
                    className="h-full"
                >
                    <Card
                        className="rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full cursor-pointer hover:border-red-500/30 group transition-all"
                        onClick={filesClick}
                    >
                        <CardHeader className="p-0 mb-4">
                            <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 mb-4 border border-red-500/20 w-fit group-hover:scale-110 transition-transform">
                                <FiHardDrive size={32} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Secure File Locker
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mb-6">
                            <CardDescription className="text-sm text-gray-400 leading-relaxed">
                                Lock and upload documents, photos, or other media files. Everything is securely stored using a passkey encryption standard.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-0">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    filesClick();
                                }}
                                variant="outline"
                                className="w-full py-6 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 group-hover:bg-red-600 group-hover:border-transparent transition-all flex items-center justify-center gap-2"
                            >
                                {userData && !userData.hasPasskey && <FiLock size={14} />}
                                <span>{userData?.hasPasskey ? "Open Files" : "Setup Passkey"}</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;