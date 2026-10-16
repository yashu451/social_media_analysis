# Exploratory Data Visualization Findings Report

**Project Title**: Social Media Engagement Analysis  
**Course / Context**: College Data Visualization (DV) Project  
**Task Phase**: Milestone 3 — Exploratory Data Visualization  
**Date**: October 2026  
**Cleaned Dataset**: [`data/processed/social_media_engagement_cleaned.csv`](data/processed/social_media_engagement_cleaned.csv) (2,200 rows × 20 columns)  
**Exploratory Notebook**: [`notebooks/03_exploratory_visualization.ipynb`](notebooks/03_exploratory_visualization.ipynb)  
**Figures Directory**: [`reports/figures/`](reports/figures/)  
**Status**: Milestone 3 Complete — Core Visualizations & Findings Documented

---

## 1. Executive Summary

Milestone 3 focuses on exploratory data visualization across the cleaned dataset without inventing unavailable data (such as views, impressions, state/region, or content types). Seven core visualizations were engineered to investigate platform hierarchies, engagement component mechanics, geographic patterns, multi-year temporal trends, sentiment compositions, diurnal posting behaviors, and distributional skewness.

### Key Macro Findings at a Glance
1. **Platform Hierarchy**: **TikTok** generates the highest average engagement (**60.3 interactions/post**), followed by **Instagram** (**50.2**), **Twitter** (**43.4**), **Facebook** (**36.2**), and **LinkedIn** (**26.8**).
2. **Interaction Composition**: Across all five networks, **likes represent >75% of total engagement**, while **shares outnumber comments ~2:1**.
3. **Geographic Uniformity**: Average engagement across the 12 countries is remarkably narrow (**41.3 to 48.3 interactions/post**), demonstrating that platform mechanics and content impact engagement far more than geography.
4. **Longitudinal Stability**: Monthly average engagement over the 24-month horizon (2023–2024) is stable, hovering near the grand mean of **46.1 interactions/post**.
5. **Sentiment Balance**: Positive sentiment is the plurality category across all networks (**37.5% to 43.3%**), with negative sentiment remaining consistent (**28% to 32%**).
6. **Diurnal Posting Rhythm**: Average engagement peaks at **11:00 AM (49.4 interactions/post)**, with secondary strength during evening hours (**20:00–21:00**).
7. **Distributional Profile**: Total engagement is moderately right-skewed (**+1.35 skewness**; Median = 42.0, Mean = 46.1) with 81 legitimate viral outliers extending up to 169 interactions.

---

## 2. Core Visualizations & In-Depth Interpretations

### Visualization 1: Platform Comparison — Average Total Engagement

* **Research Question**: Which social media platforms generate the highest average total engagement per post?
* **Visual Encoding**: Sorted vertical bar chart with distinct categorical colors, direct average value labels, and explicit sample size annotations ($N$).
* **Saved Graphic**: [`reports/figures/01_platform_comparison.png`](reports/figures/01_platform_comparison.png)

```
TikTok:    60.3 interactions/post  (N = 382 valid posts | Total N = 390)
Instagram: 50.2 interactions/post  (N = 577 valid posts | Total N = 595)
Twitter:   43.4 interactions/post  (N = 712 valid posts | Total N = 726)
Facebook:  36.2 interactions/post  (N = 361 valid posts | Total N = 370)
LinkedIn:  26.8 interactions/post  (N = 116 valid posts | Total N = 119)
```

#### Interpretation:
TikTok achieves clear leadership in post engagement, averaging 60.3 interactions per post, followed by Instagram at 50.2. In contrast, professional and legacy text-focused networks exhibit lower average interactions (Twitter: 43.4; Facebook: 36.2; LinkedIn: 26.8). 

#### Critical Limitations & Context:
* **Sample Size Disparity**: Twitter has over 6 times the sample volume ($N=712$) of LinkedIn ($N=116$).
* **Absence of View/Impression Reach**: Because impressions and video views are not recorded in this schema, it cannot be determined whether TikTok's higher engagement is driven by broader algorithmic discovery or higher audience interaction density per view.

---

### Visualization 2: Engagement Components by Platform

* **Research Question**: How do the constituent engagement metrics (likes, comments, retweets/shares) compare across platforms?
* **Visual Encoding**: Grouped (clustered) bar chart comparing average likes, shares, and comments side-by-side for each platform.
* **Saved Graphic**: [`reports/figures/02_engagement_components.png`](reports/figures/02_engagement_components.png)

