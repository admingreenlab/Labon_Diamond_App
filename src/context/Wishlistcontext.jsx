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
      const apiRes = await Axios.get("user/watchlist");
      const apiCount = apiRes?.data?.data?.length || 0;

      const local = JSON.parse(localStorage.getItem("watchlist")) || [];
      const localCount = local.length;

      setWatchlistCount(apiCount + localCount);

    } catch (err) {
      console.log("Failed to fetch watchlist.");
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchWatchlistts();
  }, []);

  return (
    <WatchlistContext.Provider
      value={{ watchlistCount, setWatchlistCount, fetchWatchlistts }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export { WatchlistProvider, WatchlistContext };
