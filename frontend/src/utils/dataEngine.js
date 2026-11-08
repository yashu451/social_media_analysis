/**
 * Social Media Engagement Data Processing & Aggregation Engine
 * High-performance, zero-dependency in-memory calculation logic
 * Computes KPIs, cross-filtered subsets, and Chart.js datasets
 */

export function parseCleanedRow(row) {
  const likes = row.likes !== '' && row.likes !== undefined && !isNaN(Number(row.likes)) ? Number(row.likes) : null;
  const comments = row.comments !== '' && row.comments !== undefined && !isNaN(Number(row.comments)) ? Number(row.comments) : null;
  const retweets_shares = Number(row.retweets_shares || 0);
  const total_engagement = row.total_engagement !== '' && row.total_engagement !== undefined && !isNaN(Number(row.total_engagement))
    ? Number(row.total_engagement)
    : (likes !== null && comments !== null ? likes + comments + retweets_shares : null);
  
  const followers_count = row.followers_count !== '' && row.followers_count !== undefined && !isNaN(Number(row.followers_count))
    ? Number(row.followers_count)
    : null;

  const engagement_rate_per_follower = row.engagement_rate_per_follower !== '' && row.engagement_rate_per_follower !== undefined && !isNaN(Number(row.engagement_rate_per_follower))
    ? Number(row.engagement_rate_per_follower)
    : (total_engagement !== null && followers_count && followers_count > 0 ? (total_engagement / followers_count) * 100 : null);

  return {
    post_id: row.post_id || '',
    timestamp: row.timestamp || '',
    platform: row.platform || '',
    user: row.user || '',
    followers_count,
    verified: row.verified || 'No',
    text: row.text || '',
    hashtags: row.hashtags || '',
    country: row.country || 'Unknown',
    likes,
    retweets_shares,
    comments,
    sentiment: row.sentiment && row.sentiment.trim() !== '' ? row.sentiment.trim() : null,
    year: Number(row.year || (row.timestamp ? row.timestamp.substring(0, 4) : 0)),
    month: Number(row.month || (row.timestamp ? row.timestamp.substring(5, 7) : 0)),
    month_year: row.month_year || (row.timestamp ? row.timestamp.substring(0, 7) : ''),
    day_of_week: row.day_of_week || '',
    hour: Number(row.hour !== undefined && row.hour !== '' ? row.hour : (row.timestamp ? parseInt(row.timestamp.substring(11, 13), 10) : 0)),
    total_engagement,
    engagement_rate_per_follower
  };
}

/**
 * Filter dataset based on global filter state
 */
export function filterPosts(posts, filters) {
  return posts.filter(post => {
    if (filters.platform && filters.platform !== 'All' && post.platform !== filters.platform) {
      return false;
    }
    if (filters.country && filters.country !== 'All' && post.country !== filters.country) {
      return false;
    }
    if (filters.sentiment && filters.sentiment !== 'All') {
      if (post.sentiment !== filters.sentiment) return false;
    }
    if (filters.year && filters.year !== 'All') {
      if (post.year !== Number(filters.year)) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchText = post.text.toLowerCase().includes(q);
      const matchUser = post.user.toLowerCase().includes(q);
      const matchTag = post.hashtags.toLowerCase().includes(q);
      const matchId = post.post_id.toLowerCase().includes(q);
      if (!matchText && !matchUser && !matchTag && !matchId) return false;
    }
    return true;
  });
}

/**
 * Calculate the 5 main KPI metrics
 */