| Platform | Average Likes | Average Retweets / Shares | Average Comments |
|:---|:---:|:---:|:---:|
| **TikTok** | **47.3** | **8.7** | **4.6** |
| **Instagram** | 39.0 | 7.2 | 3.8 |
| **Twitter** | 34.0 | 6.2 | 3.2 |
| **Facebook** | 28.3 | 5.3 | 2.6 |
| **LinkedIn** | 21.2 | 3.6 | 1.9 |

#### Interpretation:
1. **Dominance of Low-Friction Likes**: Across all networks, likes constitute between 77% and 79% of total engagement.
2. **Shares Exceed Comments**: Retweets and shares consistently outpace comments by approximately 1.8x to 2x across every platform.
3. **Consistent Component Rank**: TikTok dominates across all three individual components, and the relative ranking across platforms is perfectly preserved for likes, shares, and comments alike.

#### Critical Limitations:
* Comments demand significantly higher cognitive and temporal friction from users than a double-tap like; thus, a 1:1 count comparison understates the communicative impact of comment conversations.

---

### Visualization 3: Geographic Comparison — Country-Level Engagement

* **Research Question**: Which countries exhibit the highest average post engagement, and how does engagement vary geographically?
* **Visual Encoding**: Horizontal bar chart sorted ascending by mean engagement, with post counts ($N$) indicated.
* **Exclusion Policy**: 66 posts with `country == 'Unknown'` were excluded to prevent geographic skewing.
* **Saved Graphic**: [`reports/figures/03_country_comparison.png`](reports/figures/03_country_comparison.png)

| Country Rank | Country | Average Total Engagement | Median Engagement | Sample Size ($N$) |
|:---:|:---|:---:|:---:|:---:|
| 1 | **Canada** | **48.3** | 45.0 | 173 |
| 2 | **UAE** | 47.6 | 43.0 | 117 |
| 3 | **Japan** | 47.1 | 44.0 | 103 |
| 4 | **USA** | 47.0 | 42.0 | 456 |
| 5 | **India** | 46.7 | 42.0 | 377 |
| 6 | **UK** | 46.3 | 41.0 | 213 |
| 7 | **Germany** | 45.7 | 42.0 | 143 |
| 8 | **Brazil** | 44.9 | 39.5 | 106 |
| 9 | **Australia** | 44.1 | 43.0 | 159 |
| 10 | **France** | 43.8 | 42.0 | 108 |
| 11 | **South Africa** | 42.2 | 39.0 | 77 |
| 12 | **Mexico** | 41.3 | 41.5 | 52 |

#### Interpretation:
* **Narrow Geographic Spread**: Country averages are clustered within a narrow band of 7.0 interactions (from 41.3 in Mexico to 48.3 in Canada).
* **Platform vs. Geography**: Platform choice introduces a spread of 33.5 interactions (TikTok 60.3 vs LinkedIn 26.8), indicating that platform format and creator behavior are substantially stronger drivers of virality than geography.

#### Critical Limitations:
* **Unequal Geographic Representation**: USA ($N=456$) and India ($N=377$) constitute 38.8% of all analyzed posts, while Mexico has only 52 posts.
* **Lack of Sub-National Data**: State, province, and municipal granularity are unavailable in the dataset.

---

### Visualization 4: Longitudinal Monthly Trend (24 Months)

* **Research Question**: How does average engagement evolve over the 24-month observation window (January 2023 to December 2024)?
* **Visual Encoding**: 24-month time-series line chart with circular markers and an overlaid dashed reference line for the grand mean (46.1).
* **Saved Graphic**: [`reports/figures/04_monthly_trend.png`](reports/figures/04_monthly_trend.png)

#### Trend Observations:
* **Grand Mean**: 46.1 interactions per post across the entire 24 months.
* **Peak Month**: **February 2023 (49.9 interactions/post)**, with secondary peaks in July 2023 (49.7) and December 2023 (49.1).
* **Trough Month**: **September 2024 (42.1 interactions/post)**.
* **Trend Continuity**: The time series exhibits mean-reverting stability. There is no long-term secular decline or exponential inflation in engagement over the two-year period.

