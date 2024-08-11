import React from 'react';
import { useVendors } from "./VendorsContext";

const SearchResultBadges = () => {
    const {searchBadges} = useVendors()
    // console.log(searchBadges);
    // Check if searchBadges is an array and has elements
    if (!Array.isArray(searchBadges) || searchBadges.length === 0) {
        return null; // Or return a placeholder or empty state if needed
    }
    

   

    return (
        <div className='space-x-4 mt-20'>
            {searchBadges.map((filter, index) => (
                <span key={index} id="badge-dismiss-dark" className="inline-flex items-center px-2 py-1 text-sm font-medium text-black bg-[#E0E0D3]">
                    {filter}
                    
                </span>
            ))}
        </div>
    );
};

export default SearchResultBadges;