export function calculateKpis(filteredPosts) {
  const totalPosts = filteredPosts.length;

  if (totalPosts === 0) {
    return {
      totalPosts: 0,
      avgEngagement: 0,
      avgLikes: 0,
      avgShares: 0,
      avgEngagementRate: 0,
      medianEngagement: 0
    };
  }

  // Non-null engagement records
  const engRecords = filteredPosts.filter(p => p.total_engagement !== null && !isNaN(p.total_engagement));
  const sumEng = engRecords.reduce((acc, p) => acc + p.total_engagement, 0);
  const avgEngagement = engRecords.length > 0 ? sumEng / engRecords.length : 0;

  // Median Engagement
  const sortedEng = engRecords.map(p => p.total_engagement).sort((a, b) => a - b);
  let medianEngagement = 0;
  if (sortedEng.length > 0) {
    const mid = Math.floor(sortedEng.length / 2);
    medianEngagement = sortedEng.length % 2 !== 0 ? sortedEng[mid] : (sortedEng[mid - 1] + sortedEng[mid]) / 2;
  }

  // Non-null likes
  const likeRecords = filteredPosts.filter(p => p.likes !== null && !isNaN(p.likes));
  const sumLikes = likeRecords.reduce((acc, p) => acc + p.likes, 0);
  const avgLikes = likeRecords.length > 0 ? sumLikes / likeRecords.length : 0;

  // Shares (retweets_shares)
  const sumShares = filteredPosts.reduce((acc, p) => acc + (p.retweets_shares || 0), 0);
  const avgShares = sumShares / totalPosts;

  // Non-null engagement rate
  const rateRecords = filteredPosts.filter(p => p.engagement_rate_per_follower !== null && !isNaN(p.engagement_rate_per_follower));
  const sumRate = rateRecords.reduce((acc, p) => acc + p.engagement_rate_per_follower, 0);
  const avgEngagementRate = rateRecords.length > 0 ? sumRate / rateRecords.length : 0;

  return {
    totalPosts,
    avgEngagement: Number(avgEngagement.toFixed(2)),
    avgLikes: Number(avgLikes.toFixed(2)),
    avgShares: Number(avgShares.toFixed(2)),
    avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
    medianEngagement: Number(medianEngagement.toFixed(1))
  };
}

/**
 * Chart 1: Platform Engagement Leaderboard (Horizontal Bar Chart)
 */
export function getPlatformLeaderboardData(filteredPosts) {
  const platforms = ['TikTok', 'Instagram', 'Twitter', 'Facebook', 'LinkedIn'];
  const platformStats = platforms.map(p => {
    const list = filteredPosts.filter(post => post.platform === p && post.total_engagement !== null);
    const count = list.length;
    const avg = count > 0 ? list.reduce((sum, item) => sum + item.total_engagement, 0) / count : 0;
    return {
      platform: p,
      avgEngagement: Number(avg.toFixed(2)),
      count
    };
  });

  // Sort descending by engagement
  platformStats.sort((a, b) => b.avgEngagement - a.avgEngagement);

  return {
    labels: platformStats.map(d => d.platform),
    datasets: [{
      label: 'Avg Total Engagement',
      data: platformStats.map(d => d.avgEngagement),
      counts: platformStats.map(d => d.count),
      backgroundColor: [
        '#0d9488', // TikTok Teal
        '#14b8a6', // Instagram Teal light
        '#2dd4bf', // Twitter Sky Teal
        '#64748b', // Facebook Slate
        '#94a3b8'  // LinkedIn Soft Grey
      ],
      borderRadius: 6
    }]
  };
}

/**
 * Chart 2: Engagement Components by Platform (Grouped Bar Chart)
 */
export function getEngagementComponentsData(filteredPosts) {
  const platforms = ['TikTok', 'Instagram', 'Twitter', 'Facebook', 'LinkedIn'];
  
  const likesData = [];
  const sharesData = [];
  const commentsData = [];

  platforms.forEach(p => {
    const pPosts = filteredPosts.filter(post => post.platform === p);
    
    const validLikes = pPosts.filter(post => post.likes !== null);
    const avgLikes = validLikes.length > 0 ? validLikes.reduce((sum, item) => sum + item.likes, 0) / validLikes.length : 0;

    const avgShares = pPosts.length > 0 ? pPosts.reduce((sum, item) => sum + item.retweets_shares, 0) / pPosts.length : 0;

    const validComments = pPosts.filter(post => post.comments !== null);
    const avgComments = validComments.length > 0 ? validComments.reduce((sum, item) => sum + item.comments, 0) / validComments.length : 0;

    likesData.push(Number(avgLikes.toFixed(2)));
    sharesData.push(Number(avgShares.toFixed(2)));
    commentsData.push(Number(avgComments.toFixed(2)));
  });

  return {
    labels: platforms,
    datasets: [
      {
        label: 'Average Likes',
        data: likesData,
        backgroundColor: '#0d9488', // Teal
        borderRadius: 4
      },
      {
        label: 'Average Shares / Retweets',
        data: sharesData,
        backgroundColor: '#f59e0b', // Warm Amber
        borderRadius: 4
      },
      {
        label: 'Average Comments',
        data: commentsData,
        backgroundColor: '#f43f5e', // Coral
        borderRadius: 4
      }
    ]
  };
}

