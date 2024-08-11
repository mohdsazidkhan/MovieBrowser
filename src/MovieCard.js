import React from 'react';

const MovieCard = ({ movie, handleFavorite, isFavorite }) => {
  const truncatedTitle = movie.title.length > 18 ? `${movie.title.slice(0, 18)}...` : movie.title;

  return (
    <div
      className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: `url(${process.env.REACT_APP_TMDB_IMAGE_BASE_URL}/${movie.poster_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end rounded-lg">
        <div className="w-full text-white p-4">
          <h3
            className="text-sm sm:text-base md:text-lg font-semibold"
            title={movie.title}
          >
            {truncatedTitle}
          </h3>
          <p className="text-xs sm:text-sm md:text-base">{movie.release_date}</p>
          <button
            className={`mt-2 py-1 px-3 rounded ${isFavorite ? 'bg-red-600' : 'bg-green-600'}`}
            onClick={() => handleFavorite(movie)}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
