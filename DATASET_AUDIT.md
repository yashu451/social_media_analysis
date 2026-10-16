# Dataset Quality Audit & Schema Inspection Report

**Project Title**: Social Media Engagement Analysis  
**Course / Context**: College Data Visualization (DV) Project  
**Inspection Date**: October 2026  
**File Inspected**: `data/social_media_sentiment_raw.csv`  
**Inspection Notebook**: [`notebooks/01_data_inspection.ipynb`](notebooks/01_data_inspection.ipynb)  
**Status**: Milestone 1 Completed — Awaiting User Approval on Proposed Cleaning Treatments

---

## 1. Executive Summary

A comprehensive data quality inspection was conducted on the raw dataset provided in the `data/` directory. The inspection was carried out strictly without modifying the raw dataset, without deleting records, and without filling missing values.

### Dataset Overview
* **File Path**: `data/social_media_sentiment_raw.csv`
* **File Size**: 346,486 bytes (~338 KB)
* **Total Records (Rows)**: 2,260
* **Total Attributes (Columns)**: 13
* **Total Cells**: 29,380
* **Total Missing Cells**: 1,127 (3.84% across the entire dataset)
* **Temporal Horizon**: 2023-01-01 01:08:09 to 2024-12-31 21:11:13 (Exactly 2 full calendar years)

---

## 2. Schema and Column-by-Column Inventory

The table below presents the exact schema, storage types, missingness, and sample values directly discovered from the raw data.

| Column Name | Inferred Dtype | Non-Null Count | Missing Count (%) | Cardinality | Description & Sample Values |
|:---|:---:|:---:|:---:|:---:|:---|
| `post_id` | `object` (string) | 2,260 | 0 (0.00%) | 2,200 | Unique post identifier (e.g., `P100040`, `P101934`). 60 duplicate occurrences identified. |
| `timestamp` | `object` (string) | 2,260 | 0 (0.00%) | 2,260 | ISO timestamp `YYYY-MM-DD HH:MM:SS` spanning 2023–2024. All parse cleanly. |
| `platform` | `object` (string) | 2,260 | 0 (0.00%) | 10 | Target social platform (Twitter, Instagram, TikTok, Facebook, LinkedIn). Contains uppercase duplicates. |
| `user` | `object` (string) | 2,260 | 0 (0.00%) | 2,185 | Handle/username of post author (e.g., `quinn_5984`, `ravi_5073`). |
| `followers_count` | `object` (string) | 2,170 | 90 (3.98%) | 1,778 | Account follower count. Stored as string due to comma separators (e.g., `'20,454'`) and decimals (`'668.0'`). |
| `verified` | `object` (string) | 2,216 | 44 (1.95%) | 2 | Account verification flag (`'No'`, `'Yes'`). |
| `text` | `object` (string) | 2,260 | 0 (0.00%) | 24 | Post content/caption text (length: 43 to 69 characters). Synthetic/templated text phrases. |
| `hashtags` | `object` (string) | 1,472 | 788 (34.87%) | 185 | Space-separated hashtags (e.g., `#Climate #Movies #Fitness`). Highest missingness in dataset. |
| `country` | `object` (string) | 2,134 | 126 (5.58%) | 25 | Country origin of post. Contains trailing spaces and lowercase entries (`'usa  '`, `'india  '`). |
| `likes` | `int64` | 2,260 | 0 (0.00%) | 98 | Like count (Min: `-1`, Median: `33`, Mean: `35.95`, Max: `126`). Contains 8 negative sentinel values. |
| `retweets_shares`| `int64` | 2,260 | 0 (0.00%) | 38 | Retweet/share count (Min: `0`, Median: `6`, Mean: `6.62`, Max: `37`). Clean, no negatives. |
| `comments` | `float64` | 2,214 | 46 (2.04%) | 21 | Comment count (Min: `0.0`, Median: `3.0`, Mean: `3.45`, Max: `20.0`). Stored as float due to NaNs. |
| `sentiment` | `object` (string) | 2,227 | 33 (1.46%) | 3 | Sentiment classification label (`'Positive'`, `'Neutral'`, `'Negative'`). |

