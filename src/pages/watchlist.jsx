import React, { useEffect, useState, useRef } from 'react';
import {
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonImg,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonAccordion,
    IonAccordionGroup,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonChip,
    IonicSlides,
    IonButtons,
    IonToast
} from '@ionic/react';
import Bottom from './bottomtab';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './head';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import Like from './like';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import Axios from "../service/jwtAuth";


function Watchlist({isAuthenticated}) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(100);
    const [data, setData] = useState([]);
    const [clientName, setClientName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const isFetching = useRef(false)
    const [tabselect, settabselect] = useState({
        single: true,
        parcel: false
    });

    

    const fetchData = async (single) => {
        if (isFetching.current) return; 
        isFetching.current = true; 

        if (single === 'parcel') {
        
            const watchlistdata = JSON.parse(localStorage.getItem('watchlist'));
            setData(watchlistdata)
            
        } else {
            
            try {
                const response = await Axios.get('user/watchlist');

                if (response.status === 200) {
                    setData(response?.data?.data); 
                    
                }
            }
            catch (err) {
                console.log("Failed to fetch data. Please try again."); 
            }
        }
        isFetching.current = false;
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const user = localStorage.getItem('user') || localStorage.getItem('user');
        if (user) {
            // console.log('user.FL_USER_NAME',JSON.parse(user)?.FL_USER_NAME)
            setClientName(JSON.parse(user)?.FL_USER_NAME)
        }
    }, [])


    // useEffect(() => {
    //     console.log('selectedRows', selectedRows);
    // }, [selectedRows])

    const handleRowSelect = (item) => {
        if (tabselect.single) {
            setSelectedRows((prevSelected) => {
                const isSelected = prevSelected.some(selected => selected === item.STONE);
                if (isSelected) {
                    // Remove the item if already selected
                    return prevSelected.filter(selected => selected !== item.STONE);
                } else {
                    // Add the complete item if not selected
                    return [...prevSelected, item.STONE];
                }
            });
        } else {
            setSelectedRows((prevSelected) => {
                const isSelected = prevSelected.some(selected => selected === item.FL_SUB_LOT);
                if (isSelected) {
                    // Remove the item if already selected
                    return prevSelected.filter(selected => selected !== item.FL_SUB_LOT);
                } else {
                    // Add the complete item if not selected
                    return [...prevSelected, item.FL_SUB_LOT];
                }
            });
        }
    };

    const sortfilter = (col) => {
        const sortedValue = [...data].sort((a, b) => {
            const aValue = a[col] ? a[col].toString() : "";
            const bValue = b[col] ? b[col].toString() : "";

            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        setData(sortedValue);
    };

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(col);
            setSortOrder("asc");
        }
        sortfilter(col);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);
    // const totalPages = Math.ceil(data?.length / rowsPerPage);
    const totalPages = data?.length > 0 ? Math?.ceil(data.length / rowsPerPage) : 1;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totals = {
        CARATS: data?.reduce((sum, row) => sum + row.CARATS, 0),
        ASK_DISC: data?.reduce((sum, row) => sum + (row.ASK_DISC / data.length), 0),
        // pricects: data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100), 0),
        pricects: data?.length > 0 ?
            data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100) * (row.CARATS), 0) /
            data?.reduce((sum, row) => sum + row.CARATS, 0) : 0,
        amount: data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100) * row.CARATS, 0),
    };

    const handleaddBasket = async () => {
        if (tabselect.single) {
            if (selectedRows.length > 0) {
                try {
                    const response = await Axios.post('user/userbasket', {
                        type: 'I',
                        stone_id: selectedRows,
                        stype: 'POLISH-SINGLE'
                    })
                    if (response.status === 200) {
                        fetchData('single');
                        setToastMessage(response?.data?.status);
                        setShowToast(true);
                        window.location.reload()
                    }
                } catch (error) {
                    console.error("error to handle basket", error)
                    setToastMessage(error.response.data)
                    // setToastMessage('User not found.');
                    setShowToast(true);
                }
            } else {
                window.alert('please select stone')
            }
        } else {
            if (selectedRows.length > 0) {
                try {
                    const response = await Axios.post('user/userbasket', {
                        type: 'I',
                        stone_id: selectedRows,
                        stype: 'POLISH-PARCEL'
                    })
                    if (response.status === 200) {
                        fetchData('parcel');
                        setToastMessage(response?.data?.status);
                        setShowToast(true);
                        // window.location.reload()

                    }
                } catch (error) {
                    console.error("error to handle basket", error)
                    setToastMessage(error.response.data)
                    // setToastMessage('User not found.');
                    setShowToast(true);
                }
            } else {
                window.alert('please select stone')
            }
        }
    }

    const handleRemoveFromWatchlist = async () => {
        if (selectedRows.length === 1) {
            try {
                const response = await Axios.delete('user/watchlist/remove', {
                    params: {
                        lotId: selectedRows.join(',')
                    }
                });
                if (response.status === 200) {
                    setToastMessage(response?.data?.message);
                    setShowToast(true);
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error removing from watchlist", error);
                setToastMessage(error.response.data);
                setShowToast(true);
            }
        } else {
            window.alert('Please select only one StoneId');
        }
    }


    const removeFromLocalStorage = (selectedRows) => {
        try {
 
            const storedData = JSON.parse(localStorage.getItem('watchlist')) || [];

            const updatedData = storedData.filter(
                (item) => !selectedRows.includes(item.FL_SUB_LOT)
            );

            localStorage.setItem('watchlist', JSON.stringify(updatedData));

            console.log('Successfully removed selected items.');
        } catch (error) {
            console.error('Error removing items:', error);
        }
    };

    const handleClearWatchlist = async () => {
        if (tabselect.single) {
            if (selectedRows?.length === data?.length) {
                try {
                    const response = await Axios.delete('user/watchlist/clear');
                    if (response.status === 200) {
                        setToastMessage(response?.data?.message);
                        setShowToast(true);
                        setSelectedRows([]);
                        window.location.reload();
                        fetchData()
                    }
                } catch (error) {
                    console.error("Error removing from watchlist", error);
                    setToastMessage(error.response.data);
                    setShowToast(true);
                }
            } else {
                window.alert('Please select all StoneIds to clear the watchlist');
            }
        } else {
           
            if (selectedRows?.length !== 0) {
                removeFromLocalStorage(selectedRows);
                fetchData('parcel')
            } else {
                window.alert('Please select StoneIds to clear the watchlist');
            }
        }
    };



    return (
        <>
        <IonPage>
            <Header />
            <IonContent  style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px' }}>
                <div style={{ marginTop: '20px' }}>
                    <h5 class="text-center mb-5 element">Watch List</h5>
                </div>
                <div style={{ display: 'flex', gap: '10px', margin:'10px 0px 15px 15px' }}>
                    <button
                        className={tabselect.single ? 'sumbutton' : 'sumbutton sumbutton-11'}
                        onClick={() => {
                            settabselect(prev => ({
                                ...prev,
                                single: true,
                                parcel: false
                            }))
                            fetchData('single');
                            setSelectedRows([]);
                        }}>SINGLE</button>
                    <button
                        className={tabselect.parcel ? 'sumbutton' : 'sumbutton sumbutton-11'}
                        onClick={() => {
                            settabselect((prev) => ({
                                ...prev,
                                single: false,
                                parcel: true
                            }))
                            fetchData('parcel');
                            setSelectedRows([]);
                        }}
                    >PARCEL</button>
                </div>
                <div className='myquotations' style={{ marginBottom: '90px' }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div style={{ display: "flex", color: "black", marginBottom: "10px" }}>
                                    <span className='client'>Client Name:</span>
                                    <div style={{ marginLeft: "8px", display: "block", color: "#4c3226", borderBottom: '1px solid #b89154' }}>{clientName} </div>
                                </div>
                                <div className="mainbtn" style={{ justifyContent: "start", marginBottom: "15px", alignItems: "center" }}>
                                    <div style={{
                                        fontWeight: 400,
                                        display: "flex",
                                        gap: "6px",
                                        color: "black",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}>
                                        <button className="sumbutton" style={{}} onClick={handleaddBasket}>Add to Basket</button>
                                        <button className="sumbutton" style={{}} onClick={handleRemoveFromWatchlist}>Remove Watchlist</button>
                                        <button className="sumbutton" style={{}} onClick={handleClearWatchlist}>All Watchlist Clear</button>
                                    </div>
                                    <div className='suggest-nam' style={{ marginLeft: 'auto', marginTop: "15px", color: "black" }}>
                                        <label style={{ fontWeight: '300', color: "black" }}> Available: </label>
                                        <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px", }}> A </button>
                                        <label style={{ fontWeight: '300', color: "black" }}> Memo: </label>
                                        <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px", }}> M </button>
                                    </div>
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <IonRow style={{ display: 'flex', textAlign: 'center', margin: '0px 0px 0px 0px' }}>
                                        <IonCol size='12' style={{ display: "flex", alignItems: 'center', justifyContent: "center" }}>
                                            <button onClick={() => handlePageChange(1)} className='Pagination'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                                                    <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} className='Pagination'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                                </svg>
                                            </button>
                                            {[...Array(totalPages)]?.map((_, index) => (
                                                <button
                                                    className='Pagination'
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} className='Pagination'>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handlePageChange(totalPages)} className='Pagination'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                                                    <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                                                </svg>
                                            </button>
                                        </IonCol>
                                    </IonRow>
                                </div>
                                {
                                    tabselect?.single ? <>
                                        <div className='table-responsive pt-10'>
                                            <table striped bordered hover style={{ width: 'max-content', color: 'black' }} >
                                                <thead className="tablecss" >
                                                    <tr>
                                                        <th>
                                                            <label className="checkbox style-a">
                                                                <input type="checkbox"
                                                                    onChange={() => {
                                                                        if (selectedRows?.length === data?.length) {
                                                                            setSelectedRows([]);
                                                                        } else {
                                                                            setSelectedRows(data?.map(item => item.STONE));
                                                                        }
                                                                    }}
                                                                    checked={selectedRows?.length === data?.length}
                                                                />
                                                                <div className="checkbox__checkmark"></div>
                                                            </label>
                                                        </th>
                                                        {/* <th>SrNo</th> */}
                                                        <th>Status</th>
                                                        <th>StoneId</th>
                                                        <th onClick={() => handleSort("LAB")}> Lab {sortBy === "LAB" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th>Report No</th>
                                                        <th onClick={() => handleSort("SHAPE")}>
                                                            Shape {sortBy === "SHAPE" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}
                                                        </th>
                                                        <th onClick={() => handleSort("CARATS")}>
                                                            Carats {sortBy === "CARATS" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th onClick={() => handleSort("COLOR")}>
                                                            Color {sortBy === "COLOR" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th onClick={() => handleSort("CLARITY")}>
                                                            Clarity {sortBy === "CLARITY" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th onClick={() => handleSort("CUT")}>
                                                            Cut{sortBy === "CUT" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th onClick={() => handleSort("POLISH")}>
                                                            Polish{sortBy === "POLISH" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th onClick={() => handleSort("SYMM")}>
                                                            Symm{sortBy === "SYMM" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                        <th>Measurements</th>
                                                        <th>Table %</th>
                                                        <th>Depth %</th>
                                                        <th>Ratio</th>
                                                        <th>H&A</th>
                                                        <th>RapPrice</th>
                                                        <th>Discount %</th>
                                                        <th>Price/Cts</th>
                                                        <th>Amount</th>
                                                        <th>Certificate</th>
                                                        <th>VideoLink</th>
                                                        <th>Created By</th>

                                                    </tr>
                                                </thead>
                                                <tbody className="tablecss">
                                                    {currentRows?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <label className="checkbox style-a">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRows?.some(selected => selected === item.STONE)}
                                                                        onChange={() => handleRowSelect(item)}

                                                                    />
                                                                    <div className="checkbox__checkmark"></div>
                                                                </label>
                                                            </td>
                                                            {/* <td>{item.srNo}</td> */}
                                                            <td>{item.STATUS}</td>
                                                            <td>{item.STONE}</td>
                                                            <td><a style={{ color: 'blue' }} href={`https://www.igi.org/reports/verify-your-report?r=${item.REPORTNO}`} target="_blank">{item.LAB}</a></td>
                                                            <td>{item.REPORTNO}</td>
                                                            <td>{item.SHAPE}</td>
                                                            <td>{item.CARATS}</td>
                                                            <td>{item.COLOR}</td>
                                                            <td>{item.CLARITY}</td>
                                                            <td>{item.CUT}</td>
                                                            <td>{item.POLISH}</td>
                                                            <td>{item.SYMM}</td>
                                                            <td>{item.FL_MEASUREMENTS}</td>
                                                            <td>{item.FL_TABLE_PER?.toFixed(2)}</td>
                                                            <td>{item.FL_DEPTH_PER?.toFixed(2)}</td>
                                                            <td>{item.FL_RATIO || '-'}</td>
                                                            <td>{item.ha}</td>
                                                            <td>{item.RAP_PRICE?.toFixed(2)}</td>
                                                            <td>{item.ASK_DISC}</td>
                                                            <td>{(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100).toFixed(2)}</td>
                                                            <td>{((item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100) * item.CARATS)?.toFixed(2)}</td>
                                                            <td><a href={`https://www.igi.org/reports/verify-your-report?r=${item.REPORTNO}`} target="_blank" style={{ color: 'blue' }}>PDF</a></td>
                                                            <td><a href={`https://www.dnav360.com/vision/dna.html?d=${item.STONE}&ic=1`} target="_blank" style={{ color: 'blue' }}>VIDEO</a></td>
                                                            <td>{clientName}</td>
                                                            {/* <td>{item.companyName}</td> */}
                                                        </tr>
                                                    ))}
                                                    <tr className="tablecss">
                                                        <th></th>
                                                        <th colSpan={5}>Total</th>
                                                        <th>{totals.CARATS?.toFixed(2)}</th>
                                                        <th colSpan={10}></th>
                                                        <th></th>
                                                        <th>{totals.ASK_DISC?.toFixed(2)}</th>
                                                        <th>{totals.pricects?.toFixed(2)}</th>
                                                        <th>{totals.amount?.toFixed(2)}</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {/* <th></th> */}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </> : <>
                                    <div className='table-responsive pt-10'>
                                            <table striped bordered hover style={{ width: 'max-content', color: 'black' }} >
                                                <thead className="tablecss" >
                                                    <tr>
                                                            <th>
                                                            <label className="checkbox style-a">
                                                                <input type="checkbox"
                                                                    onChange={() => {
                                                                        if (selectedRows?.length === data?.length) {
                                                                            setSelectedRows([]);
                                                                        } else {
                                                                            setSelectedRows(data?.map(item => item.FL_SUB_LOT));
                                                                        }
                                                                    }}
                                                                    checked={selectedRows?.length === data?.length}
                                                                />
                                                                <div className="checkbox__checkmark"></div>
                                                            </label>
                                                        </th>
                                                        {/* <th>SrNo</th> */}
                                                        <th>Type</th>
                                                    <th>Location</th>
                                                    <th>In Stock</th>
                                                    <th>LOT NO</th>
                                                    <th>Carats</th>
                                                    <th>Clarity</th>
                                                    <th>CO ID</th>
                                                    <th>Color</th>
                                                    <th>Height</th>
                                                    <th>Length</th>
                                                    <th>Main_LOT</th>
                                                    <th>Shape</th>
                                                    <th>MM Size</th>
                                                    <th>Width</th>
                                                    <th>ASK AMT</th>

                                                    </tr>
                                                </thead>
                                                <tbody className="tablecss">
                                                    {currentRows?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <label className="checkbox style-a">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRows?.some(selected => selected === item.FL_SUB_LOT)}
                                                                        onChange={() => handleRowSelect(item)}

                                                                    />
                                                                    <div className="checkbox__checkmark"></div>
                                                                </label>
                                                            </td>
                                                            <td>{item.FL_TYPE}</td>
                                                        <td>{item.FL_BRID}</td>
                                                        <td>A</td>
                                                        <td>{item.FL_SUB_LOT}</td>
                                                        <td>{item.FL_CARATS}</td>
                                                        <td>{item.FL_CLARITY}</td>
                                                        <td>{item.FL_COID}</td>
                                                        <td>{item.FL_COLOR}</td>
                                                        <td>{item.FL_HIGHT}</td>
                                                        <td>{item.FL_LENGTH}</td>
                                                        <td>{item.FL_MAIN_LOT}</td>
                                                        <td>{item.FL_SHAPE_NAME}</td>
                                                        <td>{item.FL_SIZE}</td>
                                                        <td>{item.FL_WIDTH}</td>
                                                        <td>{item.FL_ASK_AMT}</td>
                                                        </tr>
                                                    ))}
                                       
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                }
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />

            </IonContent >
           <Bottom isAuthenticated={isAuthenticated}/>
           </IonPage>
        </ >
    );
}
export default Watchlist; 