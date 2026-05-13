import React, { useState } from 'react';
import { Database, Link, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MigrationForm = ({ onStart, onFetchCollections, isLoadingCollections }) => {
  const [formData, setFormData] = useState({
    sourceUri: '',
    destinationUri: '',
    dbName: '',
    destinationDbName: '',
    clearDestination: false
  });
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [availableCollections, setAvailableCollections] = useState([]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFetchCollections = async () => {
    const collections = await onFetchCollections(formData.sourceUri, formData.dbName);
    if (collections) {
      setAvailableCollections(collections);
      setSelectedCollections(collections); // Select all by default
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ 
      ...formData, 
      collections: selectedCollections,
      transferOptions: {
        clearDestination: formData.clearDestination,
        destinationDbName: formData.destinationDbName
      }
    });
  };

  const toggleCollection = (name) => {
    if (selectedCollections.includes(name)) {
      setSelectedCollections(selectedCollections.filter(c => c !== name));
    } else {
      setSelectedCollections([...selectedCollections, name]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-400 mb-1.5 block">Source MongoDB URI</span>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="sourceUri"
                  value={formData.sourceUri}
                  onChange={handleChange}
                  placeholder="mongodb+srv://..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-400 mb-1.5 block">Source Database Name</span>
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

          <button
            type="button"
            onClick={handleFetchCollections}
            disabled={!formData.sourceUri || !formData.dbName || isLoadingCollections}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {isLoadingCollections ? 'Fetching...' : 'Fetch Collections'}
          </button>

          {availableCollections.length > 0 && (
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Select Collections</span>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                {availableCollections.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleCollection(col)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCollections.includes(col) 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="py-2 flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-slate-600 rotate-90 md:rotate-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-400 mb-1.5 block">Destination MongoDB URI</span>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="destinationUri"
                  value={formData.destinationUri}
                  onChange={handleChange}
                  placeholder="mongodb+srv://..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-400 mb-1.5 block">Destination DB Name</span>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="destinationDbName"
                  value={formData.destinationDbName}
                  onChange={handleChange}
                  placeholder="(Optional) same as source"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="clearDestination"
                checked={formData.clearDestination}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary outline-none transition-all"
              />
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Clear destination collections before transfer (Prevents duplicate errors)
            </span>
          </label>

          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <p className="text-xs text-slate-400">
              URIs are encrypted before processing. We do not store your credentials.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          Start Migration
        </button>
      </form>
    </motion.div>
  );
};

export default MigrationForm;
