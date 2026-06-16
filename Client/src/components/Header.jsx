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
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Decorative backdrop light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Welcome Text */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold border border-red-500/20 mb-6">
              <FiSmile />
              <span>Hey {userData ? userData.name : "Guest"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Welcome to <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">DriveLocker</span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 mb-8 max-w-md leading-relaxed">
              Securely upload and view your files, and easily write private notes protected with custom passkeys.
            </p>

            <div className="flex gap-3 justify-center mb-10 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/features")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-red-600/20 transition-all text-sm w-full sm:w-auto h-auto"
              >
                Enter Vault
              </Button>
            </div>
          </div>

          {/* Feature Icons Section */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-red-500 border border-white/5">
                <FiShield size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-300">Secure Storage</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-red-500 border border-white/5">
                <FiCpu size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-300">Fast & Light</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-red-500 border border-white/5">
                <FiUsers size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-300">Private Vault</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Header;