import React, { createContext, useContext, useState } from 'react';

const VendorsContext = createContext();

export const VendorsProvider = ({ children }) => {
    const [displayedVendors, setdisplayedVendors] = useState([]);

    return (
        <VendorsContext.Provider value={{ displayedVendors, setdisplayedVendors }}>
            {children}
        </VendorsContext.Provider>
    );
};

export const useVendors = () => useContext(VendorsContext);
