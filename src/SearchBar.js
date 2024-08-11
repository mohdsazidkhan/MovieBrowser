import React, { useRef } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, genre, setGenre, releaseYear, setReleaseYear, rating, setRating, genres, years, ratings, resetFilters }) => {
  const searchInputRef = useRef(null);

  return (
    <div className="flex flex-col lg:flex-row justify-between lg:items-center lg:gap-2 my-4">
      {/* Search Input */}
      <input
        type="text"
        className="w-full lg:w-[200px] mb-2 lg:mb-0 p-2 border border-gray-300 rounded text-white bg-transparent"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchInputRef.current?.focus();
        }}
        ref={searchInputRef}
      />

      {/* Selects Row */}
      <div className="flex flex-row justify-between gap-2 w-full">

        <select
          className="custom-select w-full"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>

        <select
          className="custom-select w-full"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select
          className="custom-select w-full"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
        >
          <option value="">All Ratings</option>
          {ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        className="mt-2 lg:mt-0 lg:ml-4 lg:w-[150px] py-2 px-4 bg-white text-black rounded w-full"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );
};

export default SearchBar;
