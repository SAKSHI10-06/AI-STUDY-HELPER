import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Github, LayoutGrid, CheckCircle2, Rocket, Stars } from 'lucide-react';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* LEFT SIDE: Premium Visuals (Changes based on State) */}
      <motion.div 
        className="hidden lg:flex w-1/2 relative items-center justify-center p-16 overflow-hidden transition-colors duration-700"
        animate={{ backgroundColor: isLogin ? '#0B1120' : '#1a0b2e' }} // Deep Blue vs Deep Purple
      >
         {/* Animated Background Elements */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         
         {/* Gradient Orbs - Dynamic Colors */}
         <motion.div 
            animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.3, 0.5, 0.3],
                backgroundColor: isLogin ? 'rgba(79, 70, 229, 0.3)' : 'rgba(219, 39, 119, 0.3)' // Indigo vs Pink
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen" 
         />
         <motion.div 
            animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.3, 0.5, 0.3],
                backgroundColor: isLogin ? 'rgba(147, 51, 234, 0.2)' : 'rgba(79, 70, 229, 0.2)' // Purple vs Indigo
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen" 
         />
         
         <div className="relative z-10 max-w-lg w-full">
             <AnimatePresence mode='wait'>
                 <motion.div 
                    key={isLogin ? "login-visuals" : "signup-visuals"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                 >
                    {/* Shine Effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>

                    {isLogin ? (
                        <>
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-8">
                                <LayoutGrid size={32} />
                            </div>
                            <h2 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Welcome <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">Back.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                                Pick up right where you left off. Your flashcards and quizzes are waiting.
                            </p>
                            <div className="space-y-5">
                                <FeatureItem text="Resume your progress" delay={0.1} />
                                <FeatureItem text="Access saved study sets" delay={0.2} />
                                <FeatureItem text="View performance stats" delay={0.3} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20 mb-8">
                                <Rocket size={32} />
                            </div>
                            <h2 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Start your <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Journey.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                                Create an account to unlock the full power of AI-driven learning today.
                            </p>
                            <div className="space-y-5">
                                <FeatureItem text="Generate unlimited quizzes" delay={0.1} />
                                <FeatureItem text="Save flashcards forever" delay={0.2} />
                                <FeatureItem text="Track weak areas" delay={0.3} />
                            </div>
                        </>
                    )}
                 </motion.div>
             </AnimatePresence>
         </div>
      </motion.div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white">
         <button 
            onClick={() => window.location.reload()} 
            className="absolute top-10 left-10 flex items-center text-slate-400 hover:text-slate-900 transition-colors font-medium text-sm group"
         >
            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mr-3 group-hover:border-slate-300 group-hover:bg-slate-100 transition-all">
                <ArrowLeft size={16} />
            </div>
            Back to Home
         </button>

         <div className="w-full max-w-[420px]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">{isLogin ? "Welcome back" : "Create account"}</h2>
                        <p className="text-slate-500 text-lg">
                            {isLogin ? "Enter your details to access your workspace." : "Start your free journey today."}
                        </p>
                    </div>

                    {/* Social Auth */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <SocialButton icon={<Github size={20} />} label="Github" />
                        <SocialButton icon={<div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500"></div>} label="Google" />
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400 font-medium">Or continue with email</span></div>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onAuthSuccess(); }}>
                        {!isLogin && (
                            <InputGroup label="Full Name" icon={<User size={20} />} type="text" placeholder="John Doe" />
                        )}
                        
                        <InputGroup label="Email Address" icon={<Mail size={20} />} type="email" placeholder="you@example.com" />
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                {isLogin && <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>}
                            </div>
                            <div className="relative group">
                                <Lock size={20} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 bg-slate-50/50 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`w-full text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] border border-white/10 text-lg ${
                                isLogin 
                                ? 'bg-gradient-to-r from-slate-900 to-slate-800 shadow-slate-900/20' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/20 hover:shadow-indigo-500/40'
                            }`}
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"} 
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className={`ml-1 font-bold hover:underline transition-colors underline-offset-4 decoration-2 ${
                                isLogin ? 'text-indigo-600' : 'text-purple-600'
                            }`}
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const FeatureItem = ({ text, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex items-center gap-4 text-slate-200"
    >
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <CheckCircle2 size={16} className="text-indigo-300" />
        </div>
        <span className="font-medium text-lg">{text}</span>
    </motion.div>
);

const SocialButton = ({ icon, label }) => (
    <button className="flex items-center justify-center py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all gap-3 font-semibold text-slate-700 hover:shadow-sm">
        {icon} {label}
    </button>
);

const InputGroup = ({ label, icon, type, placeholder }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="relative group">
            {React.cloneElement(icon, { size: 20, className: "absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" })}
            <input 
                type={type} 
                placeholder={placeholder} 
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 bg-slate-50/50 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400" 
            />
        </div>
    </div>
);

export default AuthPage;