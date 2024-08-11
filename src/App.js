import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import Loader from './Loader';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [rating, setRating] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const apiUrl = searchQuery.trim() !== '' ? '/search/movie' : '/discover/movie';

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() === '' && !data) {
        setLoading(true);
      }
      setError(null);
      try {
        const params = {
          page,
          with_genres: genre,
          'release_date.gte': `${releaseYear || 1900}-01-01`,
          'release_date.lte': `${releaseYear || new Date().getFullYear()}-12-31`,
          'vote_average.gte': rating || 0,
          'vote_average.lte': rating || 10,
          'language': 'hi-IN',
          'region': 'IN',
          'with_original_language': 'hi'
        };

        if (searchQuery.trim()) {
          params.query = searchQuery;
        }

        const options = {
          method: 'GET',
          url: `${process.env.REACT_APP_TMDB_BASE_URL}${apiUrl}`,
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
  }, [apiUrl, page, genre, releaseYear, rating, searchQuery]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      if (!loading && data?.results?.length < data?.total_pages * 20) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, data]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setLoading(false);
    } else {
      setPage(1); 
    }
  }, [searchQuery]);

  const handleFavorite = (movie) => {
    let updatedFavorites = [...favorites];
    const isFavorite = updatedFavorites.some((fav) => fav.id === movie.id);
    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter((fav) => fav.id !== movie.id);
    } else {
      updatedFavorites.push(movie);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setGenre('');
    setReleaseYear('');
    setRating('');
    setPage(1);
  };

  if (searchQuery.trim() === '' && loading && page === 1) return <Loader message="Loading Movies..." />;
  if (error) return <p>Error: {error.message}</p>;

  const filteredMovies = data?.results?.filter((movie) =>
    (genre ? movie?.genre_ids?.includes(parseInt(genre)) : true) &&
    (!releaseYear || new Date(movie.release_date).getFullYear() === parseInt(releaseYear)) &&
    (!rating || movie.vote_average <= rating)
  ) || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const ratings = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];

  return (
    <div className="container mx-auto">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genre={genre}
        setGenre={setGenre}
        releaseYear={releaseYear}
        setReleaseYear={setReleaseYear}
        rating={rating}
        setRating={setRating}
        genres={genres}
        years={years}
        ratings={ratings}
        resetFilters={resetFilters}
      />

      <MovieList
        movies={filteredMovies}
        handleFavorite={handleFavorite}
        favorites={favorites}
      />

      {loading && <Loader message="Loading more..." />}
    </div>
  );
}

export default App;
