import React from 'react';
import { useVendors } from './VendorsContext';

const SearchResultText = () => {
  const { searchfilters } = useVendors();

  // Check if searchfilters is defined and contains tradeOrBusiness
  if (!searchfilters || !searchfilters.tradeOrBusiness) {
    return null; // Do not render anything if the filter is empty
  }

  return (
    <div>
      <p className='bg-[#E6E6E5] text-base px-8 py-4 mt-[92px]'>
        Showing results for <span className='font-bold'>{searchfilters.tradeOrBusiness}</span>
      </p>
    </div>
  );
};

export default SearchResultText;
