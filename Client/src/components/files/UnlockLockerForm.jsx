import React from 'react';
import { useForm } from "react-hook-form";
import { FiKey } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UnlockLockerForm = ({ onUnlock, loading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        onUnlock(data.passkey);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="space-y-1.5 text-left">
                <Label htmlFor="passkey" className="text-xs font-semibold text-gray-400">Enter Passkey</Label>
                <div className="relative flex items-center">
                    <FiKey className="absolute left-3.5 text-gray-400 z-10" size={18} />
                    <Input
                        id="passkey"
                        type="password"
                        {...register("passkey", { required: "Passkey is required" })}
                        placeholder="Your Secret Passkey"
                        className="w-full pl-11 pr-4 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                    />
                </div>
                {errors.passkey && (
                    <p className="text-xs text-red-500 font-semibold">{errors.passkey.message}</p>
                )}
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/10 transition-colors"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span>Unlock Locker</span>
                )}
            </Button>
        </form>
    );
};

export default UnlockLockerForm;

