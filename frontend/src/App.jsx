import React, { useState, useMemo, useEffect } from 'react';
import { useSocialData } from './hooks/useSocialData';
import {
  filterPosts,
  calculateKpis,
  getPlatformLeaderboardData,
  getEngagementComponentsData,
  getMonthlyTrendData,
  getHourlyPatternData,
  getSentimentStackedData,
  getSentimentPieData,
  getCountryRankingsData,
  getDistributionHistogramData
} from './utils/dataEngine';

import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiGrid from './components/KpiGrid';
import BenchmarkPanel from './components/BenchmarkPanel';
import PostExplorerTable from './components/PostExplorerTable';

import PlatformLeaderboard from './components/charts/PlatformLeaderboard';
import EngagementComponents from './components/charts/EngagementComponents';
import MonthlyTrend from './components/charts/MonthlyTrend';
import HourlyPattern from './components/charts/HourlyPattern';
import SentimentPieChart from './components/charts/SentimentPieChart';
import SentimentStacked from './components/charts/SentimentStacked';
import CountryRankings from './components/charts/CountryRankings';
import DistributionHistogram from './components/charts/DistributionHistogram';

import Papa from 'papaparse';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('social_media_dashboard_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Global filters
  const [filters, setFilters] = useState({
    platform: 'All',
    country: 'All',
    sentiment: 'All',
    year: 'All',
    search: ''
  });

  // Benchmark Panel open/closed
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Sync theme with <html> class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('social_media_dashboard_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('social_media_dashboard_theme', 'light');
    }
  }, [isDark]);

  // Load dataset and Power BI benchmarks
  const { posts, benchmarks, loading, error } = useSocialData();

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      platform: 'All',
      country: 'All',
      sentiment: 'All',
      year: 'All',
      search: ''
    });
  };

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    return filterPosts(posts, filters);
  }, [posts, filters]);

  // Check if any filter is active
  const isFiltered = (
    filters.platform !== 'All' ||
    filters.country !== 'All' ||
    filters.sentiment !== 'All' ||
    filters.year !== 'All' ||
    Boolean(filters.search && filters.search.trim() !== '')
  );

  // 5 KPIs
  const kpis = useMemo(() => {
    return calculateKpis(filteredPosts);
  }, [filteredPosts]);

  // 7 Chart Datasets
  const chart1Data = useMemo(() => getPlatformLeaderboardData(filteredPosts), [filteredPosts]);
  const chart2Data = useMemo(() => getEngagementComponentsData(filteredPosts), [filteredPosts]);
  const chart3Data = useMemo(() => getMonthlyTrendData(filteredPosts), [filteredPosts]);
  const chart4Data = useMemo(() => getHourlyPatternData(filteredPosts), [filteredPosts]);
  const chart5Data = useMemo(() => getSentimentStackedData(filteredPosts), [filteredPosts]);
  const sentimentPieData = useMemo(() => getSentimentPieData(filteredPosts), [filteredPosts]);
  const chart6Data = useMemo(() => getCountryRankingsData(filteredPosts, true), [filteredPosts]);
  const chart7Data = useMemo(() => getDistributionHistogramData(filteredPosts), [filteredPosts]);

  // Export current filtered slice to CSV
  const handleExportCsv = () => {
    if (filteredPosts.length === 0) return;
    const csv = Papa.unparse(filteredPosts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `social_media_filtered_${filters.platform}_${filters.country}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-700 dark:text-slate-200">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
        <h2 className="text-lg font-bold">Loading Social Media Dataset...</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Parsing 2,200 verified post records and indexing Power BI benchmarks.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-lg text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Header
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenBenchmarks={() => setIsBenchmarkOpen(true)}
        onExportCsv={handleExportCsv}
        totalFilteredCount={filteredPosts.length}
        totalUnfilteredCount={posts.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Slicers Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredPosts.length}
          totalCount={posts.length}
        />

        {/* 5 KPI Metric Cards */}
        <KpiGrid
          kpis={kpis}
          benchmarks={benchmarks}
          isFiltered={isFiltered}
        />

        {/* 8 Interactive Chart.js Visualizations */}
        <div className="space-y-6">
          {/* Row 1: Platform Leaderboard & Engagement Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformLeaderboard data={chart1Data} isDark={isDark} />
            <EngagementComponents data={chart2Data} isDark={isDark} />
          </div>

          {/* Row 2: 24-Month Trend & Hourly Diurnal Pattern */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyTrend data={chart3Data} isDark={isDark} />
            <HourlyPattern data={chart4Data} isDark={isDark} />
          </div>

          {/* Row 3: Sentiment Analysis: Dedicated Pie Chart & Stacked Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SentimentPieChart data={sentimentPieData} isDark={isDark} />
            <SentimentStacked data={chart5Data} isDark={isDark} />
          </div>

          {/* Row 4: Geographic Analysis & Outlier Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryRankings data={chart6Data} isDark={isDark} />
            <DistributionHistogram
              data={chart7Data}
              isDark={isDark}
              mean={kpis.avgEngagement}
              median={kpis.medianEngagement}
            />
          </div>
        </div>

        {/* Post Explorer Table */}
        <PostExplorerTable posts={filteredPosts} />
      </main>

      {/* Benchmark & Power BI Validation Side Drawer */}
      <BenchmarkPanel
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        kpis={kpis}
        isFiltered={isFiltered}
        benchmarksData={benchmarks}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Social Media Engagement Analysis • College Data Visualization Project (Milestone 4)
        </p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          Built with React 19, Chart.js 4, and Tailwind CSS • Cleaned Dataset: 2,200 posts (2023–2024)
        </p>
      </footer>
    </div>
  );
}
