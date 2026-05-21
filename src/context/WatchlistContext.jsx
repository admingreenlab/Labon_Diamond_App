import { createContext, useState, useEffect, useRef } from "react";
import Axios from "../service/jwtAuth";

const WatchlistContext = createContext();

const WatchlistProvider = ({ children }) => {
  const [watchlistCount, setWatchlistCount] = useState(0);
  const isFetching = useRef(false);

  const fetchWatchlistts = async () => {
    if (isFetching.current) return;

    isFetching.current = true;

    try {
      // SINGLE
      const singleRes = await Axios.get(
        "user/watchlist?inventoryType=single"
      );

      // PARCEL
      const parcelRes = await Axios.get(
        "user/watchlist?inventoryType=parcel"
      );

      // JEWEL
      const jewelRes = await Axios.get(
        "user/watchlist?inventoryType=jewel"
      );

      const singleCount = singleRes?.data?.data?.length || 0;
      const parcelCount = parcelRes?.data?.data?.length || 0;
      const jewelCount = jewelRes?.data?.data?.length || 0;

      // TOTAL COUNT
      setWatchlistCount(
        singleCount + parcelCount + jewelCount
      );

    } catch (err) {
      console.log("Failed to fetch watchlist.", err);
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchWatchlistts();
  }, []);

  return (
    <WatchlistContext.Provider
      value={{
        watchlistCount,
        setWatchlistCount,
        fetchWatchlistts,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export { WatchlistProvider, WatchlistContext };