---

## 3. Specific Project Requirements Verification

Per the project guidelines for the **Social Media Engagement Analysis** DV project, each requested attribute was audited against the raw CSV:

| # | Requested Dimension / Metric | Status | Finding & Exact Mapping |
|:---:|:---|:---:|:---|
| **1** | **Social media platform names** | **PRESENT** | Found in `platform` column. Covers 5 platforms (Twitter, Instagram, TikTok, Facebook, LinkedIn), but requires normalization of uppercase duplicates (`TWITTER`, etc.). |
| **2** | **Country** | **PRESENT** | Found in `country` column. Covers 12 distinct nations, but requires whitespace stripping and casing normalization (`'usa  '` -> `'USA'`). 126 values are missing (`NaN`). |
| **3** | **State or region** | **MISSING** | **Not present** in the dataset. Geographic visualizations must be conducted at the country level. No state/province data exists. |
| **4** | **Post date or timestamp** | **PRESENT** | Found in `timestamp` column. Complete 2-year range (Jan 1, 2023 to Dec 31, 2024), 0 nulls, 100% valid datetime format. |
| **5** | **Likes, comments and shares** | **PRESENT** | All three metrics are present: `likes` (int64), `comments` (float64), and `retweets_shares` (int64). |
| **6** | **Views or impressions** | **MISSING** | **Not present** in the dataset. Reach/impressions metrics cannot be visualized directly; engagement rates must be computed relative to followers or total interaction counts. |
| **7** | **Content type** | **MISSING** | **Not present** in the dataset. Formats like image, video, reel, or carousel are absent. |

---

## 4. Comprehensive Data Quality Findings & Anomalies

### 4.1 Duplicate Records Audit
* **Exact Full-Row Duplicates**: **44 rows** are character-for-character identical across all 13 columns.
* **Duplicate `post_id`s**: **60 duplicate instances** exist across 60 unique `post_id` values (involving 120 rows total).
* **Root Cause of the 16 Non-Exact Duplicates**:
  * Detailed differential analysis revealed that the remaining 16 duplicate pairs differ **only** because of data hygiene inconsistencies:
    1. Capitalization differences in `platform` (e.g., `TWITTER` vs. `Twitter`).
    2. Comma vs. decimal formatting in `followers_count` (e.g., `'20,454'` vs `'20454.0'`, `'310'` vs `'310.0'`).
  * When string normalization is applied, **all 60 duplicate `post_id` pairs resolve to identical duplicate posts**.

### 4.2 Categorical Casing & Whitespace Inconsistencies
* **`platform` (10 raw values -> 5 true platforms)**:
  * `Twitter` (691) + `TWITTER` (54) = 745
  * `Instagram` (561) + `INSTAGRAM` (53) = 614
  * `TikTok` (357) + `TIKTOK` (41) = 398
  * `Facebook` (352) + `FACEBOOK` (27) = 379
  * `LinkedIn` (118) + `LINKEDIN` (6) = 124
* **`country` (25 raw values -> 12 true countries + NaN)**:
  * 122 rows have trailing whitespace and lowercase formatting:
    `usa  ` (33), `india  ` (22), `uk  ` (15), `canada  ` (12), `australia  ` (8), `uae  ` (7), `brazil  ` (6), `germany  ` (6), `japan  ` (5), `france  ` (4), `south africa  ` (4), `mexico  ` (4).
  * Standardized breakdown (post-cleaning):
    * USA: 466 | India: 389 | UK: 217 | Canada: 176 | Australia: 164 | Germany: 149
    * UAE: 117 | France: 108 | Brazil: 107 | Japan: 106 | South Africa: 82 | Mexico: 53
    * Missing (`NaN`): 126 (5.58%)
* **`verified`**:
  * `'No'`: 2,024 | `'Yes'`: 192 | Missing: 44 (1.95%)
* **`sentiment`**:
  * `'Positive'`: 907 (40.7%) | `'Neutral'`: 675 (30.3%) | `'Negative'`: 645 (29.0%) | Missing: 33 (1.46%)

