import React, { useState } from "react";
import SearchResultBadges from "./SearchResultBadges";
import SearchResultPagination from "./SearchResultPagination";
import { useVendors } from "./VendorsContext";

const ContactInfoPopup = ({ business, onClose }) => {
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
    return initials.join("");
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-[505px] h-[459px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Contact Info</h2>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <h3 className="font-bold text-gray-600">Business Contact Details</h3>
          <h3 className="font-bold">{business.vendorName}</h3>
          <p>{business.vendorContact.email}</p>
          <p>{business.vendorContact.phone}</p>
        </div>
        <div className="bg-gray-100 p-4">
          <h3 className="font-bold text-gray-600">Team Contact Details</h3>
          {business.vendorTeam.map((member, index) => (
            <div key={index} className="flex items-center my-2">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {getInitials(member.Name)}
              </div>
              <div>
                <p className="font-bold">{member.Name}</p>
                <p>{member.Email}</p>
                <p>{member.Phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BusinessCard = ({ business, onViewContact }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const description = business.vendorDescription || "No description available.";
  const truncatedDescription = description.slice(0, 150);

  return (
    <div
      style={{
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.15)",
        overflowY: "scroll",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
      className="overflow-y-auto lg:w-[867px] md:w-[664px] md:h-[284px] lg:h-[315px] bg-white md:p-[28px] lg:px-[35px] lg:pt-[35px] lg:pb-[15px] rounded-sm my-6"
    >
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <img
            src="https://storagereponeevaydevcdn.blob.core.windows.net/business/no_business_img.svg"
            alt="Vendor"
            className="lg:h-[140px] lg:w-[140px] md:w-[107px] md:h-[107px] object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-[#212112]">
              {business.vendorName}
            </h3>
            <div className="flex items-center justify-between pb-2 md:pt-[6px] md:pb-[12px]">
              <div className="flex items-center">
                {business.verifiedStatus && (
                  <img
                    src="https://storagereponeevaydevcdn.blob.core.windows.net/business/blue_tick.svg"
                    alt="blue tick"
                  />
                )}
                <span className="text-sm font-medium text-gray-600 pl-[3px]">
                  {business.verifiedStatus ? "Verified Vendor" : ""}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-bold text-gray-500 pt-5">
                {`${business.services[0]}, ${business.services[1]}`}
              </p>
              <span className="flex items-center space-x-1 text-sm font-medium border border-[#CDCDB5] text-gray-600 bg-gray-100 py-2 rounded-full px-2">
                <span role="img" aria-label="location">
                  📍
                </span>
                <span>
                  {`${business.officeAddress.City}, ${business.officeAddress.State}`}
                </span>
              </span>
            </div>
            <div className="bg-[#F5F4F5] md:w-[360px] lg:w-[479px] grid grid-cols-2 gap-4 md:p-[10px] lg:p-[19px] mt-2">
              <div className="flex items-center space-x-2">
                <img
                  src="https://storagereponeevaydevcdn.blob.core.windows.net/business/rupees.svg"
                  alt="Rs."
                />
                <span className="text-gray-700 md:text-xs lg:text-sm">
                  Turnover :
                </span>
                <span className="font-bold md:text-xs lg:text-sm">
                  {business.turnover} Lakh
                </span>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <img
                  src="https://storagereponeevaydevcdn.blob.core.windows.net/business/labour_strength.svg"
                  alt="labour"
                />
                <span className="text-gray-700 md:text-xs lg:text-sm">
                  Labour Strength :
                </span>
                <span className="font-bold md:text-xs lg:text-sm">
                  {business.laborStrength}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src="https://storagereponeevaydevcdn.blob.core.windows.net/business/business_age.svg"
                  alt="age"
                />
                <span className="text-gray-700 md:text-xs lg:text-sm">
                  Business Age :
                </span>
                <span className="font-bold md:text-xs lg:text-sm">
                  {business.businessAge}
                </span>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <img
                  src="https://storagereponeevaydevcdn.blob.core.windows.net/business/projects_completed.svg"
                  alt="proj."
                />
                <span className="text-gray-700 md:text-xs lg:text-sm">
                  Projects Completed :
                </span>
                <span className="font-bold md:text-xs lg:text-sm">
                  {business.projectsCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="mx-4 text-base font-bold text-[#4E4E4E] underline">
            View Profile
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="text-sm w-[620px] text-gray-500 mt-[15px]">
          {isExpanded ? description : truncatedDescription}
          {description.length > 150 && (
            <button
              onClick={handleToggle}
              className="text-blue-500 underline ml-1"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
        <button
          onClick={() => onViewContact(business)}
          className="lg:w-[125px] lg:h-[44px] md:w-[129px] md:h-[44px] flex justify-center items-center text-white text-sm bg-[#2D2D24] rounded-sm"
        >
          View Contact
        </button>
      </div>
    </div>
  );
};

const SearchResultCards = () => {
  const { displayedVendors, searchfilters } = useVendors();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleViewContact = (business) => {
    setSelectedBusiness(business);
  };

  const handleClosePopup = () => {
    setSelectedBusiness(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Apply search filters to displayedVendors
  const filterBusinesses = displayedVendors.filter((vendor) => {
    const matchesVendorType = searchfilters.vendorType
      ? vendor.vendorType === searchfilters.vendorType
      : true;
    const matchesTradeOrBusiness = searchfilters.tradeOrBusiness
      ? vendor.services.includes(searchfilters.tradeOrBusiness)
      : true;
    const matchesRegion = searchfilters.region
      ? `${vendor.officeAddress.City}, ${vendor.officeAddress.State}`.includes(searchfilters.region)
      : true;
    return matchesVendorType && matchesTradeOrBusiness && matchesRegion;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBusinesses = filterBusinesses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filterBusinesses.length / itemsPerPage);

  return (
    <>
      {/* Placeholder for SearchResultBadges */}
      <div className="min-h-screen flex flex-col items-center pr-8">
        <div className="mt-4">
      <SearchResultBadges />
          
          {currentBusinesses.map((business) => (
            <BusinessCard
              key={business.vendorId}
              business={business}
              onViewContact={handleViewContact}
            />
          ))}
        </div>
        <SearchResultPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      {selectedBusiness && (
        <ContactInfoPopup
          business={selectedBusiness}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default SearchResultCards;
