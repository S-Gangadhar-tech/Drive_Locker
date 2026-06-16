import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { EmailStepForm, OtpStepForm, PasswordStepForm } from "../components/auth/ResetPasswordForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
    const { triggerResetOtp, completeResetPassword, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otpStr, setOtpStr] = useState("");
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [isPasswordStep, setIsPasswordStep] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSendOtp = async (data) => {
        setEmail(data.email);
        try {
            await triggerResetOtp(data.email);
            setIsOtpStep(true);
        } catch (err) {}
    };

    const handleOtpSubmit = (otpValue) => {
        setOtpStr(otpValue);
        setIsOtpStep(false);
        setIsPasswordStep(true);
    };

    const handleResetPasswordSubmit = async (password) => {
        try {
            await completeResetPassword(email, otpStr, password);
            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {}
    };

    const renderContent = () => {
        if (isSuccess) {
            return (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 rounded-full bg-green-500/10 text-green-500 mb-2 border border-green-500/20">
                        <FiCheckCircle size={36} />
                    </div>
                    <p className="text-xl font-bold text-gray-200">Reset Successful</p>
                    <p className="text-sm text-gray-400">You will be redirected to the login page shortly.</p>
                    <Button
                        onClick={() => navigate("/login")}
                        variant="outline"
                        className="mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all h-auto"
                    >
                        Go to Login
                    </Button>
                </div>
            );
        }

        if (isPasswordStep) {
            return <PasswordStepForm onSubmit={handleResetPasswordSubmit} loading={loading} />;
        }

        if (isOtpStep) {
            return <OtpStepForm onSubmit={handleOtpSubmit} email={email} loading={loading} />;
        }

        return <EmailStepForm onSubmit={handleSendOtp} loading={loading} />;
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative">
                    {!isSuccess && (
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/login")}
                            className="absolute top-6 left-6 text-gray-400 hover:text-white transition flex items-center gap-1.5 text-xs font-medium h-auto py-1.5 px-3"
                        >
                            <FiArrowLeft size={14} /> Back
                        </Button>
                    )}

                    <CardHeader className="text-center pb-6 pt-8">
                        <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-3 border border-red-500/20 mx-auto">
                            <FiLock size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
                            Reset Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderContent()}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;