import { useState } from "react";
import "./SearchBar.css";

function SearchBar({text, onInputChange}) {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  return (
    <div>
      <label className="searchBar-container">
        <input
          className="searchBar-input"
          type="text"
          value={inputValue}
      onChange={handleInputChange}
          placeholder={text}
        />
      </label>
    </div>
  );
}

export default SearchBar;
