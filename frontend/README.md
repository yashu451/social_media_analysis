# Social Media Engagement Analytics Dashboard (React + Chart.js)

An interactive, responsive analytics dashboard built with **React 19**, **Chart.js 4**, and **Tailwind CSS**, designed to visualize social media engagement metrics and cross-validate against exported Power BI summaries.

---

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## Dashboard Architecture & Features

### 1. Header & Controls
* **Light / Dark Mode Toggle**: Theme persistence in `localStorage`, dynamic Chart.js canvas re-rendering.
* **Power BI Validation Button**: Opens the live slide-over benchmark drawer.
* **Export CSV**: Instantly downloads the currently filtered subset of posts.
* **Print / PDF**: Formatted print layout for reports.

### 2. Global Slicers & Cross-Filtering
All 5 KPI cards and 7 Chart.js visualizations dynamically react in sub-milliseconds to:
* **Platform**: All, TikTok, Instagram, Twitter, Facebook, LinkedIn
* **Country**: All, 12 countries + Unknown
* **Sentiment**: All, Positive, Neutral, Negative
* **Year**: All, 2023, 2024
* **Reset Filters**: One-click restore to baseline

### 3. 5 KPI Cards with Power BI Delta Tracking
* **Total Posts**: 2,200 posts corpus
* **Average Engagement**: 46.13 interactions / post
* **Average Likes**: 36.09 likes / post
* **Average Shares**: 6.60 shares / post
* **Average Engagement Rate**: 6.62% per follower

### 4. Eight Chart.js Visualizations
1. **Platform Engagement Leaderboard**: Horizontal bar chart sorted by interaction density.
2. **Engagement Components by Platform**: Grouped bar chart comparing Likes, Comments, and Shares.
3. **Monthly Engagement Trend**: 24-month longitudinal line chart with 46.1 grand mean dashed baseline.
4. **Hourly Engagement Pattern**: 24-hour diurnal posting cycle highlighting 11:00 AM peak (49.4).
5. **Overall Sentiment Distribution (Pie Chart)**: Dedicated Pie / Donut Chart reflecting `exports/Social Media Sentiment Distribution..csv` (879 Positive [40.6%], 652 Neutral [30.1%], 636 Negative [29.4%]).
6. **Sentiment Composition by Platform**: 100% normalized stacked bar chart across each network.
7. **Country Engagement Rankings**: Horizontal bar chart across 12 nations.
8. **Total Engagement Distribution**: 10-unit binned histogram highlighting viral outliers (>90 interactions) with Median (42.0) and Mean (46.1) markers.

### 5. Benchmark & Power BI Validation Panel
* Direct comparison of active metrics against the 15 exported Power BI CSV files in `exports/`.
* 0.00% difference in baseline state, with full explanations for active filtered slices.
* No fabricated or invented benchmark values.

### 6. Interactive Post Explorer Table
* Search across text copy, usernames, hashtags, and post IDs.
* Sortable columns (click headers for ascending/descending).
* Pagination with 10, 25, 50, or 100 rows per page.
* Expandable row cards displaying full post copy and viral outlier status.
