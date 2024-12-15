import { useState } from "react";
import DropArrow from "../../images/dropArrow.svg";
import "./Dropdown.css";

function Dropdown({ options, defaultValue, onChange  }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = option => {
    setSelectedOption(option); // 로컬 상태 업데이트
    setIsOpen(false);

    if (onChange) {
      onChange(option); // 부모 컴포넌트로 값 전달
    }
  };

  return (
    <div className="dropdown-container">
      <button onClick={toggleDropdown} className="dropdown-button">
        <span>{selectedOption}</span>
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
          <img src={DropArrow} alt="DropArrow"></img>
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="dropdown-item">
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
