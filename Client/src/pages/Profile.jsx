import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useNotes } from "../hooks/useNotes";
import { useFiles } from "../hooks/useFiles";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import {
    FiUser,
    FiMail,
    FiShield,
    FiKey,
    FiCheckCircle,
    FiAlertTriangle,
    FiLogOut,
    FiFileText,
    FiHardDrive,
    FiArrowLeft,
    FiLock,
    FiUnlock,
    FiCopy,
    FiCheck
} from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
    const { userData, logoutUser } = useAuth();
    const { notes, fetchNotes } = useNotes();
    const { files, loading: filesLoading, fetchUserFiles } = useFiles();
    const { BackendURL } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [copiedId, setCopiedId] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    // Fetch notes and files stats if user is authenticated
    useEffect(() => {
        if (userData) {
            fetchNotes();
            const storedPasskey = sessionStorage.getItem('drive_locker_passkey');
            if (storedPasskey && files === null && !filesLoading) {
                fetchUserFiles(storedPasskey);
            }
        }
    }, [userData, fetchNotes, fetchUserFiles, files, filesLoading]);

    if (!userData) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const copyUserId = () => {
        if (userData.userId) {
            navigator.clipboard.writeText(userData.userId);
            setCopiedId(true);
            toast.success("User ID copied!");
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    const handleSendVerificationOtp = async () => {
        setOtpLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("Verification OTP sent to your email!");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    const userInitials = userData.name
        ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const hasStoredPasskey = !!sessionStorage.getItem('drive_locker_passkey');

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
                onClick={() => navigate("/features")}
                variant="ghost"
                className="flex items-center gap-2 text-gray-400 hover:text-white bg-transparent hover:bg-white/5 px-4 py-2 rounded-xl text-sm"
            >
                <FiArrowLeft size={16} />
                <span>Back to Vault</span>
            </Button>

            {/* Profile Overview Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="glass-card p-6 md:p-8 border border-white/10 rounded-3xl relative overflow-hidden bg-white/5 backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Initials Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-red-600/20 border border-white/10 shrink-0">
                            {userInitials}
                        </div>

                        {/* User Metadata */}
                        <div className="flex-grow text-center sm:text-left space-y-2.5 overflow-hidden w-full">
                            <h2 className="text-2xl font-bold text-white tracking-tight truncate">
                                {userData.name}
                            </h2>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-400">
                                <FiMail size={14} className="text-gray-500 shrink-0" />
                                <span className="truncate">{userData.email}</span>
                            </div>
                            {userData.userId && (
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg w-fit mx-auto sm:mx-0">
                                    <span className="font-mono truncate max-w-[140px] sm:max-w-xs">ID: {userData.userId}</span>
                                    <button 
                                        onClick={copyUserId} 
                                        className="text-gray-400 hover:text-white transition-colors"
                                        title="Copy User ID"
                                    >
                                        {copiedId ? <FiCheck className="text-green-500" size={13} /> : <FiCopy size={13} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Profile Configurations & Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Account Details Status Card */}
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card className="glass border border-white/5 bg-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 text-gray-300 font-semibold text-sm border-b border-white/5 pb-3">
                                <FiShield size={16} className="text-red-500" />
                                <span>Verification & Security</span>
                            </div>

                            <div className="space-y-3.5 pt-1">
                                {/* Account Verification */}
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs text-gray-400">Account Status</span>
                                    {userData.isAccountVerified ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                            <FiCheckCircle size={12} /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                                            <FiAlertTriangle size={12} /> Unverified
                                        </span>
                                    )}
                                </div>

                                {/* Passkey status */}
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs text-gray-400">Locker Security</span>
                                    {userData.hasPasskey ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                            <FiUnlock size={12} /> Passkey Setup
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                                            <FiLock size={12} /> No Passkey
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Configuration Action Buttons */}
                        <div className="pt-6 space-y-2">
                            {!userData.isAccountVerified && (
                                <Button
                                    onClick={handleSendVerificationOtp}
                                    disabled={otpLoading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl text-xs shadow-md transition-colors"
                                >
                                    {otpLoading ? "Sending OTP..." : "Verify Account Now"}
                                </Button>
                            )}

                            {!userData.hasPasskey && (
                                <Button
                                    onClick={() => navigate("/create-passkey")}
                                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                                >
                                    Setup Locker Passkey
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Storage & Locker Statistics Card */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card className="glass border border-white/5 bg-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 text-gray-300 font-semibold text-sm border-b border-white/5 pb-3">
                                <FiHardDrive size={16} className="text-red-500" />
                                <span>Vault Statistics</span>
                            </div>

                            <div className="space-y-4 pt-1">
                                {/* Notes Count */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <FiFileText size={14} className="text-gray-500" />
                                        <span>Notes Stored</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {notes ? notes.length : 0}
                                    </span>
                                </div>

                                {/* Files Count */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <FiHardDrive size={14} className="text-gray-500" />
                                        <span>Files Locked</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {!userData.hasPasskey ? (
                                            <span className="text-gray-500 font-normal text-[11px]">Passkey not set</span>
                                        ) : hasStoredPasskey ? (
                                            files ? files.length : "Loading..."
                                        ) : (
                                            <span className="text-red-500/70 font-normal text-[11px] inline-flex items-center gap-1">
                                                <FiLock size={10} /> Locked
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Locker Unlock Shortcut */}
                        <div className="pt-6">
                            {userData.hasPasskey && !hasStoredPasskey && (
                                <Button
                                    onClick={() => navigate("/files")}
                                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                                >
                                    Unlock Files Locker
                                </Button>
                            )}
                            {hasStoredPasskey && (
                                <div className="text-[10px] text-gray-500 text-center bg-white/5 border border-white/5 px-2 py-1.5 rounded-lg">
                                    Locker unlocked for current session
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Logout & Danger Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Card className="glass border border-white/5 bg-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-white">Session Management</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Logout from your account or lock your current session.</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {hasStoredPasskey && (
                            <Button
                                onClick={() => {
                                    sessionStorage.removeItem('drive_locker_passkey');
                                    toast.success("Files session locked successfully!");
                                    navigate("/profile"); // Reload state
                                }}
                                variant="outline"
                                className="flex-grow sm:flex-grow-0 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs py-5 px-4 rounded-xl"
                            >
                                <FiLock size={14} className="mr-1" />
                                <span>Lock Session</span>
                            </Button>
                        )}
                        <Button
                            onClick={handleLogout}
                            className="flex-grow sm:flex-grow-0 bg-red-600 hover:bg-red-700 text-white text-xs py-5 px-4 rounded-xl shadow-md transition-colors"
                        >
                            <FiLogOut size={14} className="mr-1" />
                            <span>Log Out</span>
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Profile;
