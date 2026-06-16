import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
    const [isCreateAccount, setCreateAccount] = useState(false);
    const { loginUser, registerUser, loading } = useAuth();

    const onSubmit = async (data) => {
        if (isCreateAccount) {
            await registerUser(data);
            setCreateAccount(false);
        } else {
            await loginUser(data);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent mb-2">
                            {isCreateAccount ? "Create Account" : "Welcome Back"}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-400">
                            {isCreateAccount
                                ? "Sign up to start securing your notes and files"
                                : "Enter your credentials to unlock your DriveLocker"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isCreateAccount ? (
                            <RegisterForm onSubmit={onSubmit} loading={loading} />
                        ) : (
                            <LoginForm onSubmit={onSubmit} loading={loading} />
                        )}

                        {/* Switch Auth Mode */}
                        <div className="mt-6 text-center text-sm text-gray-400">
                            {isCreateAccount ? (
                                <p>
                                    Already have an account?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => setCreateAccount(false)}
                                        className="text-red-500 font-semibold hover:text-red-400 hover:underline transition p-0 h-auto"
                                    >
                                        Sign in
                                    </Button>
                                </p>
                            ) : (
                                <p>
                                    New here?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => setCreateAccount(true)}
                                        className="text-red-500 font-semibold hover:text-red-400 hover:underline transition p-0 h-auto"
                                    >
                                        Create an account
                                    </Button>
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;