### 4.3 Numerical Integrity & Anomalies
* **Negative Engagement in `likes`**:
  * **8 records** have `likes = -1`.
  * These records span multiple platforms (Twitter: 4, Instagram: 2, Facebook: 1, TikTok: 1) and countries.
  * In social media data ingestion, `-1` represents a corrupted counter or sentinel code for missing data.
* **`followers_count` Format & Type Error**:
  * 67 records contain comma thousands separators (e.g. `'20,454'`), forcing pandas to read the entire column as `object` (string).
  * 90 values are missing (`NaN`).
  * Once converted, range spans from 10 to 30,000 followers.
* **`comments` Data Type**:
  * Stored as `float64` rather than integer because pandas defaults to float when an integer column contains `NaN` values (46 nulls).
* **Engagement Distribution & Outliers**:
  * `likes`: Q1=25.0, Median=33.0, Q3=44.0, IQR=19.0. Upper fence = 72.5. 79 outliers (Max = 126).
  * `retweets_shares`: Q1=3.0, Median=6.0, Q3=9.0, IQR=6.0. Upper fence = 18.0. 51 outliers (Max = 37).
  * `comments`: Q1=1.0, Median=3.0, Q3=5.0, IQR=4.0. Upper fence = 11.0. 36 outliers (Max = 20).
  * The outliers represent natural viral engagement spikes typical of social media datasets.

### 4.4 Temporal Integrity
* **Parsing Success**: 2,260 / 2,260 (100% valid datetime strings, 0 unparseable values).
* **Range**: `2023-01-01 01:08:09` to `2024-12-31 21:11:13`.
* **Annual Distribution**:
  * 2023: 1,128 posts (49.9%)
  * 2024: 1,132 posts (50.1%)
* Temporal continuity is well balanced with posts distributed evenly across months, days of the week, and hours of the day.

---

## 5. Proposed Data Cleaning & Preprocessing Treatments

Before executing any data cleaning or pipeline transformations, here are the proposed treatments for each identified defect for your review and approval:

| Issue # | Component | Defect | Proposed Treatment |
|:---:|:---|:---|:---|
| **T1** | **Duplicate Rows** | 60 redundant duplicate post records (44 exact, 16 casing/formatting variants). | **Deduplicate on `post_id`** after standardizing casing and numeric formats, keeping the first valid record. This will reduce row count from 2,260 to 2,200 clean, unique posts. |
| **T2** | **`platform`** | 181 entries in all-caps (`TWITTER`, `INSTAGRAM`, etc.). | Apply `.str.strip().str.title()` to collapse the 10 raw variants into exactly 5 platforms: `Twitter`, `Instagram`, `TikTok`, `Facebook`, `LinkedIn`. |
| **T3** | **`country`** | Trailing whitespace and lowercase variants (`'usa  '`). | Apply `.str.strip().str.title()` with specific uppercase acronym preservation for `USA`, `UK`, `UAE`. |
| **T4** | **`country` Missingness** | 126 records (5.58%) have missing country. | **Option A (Recommended)**: Impute as `'Unknown'` or `'Unspecified'`, allowing them to be retained for platform/sentiment analysis while filtered out of geographic maps. <br>**Option B**: Drop records with missing country only when generating country-specific visual charts. |
| **T5** | **Negative Likes** | 8 records contain `-1`. | **Option A (Recommended)**: Replace `-1` with the median likes of that platform/sentiment group, or replace with `0` (conservative lower bound). <br>**Option B**: Set to `NaN` and exclude from engagement sum calculations. |
| **T6** | **`followers_count`** | Comma strings and 90 missing values (3.98%). | 1. Strip commas: `.astype(str).str.replace(',', '')`. <br>2. Convert to numeric (`float64` / nullable `Int64`). <br>3. Impute the 90 missing values using the median followers count grouped by platform and verification status. |
| **T7** | **`comments`** | 46 missing values (2.04%) and float64 type. | Impute missing values with `0` (assuming no comments were recorded) or platform median, then cast column to nullable integer `Int64`. |
| **T8** | **`verified`** | 44 missing values (1.95%). | Impute with mode (`'No'`), as unverified accounts represent 91.3% of the known population. |
| **T9** | **`sentiment`** | 33 missing values (1.46%). | Impute as `'Neutral'` or assign an explicit category `'Unclassified'`. |
| **T10** | **`timestamp`** | Stored as string `object`. | Convert to `pd.to_datetime()` and engineer visualization-ready features: `year`, `month`, `month_year`, `day_of_week`, `hour`. |
| **T11** | **Feature Engineering** | Need consolidated engagement metric. | Derive `total_engagement = likes + retweets_shares + comments` and `engagement_rate_per_follower = (total_engagement / followers_count) * 100` (handling 0 division safely). |

