import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiLock, FiKey, FiCheck, FiX } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CreatePasskey = () => {
    const { userData, setPasskey, loading } = useAuth();
    const navigate = useNavigate();
    const [passkeyVal, setPasskeyVal] = useState("");

    useEffect(() => {
        if (userData && userData.hasPasskey) {
            navigate("/files");
        }
    }, [userData, navigate]);

    // Requirements checks
    const hasMinLength = passkeyVal.length >= 8;
    const hasUppercase = /[A-Z]/.test(passkeyVal);
    const hasLowercase = /[a-z]/.test(passkeyVal);
    const hasNumber = /\d/.test(passkeyVal);
    const hasSpecial = /[@$!%*?&]/.test(passkeyVal);

    const isAllValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

    const createKey = async (e) => {
        e.preventDefault();
        if (!userData) {
            toast.error("User data not available. Please log in again.");
            return;
        }
        if (!isAllValid) {
            toast.error("Please meet all complexity requirements before setting the passkey.");
            return;
        }

        try {
            await setPasskey(passkeyVal);
            setPasskeyVal("");
            navigate("/files");
        } catch (err) {
            // Error is handled by hook
        }
    };

    const requirements = [
        { label: "At least 8 characters long", met: hasMinLength },
        { label: "Includes at least one uppercase letter", met: hasUppercase },
        { label: "Includes at least one lowercase letter", met: hasLowercase },
        { label: "Includes at least one numeric digit", met: hasNumber },
        { label: "Includes at least one special character (@$!%*?&)", met: hasSpecial },
    ];

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-3 border border-red-500/20 mx-auto">
                            <FiLock size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
                            Create Passkey
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-400 mt-2">
                            Create a master password to encrypt and lock your private file storage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={createKey} className="space-y-5">
                            {/* Input */}
                            <div className="space-y-1.5 text-left">
                                <Label htmlFor="passkey" className="text-xs font-semibold text-gray-300">Set Passkey</Label>
                                <div className="relative flex items-center">
                                    <FiKey className="absolute left-3.5 text-gray-400 z-10" size={18} />
                                    <Input
                                        id="passkey"
                                        type="password"
                                        placeholder="Enter your passkey"
                                        value={passkeyVal}
                                        onChange={(e) => setPasskeyVal(e.target.value)}
                                        className="w-full pl-11 pr-4 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Requirements checklist */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2.5 text-left">
                                <span className="text-xs font-bold text-gray-300">Complexity Requirements</span>
                                <div className="space-y-2">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            {req.met ? (
                                                <FiCheck className="text-green-500 font-bold" />
                                            ) : (
                                                <FiX className="text-gray-500" />
                                            )}
                                            <span className={req.met ? "text-gray-200" : "text-gray-400"}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Button */}
                            <Button
                                type="submit"
                                disabled={loading || !isAllValid}
                                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-600/10 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FiKey size={14} /> Set Passkey
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default CreatePasskey;