import React, { useState, useEffect } from "react";
import { useVendors } from "./VendorsContext";
import vendorData from "./vendorData.json";
import ReactSlider from "react-slider";


const SearchResultFilters = () => {
  // State variables
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setdisplayedVendors ,setSearchBadges} = useVendors();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [projectsCompletedFilter, setProjectsCompletedFilter] = useState(0);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [projectOpen, setProjectOpen] = useState(false);
  const [labourOpen, setLabourOpen] = useState(false);
  const [projects, setProjects] = useState([0,70]);
  const [showAll, setShowAll] = useState(false);
  const [selectedLaborStrength, setSelectedLaborStrength] = useState("");
  const [turnoverFilter, setTurnoverFilter] = useState([0, 100]);
  const [selectedBusinessAge, setSelectedBusinessAge] = useState("");
  const [turnover, setTurnover] = useState(false);
  const [range, setRange] = useState([0, 100]);
  const [businessAge, setBusinessAge] = useState(false);

  // Extract all unique cities from vendor data
  const allCities = [
    ...new Set(
      vendorData.flatMap((vendor) =>
        vendor.serviceLocations.Selectedcities.concat(
          vendor.serviceLocations.Allcities
        )
      )
    ),
  ].slice(0, 10); // Limit to the first 10 cities

  const handleTurnoverDropdown = () => {
    setTurnover(!turnover);
  };
  const handleSliderChange = (values) => {
    setRange(values);
    setTurnoverFilter(values); // Update turnover filter with range
  };
  const handleBusinessAgeDropdown = () => {
    setBusinessAge(!businessAge);
  };

  const handleCheckboxChange = (event) => {
    setShowOnlyVerified(event.target.checked);
  };

  const handleLocationDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  

  const handleRangeChange = (value) => {
    setProjectsCompletedFilter(value);
  };

  const handleLaborStrengthChange = (event) => {
    setSelectedLaborStrength(event.target.value);
  };

  const handleProjectsDropdown = () => {
    setProjectOpen(!projectOpen);
  };
  const handleLabourDropdown = () => {
    setLabourOpen(!labourOpen);
  };

  const handleTurnoverRangeChange = (event) => {
    setTurnoverFilter(parseInt(event.target.value, 10));
  };

  const handleCitySearchChange = (event) => {
    setCitySearchQuery(event.target.value);
  };

  const handleBusinessAgeChange = (event) => {
    setSelectedBusinessAge(event.target.value);
  };

  const handleCityCheckboxChange = (event) => {
    const city = event.target.value;
    if (event.target.checked) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities(
        selectedCities.filter((selectedCity) => selectedCity !== city)
      );
    }
  };

  const convertedVendorsData = vendorData.map((vendor) => ({
    ...vendor,
    turnover: Number(vendor.turnover.replace(/[^0-9.-]+/g, "")), // Remove non-numeric characters and convert to number
  }));

  const filteredCities = allCities.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const citiesToShow = showAll ? filteredCities : filteredCities.slice(0, 4);
  useEffect(() => {
    const filteredVendors = convertedVendorsData
      .filter((vendor) => !showOnlyVerified || vendor.verifiedStatus) // Filter by verified status if the checkbox is checked
      .filter((vendor) => vendor.projectsCompleted >= projectsCompletedFilter) // Filter by projects completed
      .filter(
        (vendor) =>
          vendor.turnover >= turnoverFilter[0] &&
          vendor.turnover <= turnoverFilter[1]
      ) // Filter by turnover
      .filter(
        (vendor) =>
          (selectedCities.length === 0 || // If no city is selected, show all vendors
            vendor.serviceLocations.Selectedcities.some((city) =>
              selectedCities.includes(city)
            ) ||
            vendor.serviceLocations.Allcities.some((city) =>
              selectedCities.includes(city)
            )) &&
          (citySearchQuery === "" || // Filter by city search query
            vendor.serviceLocations.Selectedcities.some((city) =>
              city.toLowerCase().includes(citySearchQuery.toLowerCase())
            ) ||
            vendor.serviceLocations.Allcities.some((city) =>
              city.toLowerCase().includes(citySearchQuery.toLowerCase())
            ))
      )
      .filter((vendor) => {
        if (selectedLaborStrength) {
          const [minStrength, maxStrength] = selectedLaborStrength
            .split("-")
            .map(Number);

          // Default to extremely low/high values if not defined
          const [vendorMinStrength, vendorMaxStrength] = vendor.laborStrength
            .split("-")
            .map(Number);

          return (
            (minStrength === undefined || vendorMinStrength >= minStrength) &&
            (maxStrength === undefined || vendorMaxStrength <= maxStrength)
          );
        }
        return true;
      })
      .filter((vendor) => {
        if (selectedBusinessAge) {
          const [minAge, maxAge] = selectedBusinessAge.split("-").map((age) => {
            if (age.includes("+")) {
              return parseInt(age, 10);
            }
            return parseInt(age, 10);
          });

          const vendorAgeMatch = vendor.businessAge.match(/(\d+)\+?\s*Years/);

          if (vendorAgeMatch) {
            const vendorAge = parseInt(vendorAgeMatch[1], 10);
            if (minAge !== undefined && maxAge !== undefined) {
              return vendorAge >= minAge && vendorAge <= maxAge;
            } else if (minAge !== undefined) {
              return vendorAge >= minAge;
            }
          } else {
            // If age is in a range format
            const vendorAgeRange = vendor.businessAge
              .split("-")
              .map((age) => parseInt(age, 10));
            if (vendorAgeRange.length === 2) {
              return vendorAgeRange[0] >= minAge && vendorAgeRange[1] <= maxAge;
            }
          }
        }
        return true;
      });

    setdisplayedVendors(filteredVendors);

    // Set search badges based on active filters
    const activeFilters = [];
    if (showOnlyVerified) activeFilters.push("Verified Vendors");
    if (projectsCompletedFilter > 0)
      activeFilters.push(`Projects Completed: ${projectsCompletedFilter}+`);
    if (turnoverFilter > 0)
      activeFilters.push(`Turnover: ${turnoverFilter}+ lakh`);
    if (selectedCities.length > 0)
      activeFilters.push(`Cities: ${selectedCities.join(", ")}`);
    if (citySearchQuery) activeFilters.push(`City Search: ${citySearchQuery}`);
    if (selectedLaborStrength)
      activeFilters.push(`Labor Strength: ${selectedLaborStrength}`);
    if (selectedBusinessAge)
      activeFilters.push(`Business Age: ${selectedBusinessAge} years`);

    setSearchBadges(activeFilters); // Update search badges context
    

  }, [
    convertedVendorsData,
    showOnlyVerified,
    projectsCompletedFilter,
    turnoverFilter,
    selectedCities,
    citySearchQuery,
    selectedLaborStrength,
    selectedBusinessAge,
    setdisplayedVendors,
    setSearchBadges,
  ]);
  return (<>
  
    <div className="w-[340px] h-[90vh] overflow-hidden">
      <div
        className="flex flex-col sticky px-8 pt-[24px] h-full"
        style={{
          overflowY: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">Filters</h3>

          {/* Verified vendors only */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/blue_tick.svg"
                alt="tick"
              />
              <p className="ms-2 text-sm w-fit font-medium text-black">
                Verified Vendors Only
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={handleCheckboxChange}
              />
              <div className="mr-[2px] relative w-11 h-6 bg-[#ACACAC] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Locations */}
          <div>
            <button
              onClick={handleLocationDropdown}
              className="w-full flex items-center justify-between text-base text-[#2F2F1C] font-semibold"
            >
              Locations
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
                alt="v"
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "scroll",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                  className="mt-3 flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="p-2 border border-gray-300 rounded-md"
                    value={citySearchQuery}
                    onChange={handleCitySearchChange}
                  />
                  <div className="flex flex-col gap-2">
                    {citiesToShow.map((city, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          value={city}
                          onChange={handleCityCheckboxChange}
                          className="form-checkbox"
                        />
                        <span className="ms-2 text-sm">{city}</span>
                      </label>
                    ))}
                    {!showAll && (
                      <button
                        onClick={() => setShowAll(true)}
                        className="mt-2 text-blue-600"
                      >
                        Show More
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Labor Strength */}
          <div>
            <button
              onClick={handleLabourDropdown}
              className="w-full flex items-center justify-between text-base text-[#2F2F1C] font-semibold"
            >
              Labor Strength
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
                alt="v"
                className={`transition-transform duration-300 ${
                  labourOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {labourOpen && (
              <div className="mt-3">
              <div className="flex flex-col mt-2">
                {["1-10", "10-50", "50-100", "100-200"].map((option) => (
                  <label key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="laborStrength"
                      value={option}
                      checked={selectedLaborStrength === option}
                      onChange={handleLaborStrengthChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            )}
          </div>

          {/* Turnover */}
          <div>
            <button
              onClick={handleTurnoverDropdown}
              className="w-full flex items-center justify-between text-base text-[#2F2F1C] font-semibold"
            >
              Turnover
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
                alt="v"
                className={`transition-transform duration-300 ${
                  turnover ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {turnover && (
              <div>
                <ReactSlider
                  className="w-full h-6 mt-4 mb-8 flex items-center justify-center"
                  thumbClassName="h-6 w-6 bg-white rounded-full cursor-pointer flex items-center justify-center border border-gray-300"
                  trackClassName="h-[2px] bg-[#AEAEAE]"
                  min={0}
                  max={100}
                  step={1}
                  value={range}
                  onChange={handleSliderChange}
                  renderThumb={(props, state) => (
                    <div
                      {...props}
                      className="h-6 w-6 bg-white rounded-full cursor-pointer flex items-center justify-center border border-gray-300"
                    >
                      <div className="absolute bottom-[-25px] px-2 py-1 rounded text-xs">
                        {state.valueNow}
                      </div>
                    </div>
                  )}
                />
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex flex-col justify-center items-center py-1 px-4 border border-gray-400">
                    <span className="text-sm">Minimum</span>
                    <div className="text-base font-bold text-[#464646]">
                      ₹ {range[0]} Lakh
                    </div>
                  </div>
                  <div className="w-4 h-[1px] bg-gray-400"></div>
                  <div className="flex flex-col items-center py-1 px-4 border border-gray-400">
                    <span className="text-sm">Maximum</span>
                    <div className="text-base font-bold text-[#464646]">
                      ₹ {range[1]} Lakh
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Projects Completed */}
          <div>
            <button
              onClick={handleProjectsDropdown}
              className="w-full flex items-center justify-between text-base text-[#2F2F1C] font-semibold"
            >
              Projects Completed
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
                alt="v"
                className={`transition-transform duration-300 ${
                  projectOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {projectOpen && (
              <div>
              <ReactSlider
              className="w-full h-6 mt-4 mb-8 flex items-center justify-center relative"
              thumbClassName="h-6 w-6 bg-white rounded-full cursor-pointer flex items-center justify-center border border-gray-300"
              trackClassName="h-[2px] bg-[#AEAEAE]"
              min={1}
              max={70}
              step={1}
              value={projectsCompletedFilter}
              onChange={handleRangeChange}
              renderThumb={(props, state) => (
                <div
                  {...props}
                  className="h-6 w-6 bg-white rounded-full cursor-pointer flex items-center justify-center border border-gray-300"
                >
                  <div className="absolute bottom-[-25px] px-2 py-1 rounded text-xs">
                    {state.valueNow}
                  </div>
                </div>
              )}
            />
            </div>
            )}
          </div>

          {/* Business Age */}
          <div>
            <button
              onClick={handleBusinessAgeDropdown}
              className="w-full flex items-center justify-between text-base text-[#2F2F1C] font-semibold"
            >
              Business Age
              <img
                src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
                alt="v"
                className={`transition-transform duration-300 ${
                  businessAge ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {businessAge && (
              <div className="mt-3">
              <div className="flex flex-col mt-2">
                {["0-20","20-40","40+"].map((option) => (
                  <label key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="businessAge"
                      value={option}
                      checked={selectedBusinessAge === option}
                      onChange={handleBusinessAgeChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SearchResultFilters;