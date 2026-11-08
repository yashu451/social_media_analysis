import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function SentimentStacked({ data, isDark }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: true,
    legendPosition: 'top',
    extra: {
      indexAxis: 'x'
    },
    scaleX: {
      stacked: true,
      grid: { display: false }
    },
    scaleY: {
      stacked: true,
      max: 100,
      title: {
        display: true,
        text: 'Sentiment Percentage (%)',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      },
      ticks: {
        callback: (v) => `${v}%`
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const pct = context.parsed.y;
          const label = context.dataset.label;
          const platformIdx = context.dataIndex;
          let count = 0;
          if (label.includes('Positive') && data.rawCounts) {
            count = data.rawCounts.positive[platformIdx];
          } else if (label.includes('Neutral') && data.rawCounts) {
            count = data.rawCounts.neutral[platformIdx];
          } else if (label.includes('Negative') && data.rawCounts) {
            count = data.rawCounts.negative[platformIdx];
          }
          return ` ${label}: ${pct}% (${count} posts)`;
        }
      }
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors flex flex-col justify-between">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Sentiment Composition by Platform (Stacked Bar)
          </h3>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
            Positive Plurality
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          100% normalized sentiment proportions (Positive, Neutral, Negative) across each platform.
        </p>
      </div>

      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
