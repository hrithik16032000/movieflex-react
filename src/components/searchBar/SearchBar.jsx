import React from "react";
import "./SearchBar.css"; // Make sure to create and style SearchBar.css as needed

const SearchBar = ({ searchInput, handleSearchInputChange, handleSearchSubmit }) => {
  return (
    <div className="searchBar">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