#### Critical Limitations:
* Monthly aggregates pool all platforms together; minor oscillations are partly influenced by small fluctuations in monthly platform publishing mix rather than audience macro-behavior.

---

### Visualization 5: Sentiment Distribution Across Platforms

* **Research Question**: How does sentiment classification (Positive, Neutral, Negative) distribute across each platform?
* **Visual Encoding**: 100% normalized stacked bar chart with direct percentage labels centered in each segment.
* **Exclusion Policy**: 33 records with missing sentiment were excluded.
* **Saved Graphic**: [`reports/figures/05_sentiment_distribution.png`](reports/figures/05_sentiment_distribution.png)

| Platform | Positive Sentiment (%) | Neutral Sentiment (%) | Negative Sentiment (%) | Total Classified Posts |
|:---|:---:|:---:|:---:|:---:|
| **Twitter** | **43.3%** | 27.9% | 28.8% | 713 |
| **Facebook** | 41.5% | 31.0% | 27.5% | 364 |
| **TikTok** | 39.7% | 29.9% | 30.4% | 385 |
| **LinkedIn** | 38.7% | 29.4% | **31.9%** | 119 |
| **Instagram** | 37.5% | 32.4% | 30.0% | 586 |

#### Interpretation:
1. **Positive Sentiment Plurality**: Positive sentiment is the plurality category across all five platforms, ranging from 37.5% on Instagram to 43.3% on Twitter.
2. **Remarkable Cross-Platform Consistency**: The proportion of negative sentiment is stable across all platforms, hovering tightly between 27.5% and 31.9%.
3. **Corporate/Professional Tone**: LinkedIn exhibits the highest proportion of negative posts (31.9%), driven primarily by user complaints regarding service and product issues in the text templates.

#### Critical Limitations:
* Sentiment is recorded as a high-level 3-class label without aspect-level, emotional intensity, or conversational depth nuances.

---

### Visualization 6: Diurnal Posting Time Analysis (By Hour)

* **Research Question**: How does average post engagement vary across different hours of the day (00:00 to 23:00)?
* **Visual Encoding**: Continuous 24-hour diurnal line chart with square markers and peak annotation.
* **Saved Graphic**: [`reports/figures/06_hourly_engagement.png`](reports/figures/06_hourly_engagement.png)

#### Key Hourly Dynamics:
* **Daily Peak**: **11:00 AM (49.4 interactions/post)**, followed by 12:00 PM (48.0 interactions/post).
* **Evening Lift**: Strong secondary engagement window from **20:00 to 21:00 (47.9 to 48.0 interactions/post)**.
* **Early Morning Trough**: Lowest engagement occurs at **01:00 AM (44.2 interactions/post)**.
* **Diurnal Range**: The spread across the 24 hours is only 5.2 interactions, indicating continuous global consumption.

#### Critical Limitations:
* **Unified Timestamp Conflation**: Publication timestamps are recorded in a single reference timezone without local UTC offsets. Because posts originate across 12 countries spanning multiple global timezones, 11:00 AM in the dataset represents different local times for content creators and audiences.

---

### Visualization 7: Overall Total Engagement Distribution

* **Research Question**: What is the shape, spread, and outlier profile of total engagement across posts?
* **Visual Encoding**: Histogram with 35 bins, overlaid Kernel Density Estimation (KDE) curve, and vertical markers for Median (42.0), Mean (46.1), and Upper IQR Fence (93.5).
* **Saved Graphic**: [`reports/figures/07_engagement_distribution.png`](reports/figures/07_engagement_distribution.png)

#### Distributional Parameters:
* **Observations ($N$)**: 2,148 valid posts (52 records with unrecorded likes/comments excluded).
* **Mean**: 46.13 interactions
* **Median**: 42.00 interactions
* **Standard Deviation**: 21.75
* **Interquartile Range (IQR)**: 25.00 ($Q_1 = 31.00$, $Q_3 = 56.00$)
* **Skewness**: **+1.35** (Pronounced positive right skew)
* **Outlier Count**: **81 posts (3.8%)** lie beyond the upper fence ($>93.5$), with a maximum of **169 interactions**.

#### Interpretation:
The distribution exhibits classical power-law dynamics typical of social media networks: most posts cluster moderately between 31 and 56 interactions, while a long right-side tail of viral content pulls the arithmetic mean above the median. All outliers are authentic and retained.

---

