import React, { useState, useEffect, useRef, useCallback,  } from "react";
import MovieCard from "./components/movieCard/MovieCard";
import SearchBar from "./components/searchBar/SearchBar";
import "./App.css";

const BASE_API_URL = "https://api.themoviedb.org/3";
export const API_KEY = `${process.env.REACT_APP_API_KEY}`;
const DEFAULT_YEAR = 2012;
const CURRENT_YEAR = new Date().getFullYear();

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [currentYear, setCurrentYear] = useState(DEFAULT_YEAR);

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const loaderRef = useRef(null);

  const fetchMovies = async (year, genres = []) => {
    setIsLoading(true);
    try {
      let apiUrl = "";

      if (searchParam) {
        apiUrl = `${BASE_API_URL}/search/movie?api_key=${API_KEY}&query=${searchParam}&sort_by=popularity.desc&page=1&vote_count.gte=100&language=en-US&primary_release_year=${year}`;
      } else {
        apiUrl = `${BASE_API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=1&vote_count.gte=100&primary_release_year=${year}`;
        if (genres.length > 0) {
          apiUrl += `&with_genres=${genres.join(",")}`;
        }
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      setMovies((prevMovies) => [
        ...prevMovies,
        { year, movies: data.results },
      ]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();

        const filteredGenres = data.genres.filter((genre) =>
          [28, 12, 35, 878, 27, 10749, 18].includes(genre.id)
        );
        setGenres(filteredGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (!initialFetchDone) {
      fetchMovies(DEFAULT_YEAR, selectedGenres);
      setInitialFetchDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetchDone, selectedGenres]);

  useEffect(() => {
    if (initialFetchDone) {
      setMovies([]); // Clear previous movies
      fetchMovies(DEFAULT_YEAR, selectedGenres);
      setCurrentYear(DEFAULT_YEAR); // Reset the year to the default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, searchParam]);

  // Intersection observer callback to fetch movies for previous years
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && initialFetchDone) {
        const nextYear = currentYear + 1;
        if (nextYear <= CURRENT_YEAR) {
          setCurrentYear(nextYear);
          fetchMovies(nextYear, selectedGenres);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, initialFetchDone, currentYear, selectedGenres]
  );

  // Setup intersection observer to load more movies as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loaderRef.current && initialFetchDone) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver, initialFetchDone]);

  const handleGenreSelect = (genreId) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genreId)
        ? prevSelectedGenres.filter((id) => id !== genreId)
        : [...prevSelectedGenres, genreId]
    );
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchParam(searchInput);
  };

  const handleAllButtonClick = () => {
    setSelectedGenres([]);
    setSearchParam("");
    setSearchInput("");
  };

  return (
    <div className="app">
      <div className="header">
        <div className="headerSearch">
          {/* App Logo */}
          <div className="moviefix-logo">MOVIEFIX</div>

          {/* Search Bar */}
          <div className="search-bar-container">
          <SearchBar
            searchInput={searchInput}
            handleSearchInputChange={handleSearchInputChange}
            handleSearchSubmit={handleSearchSubmit}
          />
          </div>
        </div>

        <div className="headerFilter">
          <h2>Genre Filter: </h2>
        </div>

        {/* Genre Filter Buttons */}
        <div className="filter-btns">
          <button
            className={
              selectedGenres.length === 0 && searchParam === "" ? "active" : ""
            }
            onClick={handleAllButtonClick}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={selectedGenres.includes(genre.id) ? "active" : ""}
              onClick={() => handleGenreSelect(genre.id)}
            >
              {genre.name}
            </button>
          ))}
          <button id="clear-btn" onClick={() => setSelectedGenres([])}>
            Clear
          </button>
        </div>
      </div>

      {isLoading && movies.length === 0 && (
        <div className="loading">Loading...</div>
      )}

      {!isLoading && movies.length === 0 && (
        <div className="no-movies">No Movies Found</div>
      )}

      {movies.length > 0 &&
        movies.map(
          (yearData) =>
            yearData.movies.length > 0 && (
              <div key={yearData.year}>
                <div className="year">{yearData.year}</div>

                <div className="container">
                  {yearData.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )
        )}

      {isLoading && movies.length > 0 && (
        <div className="loading">Loading...</div>
      )}

      <div ref={loaderRef} />
    </div>
  );
}

export default App;

