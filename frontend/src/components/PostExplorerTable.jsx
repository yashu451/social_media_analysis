import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Heart, Share2, Sparkles } from 'lucide-react';

export default function PostExplorerTable({ posts }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('total_engagement');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Filter posts based on local search input
  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase().trim();
    return posts.filter(p => (
      (p.post_id && p.post_id.toLowerCase().includes(q)) ||
      (p.user && p.user.toLowerCase().includes(q)) ||
      (p.text && p.text.toLowerCase().includes(q)) ||
      (p.hashtags && p.hashtags.toLowerCase().includes(q)) ||
      (p.platform && p.platform.toLowerCase().includes(q)) ||
      (p.country && p.country.toLowerCase().includes(q))
    ));
  }, [posts, search]);

  // Sort posts
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <span className="opacity-20 text-[10px]">↕</span>;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 inline" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 inline" />
    );
  };

  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'TikTok':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Instagram':
        return 'bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800';
      case 'Twitter':
        return 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Facebook':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'LinkedIn':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200';
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Neutral':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case 'Negative':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-400 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors mt-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Post Explorer & Content Drilldown
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {filtered.length.toLocaleString()} matching records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, sort, and inspect granular post metrics, user handles, sentiment labels, and copy.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search text, user, hashtag, ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-3.5 py-3 cursor-pointer select-none" onClick={() => handleSort('post_id')}>
                Post ID {renderSortIcon('post_id')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none" onClick={() => handleSort('platform')}>
                Platform {renderSortIcon('platform')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none" onClick={() => handleSort('user')}>
                Creator {renderSortIcon('user')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none" onClick={() => handleSort('country')}>
                Country {renderSortIcon('country')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('likes')}>
                Likes {renderSortIcon('likes')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('retweets_shares')}>
                Shares {renderSortIcon('retweets_shares')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('comments')}>
                Comments {renderSortIcon('comments')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('total_engagement')}>
                Total Eng {renderSortIcon('total_engagement')}
              </th>
              <th className="px-3.5 py-3 cursor-pointer select-none" onClick={() => handleSort('sentiment')}>
                Sentiment {renderSortIcon('sentiment')}
              </th>
              <th className="px-3.5 py-3">Content Snippet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentPosts.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  No social media posts match the active filter and search criteria.
                </td>
              </tr>
            ) : (
              currentPosts.map((post) => {
                const isExpanded = expandedPostId === post.post_id;
                const isViral = post.total_engagement >= 90;

                return (
                  <React.Fragment key={post.post_id}>
                    <tr
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setExpandedPostId(isExpanded ? null : post.post_id)}
                    >
                      <td className="px-3.5 py-2.5 font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {post.post_id}
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full border ${getPlatformBadge(post.platform)}`}>
                          {post.platform}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1">
                          <span>{post.user}</span>
                          {post.verified === 'Yes' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 inline" title="Verified Creator" />
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {post.country}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                        {post.likes !== null ? post.likes.toLocaleString() : '—'}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                        {post.retweets_shares.toLocaleString()}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                        {post.comments !== null ? post.comments.toLocaleString() : '—'}
                      </td>
                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          isViral
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {post.total_engagement !== null ? post.total_engagement.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${getSentimentBadge(post.sentiment)}`}>
                          {post.sentiment || 'Unclassified'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 max-w-xs truncate text-slate-500 dark:text-slate-400 text-[11px]" title={post.text}>
                        {post.text}
                      </td>
                    </tr>

                    {/* Expandable row detail */}
                    {isExpanded && (
                      <tr className="bg-slate-50 dark:bg-slate-800/60">
                        <td colSpan={10} className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="md:col-span-2">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Full Post Copy:
                              </span>
                              <p className="text-slate-800 dark:text-slate-100 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                "{post.text}"
                              </p>
                              {post.hashtags && (
                                <p className="mt-1.5 text-teal-600 dark:text-teal-400 font-mono text-[11px]">
                                  {post.hashtags}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div><strong className="text-slate-700 dark:text-slate-300">Timestamp:</strong> {post.timestamp}</div>
                              <div><strong className="text-slate-700 dark:text-slate-300">Followers:</strong> {post.followers_count ? post.followers_count.toLocaleString() : 'Unrecorded'}</div>
                              <div><strong className="text-slate-700 dark:text-slate-300">Eng Rate / Follower:</strong> {post.engagement_rate_per_follower ? `${post.engagement_rate_per_follower.toFixed(2)}%` : 'N/A'}</div>
                              <div><strong className="text-slate-700 dark:text-slate-300">Viral Status:</strong> {isViral ? '🔥 High Viral Outlier (>90 interactions)' : 'Standard Performance'}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, sorted.length)} to {Math.min(page * pageSize, sorted.length)} of {sorted.length} posts
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
