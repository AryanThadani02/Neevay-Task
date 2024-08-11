import React from "react";

const SearchResultPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-4 mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`border border-black px-3 py-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-black'}`}
      >
        <img
          src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
          alt="Previous"
          className="rotate-90"
        />
      </button>
      <button
        onClick={() => onPageChange(1)}
        className={`border px-3 py-1 ${currentPage === 1 ? 'bg-black text-white' : 'border-black'}`}
      >
        1
      </button>
      {totalPages > 1 && (
        <button
          onClick={() => onPageChange(2)}
          className={`border px-3 py-1 ${currentPage === 2 ? 'bg-black text-white' : 'border-black'}`}
        >
          2
        </button>
      )}
      {totalPages > 2 && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={`border px-3 py-1 ${currentPage === totalPages ? 'bg-black text-white ' : 'border-black'}`}
        >
          {totalPages}
        </button>
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`border border-black px-3 py-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white text-black'}`}
      >
        <img
          src="https://storagereponeevaydevcdn.blob.core.windows.net/business/dropdown_arrow.svg"
          alt="Next"
          style={{ transform: 'rotate(270deg)' }}
        />
      </button>
    </div>
  );
};

export default SearchResultPagination;