/**
 * Chart 3: Monthly Engagement Trend (24 Months Line Chart)
 */
export function getMonthlyTrendData(filteredPosts, grandMean = 46.13) {
  const allMonths = [
    '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
    '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
  ];

  const monthLabels = [
    'Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23',
    'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23',
    'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24',
    'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'
  ];

  const dataPoints = allMonths.map(my => {
    const list = filteredPosts.filter(p => p.month_year === my && p.total_engagement !== null);
    if (list.length === 0) return null;
    const avg = list.reduce((sum, item) => sum + item.total_engagement, 0) / list.length;
    return Number(avg.toFixed(2));
  });

  return {
    labels: monthLabels,
    datasets: [
      {
        label: 'Monthly Average Engagement',
        data: dataPoints,
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0d9488'
      },
      {
        label: 'Grand Mean Baseline (46.1)',
        data: new Array(allMonths.length).fill(grandMean),
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        borderWidth: 1.5
      }
    ]
  };
}

/**
 * Chart 4: Hourly Engagement Pattern (24-Hour Line Chart)
 */
export function getHourlyPatternData(filteredPosts) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourLabels = hours.map(h => `${h.toString().padStart(2, '0')}:00`);

  const hourlyAverages = hours.map(h => {
    const list = filteredPosts.filter(p => p.hour === h && p.total_engagement !== null);
    if (list.length === 0) return 0;
    const avg = list.reduce((sum, item) => sum + item.total_engagement, 0) / list.length;
    return Number(avg.toFixed(2));
  });

  return {
    labels: hourLabels,
    datasets: [
      {
        label: 'Hourly Average Engagement',
        data: hourlyAverages,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: hourlyAverages.map(val => val >= 49.0 ? '#f43f5e' : '#14b8a6')
      }
    ]
  };
}

/**
 * Chart 5: Sentiment Composition by Platform (100% Stacked Bar Chart)
 */
