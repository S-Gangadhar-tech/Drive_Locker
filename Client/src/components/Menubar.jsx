import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiLogIn,
    FiMenu,
    FiX,
    FiLogOut,
    FiGrid,
    FiFileText,
    FiHardDrive,
    FiKey,
    FiUser,
    FiAlertTriangle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { BackendURL, setIsLoggedin, setUserData, userData } = useContext(AppContext);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${BackendURL}/auth/send-otp`);
            if (res.status === 200) {
                navigate("/email-verify");
                toast.success("OTP sent successfully");
            } else {
                toast.error("Unable to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post(
                `${BackendURL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            if (res.status === 200) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('drive_locker_passkey');
                setIsLoggedin(false);
                setUserData(null);
                toast.success("Logged out successfully");
                navigate("/login");
            } else {
                toast.error("Logout failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const navItems = [
        { label: "Features", path: "/features", icon: <FiGrid size={18} /> },
        { label: "Notes", path: "/notes", icon: <FiFileText size={18} /> },
        { label: "Files", path: "/files", icon: <FiHardDrive size={18} /> },
    ];

    if (userData && !userData.hasPasskey) {
        navItems.push({
            label: "Create Passkey",
            path: "/create-passkey",
            icon: <FiKey size={18} />,
        });
    }

    return (
        <div className="w-full flex flex-col sticky top-0 z-50">
            {/* Sleek Verification Banner */}
            {userData && !userData.isAccountVerified && (
                <div className="w-full bg-gradient-to-r from-red-950/80 to-amber-950/80 border-b border-red-500/30 text-white px-4 py-2 text-xs md:text-sm flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-2 mx-auto">
                        <FiAlertTriangle className="text-red-500 animate-pulse" size={16} />
                        <span>Please verify your account to unlock all features.</span>
                        <Button
                            onClick={sendVerificationOtp}
                            variant="link"
                            className="ml-4 underline font-bold hover:text-red-400 transition p-0 h-auto text-white"
                        >
                            Verify Now
                        </Button>
                    </div>
                </div>
            )}

            {/* Glassmorphic Navbar */}
            <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between bg-black/40 border-b border-white/5 backdrop-blur-md">
                {/* Logo and Brand Name */}
                <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    <motion.img
                        src={assets.home}
                        alt="DriveLocker Logo"
                        className="h-9 w-9 rounded-xl border border-white/10"
                        whileHover={{ scale: 1.08, rotate: 5 }}
                    />
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-red-500 bg-clip-text text-transparent group-hover:to-red-400 transition-colors">
                        DriveLocker
                    </span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-1.5">
                    {userData && navItems.map((item) => {
                        const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
                        return (
                            <Button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                variant="ghost"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all h-auto ${isActive
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent bg-transparent"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Button>
                        );
                    })}
                </div>

                {/* Desktop Auth Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {userData ? (
                        <div className="flex items-center gap-4">
                            {/* Profile Indicator (Clickable Button) */}
                            <button
                                onClick={() => navigate("/profile")}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm cursor-pointer transition-all"
                                title="Go to Profile"
                            >
                                <FiUser size={14} className="text-red-500" />
                                <span>{userData.name}</span>
                            </button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all h-auto"
                            >
                                <FiLogOut size={14} />
                                <span>Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all h-auto"
                        >
                            <FiLogIn size={14} />
                            <span>Sign In</span>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <Button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        variant="ghost"
                        className="text-gray-300 hover:text-white p-2 rounded-lg bg-white/5 h-auto"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </Button>
                </div>
            </nav>

            {/* Mobile Collapsible Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full bg-neutral-950/95 border-b border-white/5 md:hidden overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col gap-2">
                            {userData && navItems.map((item) => {
                                const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
                                return (
                                    <Button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsMenuOpen(false);
                                        }}
                                        variant="ghost"
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all h-auto justify-start ${isActive
                                            ? "text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                                            : "text-gray-300 hover:text-white hover:bg-white/5 bg-transparent hover:bg-white/5"
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}

                            <hr className="border-white/5 my-2" />

                            {userData ? (
                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 text-sm cursor-pointer text-left transition-all"
                                        title="Go to Profile"
                                    >
                                        <FiUser size={16} className="text-red-500" />
                                        <span>Logged in as <strong>{userData.name}</strong></span>
                                    </button>
                                    <Button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/20 transition-all h-auto"
                                    >
                                        <FiLogOut size={16} />
                                        <span>Logout</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => {
                                        navigate("/login");
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 transition-all h-auto"
                                >
                                    <FiLogIn size={16} />
                                    <span>Sign In</span>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Menubar;