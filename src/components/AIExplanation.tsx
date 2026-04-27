import React from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Info, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AIExplanationProps {
  explanation: string | null;
  isLoading: boolean;
  className?: string;
}

export default function AIExplanation({ explanation, isLoading, className }: AIExplanationProps) {
  return (
    <div className={cn("bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col", className)}>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step-by-Step Logic</h2>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-12 gap-4 text-slate-400"
            >
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">Processing Logic...</p>
            </motion.div>
          ) : explanation ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-sm prose-slate max-w-none prose-headings:text-indigo-600 prose-headings:text-xs prose-headings:uppercase prose-headings:tracking-widest prose-p:text-slate-600"
            >
              <Markdown>{explanation}</Markdown>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full py-12 gap-4 text-slate-300 text-center"
            >
              <Info size={32} className="opacity-20" />
              <p className="text-[11px] uppercase tracking-widest max-w-[150px]">Awaiting system input to generate logic</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isLoading && explanation && (
        <div className="mt-6 pt-4 border-t border-slate-100">
           <button className="w-full py-2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-indigo-100 transition-colors">
            Copy Full Report
           </button>
        </div>
      )}
    </div>
  );
}
