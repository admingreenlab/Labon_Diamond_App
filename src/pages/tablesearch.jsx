import React, { useContext, useEffect, useRef, useState } from 'react';
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
    IonToast,

} from '@ionic/react';
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
import Bottom from './bottomtab';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import Axios, { baseURL } from "../service/jwtAuth"
// import { SearchContext } from "../context/SearchContext";
// import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { BasketContext } from "../context/BasketContext";
import { WatchlistContext } from "../context/WatchlistContext";

function Tablesearch({isAuthenticated}) {
    const history = useHistory();
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const hasFetched = React.useRef(false);
    const location = useLocation();
    const searchResult = location.state?.searchResult;
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoadings, setIsLoadings] = useState(false);
    const selectedOptions = location.state?.selectedOptions;
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const { setSearchState, fetchDatas } = useContext(BasketContext);
    const { setWatchlistCount, fetchWatchlistts } = useContext(WatchlistContext);

    useEffect(() => {
        if (searchResult && !hasFetched.current) {
            setData(searchResult);
            setLoading(false);
            hasFetched.current = true;
        }
    }, [searchResult]);



    const handleRowSelect = (item) => {
        setSelectedRows((prevSelected) => {
            const isSelected = prevSelected.some(selected => selected.STONE === item.STONE);
            if (isSelected) {
                return prevSelected.filter(selected => selected.STONE !== item.STONE);
            } else {
                return [...prevSelected, item];
            }
        });
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
    const paginatedData = data?.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = data?.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;


    const generatePaginationButtons = () => {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Adjust start and end pages if necessary
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, 5);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, totalPages - 4);
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totals = {
        CARATS: data?.reduce((sum, row) => sum + row.CARATS, 0),
        ASK_DISC: data?.reduce((sum, row) => sum + (row.ASK_DISC / data.length), 0),
        // pricects: data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100), 0),
        pricects: data?.length > 0 ?
            data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100) * (row.CARATS), 0) /
            data?.reduce((sum, row) => sum + row.CARATS, 0) : 0,
        amount: data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100) * row.CARATS, 0),
        // {(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100)}
        // {(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100) * item.CARATS}
    };


    const handleaddwatchlist = async () => {
        if (selectedRows.length < 1) {
          window.alert("Please select stone to add watchlist");
          return;
        }
        if (selectedRows.length > 500) {
          window.alert("You can add a maximum of 500 stones to the watchlist.");
          return;
        }
    
        setIsLoadingAll(true);
        const users = localStorage.getItem("user");
        const FL_COID = JSON.parse(users).FL_COID;
    
        try {
          const response = await Axios.post("user/watchlist/add", {
            lotIds: selectedRows.map((row) => row.STONE),
            inventoryType: "POLISH-SINGLE",
            coid: FL_COID,
          });
    
          if (response.status === 200) {
            setToastMessage("Stone added to Watchlist");
            setShowToast(true);
            setSelectedRows([]);
          }
          await fetchWatchlistts();
        } catch (error) {
          setToastMessage(error?.response?.data?.message);
          setShowToast(true);
        } finally {
          setIsLoadingAll(false);
        }
      };
    
      const handleaddBasket = async () => {
        if (selectedRows.length === 0) {
          window.alert("Please select stone to add Basket");
          return;
        }
        if (selectedRows.length > 500) {
          window.alert("You can add a maximum of 500 stones to the Add to Basket.");
          return;
        }
        setIsLoadingAll(true);
        try {
          const response = await Axios.post("user/userbasket", {
            type: "I",
            stone_id: selectedRows.map((row) => row.STONE),
            stype: "POLISH-SINGLE",
          });
          if (response.status === 200) {
            // const eventBus = getEventBus();
            setToastMessage("Stone added to basket");
            setShowToast(true);
            // eventBus.emit("basketUpdated");
            // window.alert('Added to basket')
            setSelectedRows([]);
          }
          await fetchDatas();
        } catch (error) {
          console.error("error to handle basket", error);
          // setToastMessage("Please select stone ID")
          // // setToastMessage('User not found.');
          // setShowToast(true);
        } finally {
          setIsLoadingAll(false);
        }
      };
    
    const handleExportSelectedToExcel = async () => {

        if (selectedRows.length === 0) {
            window.alert('Please select stones to export.');
            return;
        }

        try {
            setIsLoading(true);
            // console.log('selectedRows', selectedRows)
            const payload = {
                stoneCert: selectedRows?.map(row => row.STONE).join(' '), // Converts the array of STONE IDs into a space-separated string
            };

            const response = await Axios.post('/search/stoneUser?type=excel', payload);

            if (response.data.status === 'success') {
                const link = document.createElement('a');
                link.href = `${baseURL}/exports/${response.data.fileName}`;
                link.download = response.data.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            
                setToastMessage(response?.data?.status);
                setShowToast(true);
            }
            


        } catch (error) {
            console.log(error)
            setToastMessage(error.response.data)
            // setToastMessage('User not found.');
            setShowToast(true);
        }
        finally {
            setIsLoading(false); // Set loading to false after search completes or fails
        }
    }

    const basketredireck = async () => {
        console.log('Redirecting with selected options:', selectedOptions);
        history.push({
            pathname: `/home`,
            state: { selectedOptions: selectedOptions }
          });
    };

    // const basketredireck = async () => {
    //     // console.log('Redirecting with selected options:', selectedOptions);
    //     // history.push({
    //     //     pathname: `/home`,
    //     //     state: { selectedOptions: selectedOptions }
    //     //   });
    //     history.push('/home')
    // };


    const handleExportAllToExcel = async () => {

        if (data.length === 0) {
            window.alert('No data available to export.');
            return;
        }

        try {
            setIsLoadings(true);
            const payload = {
                stoneCert: "",
                ...searchResult // Pass the entire searchState object here
            }
            const response = await Axios.post('/search/stoneUser?type=excel', payload);

            if (response.data.status === 'success') {
                window.open(`${baseURL}/exports/${response.data.fileName}`)
                setToastMessage(response?.data?.status);
                setShowToast(true);
            }


        } catch (error) {
            console.log(error)
            setToastMessage(error.response.data)
            // setToastMessage('User not found.');
            setShowToast(true);
        }
        finally {
            setIsLoadings(false); // Set loading to false after search completes or fails
        }
    }
    const [showDropdown, setShowDropdown] = useState(false);
    const handleClick = () => {
        setShowDropdown(!showDropdown);
    };


    return (
        <>
        <IonPage>
            <Header />
            <IonContent  style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px', }}>
                <div style={{ marginTop: '20px' }}>
                    <h5 class="text-center mb-5 element">Polish Certified Table</h5>
                </div>
                <div className='myquotations' style={{ marginBottom: '100px' }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div className="mainbtn" style={{ justifyContent: "start", marginBottom: "15px", alignItems: "center" }}>
                                    <div style={{
                                        fontWeight: 400,
                                        display: "flex",
                                        gap: "7px",
                                        color: "black",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}>

                                        <button className="sumbuttontable" onClick={handleaddBasket} >Add to Basket</button>

                                        <button className="sumbuttontable" onClick={handleExportSelectedToExcel} disabled={isLoading}>{isLoading ? "Download..." : "Export to Excel"}</button>

                                        <button className="sumbuttontable" onClick={handleExportAllToExcel} disabled={isLoadings}>{isLoadings ? "Download..." : "Export All to Excel"}</button>
                                        <button className="sumbuttontable" onClick={basketredireck}>Modify Search</button>
                                        <button className="sumbuttontable" onClick={handleaddwatchlist}>Add To WatchList</button>
                                        <button onClick={handleClick} className={showDropdown ? "dropdown show" : "dropdown"}>
                                            <div style={{ display: 'flex',  }}>
                                                <span style={{ background: '#fff6ec', fontSize: '17px', color:"#4c3226" }}>Page Size:</span>
                                                <select
                                                    style={{ margin: '-5px 0px 0px 5px' }}
                                                    value={rowsPerPage}
                                                    onChange={(e) => {
                                                        setRowsPerPage(parseInt(e.target.value));
                                                        setCurrentPage(1);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {[10, 20, 50, 100].map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </button>

                                    </div>
                                    <div className='suggest-nam' style={{ margin: 'auto', marginTop: "25px", color: "black" }}>
                                        <label style={{ fontWeight: '300', color: "black" }}> Available:</label>
                                        <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px" }}>A</button>
                                        <label style={{ fontWeight: '300', color: "black" }}> Memo:</label>
                                        <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px" }}> M </button>
                                       
                                    </div>
                                </div>
                                <div style={{ margin: '0px 0px 10px 0px' }}>
                                    <IonRow style={{ display: 'flex', textAlign: 'center',  margin: '0px 0px 0px 0px' }}>
                                        <IonCol size='12' style={{display:"flex", alignItems:'center',justifyContent:"center"}}>
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

                                            {generatePaginationButtons().map((page) => (
                                                <button
                                                    className='Pagination'
                                                    key={page}
                                                    active={page === currentPage}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
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
                                <div className='table-responsive pt-10'>
                                    <table striped bordered hover style={{ width: 'max-content', color: 'black' }} >
                                        <thead className="tablecss" >
                                            <tr>
                                                <th>
                                                    <label className="checkbox style-a">
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => {
                                                                if (selectedRows?.length === data?.length) {
                                                                    setSelectedRows([]);
                                                                } else {
                                                                    setSelectedRows(data?.map(item => item));
                                                                }
                                                            }}
                                                            checked={selectedRows?.length === data?.length}
                                                        />
                                                        <div className="checkbox__checkmark"></div>
                                                    </label>
                                                </th>
                                                {/* <th>SrNo</th> */}
                                                <th>Status</th>
                                                <th>Location</th>
                                                <th>StoneId</th>
                                                <th style={{ minWidth: '55px' }} onClick={() => handleSort("LAB")}> Lab {sortBy === "LAB" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th>ReportNo</th>
                                                <th style={{ minWidth: '70px' }} onClick={() => handleSort("SHAPE")}>
                                                    Shape {sortBy === "SHAPE" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}
                                                </th>
                                                <th style={{ minWidth: '64px' }} onClick={() => handleSort("CARATS")}>
                                                    Carats {sortBy === "CARATS" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th style={{ minWidth: '64px' }} onClick={() => handleSort("COLOR")}>
                                                    Color {sortBy === "COLOR" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th style={{ minWidth: '75px' }} onClick={() => handleSort("CLARITY")}>
                                                    Clarity {sortBy === "CLARITY" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th onClick={() => handleSort("CUT")}>
                                                    Cut{sortBy === "CUT" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th onClick={() => handleSort("POLISH")}>
                                                    Polish{sortBy === "POLISH" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th onClick={() => handleSort("SYMM")}>
                                                    Symm{sortBy === "SYMM" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th>Measurements</th>
                                                <th style={{ minWidth: '62px' }}>Table %</th>
                                                <th style={{ minWidth: '62px' }}>Depth %</th>
                                                <th>Ratio</th>
                                                <th>H&A</th>
                                                <th>RapPrice</th>
                                                <th style={{ minWidth: '55px' }}>Discount %</th>
                                                <th>Price/Cts</th>
                                                <th onClick={() => handleSort("RAP_PRICE")}>
                                                    Amount{sortBy === "RAP_PRICE" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                                <th>View Offer</th>
                                                <th>Certificate</th>
                                                <th>VideoLink</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tablecss">
                                            {paginatedData?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <label className="checkbox style-a" style={{ maxWidth: '30px' }}>
                                                            <input
                                                                style={{ maxWidth: '30px' }}
                                                                type="checkbox"
                                                                checked={selectedRows?.some(selected => selected?.STONE === item?.STONE)}
                                                                onChange={() => handleRowSelect(item)}
                                                            />
                                                            <div className="checkbox__checkmark"></div>
                                                        </label>
                                                    </td>
                                                    {/* <td>{item.srNo}</td> */}
                                                    <td>{item.STATUS}</td>
                                                    <td>{item.FL_BRID}</td>
                                                    <td>{item.STONE}</td>
                                                    <td><a style={{ color: 'blue' }} href={item.LAB === "IGI" ? `https://www.igi.org/reports/verify-your-report?r=${item.REPORTNO}` : `https://www.gia.edu/report-check?reportno=${item.REPORTNO}`} target="_blank">{item.LAB}</a></td>
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
                                                    <td>{item.ASK_DISC || '-'}</td>
                                                    <td>{(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100).toFixed(2)}</td>
                                                    <td>{((item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100) * item.CARATS)?.toFixed(2)}</td>
                                                    <td>{item.viewoffer}</td>
                                                    <td><a href={item.LAB === "IGI" ? `https://www.igi.org/reports/verify-your-report?r=${item.REPORTNO}` : `https://www.gia.edu/report-check?reportno=${item.REPORTNO}`} target="_blank" style={{ color: 'blue' }}>PDF</a></td>
                                                    <td><a href={`https://www.dnav360.com/vision/dna.html?d=${item.STONE}&ic=1`} target="_blank" style={{ color: 'blue' }}>VIDEO</a></td>
                                                </tr>
                                            ))}

                                            <tr className="tablecss">
                                                <th></th>
                                                <th colSpan={6}></th>
                                                <th>{totals.CARATS?.toFixed(2)}</th>
                                                <th colSpan={10}></th>
                                                <th></th>
                                                <th>{totals.ASK_DISC?.toFixed(2)}</th>
                                                <th>{totals.pricects?.toFixed(2)}</th>
                                                <th>{totals.amount?.toFixed(2)}</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
export default Tablesearch; 