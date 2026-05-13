import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import MigrationForm from './components/MigrationForm';
import ProgressDashboard from './components/ProgressDashboard';
import BackupForm from './components/BackupForm';
import SuccessAnimation from './components/SuccessAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Download, ArrowRightLeft } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/transfer';
const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [stage, setStage] = useState('config'); // 'config', 'progress', 'success'
  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer', 'backup'
  const [progressData, setProgressData] = useState({});
  const [error, setError] = useState(null);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('transfer-progress', (data) => {
      setProgressData((prev) => ({
        ...prev,
        [data.collection]: data
      }));
    });

    socket.on('transfer-complete', () => {
      setStage('success');
    });

    socket.on('transfer-error', (data) => {
      setError(data.message);
    });

    return () => socket.disconnect();
  }, []);

  const handleFetchCollections = async (sourceUri, dbName) => {
    setIsLoadingCollections(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/collections`, { sourceUri, dbName });
      setIsLoadingCollections(false);
      return response.data.collections;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch collections');
      setIsLoadingCollections(false);
      return null;
    }
  };

  const handleStartMigration = async (formData) => {
    setStage('progress');
    setProgressData({});
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/start`, formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start migration');
      setStage('config');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} stage={stage} />
      
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Migrate Your Data with <span className="text-gradient">Precision.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            The fastest way to move collections between MongoDB Atlas clusters. 
            Built for scale, optimized for reliability.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {stage === 'config' ? (
            activeTab === 'transfer' ? (
              <motion.div
                key="config-transfer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <MigrationForm 
                  onStart={handleStartMigration} 
                  onFetchCollections={handleFetchCollections}
                  isLoadingCollections={isLoadingCollections}
                />
              </motion.div>
            ) : (
              <motion.div
                key="config-backup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <BackupForm />
              </motion.div>
            )
          ) : stage === 'progress' ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <ProgressDashboard progressData={progressData} error={error} />
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setStage('config')}
                  className="px-6 py-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm font-medium"
                >
                  Configure New Migration
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SuccessAnimation onReset={() => setStage('config')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}

export default App;
