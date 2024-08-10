import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (endpoint, page, genre, releaseYearRange, ratingRange, searchQuery) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prepare parameters based on whether searchQuery is present
        const params = {
          page,
          with_genres: genre,
          'release_date.gte': `${releaseYearRange[0]}-01-01`,
          'release_date.lte': `${releaseYearRange[1]}-12-31`,
          'vote_average.gte': ratingRange[0],
          'vote_average.lte': ratingRange[1],
          'language': 'hi-IN',
          'region': 'IN',
          'with_original_language': 'hi'
        };

        // Include searchQuery only if it is not empty
        if (searchQuery.trim()) {
          params.query = searchQuery;
        }

        const options = {
          method: 'GET',
          url: `${process.env.REACT_APP_TMDB_BASE_URL}${endpoint}`,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
          },
          params
        };

        const response = await axios.request(options);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page, genre, releaseYearRange, ratingRange, searchQuery]);

  return { data, loading, error };
};

export default useApi;
