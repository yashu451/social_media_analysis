# Data Cleaning & Preprocessing Report

**Project Title**: Social Media Engagement Analysis  
**Course / Context**: College Data Visualization (DV) Project  
**Task Phase**: Milestone 2 — Data Cleaning & Preprocessing  
**Date**: October 2026  
**Input Raw Dataset**: [`data/social_media_sentiment_raw.csv`](data/social_media_sentiment_raw.csv) (Preserved unchanged)  
**Output Cleaned Dataset**: [`data/processed/social_media_engagement_cleaned.csv`](data/processed/social_media_engagement_cleaned.csv)  
**Execution Notebook**: [`notebooks/02_data_cleaning.ipynb`](notebooks/02_data_cleaning.ipynb)  
**Status**: Validated & Complete — Ready for Milestone 3 (Exploratory Data Visualization)

---

## 1. Executive Summary

In Milestone 2, the raw social media dataset was processed through a systematic, reproducible, and fully documented data cleaning pipeline. The raw CSV file in `data/social_media_sentiment_raw.csv` remains strictly untouched. The processed dataset has been exported to `data/processed/social_media_engagement_cleaned.csv` and verified with programmatic unit checks.

### Key Transformation Metrics
* **Row Count**: Reduced from **2,260** to **2,200** (-60 redundant duplicate rows removed).
* **Column Count**: Expanded from **13** to **20** (+7 derived temporal and engagement features).
* **Duplicate `post_id` Count**: Reduced from **60** to **0** (100% unique primary identifiers).
* **Negative Engagement Counts**: Reduced from **8** to **0** (corrupted `-1` values converted to missing `NaN`).
* **Platform Categorical Variants**: Normalized from **10** raw casing forms into **5** canonical platforms (`Twitter`, `Instagram`, `TikTok`, `Facebook`, `LinkedIn`).
* **Country Categorical Variants**: Normalized from **25** raw forms (with whitespace/casing errors) into **12** standardized countries + `'Unknown'` for missing geography.
* **Temporal Horizon**: 100% valid ISO datetime coverage spanning **2023-01-01 01:08:09** to **2024-12-31 21:11:13** (2 full calendar years).

---

## 2. Before-and-After Dataset Comparison

| Dimension / Metric | Raw Dataset (`df_raw`) | Cleaned Dataset (`df_clean`) | Change Description |
|:---|:---:|:---:|:---|
| **Total Rows** | 2,260 | 2,200 | -60 redundant duplicate post records removed |
| **Total Columns** | 13 | 20 | +7 engineered columns (`year`, `month`, `month_year`, `day_of_week`, `hour`, `total_engagement`, `engagement_rate_per_follower`) |
| **Duplicate `post_id`s** | 60 | 0 | All duplicates resolved and removed |
| **Negative Likes** | 8 (values of `-1`) | 0 | Converted to `NaN` (unrecorded/missing) |
| **`platform` Unique Values**| 10 (casing variants) | 5 | Standardized brand casing (`Twitter`, `Instagram`, `TikTok`, `Facebook`, `LinkedIn`) |
| **`country` Unique Values** | 25 (whitespace/casing) | 13 | Standardized 12 nations + `'Unknown'` |
| **`followers_count` Dtype** | `object` (string with commas) | `Int64` (nullable integer) | Stripped commas and converted to integer |
| **`comments` Dtype** | `float64` | `Int64` (nullable integer) | Cast to integer while preserving missingness |
| **`timestamp` Dtype** | `object` (string) | `datetime64[ns]` | Parsed to datetime with microsecond precision |
| **File Size on Disk** | 346,486 bytes | 433,648 bytes | Validated clean CSV with UTF-8 encoding |

---

## 3. Detailed Record of Cleaning Treatments Applied

