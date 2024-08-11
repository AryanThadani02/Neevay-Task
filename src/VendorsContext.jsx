import React, { createContext, useContext, useState } from 'react';

const VendorsContext = createContext();

export const VendorsProvider = ({ children }) => {
    const [displayedVendors, setdisplayedVendors] = useState([]);
    const [searchfilters, setSearchfilters] = useState([])
    const [searchBadges, setSearchBadges] = useState([])

    return (
        <VendorsContext.Provider value={{ displayedVendors, setdisplayedVendors,searchfilters, setSearchfilters ,searchBadges, setSearchBadges }}>
            {children}
        </VendorsContext.Provider>
    );
};

export const useVendors = () => useContext(VendorsContext);