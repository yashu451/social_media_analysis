import React from 'react';
import { Line } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function HourlyPattern({ data, isDark }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: false,
    scaleY: {
      title: {
        display: true,
        text: 'Average Total Engagement',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      },
      min: 40,
      suggestedMax: 52
    },
    scaleX: {
      grid: { display: false }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const val = context.parsed.y;
          const isPeak = val >= 49.0;
          return ` Avg Engagement: ${val} interactions ${isPeak ? '★ Daily Peak' : ''}`;
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
            Chart 4: Hourly Engagement Pattern
          </h3>
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
            Peak at 11:00 AM (49.4)
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          24-hour diurnal posting cycle showing morning peak and evening lift (20:00–21:00).
        </p>
      </div>

      <div className="h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