### Treatment 1: Post ID Deduplication & Pre-Normalization
* **Original Issue**: The raw dataset contained 60 duplicate instances of `post_id` (120 rows involved total). 44 rows were full character-for-character duplicates, while 16 pairs differed only by formatting artifacts (e.g., `TWITTER` vs `Twitter`, or `'20,454'` vs `'20454.0'`).
* **Treatment Applied**:
  1. Standardized platform casing, country strings, and follower numbers across all rows first.
  2. Verified that all 60 duplicate pairs resolved to semantically identical records.
  3. Applied documented deduplication rule: `df.drop_duplicates(subset=['post_id'], keep='first')`.
* **Result**: Exactly 60 redundant duplicate rows were removed. Exactly 2,200 unique post records remain. Programmatic assertion confirmed 0 duplicate `post_id`s.

### Treatment 2: Social Media Platform Name Standardization
* **Original Issue**: 181 records had uppercase names (`TWITTER`: 54, `INSTAGRAM`: 53, `TIKTOK`: 41, `FACEBOOK`: 27, `LINKEDIN`: 6), fragmenting platform comparisons.
* **Treatment Applied**: Mapped all entries to standard brand capitalization:
  * `Twitter`: 745 posts
  * `Instagram`: 614 posts
  * `TikTok`: 398 posts
  * `Facebook`: 379 posts
  * `LinkedIn`: 124 posts
* **Result**: Clean 5-platform taxonomy with 0 unmapped or fragmented categories.

### Treatment 3: Country Name Standardization & Missing Value Treatment
* **Original Issue**: 122 records had trailing whitespace and lowercase names (e.g., `'usa  '`, `'india  '`). Furthermore, 126 records in raw data had missing country values.
* **Treatment Applied**:
  1. Stripped whitespace and normalized casing while preserving standard geopolitical acronyms (`USA`, `UK`, `UAE`).
  2. Per project requirements, missing countries were assigned the explicit label `'Unknown'`.
  3. **Analytical Discovery**: All 60 duplicate rows in the raw dataset were among the records with missing country. Thus, removing 60 redundant duplicate rows reduced the missing country count from 126 in raw to exactly **66 unique posts** labeled `'Unknown'` in the cleaned dataset.
* **Final Country Distribution**:
  * `USA`: 466 | `India`: 389 | `UK`: 217 | `Canada`: 176 | `Australia`: 164 | `Germany`: 149
  * `UAE`: 117 | `France`: 108 | `Brazil`: 107 | `Japan`: 106 | `South Africa`: 82 | `Unknown`: 66 | `Mexico`: 53
* **Analytical Guidance**: Non-geographic visualizations can retain `'Unknown'` records to utilize their platform and sentiment metrics. Geographic choropleth maps must filter out `'Unknown'`.

### Treatment 4: Negative Likes Sentinel Value Treatment (`likes = -1`)
* **Original Issue**: 8 records contained `likes = -1` (Twitter: 4, Instagram: 2, Facebook: 1, TikTok: 1). Likes cannot be negative in social networks.
* **Treatment Applied**: Treated `-1` as an ingestion sentinel or corrupted recording. Replaced with `np.nan` (missing value).
* **Rationale**: Preserved missingness rather than fabricating arbitrary numbers (like 0 or platform medians) without evidence.

### Treatment 5: Follower Count Cleaning & Type Casting
* **Original Issue**: 67 values contained comma separators (e.g., `'20,454'`), forcing pandas to load the column as `object`. 88 unique records had missing follower counts.
* **Treatment Applied**:
  1. Removed comma separators: `.astype(str).str.replace(',', '').str.strip()`.
  2. Converted to numeric via `pd.to_numeric(..., errors='coerce')`.
  3. Cast to pandas nullable integer `Int64`.
  4. Preserved missingness (88 records remain `<NA>`), avoiding arbitrary imputation bias.

### Treatment 6: Comments Metric Handling & Type Casting
* **Original Issue**: 44 records in the deduplicated dataset were missing comments (`NaN`). Pandas defaulted the column to `float64` (e.g., `4.0` comments).
* **Treatment Applied**:
  1. Preserved missingness per project instructions (did **not** assume missing comments mean 0 comments).
  2. Cast column to pandas nullable integer `Int64`, ensuring true counts are displayed as integers without decimal artifacts.

