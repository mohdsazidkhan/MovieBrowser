import React, { useRef } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, genre, setGenre, releaseYear, setReleaseYear, rating, setRating, genres, years, ratings, resetFilters }) => {
  const searchInputRef = useRef(null);

  return (
    <div className="flex flex-row justify-between items-center gap-2 my-4">
      <input
        type="text"
        className="w-full sm:w-auto p-2 border border-gray-300 rounded text-white bg-transparent"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchInputRef.current?.focus();
        }}
        ref={searchInputRef}
      />
      
      <select
        className="custom-select"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>

      <select
        className="custom-select"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
      >
        <option value="">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      
      <select
        className="custom-select"
        value={rating}
        onChange={(e) => setRating(parseFloat(e.target.value))}
      >
        <option value="">All Ratings</option>
        {ratings.map(rating => (
          <option key={rating} value={rating}>{rating}</option>
        ))}
      </select>

      <button
        className="ml-4 py-2 px-4 bg-white text-black rounded"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );
};

export default SearchBar;
