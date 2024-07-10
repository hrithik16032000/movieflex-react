import React, { useState } from 'react';
import MovieModal from '../movieModal/MovieModal'; // Adjust the import path accordingly
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="movie" onClick={openModal}>
        <div>
          <span>{movie.adult ? 'Adult' : 'U'}</span>
        </div>

        <div>
          <img
            src={
              movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : `https://via.placeholder.com/500`
            }
            alt={movie.title}
          />
        </div>

        <div>
          <h3>{movie.title}</h3>
          <span>{`Rating: ${movie.vote_average.toFixed(1)}`}</span>
        </div>
      </div>

      <MovieModal isOpen={isModalOpen} onRequestClose={closeModal} movie={movie} />
    </div>
  );
};

export default MovieCard;