### Treatment 7: Temporal Standardization & Cyclic Feature Extraction
* **Original Issue**: `timestamp` was stored as raw strings.
* **Treatment Applied**:
  1. Converted to `datetime64[ns]` with zero parse failures.
  2. Extracted derived temporal features:
     * `year`: `2023` (1,091 posts) and `2024` (1,109 posts).
     * `month`: Integer 1 to 12.
     * `month_year`: Period string `YYYY-MM` (24 distinct consecutive months).
     * `day_of_week`: Day names (`Monday` through `Sunday`).
     * `hour`: Integer hour 0 to 23.

### Treatment 8: Derived Engagement Metrics & Analytical Formulations
1. **Total Engagement (`total_engagement`)**:
   $$\text{total\_engagement} = \text{likes} + \text{retweets\_shares} + \text{comments}$$
   * **Missingness Policy**: Calculated as a strict sum. If `likes` (8 records) or `comments` (44 records) is missing, `total_engagement` evaluates to `<NA>` (52 missing records total; 0 overlap).
2. **Engagement Rate per Follower (`engagement_rate_per_follower`)**:
   $$\text{engagement\_rate\_per\_follower} = \left(\frac{\text{total\_engagement}}{\text{followers\_count}}\right) \times 100$$
   * **Scope of Calculation**: Computed **strictly** where `followers_count.notna() & (followers_count > 0) & total_engagement.notna()`.
   * **Missing Count**: 136 records evaluate to `NaN` (52 records missing total engagement + 88 records missing followers count - 4 overlapping records).
   * **Documented Limitations**:
     1. **Discovery Algorithms & Virality**: Modern platforms (TikTok FYP, Instagram Explore, Twitter For You) recommend content to non-followers. Posts reaching viral distribution can exhibit engagement rates exceeding 100%.
     2. **Impression Data Absence**: Industry-standard engagement rate is $(\text{Engagements} / \text{Impressions}) \times 100$. Because views/impressions are unavailable in this dataset, follower count is used as an imperfect proxy for creator scale, not post reach.
     3. **Small-Denominator Sensitivity**: Accounts with modest followings (e.g. 20–50 followers) produce very high percentage engagement rates from modest engagement counts.

### Treatment 9: Preserving Non-Imputed Features
* `verified`: 44 missing values strictly preserved.
* `sentiment`: 33 missing values strictly preserved.
* `hashtags`: 762 missing values strictly preserved (representing posts published without hashtags).

---

## 4. Missing Value Audit (Before vs. After)

The table below summarizes missing values in the raw dataset versus the clean deduplicated dataset:

| Column Name | Raw Missing Count | Raw Missing % | Clean Missing Count | Clean Missing % | Treatment Summary |
|:---|:---:|:---:|:---:|:---:|:---|
| `post_id` | 0 | 0.00% | 0 | 0.00% | Validated 100% unique primary keys |
| `timestamp` | 0 | 0.00% | 0 | 0.00% | Converted to datetime64[ns] |
| `platform` | 0 | 0.00% | 0 | 0.00% | Standardized to 5 canonical brands |
| `user` | 0 | 0.00% | 0 | 0.00% | Preserved handles |
| `followers_count` | 90 | 3.98% | 88 | 4.00% | Commas stripped; missingness preserved |
| `verified` | 44 | 1.95% | 44 | 2.00% | Missingness preserved |
| `text` | 0 | 0.00% | 0 | 0.00% | Preserved caption text |
| `hashtags` | 788 | 34.87% | 762 | 34.64% | Missingness preserved (posts without tags) |
| `country` | 126 | 5.58% | 0 | 0.00% | 66 missing converted to explicit `'Unknown'` |
| `likes` | 0 | 0.00% | 8 | 0.36% | 8 invalid values (`-1`) converted to `NaN` |
| `retweets_shares`| 0 | 0.00% | 0 | 0.00% | 100% complete integer counts |
| `comments` | 46 | 2.04% | 44 | 2.00% | Cast to `Int64`; missingness preserved |
| `sentiment` | 33 | 1.46% | 33 | 1.50% | Missingness preserved |
| `year` | — | — | 0 | 0.00% | Derived from timestamp |
| `month` | — | — | 0 | 0.00% | Derived from timestamp |
| `month_year` | — | — | 0 | 0.00% | Derived from timestamp |
| `day_of_week` | — | — | 0 | 0.00% | Derived from timestamp |
| `hour` | — | — | 0 | 0.00% | Derived from timestamp |
| `total_engagement`| — | — | 52 | 2.36% | Missing when likes or comments missing |
| `engagement_rate_per_follower`| — | — | 136 | 6.18% | Missing when engagement or followers missing |

