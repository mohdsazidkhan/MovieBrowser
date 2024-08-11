import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, handleFavorite, favorites }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
      {movies.map((movie, index) => {
        const isFavorite = favorites.some((fav) => fav.id === movie.id);
        return (
          <MovieCard
            key={index}
            movie={movie}
            handleFavorite={handleFavorite}
            isFavorite={isFavorite}
          />
        );
      })}
    </div>
  );
};

export default MovieList;
