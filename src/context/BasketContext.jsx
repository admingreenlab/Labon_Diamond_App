import { createContext, useState, useEffect } from 'react';
import Axios from "../service/jwtAuth";

const BasketContext = createContext();

const BasketProvider = ({ children }) => {
  const [basketCount, setBasketCount] = useState(0);
  const isFetching = { current: false };

  const fetchDatas = async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    try {
      // Fetch SINGLE items
      const singleRes = await Axios.post('user/userbasket', {
        type: 'S',
        stype: 'single'
      });

      // Fetch PARCEL items
      const parcelRes = await Axios.post('user/userbasket', {
        type: 'S',
        stype: 'parcel'
      });

      const singleCount = singleRes?.data?.data?.length || 0;
      const parcelCount = parcelRes?.data?.data?.length || 0;

      // TOTAL = single + parcel
      setBasketCount(singleCount + parcelCount);

    } catch (err) {
      console.log("Failed to fetch basket data.");
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <BasketContext.Provider value={{ basketCount, setBasketCount, fetchDatas }}>
      {children}
    </BasketContext.Provider>
  );
};

export { BasketProvider, BasketContext };

