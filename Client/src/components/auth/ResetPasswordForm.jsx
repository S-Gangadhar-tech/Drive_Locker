import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiKey, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OTP_LENGTH = 6;

export const EmailStepForm = ({ onSubmit, loading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-300">Registered Email Address</Label>
                <div className="relative flex items-center">
                    <FiMail className="absolute left-3.5 text-gray-400 z-10" size={18} />
                    <Input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        className="w-full pl-11 pr-4 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                        placeholder="your.email@example.com"
                        autoFocus
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
                )}
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <FiSend size={16} /> Send OTP
                    </span>
                )}
            </Button>
        </form>
    );
};

export const OtpStepForm = ({ onSubmit, email, loading }) => {
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, idx) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[idx] = val;
            setOtp(newOtp);
            if (val !== "" && idx < OTP_LENGTH - 1) {
                inputRefs.current[idx + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        const validPasted = pasted.filter((d) => /^[0-9]$/.test(d));
        const filledOtp = Array(OTP_LENGTH).fill("");
        validPasted.forEach((digit, i) => (filledOtp[i] = digit));
        setOtp(filledOtp);
        const nextIndex = validPasted.length === OTP_LENGTH ? OTP_LENGTH - 1 : validPasted.length;
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
            inputRefs.current[idx - 1].focus();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp.join(""));
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-gray-400">Enter the 6-digit code sent to <strong className="text-gray-300">{email}</strong></p>
            </div>
            <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                    <Input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onPaste={handlePaste}
                        disabled={loading}
                        className="w-12 h-14 bg-white/5 text-white text-center border border-white/10 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                    />
                ))}
            </div>
            <Button
                type="submit"
                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center"
            >
                <span>Continue</span>
            </Button>
        </form>
    );
};

export const PasswordStepForm = ({ onSubmit, loading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data.password))} className="space-y-5">
            <div className="space-y-2 text-left">
                <Label htmlFor="newPassword" className="text-xs font-semibold text-gray-300">New Password</Label>
                <div className="relative flex items-center">
                    <FiKey className="absolute left-3.5 text-gray-400 z-10" size={18} />
                    <Input
                        id="newPassword"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className="w-full pl-11 pr-4 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                        placeholder="Min. 6 characters"
                    />
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>
                )}
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span>Reset Password</span>
                )}
            </Button>
        </form>
    );
};
