import React, { useState } from 'react';
import { Database, Link, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BackupForm = () => {
  const [formData, setFormData] = useState({
    uri: '',
    dbName: '',
  });
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBackup = async (e) => {
    e.preventDefault();
    setIsBackupLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/transfer/backup', formData, {
        responseType: 'blob', // Important for file download
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.dbName}_backup.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setIsBackupLoading(false);
    } catch (err) {
      setError('Failed to generate backup. Please check your URI and DB name.');
      setIsBackupLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl shadow-2xl max-w-xl mx-auto"
    >
      <form onSubmit={handleBackup} className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-400 mb-1.5 block">Source MongoDB URI</span>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="uri"
                value={formData.uri}
                onChange={handleChange}
                placeholder="mongodb+srv://..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-400 mb-1.5 block">Database Name</span>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="dbName"
                value={formData.dbName}
                onChange={handleChange}
                placeholder="e.g., prod_db"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </label>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <p className="text-xs text-slate-400">
            Backups are generated on the server and streamed directly to your browser.
          </p>
        </div>

        <button
          type="submit"
          disabled={isBackupLoading}
          className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isBackupLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Download className="w-5 h-5" />
              </motion.div>
              Generating Backup...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Full Backup (ZIP)
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default BackupForm;
