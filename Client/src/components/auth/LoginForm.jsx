import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = ({ onSubmit, loading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-300">Email Address</Label>
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
                        placeholder="name@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-300">Password</Label>
                <div className="relative flex items-center">
                    <FiLock className="absolute left-3.5 text-gray-400 z-10" size={18} />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className="w-full pl-11 pr-11 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                        placeholder="••••••••"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 text-gray-400 hover:text-white transition bg-transparent hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </Button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/10 transition-colors"
                disabled={loading}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span>Sign In</span>
                )}
            </Button>
        </form>
    );
};

export default LoginForm;
