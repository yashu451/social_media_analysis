import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getBaseChartOptions } from '../../utils/chartConfig';

export default function DistributionHistogram({ data, isDark, mean = 46.1, median = 42.0 }) {
  const options = getBaseChartOptions(isDark, {
    showLegend: false,
    scaleY: {
      title: {
        display: true,
        text: 'Post Frequency (Count)',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      }
    },
    scaleX: {
      grid: { display: false },
      title: {
        display: true,
        text: 'Total Engagement Bins (10-Unit Intervals)',
        color: isDark ? '#94a3b8' : '#64748b',
        font: { size: 11, weight: '500' }
      }
    },
    plugins: {
      annotation: {
        annotations: {
          medianLine: {
            type: 'line',
            xMin: 4, // 40-49 bin
            xMax: 4,
            borderColor: '#0d9488',
            borderWidth: 2,
            borderDash: [4, 4],
            label: {
              display: true,
              content: `Median: ${median}`,
              position: 'start',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: '#0d9488',
              font: { size: 10, weight: 'bold' }
            }
          },
          meanLine: {
            type: 'line',
            xMin: 4.6, // roughly 46.1
            xMax: 4.6,
            borderColor: '#f59e0b',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
              display: true,
              content: `Mean: ${mean}`,
              position: 'end',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: '#d97706',
              font: { size: 10, weight: 'bold' }
            }
          }
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const bin = context.label;
          const count = context.parsed.y;
          const isOutlier = context.dataIndex >= 9;
          return ` Range [${bin}]: ${count} posts ${isOutlier ? '(Viral Outlier Tail)' : ''}`;
        }
      }
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors flex flex-col justify-between">
      <div className="mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Chart 7: Total Engagement Distribution & Skewness
          </h3>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
              Median: {median}
            </span>
            <span className="font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
              Mean: {mean}
            </span>
            <span className="font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
              Skew: +1.35
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Right-skewed power-law distribution; viral outliers (coral bars &gt;90 interactions) extend up to 169.
        </p>
      </div>

      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
