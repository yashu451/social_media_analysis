import React from 'react';
import { FileText, Flame, Heart, Share2, Percent, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KpiGrid({ kpis, benchmarks, isFiltered }) {
  // Power BI Export baseline figures
  const baselinePosts = 2200;
  const baselineEngagement = 46.13;
  const baselineLikes = 36.09;
  const baselineShares = 6.60;
  const baselineRate = 6.62;

  const calculateDelta = (current, baseline) => {
    if (!baseline || baseline === 0) return 0;
    return Number((((current - baseline) / baseline) * 100).toFixed(1));
  };

  const deltaPosts = calculateDelta(kpis.totalPosts, baselinePosts);
  const deltaEng = calculateDelta(kpis.avgEngagement, baselineEngagement);
  const deltaLikes = calculateDelta(kpis.avgLikes, baselineLikes);
  const deltaShares = calculateDelta(kpis.avgShares, baselineShares);
  const deltaRate = calculateDelta(kpis.avgEngagementRate, baselineRate);

  const renderDeltaBadge = (delta, isVolume = false) => {
    if (!isFiltered) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
          <Minus className="w-3 h-3 text-slate-400" />
          <span>Matches Power BI (Baseline)</span>
        </span>
      );
    }

    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3" />
          <span>+{delta}% vs Baseline</span>
        </span>
      );
    } else if (delta < 0) {
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
          isVolume
            ? 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
            : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
        }`}>
          <TrendingDown className="w-3 h-3" />
          <span>{delta}% vs Baseline</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
        <Minus className="w-3 h-3" />
        <span>0.0% vs Baseline</span>
      </span>
    );
  };

  const cards = [
    {
      id: 'total_posts',
      title: 'Total Posts',
      value: kpis.totalPosts.toLocaleString(),
      subtitle: `${((kpis.totalPosts / baselinePosts) * 100).toFixed(1)}% of total corpus`,
      icon: FileText,
      iconColor: 'from-blue-500 to-indigo-600',
      badge: renderDeltaBadge(deltaPosts, true)
    },
    {
      id: 'avg_engagement',
      title: 'Average Engagement',
      value: kpis.avgEngagement.toFixed(1),
      subtitle: `Median: ${kpis.medianEngagement.toFixed(1)} interactions`,
      icon: Flame,
      iconColor: 'from-teal-500 to-emerald-600',
      badge: renderDeltaBadge(deltaEng)
    },
    {
      id: 'avg_likes',
      title: 'Average Likes',
      value: kpis.avgLikes.toFixed(1),
      subtitle: `${kpis.avgEngagement > 0 ? ((kpis.avgLikes / kpis.avgEngagement) * 100).toFixed(0) : 0}% of total engagement`,
      icon: Heart,
      iconColor: 'from-teal-600 to-cyan-600',
      badge: renderDeltaBadge(deltaLikes)
    },
    {
      id: 'avg_shares',
      title: 'Average Shares',
      value: kpis.avgShares.toFixed(1),
      subtitle: `${kpis.avgEngagement > 0 ? ((kpis.avgShares / kpis.avgEngagement) * 100).toFixed(0) : 0}% of total engagement`,
      icon: Share2,
      iconColor: 'from-amber-500 to-orange-600',
      badge: renderDeltaBadge(deltaShares)
    },
    {
      id: 'avg_rate',
      title: 'Average Engagement Rate',
      value: `${kpis.avgEngagementRate.toFixed(2)}%`,
      subtitle: 'Interactions per follower',
      icon: Percent,
      iconColor: 'from-rose-500 to-pink-600',
      badge: renderDeltaBadge(deltaRate)
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${c.iconColor} flex items-center justify-center text-white shadow-sm`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                {c.value}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                {c.subtitle}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {c.badge}
            </div>
          </div>
        );
      })}
    </div>
  );
}
