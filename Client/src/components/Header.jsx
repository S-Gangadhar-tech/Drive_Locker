import assets from "../assets/assets";
import { FiSmile, FiShield, FiCpu, FiUsers } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Decorative backdrop light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side: Welcome Text */}
            <div className="flex flex-col items-start text-left lg:w-1/2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold border border-red-500/20 mb-6">
                <FiSmile />
                <span>Hey {userData ? userData.name : "Guest"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">DriveLocker</span>
              </h1>

              <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
                Securely upload and view your files, and easily write private notes protected with custom passkeys.
              </p>

              <Button
                onClick={() => navigate("/features")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-6 px-10 rounded-xl shadow-lg shadow-red-600/20 transition-all text-base h-auto"
              >
                Enter Vault
              </Button>
            </div>

            {/* Right Side: Feature Icons Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-1/2">
              <div className="flex flex-col items-start gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <FiShield size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">Secure Storage</h3>
                <p className="text-sm text-gray-400">Military-grade encryption for all your data.</p>
              </div>
              
              <div className="flex flex-col items-start gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <FiCpu size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">Fast & Light</h3>
                <p className="text-sm text-gray-400">Optimized for speed and instant access.</p>
              </div>
              
              <div className="flex flex-col items-start gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors sm:col-span-2">
                <div className="p-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                  <FiUsers size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">Private Vault</h3>
                <p className="text-sm text-gray-400">Zero-knowledge architecture. Only you have the keys.</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Header;