---

## 5. Outlier Investigation & Analytical Justification

We evaluated engagement metrics using the Interquartile Range (IQR) fence rule ($\text{Upper Fence} = Q_3 + 1.5 \times \text{IQR}$):

| Metric | Q1 (25%) | Median (50%) | Q3 (75%) | IQR | Upper Fence | Outlier Count (%) | Max Value | Decision |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| `likes` | 25.00 | 33.00 | 44.00 | 19.00 | 72.50 | 77 (3.5%) | 126.00 | **Retained**: Authentic viral likes |
| `retweets_shares`| 3.00 | 6.00 | 9.00 | 6.00 | 18.00 | 49 (2.2%) | 37.00 | **Retained**: High-performing shares |
| `comments` | 1.75 | 3.00 | 5.00 | 3.25 | 9.88 | 74 (3.4%) | 20.00 | **Retained**: Active discussion posts |
| `total_engagement`| 31.00 | 42.00 | 56.00 | 25.00 | 93.50 | 81 (3.8%) | 169.00 | **Retained**: Top engagement posts |
| `engagement_rate_per_follower`| 0.84% | 2.34% | 6.53% | 5.69% | 15.05% | 206 (10.0%) | 250.00% | **Retained**: Micro-account viral reach |

### Justification for Retaining Outliers
Social media engagement data is inherently non-normal and heavily right-skewed. Deleting high-engagement records would artificially suppress viral phenomena—the exact subject matter of interest in a Social Media Engagement Analysis project. Therefore, all high-engagement values are preserved.

---

## 6. Programmatic Quality Assurance & Validation Suite

The cleaning pipeline incorporates automated assertion tests that verified the following conditions:

1. **Shape Integrity**: `assert df.shape == (2200, 20)` — **PASSED**.
2. **Duplicate Primary Keys**: `assert df['post_id'].duplicated().sum() == 0` — **PASSED**.
3. **Absence of Negative Counts**: Programmatic check verified 0 negative values across `followers_count`, `likes`, `retweets_shares`, `comments`, `total_engagement`, and `engagement_rate_per_follower` — **PASSED**.
4. **Platform Categorical Integrity**: `len(df['platform'].unique()) == 5` — **PASSED**.
5. **Country Categorical Integrity**: `len(df['country'].unique()) == 13` (12 countries + `'Unknown'`) — **PASSED**.
6. **Date Parsing Integrity**: `assert df['timestamp'].isna().sum() == 0` — **PASSED**.
7. **CSV Export & Read-Back**: File read back from `data/processed/social_media_engagement_cleaned.csv` verified with identical 2,200 rows and 20 columns — **PASSED**.

---

## 7. Data Dictionary: Cleaned Dataset Schema

The cleaned dataset saved at `data/processed/social_media_engagement_cleaned.csv` contains the following attributes:

