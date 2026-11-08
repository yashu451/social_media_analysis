import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function EngagementComponents({ data, isDark }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: true,
    legendPosition: 'top',
    scaleY: {
      title: {
        display: true,
        text: 'Average Interactions / Post',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      },
      suggestedMax: 55
    },
    scaleX: {
      grid: { display: false }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return ` ${context.dataset.label}: ${context.parsed.y} / post`;
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
            Chart 2: Engagement Components by Platform
          </h3>
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
            Likes &gt; 75%
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Constituent interaction breakdown: Likes, Shares/Retweets, and Comments side-by-side.
        </p>
      </div>

      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
