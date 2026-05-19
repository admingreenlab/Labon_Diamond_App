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
import Axios, { baseURL } from "../service/jwtAuth";
import { SearchContext } from "../context/SearchContext";

function apps() {
    const [showDropdown, setShowDropdown] = useState(false);
    const { basketCount } = useContext(BasketContext);
    const [data, setData] = useState(['' || 0]);
    const isFetching = useRef(false)
    const [clientName, setClientName] = useState('');
    const { setSearchState, searchState } = useContext(SearchContext);


    // const fetchData = async () => {
    //     if (isFetching.current) return;
    //     isFetching.current = true;
    //     try {
    //         const response = await Axios.get('user/watchlist');

    //         if (response.status === 200) {
    //             setData(response?.data?.data?.length); // Update state only if the component is still mounted
    //             // console.log(response?.data?.data?.length)
    //         }
    //     }
    //     catch (err) {
    //         console.log("Failed to fetch data. Please try again."); // Set error state
    //     }
    //     finally {

    //         isFetching.current = false;
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const toggleDropdown = (e) => {
        e?.stopPropagation();
        setShowDropdown(!showDropdown);
    };


    // const handleclearstorage = () => {
    //     localStorage.clear();
    // }

    const handleclearstorage = () => {
        const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true';
        localStorage.removeItem("token");
        localStorage.removeItem('user');
        localStorage.removeItem('branches');

        if (!rememberMeChecked) {
            // Only clear credentials if rememberMe was not checked
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
        const user = localStorage.getItem('user') || localStorage.getItem('user');
        // const branchescode = localStorage.getItem('branches') || sessionStorage.getItem('branches')
        if (user) {
            // setCompany(JSON.parse(branchescode)[0].FL_COMPANY_CODE);
            // console.log('user.FL_USER_NAME',JSON.parse(user)?.FL_USER_NAME)
            setClientName(JSON.parse(user)?.FL_USER_NAME)
        }
    }, [])





    return (
        <>
            <IonHeader >
                <IonToolbar >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1px 0', marginTop: '0px' }}>
                                 <div style={{ position: 'relative' }}>
                            <button onClick={toggleDropdown} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                                <IonImg
                                    slot="start"
                                    src="img/user.png"
                                    style={{ height: '30px', margin: '0' }}
                                ></IonImg>
                            </button>
                       
                        </div>
                                        <IonImg
                                slot="start"
                                src="img/logo.svg"
                                style={{ height: '24px', margin: '0', marginLeft: '0px' }}
                            ></IonImg>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IonButtons slot="start">
                                <IonMenuButton fill='clear' >
                                    <Ion-Icon slot="start" src="img/align-left.svg" style={{ height: '100%', marginLeft: '10px', marginRight: '10px' }}></Ion-Icon>
                                </IonMenuButton>
                            </IonButtons>
                 
                        </div>
               
                    </div>
                </IonToolbar>
                 
            </IonHeader>
            {showDropdown && (
                <div className='dropdown-menu' >
                    <div className="profile">
                        <h6 className="text-center mt-2">{clientName}</h6>
                    </div>
                    <a href="/login" style={{ cursor: 'pointer' }} onClick={handleclearstorage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"></path><path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"></path></svg>
                        Logout</a>
                </div>
            )}          
        </>
    );
}

export default apps;

