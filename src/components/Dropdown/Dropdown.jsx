import React, { useState, useEffect, useRef } from "react";
import { SlArrowDown } from "react-icons/sl";
import "./Dropdown.css";

const debounce = (cb, delay = 1000) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

const Dropdown = ({ url, searchMode = "internal", width = "30%" }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setIsError] = useState(null);

  const dropdownRef = useRef(null);

  const fetchData = async (search) => {
    try {
      setIsDataLoading(true);
      const initialResponse = await fetch(
        search ? `${url}/search?q=${search}` : url
      );
      const response = await initialResponse.json();

      const responseArr = Object.keys(response);
      let whatToFetchFromResp;
      responseArr.forEach((res) => {
        if (Array.isArray(response[res])) {
          whatToFetchFromResp = res;
        }
      });
      const data = response[whatToFetchFromResp];
      setOptions(data);
      setFilteredOptions(data);
    } catch (err) {
      setIsError(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleOptionClick = (item) => {
    setSelectedOption(item);
    setIsOpen(false);
  };

  const debouncedFetching = debounce(fetchData);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchMode === "internal") {
      if (term) {
        const updatedOptions = options.filter((option) =>
          option.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredOptions(updatedOptions);
      } else {
        setFilteredOptions(options);
      }
    } else if (searchMode === "external") {
      debouncedFetching(term);
    }
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="dropdown__container">
      {/* Selector */}
      <div className="dropdown__selector" style={{ width }}>
        <span
          onClick={() => setIsOpen((prevState) => !prevState)}
          className="dropdown__selectedItem"
        >
          {selectedOption || "No option selected"}
          <span>
            <SlArrowDown />
          </span>
        </span>
      </div>

      {/* Dropdown */}
      <div className="dropdown" ref={dropdownRef} style={{ width }}>
        {error && "Error while fetching data"}
        {isOpen && (
          <div className="dropdown__menu">
            <div className="dropdown__inputContainer">
              <input
                type="text"
                value={searchTerm}
                placeholder="Search..."
                onChange={handleSearch}
              />
            </div>
            {isDataLoading && <span className="dropdown__loadingText">Loading data...</span>}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div
                  key={option.id ?? idx}
                  className={`dropdown__option ${
                    selectedOption === option.title ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(option.title)}
                >
                  {option.title}
                </div>
              ))
            ) : !isDataLoading && (
              <div className="dropdown__option">No options available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
