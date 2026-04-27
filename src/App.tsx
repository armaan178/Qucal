import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, Layout, Laptop, Sparkles } from 'lucide-react';
import Calculator from './components/Calculator';
import Whiteboard from './components/Whiteboard';
import AIExplanation from './components/AIExplanation';
import { solveAndExplain } from './services/gemini';

export default function App() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSolve = async (expression: string) => {
    setIsLoading(true);
    try {
      const result = await solveAndExplain(expression);
      setExplanation(result || "Could not generate explanation.");
    } catch (err) {
      setExplanation("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Σ</div>
          <h1 className="font-semibold text-lg tracking-tight">LuminaCalc <span className="text-slate-400 font-normal">v3.0</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">AI Engine Online</div>
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-56px)]">
        {/* Left Column: Advanced Calculator & Logic */}
        <aside className="md:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator onSolve={handleSolve} isLoading={isLoading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <AIExplanation explanation={explanation} isLoading={isLoading} />
          </motion.div>
        </aside>

        {/* Center/Right Column: Workspace Whiteboard */}
        <section className="md:col-span-9 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 min-h-[400px]"
          >
            <Whiteboard className="h-full" />
          </motion.div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>System Log: Ready for input</span>
            <span>Local Instance: Asia-01</span>
          </div>
        </section>
      </main>
    </div>
  );
}
