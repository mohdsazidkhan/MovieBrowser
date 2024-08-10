import { useState, useEffect, useCallback } from 'react';
import './App.css';
import useApi from './useApi';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState('');
  const [releaseYearRange, setReleaseYearRange] = useState([2000, 2024]);
  const [ratingRange, setRatingRange] = useState([0, 10]);

  const { data, loading, error } = useApi(
    '/discover/movie',
    page,
    genre,
    releaseYearRange,
    ratingRange,
    searchQuery
  );

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

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredMovies = data?.results?.filter((movie) =>
    (genre ? movie?.genre_ids?.includes(parseInt(genre)) : true) &&
    (new Date(movie.release_date).getFullYear() >= releaseYearRange[0] &&
     new Date(movie.release_date).getFullYear() <= releaseYearRange[1]) &&
    (movie.vote_average >= ratingRange[0] && movie.vote_average <= ratingRange[1])
  ) || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const ratings = Array.from({ length: 101 }, (_, i) => (i / 10).toFixed(1));

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between items-center gap-2 my-4">
        <input
          type="text"
          className="w-full sm:w-auto p-2 border border-gray-300 rounded text-white bg-transparent"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          className="custom-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
        </select>
        
        <select
          className="custom-select"
          value={releaseYearRange[0]}
          onChange={(e) => setReleaseYearRange([parseInt(e.target.value), releaseYearRange[1]])}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          className="custom-select"
          value={releaseYearRange[1]}
          onChange={(e) => setReleaseYearRange([releaseYearRange[0], parseInt(e.target.value)])}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select
          className="custom-select"
          value={ratingRange[0]}
          onChange={(e) => setRatingRange([parseFloat(e.target.value), ratingRange[1]])}
        >
          {ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
        <select
          className="custom-select"
          value={ratingRange[1]}
          onChange={(e) => setRatingRange([ratingRange[0], parseFloat(e.target.value)])}
        >
          {ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
        {filteredMovies.map((movie) => {
          const truncatedTitle = movie.title.length > 18 ? `${movie.title.slice(0, 18)}...` : movie.title;
          return (
            <div
              key={movie.id}
              className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg shadow-lg bg-cover bg-center"
              style={{
                backgroundImage: `url(${process.env.REACT_APP_TMDB_IMAGE_BASE_URL}/${movie.poster_path})`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end rounded-lg">
                <div className="w-full text-white p-4">
                  <h3
                    className="text-sm sm:text-base md:text-lg font-semibold"
                    title={movie.title}
                  >
                    {truncatedTitle}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base">{movie.release_date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p className='text-white'>Loading more...</p>}
    </div>
  );
}

export default App;