| # | Column Name | Data Type | Null Count | Description & Value Domain |
|:---:|:---|:---:|:---:|:---|
| 1 | `post_id` | `str` | 0 | Unique post identifier (e.g., `P100040`). Primary key. |
| 2 | `timestamp` | `datetime64[ns]` | 0 | Date and time of post publication (2023-01-01 to 2024-12-31). |
| 3 | `platform` | `str` | 0 | Platform: `Twitter`, `Instagram`, `TikTok`, `Facebook`, `LinkedIn`. |
| 4 | `user` | `str` | 0 | Post author's user handle (2,185 unique users). |
| 5 | `followers_count` | `Int64` | 88 | Author follower count (Range: 10 to 30,000). Nullable integer. |
| 6 | `verified` | `str` | 44 | Account verification status: `'No'`, `'Yes'`. |
| 7 | `text` | `str` | 0 | Post content/caption text (24 recurring text templates). |
| 8 | `hashtags` | `str` | 762 | Space-separated hashtag string (e.g., `#Climate #Movies`). |
| 9 | `country` | `str` | 0 | Origin nation (12 nations or `'Unknown'`). |
| 10 | `likes` | `Int64` | 8 | Like count (Range: 5 to 126). 8 invalid values converted to `<NA>`. |
| 11 | `retweets_shares`| `Int64` | 0 | Retweet/share count (Range: 0 to 37). Nullable integer. |
| 12 | `comments` | `Int64` | 44 | Comment count (Range: 0 to 20). Nullable integer. |
| 13 | `sentiment` | `str` | 33 | Post sentiment label: `'Positive'`, `'Neutral'`, `'Negative'`. |
| 14 | `year` | `int32` | 0 | Calendar year extracted from timestamp: `2023` or `2024`. |
| 15 | `month` | `int32` | 0 | Numerical month (1 to 12). |
| 16 | `month_year` | `str` | 0 | Year and month string `YYYY-MM` (24 distinct periods). |
| 17 | `day_of_week` | `str` | 0 | Day of the week (`Monday` to `Sunday`). |
| 18 | `hour` | `int32` | 0 | Hour of day of publication (0 to 23). |
| 19 | `total_engagement`| `Int64` | 52 | Consolidated interaction sum: `likes + shares + comments`. |
| 20 | `engagement_rate_per_follower`| `float64` | 136 | Engagement percentage per follower: `(total_engagement / followers) * 100`. |

---

## 8. Milestone 2 Completion Checklist

- [x] Original raw CSV preserved unchanged at `data/social_media_sentiment_raw.csv`.
- [x] Created `notebooks/02_data_cleaning.ipynb` with complete, documented cleaning pipeline.
- [x] Notebook executed from start to finish with 0 errors and all assertions passing.
- [x] Created directory `data/processed/` and saved `social_media_engagement_cleaned.csv`.
- [x] Standardized platform names and country names; preserved standard acronyms (`USA`, `UK`, `UAE`).
- [x] Normalized formatting before duplicate resolution; removed 60 redundant duplicate posts; 1 post per ID retained.
- [x] Converted `timestamp` to datetime and `followers_count` to numeric integer.
- [x] Converted counts to nullable `Int64` while preserving authentic missingness.
- [x] Converted `likes = -1` (8 records) to missing (`NaN`) with documented rationale.
- [x] Preserved missing values carefully (`country` as `'Unknown'`, comments nulls preserved, no arbitrary imputation).
- [x] Investigated outliers and retained legitimate high-engagement viral posts.
- [x] Engineered derived columns: `year`, `month`, `month_year`, `day_of_week`, `hour`, `total_engagement`.
- [x] Calculated `engagement_rate_per_follower` only where followers are valid and $> 0$, documenting limitations.
- [x] Validated cleaned dataset with programmatic checks (types, missing values, duplicates, negatives, categories).
- [x] Created comprehensive `DATA_CLEANING_REPORT.md`.
- [x] No state/region, views/impressions, or content-type data invented.
- [x] Stopped before dashboard/visualization construction, awaiting user review.
