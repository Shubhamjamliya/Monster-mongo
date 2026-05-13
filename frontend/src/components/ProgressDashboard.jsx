import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Database, AlertCircle } from 'lucide-react';

const ProgressDashboard = ({ progressData, error }) => {
  const collectionNames = Object.keys(progressData);
  const allCompleted = collectionNames.length > 0 && collectionNames.every(name => progressData[name].status === 'completed');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold">Migration Progress</h2>
          <p className="text-slate-400 text-sm">Real-time data synchronization</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
          <div className={`flex items-center gap-2 ${allCompleted ? 'text-secondary' : 'text-primary'}`}>
            {allCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Complete</span>
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-semibold">Processing...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {collectionNames.map((name) => {
            const data = progressData[name];
            const isCompleted = data.status === 'completed';
            
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-5 rounded-2xl relative overflow-hidden group"
              >
                {/* Progress Bar Background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-500"
                  style={{ width: `${data.progress}%` }}
                />
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                      <Database className={`w-5 h-5 ${isCompleted ? 'text-secondary' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{name}</h3>
                      <p className="text-xs text-slate-500">
                        {data.count || 0} / {data.total || '?'} documents
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-sm font-bold ${isCompleted ? 'text-secondary' : 'text-slate-300'}`}>
                      {data.progress}%
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {collectionNames.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl border-dashed border-slate-700">
            <p className="text-slate-500 italic">Waiting for process to start...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