## 3. Special Analytical Investigation: Follower-Based Engagement Rate

Per project instructions, we conducted an empirical audit of the derived metric `engagement_rate_per_follower`:
$$\text{engagement\_rate\_per\_follower} = \left(\frac{\text{total\_engagement}}{\text{followers\_count}}\right) \times 100$$

### Summary Statistics ($N=2,064$ valid posts):
* **Median**: **2.34%**
* **Mean**: **6.62%**
* **IQR**: **5.69%** ($Q_1 = 0.84\%$, $Q_3 = 6.53\%$)
* **Minimum**: **0.02%**
* **Maximum**: **250.00%**
* **Posts Exceeding 50% Engagement Rate**: **47 posts (2.3%)**
* **Posts Exceeding 100% Engagement Rate**: **27 posts (1.3%)**

### Platform Medians vs. Means:
* **TikTok**: Median = 3.65% | Mean = 8.16%
* **Instagram**: Median = 2.45% | Mean = 6.84%
* **Twitter**: Median = 2.21% | Mean = 6.64%
* **Facebook**: Median = 1.95% | Mean = 5.62%
* **LinkedIn**: Median = 1.15% | Mean = 4.12%

### Critical Analytical Limitations of Follower-Based Engagement Rate:
1. **Algorithmic Distribution vs. Follower Graph**: Recommendation engines (especially TikTok FYP and Instagram Explore) serve content based on interest and virality rather than follower connections. Breakout posts receive interactions from non-followers, naturally yielding rates above 100%.
2. **Small-Denominator Inflation**: A creator with 20 followers receiving 30 likes generates a 150% engagement rate, whereas a creator with 20,000 followers receiving 400 likes generates only 2%. Arithmetic means are severely distorted by micro-accounts.
3. **Absence of View/Impression Denominator**: Industry-standard engagement rate is $(\text{Total Interactions} / \text{Impressions}) \times 100$. Without impression data, follower count serves as an imperfect proxy for creator scale rather than content reach.

**Analytical Recommendation**: **Total Engagement** remains the primary, robust metric for platform and geographic comparisons. Follower-based rate should be used strictly as an exploratory indicator of creator-level efficiency.

---

## 4. Key Takeaways for Milestone 4 (Interactive Dashboard)

The insights from this exploratory visualization milestone provide a clear architectural blueprint for the upcoming Data Visualization Dashboard:

1. **Interactive Platform Slicing**: Because platform choice is the dominant driver of engagement variance, users must be able to filter or facet all visualizations by platform.
2. **Multi-Metric Toggle**: Enable users to toggle between **Total Engagement**, **Likes**, **Shares**, and **Comments** to explore interaction mechanics.
3. **Geographic Filtering**: Country comparisons should default to excluding `'Unknown'` while allowing viewers to drill down into specific nations.
4. **Temporal Granularity**: Longitudinal views should allow monthly trend viewing and day/hour posting matrix heatmaps.
5. **Sentiment Impact Overlays**: Allow users to filter or color-code by sentiment to see how post emotion correlates with viral shares.

---

## 5. Artifacts & Deliverables Summary

- [x] **Jupyter Notebook**: [`notebooks/03_exploratory_visualization.ipynb`](notebooks/03_exploratory_visualization.ipynb) *(Executed end-to-end with 0 errors; pre-rendered tables and charts embedded)*
- [x] **High-Resolution Figures**:
  * [`reports/figures/01_platform_comparison.png`](reports/figures/01_platform_comparison.png)
  * [`reports/figures/02_engagement_components.png`](reports/figures/02_engagement_components.png)
  * [`reports/figures/03_country_comparison.png`](reports/figures/03_country_comparison.png)
  * [`reports/figures/04_monthly_trend.png`](reports/figures/04_monthly_trend.png)
  * [`reports/figures/05_sentiment_distribution.png`](reports/figures/05_sentiment_distribution.png)
  * [`reports/figures/06_hourly_engagement.png`](reports/figures/06_hourly_engagement.png)
  * [`reports/figures/07_engagement_distribution.png`](reports/figures/07_engagement_distribution.png)
- [x] **Findings Summary Report**: [`VISUALIZATION_FINDINGS.md`](VISUALIZATION_FINDINGS.md)
- [x] **No Dashboard Built Yet**: Awaiting user review and approval before proceeding to dashboard development.
