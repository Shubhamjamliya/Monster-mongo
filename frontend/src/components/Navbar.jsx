import { Database, Zap, ArrowRightLeft, Download } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, stage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Monster<span className="text-primary">mongo</span>
          </h1>
        </div>

        {/* Navigation Tabs in Navbar */}
        {stage === 'config' && (
          <div className="flex p-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'transfer' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Migration
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'backup' 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              Backup
            </button>
          </div>
        )}
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-slate-200">System Ready</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
