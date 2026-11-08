import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export function getBaseChartOptions(isDark, options = {}) {
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: options.showLegend ?? true,
        position: options.legendPosition || 'top',
        labels: {
          color: textColor,
          font: { family: 'inherit', size: 12, weight: '500' },
          boxWidth: 12,
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        bodyFont: { family: 'inherit', size: 12 },
        titleFont: { family: 'inherit', size: 13, weight: '600' },
        ...options.tooltip
      },
      ...options.plugins
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: { family: 'inherit', size: 11 }
        },
        ...options.scaleX
      },
      y: {
        grid: {
          color: gridColor,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: { family: 'inherit', size: 11 }
        },
        ...options.scaleY
      }
    },
    ...options.extra
  };
}
