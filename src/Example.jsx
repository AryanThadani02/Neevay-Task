import React, { useState } from 'react';
import vendorData from "./vendorData.json";
import { useVendors } from './VendorsContext';

function Example() {
  const { vendorsData } = useVendors();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [projectsCompletedFilter, setProjectsCompletedFilter] = useState(0);
  const [turnoverFilter, setTurnoverFilter] = useState(0);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLaborStrength, setSelectedLaborStrength] = useState("");
  const [selectedBusinessAge, setSelectedBusinessAge] = useState("");

  // Convert turnover string to number for filtering and finding the max value
  const convertedVendorsData = vendorData.map(vendor => ({
    ...vendor,
    turnover: Number(vendor.turnover.replace(/[^0-9.-]+/g, "")) // Remove non-numeric characters and convert to number
  }));

  // Extract all unique cities from vendor data
  const allCities = [...new Set(
    vendorData.flatMap(vendor => 
      vendor.serviceLocations.Selectedcities.concat(vendor.serviceLocations.Allcities)
    )
  )].slice(0, 10); // Limit to the first 10 cities

  // Determine which vendors to display based on the checkbox, range input, city checkboxes, and search input
  const displayedVendors = convertedVendorsData
    .filter(vendor => !showOnlyVerified || vendor.verifiedStatus) // Filter by verified status if the checkbox is checked
    .filter(vendor => vendor.projectsCompleted >= projectsCompletedFilter) // Filter by projects completed
    .filter(vendor => vendor.turnover >= turnoverFilter) // Filter by turnover
    .filter(vendor =>
      (selectedCities.length === 0 || // If no city is selected, show all vendors
      vendor.serviceLocations.Selectedcities.some(city => selectedCities.includes(city)) ||
      vendor.serviceLocations.Allcities.some(city => selectedCities.includes(city))) &&
      (citySearchQuery === "" || // Filter by city search query
        vendor.serviceLocations.Selectedcities.some(city => city.toLowerCase().includes(citySearchQuery.toLowerCase())) ||
        vendor.serviceLocations.Allcities.some(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
      )
    )
    .filter(vendor => {
      if (selectedLaborStrength) {
        const [minStrength, maxStrength] = selectedLaborStrength.split('-').map(Number);
        const [vendorMinStrength, vendorMaxStrength] = vendor.laborStrength.split('-').map(Number);
        return vendorMinStrength >= minStrength && vendorMaxStrength <= maxStrength;
      }
      return true;
    })
    .filter(vendor => {
      if (selectedBusinessAge) {
        const [minAge, maxAge] = selectedBusinessAge.split('-').map(age => {
          if (age.includes('+')) {
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
          const vendorAgeRange = vendor.businessAge.split('-').map(age => parseInt(age, 10));
          if (vendorAgeRange.length === 2) {
            return vendorAgeRange[0] >= minAge && vendorAgeRange[1] <= maxAge;
          }
        }
      }
      return true;
    });

  // Handle checkbox change for verified vendors
  const handleCheckboxChange = (event) => {
    setShowOnlyVerified(event.target.checked);
  };

  // Handle range input change for projects completed
  const handleRangeChange = (event) => {
    setProjectsCompletedFilter(parseInt(event.target.value, 10));
  };

  // Handle range input change for turnover
  const handleTurnoverRangeChange = (event) => {
    setTurnoverFilter(parseInt(event.target.value, 10));
  };

  // Handle city search input change
  const handleCitySearchChange = (event) => {
    setCitySearchQuery(event.target.value);
  };

  // Handle city checkbox change
  const handleCityCheckboxChange = (event) => {
    const city = event.target.value;
    if (event.target.checked) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities(selectedCities.filter(selectedCity => selectedCity !== city));
    }
  };

  // Handle labor strength radio button change
  const handleLaborStrengthChange = (event) => {
    setSelectedLaborStrength(event.target.value);
  };

  // Handle business age radio button change
  const handleBusinessAgeChange = (event) => {
    setSelectedBusinessAge(event.target.value);
  };

  return (
    <div>
      <h1>Vendors</h1>
      <label>
        <input
          type="checkbox"
          checked={showOnlyVerified}
          onChange={handleCheckboxChange}
        />
        Show only verified vendors
      </label>
      <div>
        <label>
          Projects Completed: {projectsCompletedFilter}+
          <input
            type="range"
            min="0"
            max={Math.max(...convertedVendorsData.map(vendor => vendor.projectsCompleted))}
            value={projectsCompletedFilter}
            onChange={handleRangeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Turnover: {turnoverFilter}+
          <input
            type="range"
            min="0"
            max={Math.max(...convertedVendorsData.map(vendor => vendor.turnover))}
            value={turnoverFilter}
            onChange={handleTurnoverRangeChange}
          />
        </label>
      </div>
      <div>
        <h3>Search by City</h3>
        <input
          type="text"
          placeholder="Enter city name"
          value={citySearchQuery}
          onChange={handleCitySearchChange}
        />
      </div>
      <div>
        <h3>Filter by City</h3>
        {allCities.map(city => (
          <div key={city}>
            <label>
              <input
                type="checkbox"
                value={city}
                checked={selectedCities.includes(city)}
                onChange={handleCityCheckboxChange}
              />
              {city}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h3>Filter by Labor Strength</h3>
        {['0-10', '10-50', '50-100', '100-200'].map(strengthRange => (
          <label key={strengthRange}>
            <input
              type="radio"
              name="laborStrength"
              value={strengthRange}
              checked={selectedLaborStrength === strengthRange}
              onChange={handleLaborStrengthChange}
            />
            {strengthRange}
          </label>
        ))}
      </div>
      <div>
        <h3>Filter by Business Age</h3>
        {['0-20', '20-40', '40+'].map(ageRange => (
          <label key={ageRange}>
            <input
              type="radio"
              name="businessAge"
              value={ageRange}
              checked={selectedBusinessAge === ageRange}
              onChange={handleBusinessAgeChange}
            />
            {ageRange} years
          </label>
        ))}
      </div>
      <ul>
        {displayedVendors.map(vendor => (
          <li key={vendor.vendorId}>
            <h2>{vendor.vendorName}</h2>
            <p>{vendor.vendorDescription}</p>
            <p><strong>Contact:</strong> {vendor.vendorContact.email}, {vendor.vendorContact.phone}</p>
            <p><strong>Services:</strong> {vendor.services.join(', ')}</p>
            <p><strong>Business Age:</strong> {vendor.businessAge}</p>
            <p><strong>Turnover:</strong> {vendor.turnover} lakh</p>
            <p><strong>Labor Strength:</strong> {vendor.laborStrength}</p>
            <p><strong>Market Sector:</strong> {vendor.marketSector.join(', ')}</p>
            <p><strong>Projects Completed:</strong> {vendor.projectsCompleted}</p>
            <p><strong>Service Locations:</strong> {vendor.serviceLocations.Selectedcities.concat(vendor.serviceLocations.Allcities).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Example;