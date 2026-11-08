import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { parseCleanedRow } from '../utils/dataEngine';

export function useSocialData() {
  const [posts, setPosts] = useState([]);
  const [benchmarks, setBenchmarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);

        // Fetch Cleaned CSV
        const csvResponse = await fetch('/data/social_media_engagement_cleaned.csv');
        if (!csvResponse.ok) {
          throw new Error(`Failed to load dataset: ${csvResponse.statusText}`);
        }
        const csvText = await csvResponse.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (!isMounted) return;

            const parsedPosts = results.data.map(parseCleanedRow);
            setPosts(parsedPosts);

            // Fetch Benchmarks JSON
            fetch('/data/powerbi_benchmarks.json')
              .then(res => res.json())
              .then(benchData => {
                if (isMounted) setBenchmarks(benchData);
              })
              .catch(err => {
                console.warn('Could not load benchmarks JSON:', err);
              })
              .finally(() => {
                if (isMounted) setLoading(false);
              });
          },
          error: (parseError) => {
            if (isMounted) {
              setError(parseError.message);
              setLoading(false);
            }
          }
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { posts, benchmarks, loading, error };
}
