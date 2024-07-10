import React from 'react';
import Modal from 'react-modal';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './MovieModal.css';
import {
  FaCalendarAlt,
  FaLanguage,
  FaStar,
  FaThumbsUp,
  FaFilm,
  FaListAlt,
} from 'react-icons/fa';

Modal.setAppElement('#root');

const MovieModal = ({ isOpen, onRequestClose, movie }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Movie Details"
      className="Modal"
      overlayClassName="Overlay"
    >
      <button onClick={onRequestClose} className="close-button">
        &times;
      </button>

      <h2 className="modal-title">{movie.title}</h2>

      <LazyLoad height={200} offset={100} placeholder={<Skeleton height={200} />}>
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`
              : `https://via.placeholder.com/500`
          }
          alt={movie.title}
          className="modal-image"
        />
      </LazyLoad>

      <div className="modal-info">
        <p>
          <FaCalendarAlt /> <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <FaFilm /> <strong>Original Title:</strong> {movie.original_title}
        </p>
        <p>
          <FaLanguage /> <strong>Language:</strong> {movie.original_language}
        </p>
        <p>
          <FaThumbsUp /> <strong>Popularity:</strong> {movie.popularity}
        </p>
        <p>
          <FaStar /> <strong>Vote Average:</strong> {movie.vote_average}
        </p>
        <p>
          <FaListAlt /> <strong>Vote Count:</strong> {movie.vote_count}
        </p>
        <p>
          <strong>Overview:</strong> {movie.overview}
        </p>
        <p>
          <strong>Genres:</strong> {movie.genre_ids.join(', ')}
        </p>
      </div>
    </Modal>
  );
};

export default MovieModal;
