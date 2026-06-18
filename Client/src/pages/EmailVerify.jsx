import { useRef, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

const EmailVerify = () => {
    const { verifyOtpCode, userData, isLoggedin, loading } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[index] = val;
            setOtp(newOtp);
            if (val !== "" && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        const newOtp = [...otp];
        paste.forEach((digit, i) => {
            if (/^[0-9]$/.test(digit) && i < OTP_LENGTH) {
                newOtp[i] = digit;
            }
        });
        setOtp(newOtp);
        const nextIndex = paste.length < OTP_LENGTH ? paste.length : OTP_LENGTH - 1;
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyEmailOtp = async () => {
        const otpString = otp.join("");
        if (otp.length !== OTP_LENGTH || otp.some((digit) => digit === "")) {
            toast.error("Please enter the complete 6-digit OTP.");
            return;
        }
        try {
            await verifyOtpCode(otpString);
            navigate("/");
        } catch (error) {
            // Error is already toasted by hook
        }
    };

    useEffect(() => {
        if (isLoggedin === true && userData?.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedin, userData, navigate]);

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl text-center">
                    <CardHeader className="flex flex-col items-center pb-6">
                        <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
                            <FiMail size={32} />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
                            Verify Email
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-400 mt-2">
                            Enter the <strong className="text-gray-300">6-digit code</strong> sent to your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* OTP Input Section */}
                        <div className="flex justify-center gap-2 mb-8">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    disabled={loading}
                                    className="w-12 h-14 bg-white/5 text-white text-center border border-white/10 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={verifyEmailOtp}
                            disabled={loading}
                            className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Verify Code</span>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default EmailVerify;