---

## 6. Available Data Visualization Possibilities

Based on the actual audited columns, the following rich Data Visualization modules are viable:

1. **Cross-Platform Engagement Comparison**:
   * Distribution of likes, shares, and comments across the 5 platforms (Boxplots, Violin plots, Grouped Bar charts).
   * Total and average engagement volume by platform.
2. **Temporal & Trend Analysis**:
   * Multi-line time series of monthly engagement across 2023–2024.
   * Day-of-week and Hour-of-day engagement heatmaps to identify optimal posting windows.
   * Year-over-year growth (2023 vs. 2024).
3. **Geographic Distribution (Country-Level)**:
   * Global choropleth map or ranked horizontal bar charts showing post volume and average engagement across the 12 countries.
   * Platform popularity by nation (e.g., Twitter dominance vs. TikTok dominance in different countries).
4. **Sentiment & Engagement Correlation**:
   * Sentiment distribution (Positive vs. Neutral vs. Negative) by platform and by country.
   * Impact of sentiment on virality: Do negative posts generate more comments or shares than positive posts?
5. **Audience & Creator Tier Analysis**:
   * Verified vs. Unverified creator engagement comparison.
   * Scatter plot / hexbin of follower count vs. total engagement (identifying high-impact micro-influencers).
6. **Hashtag & Topical Analysis**:
   * Frequency analysis of top hashtags (e.g., `#Climate`, `#Fitness`, `#AI`, `#Travel`, `#Business`).
   * Average engagement per hashtag theme.

---

## 7. Project Limitations & Data Constraints

To ensure academic and analytical integrity, the following limitations must be noted:

1. **No State or Regional Granularity**:
   * Visualizations cannot depict state-level maps (e.g., US states or Indian states) because regional data is absent.
2. **No Impression or View Metrics**:
   * Standard impression-based engagement rate (`Engagements / Impressions`) cannot be calculated. Only follower-based engagement rate or raw interaction sums can be reported.
3. **No Content / Media Type Breakdown**:
   * The dataset does not specify whether a post is a Video, Image, Carousel, Story, or Text-only post.
4. **Synthetic Text Patterns**:
   * The `text` column contains templated phrasing across 24 recurring text templates. While sentiment is labeled, natural language variety is constrained.
5. **Missing Country Data**:
   * 126 records (5.58%) cannot be plotted geographically unless categorized as "Unspecified / Global".

---

## 8. Inspection Verification Checklist

- [x] Dataset identified at relative path `data/social_media_sentiment_raw.csv`.
- [x] Read and inspected via Python and pandas without modifying raw files.
- [x] Structural dimensions, schema, and first 10 rows recorded.
- [x] Missing value counts and percentages fully cataloged.
- [x] Duplicate rows, category inconsistencies, negative values, and anomalies documented.
- [x] Specific required dimensions (platform, country, state, timestamp, engagement metrics, views, content type) checked.
- [x] Jupyter notebook [`notebooks/01_data_inspection.ipynb`](notebooks/01_data_inspection.ipynb) created and pre-executed.
- [x] Dataset audit [`DATASET_AUDIT.md`](DATASET_AUDIT.md) compiled.
- [x] **No original records deleted or altered**.
- [x] **Execution stopped before cleaning or dashboard construction, awaiting user approval**.
