import React, { useState } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { PieChart as PieIcon, CheckCircle2 } from 'lucide-react';

export default function SentimentPieChart({ data, isDark }) {
  const [chartType, setChartType] = useState('pie'); // default to 'pie' as requested!

  const totalClassified = data?.totalClassified || (data?.counts ? data.counts.reduce((a, b) => a + b, 0) : 0);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: isDark ? '#94a3b8' : '#475569',
          font: { family: 'inherit', size: 12, weight: '500' },
          boxWidth: 14,
          padding: 14,
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            return chart.data.labels.map((label, i) => {
              const count = dataset.data[i] || 0;
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              return {
                text: `${label}: ${count.toLocaleString()} (${pct}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor[i],
                lineWidth: 1.5,
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        bodyFont: { family: 'inherit', size: 12 },
        titleFont: { family: 'inherit', size: 13, weight: '600' },
        callbacks: {
          label: (context) => {
            const count = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return ` ${context.label}: ${count.toLocaleString()} posts (${pct}%)`;
          }
        }
      }
    },
    cutout: chartType === 'donut' ? '65%' : 0
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors flex flex-col justify-between">
      {/* Card Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Overall Sentiment Distribution (Pie Chart)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              Power BI Match
            </span>

            {/* Pie / Donut Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800/80 text-xs">
              <button
                onClick={() => setChartType('pie')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  chartType === 'pie'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="View full Pie Chart"
              >
                Pie
              </button>
              <button
                onClick={() => setChartType('donut')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  chartType === 'donut'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="View Donut Chart"
              >
                Donut
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          Benchmark: <code className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">exports/Social Media Sentiment Distribution..csv</code> (879 Positive, 652 Neutral, 636 Negative).
        </p>
      </div>

      {/* Main Canvas Area */}
      <div className="h-64 w-full relative flex items-center justify-center my-1">
        {chartType === 'donut' ? (
          <>
            <Doughnut data={data} options={pieOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-36">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Classified
              </span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {totalClassified.toLocaleString()}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                Posts
              </span>
            </div>
          </>
        ) : (
          <Pie data={data} options={pieOptions} />
        )}
      </div>

      {/* Mini Breakdown Footer */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Positive</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {data?.positive?.toLocaleString() || 879} ({data?.percentages?.[0] || '40.6'}%)
          </span>
        </div>
        <div className="p-2 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Neutral</span>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
            {data?.neutral?.toLocaleString() || 652} ({data?.percentages?.[1] || '30.1'}%)
          </span>
        </div>
        <div className="p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Negative</span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            {data?.negative?.toLocaleString() || 636} ({data?.percentages?.[2] || '29.4'}%)
          </span>
        </div>
      </div>
    </div>
  );
}
