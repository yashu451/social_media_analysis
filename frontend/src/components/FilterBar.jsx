import React from 'react';
import { Filter, RotateCcw, X, Layers, Globe, Smile, Calendar } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters,
  totalFilteredCount,
  totalCount,
  availablePlatforms = ['TikTok', 'Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
  availableCountries = [
    'USA', 'India', 'UK', 'Canada', 'Australia', 'Germany',
    'UAE', 'France', 'Brazil', 'Japan', 'South Africa', 'Mexico', 'Unknown'
  ],
  availableSentiments = ['Positive', 'Neutral', 'Negative'],
  availableYears = ['2023', '2024']
}) {
  const isFiltered = (
    filters.platform !== 'All' ||
    filters.country !== 'All' ||
    filters.sentiment !== 'All' ||
    filters.year !== 'All' ||
    (filters.search && filters.search.trim() !== '')
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Title & Quick Status */}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
          <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Global Slicers</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            ({totalFilteredCount.toLocaleString()} of {totalCount.toLocaleString()} posts)
          </span>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 lg:max-w-4xl">
          {/* Platform Slicer */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Platforms (5)</option>
              {availablePlatforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Country Slicer */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Countries (13)</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sentiment Slicer */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Smile className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Sentiment
            </label>
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Sentiments (3)</option>
              {availableSentiments.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Year Slicer */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Years (2023–2024)</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={onResetFilters}
            disabled={!isFiltered}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              isFiltered
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
            }`}
            title="Reset all slicers to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {isFiltered && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Active Filters:</span>
          {filters.platform !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Platform: {filters.platform}
              <button onClick={() => setFilters(f => ({ ...f, platform: 'All' }))}><X className="w-3 h-3 hover:text-teal-900" /></button>
            </span>
          )}
          {filters.country !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Country: {filters.country}
              <button onClick={() => setFilters(f => ({ ...f, country: 'All' }))}><X className="w-3 h-3 hover:text-teal-900" /></button>
            </span>
          )}
          {filters.sentiment !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Sentiment: {filters.sentiment}
              <button onClick={() => setFilters(f => ({ ...f, sentiment: 'All' }))}><X className="w-3 h-3 hover:text-teal-900" /></button>
            </span>
          )}
          {filters.year !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Year: {filters.year}
              <button onClick={() => setFilters(f => ({ ...f, year: 'All' }))}><X className="w-3 h-3 hover:text-teal-900" /></button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Search: "{filters.search}"
              <button onClick={() => setFilters(f => ({ ...f, search: '' }))}><X className="w-3 h-3 hover:text-slate-900" /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