export function getSentimentStackedData(filteredPosts) {
  const platforms = ['Twitter', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn'];
  const posPercentages = [];
  const neuPercentages = [];
  const negPercentages = [];
  const rawCounts = { positive: [], neutral: [], negative: [] };

  platforms.forEach(p => {
    const list = filteredPosts.filter(post => post.platform === p && post.sentiment !== null);
    const total = list.length;
    if (total === 0) {
      posPercentages.push(0);
      neuPercentages.push(0);
      negPercentages.push(0);
      rawCounts.positive.push(0);
      rawCounts.neutral.push(0);
      rawCounts.negative.push(0);
      return;
    }

    const pos = list.filter(post => post.sentiment === 'Positive').length;
    const neu = list.filter(post => post.sentiment === 'Neutral').length;
    const neg = list.filter(post => post.sentiment === 'Negative').length;

    rawCounts.positive.push(pos);
    rawCounts.neutral.push(neu);
    rawCounts.negative.push(neg);

    posPercentages.push(Number(((pos / total) * 100).toFixed(1)));
    neuPercentages.push(Number(((neu / total) * 100).toFixed(1)));
    negPercentages.push(Number(((neg / total) * 100).toFixed(1)));
  });

  return {
    labels: platforms,
    rawCounts,
    datasets: [
      {
        label: 'Positive (%)',
        data: posPercentages,
        backgroundColor: '#10b981', // Soft Sage Green
        borderRadius: 3
      },
      {
        label: 'Neutral (%)',
        data: neuPercentages,
        backgroundColor: '#64748b', // Slate
        borderRadius: 3
      },
      {
        label: 'Negative (%)',
        data: negPercentages,
        backgroundColor: '#f43f5e', // Coral
        borderRadius: 3
      }
    ]
  };
}

/**
 * Chart 5 Alternate / Power BI Benchmark: Overall Sentiment Distribution (Pie/Donut Chart)
 * Matches exports/Social Media Sentiment Distribution..csv
 */
export function getSentimentPieData(filteredPosts) {
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  let missing = 0;

  filteredPosts.forEach(post => {
    if (post.sentiment === 'Positive') positive++;
    else if (post.sentiment === 'Neutral') neutral++;
    else if (post.sentiment === 'Negative') negative++;
    else missing++;
  });

  const totalClassified = positive + neutral + negative;
  const total = filteredPosts.length;

  const pctPos = totalClassified > 0 ? Number(((positive / totalClassified) * 100).toFixed(1)) : 0;
  const pctNeu = totalClassified > 0 ? Number(((neutral / totalClassified) * 100).toFixed(1)) : 0;
  const pctNeg = totalClassified > 0 ? Number(((negative / totalClassified) * 100).toFixed(1)) : 0;

  return {
    positive,
    neutral,
    negative,
    missing,
    totalClassified,
    total,
    labels: ['Positive', 'Neutral', 'Negative'],
    counts: [positive, neutral, negative],
    percentages: [pctPos, pctNeu, pctNeg],
    datasets: [
      {
        data: [positive, neutral, negative],
        backgroundColor: [
          '#10b981', // Emerald Positive
          '#0ea5e9', // Sky Neutral
          '#f43f5e'  // Rose Negative
        ],
        borderColor: [
          '#059669',
          '#0284c7',
          '#e11d48'
        ],
        borderWidth: 1.5,
        hoverOffset: 6
      }
    ]
  };
}

/**
 * Chart 6: Country Engagement Rankings (Horizontal Bar Chart)
 */
export function getCountryRankingsData(filteredPosts, excludeUnknown = true) {
  const countries = [
    'Canada', 'UAE', 'Japan', 'USA', 'India', 'UK', 'Germany',
    'Brazil', 'Australia', 'France', 'South Africa', 'Mexico'
  ];
  if (!excludeUnknown) countries.push('Unknown');

  const stats = countries.map(c => {
    const list = filteredPosts.filter(p => p.country === c && p.total_engagement !== null);
    const count = list.length;
    const avg = count > 0 ? list.reduce((sum, item) => sum + item.total_engagement, 0) / count : 0;
    return {
      country: c,
      avgEngagement: Number(avg.toFixed(2)),
      count
    };
  });

  // Sort descending
  stats.sort((a, b) => b.avgEngagement - a.avgEngagement);

  return {
    labels: stats.map(s => s.country),
    datasets: [{
      label: 'Avg Total Engagement',
      data: stats.map(s => s.avgEngagement),
      counts: stats.map(s => s.count),
      backgroundColor: '#0d9488',
      borderRadius: 4
    }]
  };
}

/**
 * Chart 7: Total Engagement Distribution (Histogram with 10-unit bins)
 */
export function getDistributionHistogramData(filteredPosts) {
  const binEdges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
  const binLabels = [
    '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69',
    '70-79', '80-89', '90-99', '100-109', '110-119', '120-129',
    '130-139', '140-149', '150-159', '160+'
  ];

  const counts = new Array(binLabels.length).fill(0);
  const validPosts = filteredPosts.filter(p => p.total_engagement !== null && !isNaN(p.total_engagement));

  validPosts.forEach(p => {
    const val = p.total_engagement;
    if (val >= 160) {
      counts[counts.length - 1]++;
    } else {
      const idx = Math.floor(val / 10);
      if (idx >= 0 && idx < counts.length) {
        counts[idx]++;
      }
    }
  });

  return {
    labels: binLabels,
    datasets: [{
      label: 'Post Count',
      data: counts,
      backgroundColor: binLabels.map((_, i) => i >= 9 ? '#fb7185' : '#0d9488'), // Highlight viral outliers in coral
      borderRadius: 4
    }]
  };
}
