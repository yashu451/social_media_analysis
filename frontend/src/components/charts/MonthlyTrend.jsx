import React from 'react';
import { Line } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function MonthlyTrend({ data, isDark }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: true,
    legendPosition: 'top',
    scaleY: {
      title: {
        display: true,
        text: 'Average Total Engagement',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      },
      min: 35,
      suggestedMax: 55
    },
    scaleX: {
      grid: { display: false },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return ` ${context.dataset.label}: ${context.parsed.y} interactions`;
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
            Chart 3: Monthly Engagement Trend (24 Months)
          </h3>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Mean: 46.1
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Chronological average post interactions from January 2023 through December 2024.
        </p>
      </div>

      <div className="h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
