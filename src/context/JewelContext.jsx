import React, { createContext, useState } from 'react';

export const JewelContext = createContext();

export const JewelProvider = ({ children }) => {
    const [searchjewel, setSearchjewel] = useState({});

    const clearjewelState = () => {
        setSearchjewel({});
    };

    return (
        <JewelContext.Provider value={{ searchjewel, setSearchjewel , clearjewelState }}>
            {children}
        </JewelContext.Provider>
    );
};