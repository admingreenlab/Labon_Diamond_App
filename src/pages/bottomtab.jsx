import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonImg,
    IonMenuButton,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { IonMenuToggle } from '@ionic/react';
import { BasketContext } from '../context/BasketContext';
import {WatchlistContext  } from "../context/WatchlistContext";
import Axios, { baseURL } from "../service/jwtAuth";
import { SearchContext } from "../context/SearchContext";

function Bottom({isAuthenticated}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const { basketCount } = useContext(BasketContext);
    const [data, setData] = useState(['' || 0]);
    const isFetching = useRef(false)
    const [clientName, setClientName] = useState('');
    const { setSearchState, searchState } = useContext(SearchContext);
    const { watchlistCount, fetchWatchlistts } = useContext(WatchlistContext);
    const [hideBottom, setHideBottom] = useState(false);


    // const fetchData = async () => {
    //     if (!isAuthenticated) return;
        
    //     if (isFetching.current) return;
    //     isFetching.current = true;
    //     try {
    //         const response = await Axios.get('user/watchlist');

    //         if (response.status === 200) {
    //             setData(response?.data?.data?.length);
    //         }
    //     }
    //     catch (err) {
    //         console.log("Failed to fetch data. Please try again.");
    //     }
    //     finally {
    //         isFetching.current = false;
    //     }
    // };

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         fetchData();
    //     }
    // }, [isAuthenticated]);

    const toggleDropdown = (e) => {
        e?.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleclearstorage = () => {
        const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true';
        localStorage.removeItem("token");
        localStorage.removeItem('user');
        localStorage.removeItem('branches');

        if (!rememberMeChecked) {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMeChecked');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-menu')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const user = localStorage.getItem('user') || localStorage.getItem('user');
            if (user) {
                setClientName(JSON.parse(user)?.FL_USER_NAME)
            }
        }
    }, [isAuthenticated])

    return (
        <>
            {isAuthenticated && (
                <div className='bottombtm-min'>
                    <div className='bottombtm'>
                        <a href="/home" size='small' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFDEB3" className="bi bi-house-door" viewBox="0 0 16 16">
                                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                            </svg>
                        </a>
                        <a href="/watchlist" size='small'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFDEB3" className="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                            </svg>
                            {watchlistCount >= 0 && (
                            <span className="count-shop">{watchlistCount || 0}</span>
                        )}
                        </a>
                        <a href="/basket" size='small'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFDEB3" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            {basketCount >= 0 && (
                                <span className="count-shop">{basketCount}</span>
                            )}
                        </a>
                        <a href="/login" size='small' onClick={handleclearstorage}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="28" fill="#FFDEB3" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

export default Bottom;