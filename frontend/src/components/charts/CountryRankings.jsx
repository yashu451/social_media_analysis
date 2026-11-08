import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function CountryRankings({ data, isDark }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: false,
    extra: {
      indexAxis: 'y'
    },
    scaleX: {
      title: {
        display: true,
        text: 'Average Total Engagement (Interactions / Post)',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      },
      min: 35,
      suggestedMax: 52
    },
    scaleY: {
      grid: { display: false }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const val = context.parsed.x;
          const count = context.dataset.counts ? context.dataset.counts[context.dataIndex] : 0;
          return ` Avg Engagement: ${val} interactions (N = ${count} posts)`;
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
            Chart 6: Country Engagement Rankings
          </h3>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Narrow Band (41–48)
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Geographic post interactions ranked across 12 countries (excludes Unknown).
        </p>
      </div>

      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
