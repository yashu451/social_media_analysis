import React from 'react';
import { BarChart3, Sun, Moon, Download, ShieldCheck, Printer } from 'lucide-react';

export default function Header({
  isDark,
  setIsDark,
  onOpenBenchmarks,
  onExportCsv,
  totalFilteredCount,
  totalUnfilteredCount
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Title and Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Social Media Engagement Analytics
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                React + Chart.js
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validated with Power BI Exports • 2,200 Verified Posts (2023–2024)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          {/* Power BI Validation Button */}
          <button
            onClick={onOpenBenchmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="View comparison against Power BI export summaries"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Power BI Validation</span>
          </button>

          {/* Export Filtered CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition"
            title={`Export current filtered subset (${totalFilteredCount} posts)`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Print/PDF Report */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Print or Save PDF report"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
