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
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import Axios, { baseURL } from "../service/jwtAuth"
import { BasketContext } from "../context/BasketContext";
import { WatchlistContext } from "../context/WatchlistContext";
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Bottom from './bottomtab';
import ExcelJS from 'exceljs';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
import XLSX from "xlsx-js-style";

function Jeweltables({isAuthenticated}) {
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
  const searchResults = location.state?.searchResults;
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoadings, setIsLoadings] = useState(false);
  const [loadingAddBasket, setLoadingAddBasket] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const { setSearchState, fetchDatas } = useContext(BasketContext);
  const { setWatchlistCount, fetchWatchlistts } = useContext(WatchlistContext);
  const selectedOptionss = location.state?.selectedOptionss;

  useEffect(() => {
    if (searchResults && !hasFetched.current) {
      setData(searchResults);
      setLoading(false);
      hasFetched.current = true;
    }
  }, [searchResults]);

  const handleRowSelect = (item) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.FL_ITEM_CODE === item.FL_ITEM_CODE,
      );
      if (isSelected) {
        // Remove the item if already selected
        return prevSelected.filter(
          (selected) => selected.FL_ITEM_CODE !== item.FL_ITEM_CODE,
        );
      } else {
        // Add the complete item if not selected
        return [...prevSelected, item];
      }
    });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = data?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    data?.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;

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

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleaddwatchlist = async () => {
    if (selectedRows.length < 1) {
      setToastMessage("Please select jewelry");
      setShowToast(true);
      return;
    }

    if (selectedRows.length > 500) {
      alert("You can add only 500 jewelry items at one time");
      return;
    }

    try {
      const users =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      const FL_COID = JSON.parse(users).FL_COID;

      const response = await Axios.post("user/watchlist/add", {
        lotIds: selectedRows.map((row) => ({
          FL_SUB_LOT: row.FL_ITEM_CODE,
          FL_BRID: row.FL_BRID,
        })),
        inventoryType: "JEWELRY",
        coid: FL_COID,
      });

      if (response.data?.status === "success") {
        setToastMessage(response.data?.message || "Added to watchlist");

        setShowToast(true);

        setSelectedRows([]);
      }
      await fetchWatchlistts();
    } catch (error) {
      console.error("Error adding watchlist:", error);

      setToastMessage(
        error?.response?.data?.message || "Failed to add watchlist",
      );

      setShowToast(true);
    }
  };

  const handleaddBasket = async () => {
    if (selectedRows.length === 0) {
      setToastMessage("Please select at least one item");
      setShowToast(true);
      return;
    }

    if (selectedRows.length > 500) {
      alert("You can add only 500 jewelry items at one time");
      return;
    }

    try {
      const payload = {
        type: "I",
        stype: "JEWELRY",
        stone_id: selectedRows.map((row) => ({
          stone: row.FL_ITEM_CODE,
          branch: row.FL_BRID,
        })),
      };

      const response = await Axios.post("user/userbasket", payload);

      if (response.data?.status === "success") {
        setToastMessage(
          response.data?.message || "Items added to basket successfully",
        );

        setShowToast(true);

        setSelectedRows([]);
      }
      await fetchDatas();
    } catch (error) {
      console.error("Error adding basket:", error);

      setToastMessage(
        error?.response?.data?.message || "Failed to add items to basket",
      );

      setShowToast(true);
    }
  };

  const handleJewelryDownload = async () => {
    const exportData = selectedRows.length > 0 ? selectedRows : paginatedData;
  
    if (!exportData || exportData.length === 0) {
      alert("No jewelry data to export.");
      return;
    }
  
    const headers = [
      "Status",
      "Location",
      "Style Code",
      "Item Code",
      "Size",
      "Quality",
      "Gross WT",
      "Net WT",
      "Diamond PCS",
      "Diamond CTS",
      "Image",
    ];
  
    const titleRow = [
      {
        v: "Labon Diamonds LLC",
        s: {
          font: {
            bold: true,
            sz: 15,
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        },
      },
    ];
  
    const emptyRow = new Array(headers.length).fill("");
  
    const dataRows = exportData.map((item) => [
      item.FL_STATUS || "-",
      item.FL_BRID || "-",
      item.FL_STYLE_CODE || "-",
      item.FL_ITEM_CODE || "-",
      item.FL_SIZE || "-",
      item.FL_QUALITY || "-",
      item.FL_GROSS_WT || "-",
      item.FL_NET_WT || "-",
      item.FL_DIAM_PCS || "-",
      item.FL_DIAM_CTS || "-",
      item.FL_IMAGE_PATH || "-",
    ]);
  
    const finalData = [
      titleRow,
      emptyRow,
      headers,
      ...dataRows,
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headers.length - 1 },
      },
    ];
  
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 22 },
      { wch: 22 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 45 },
    ];
  
    // Header row styling - row index 2 means Excel row 3
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
  
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "C29958" },
          },
          font: {
            bold: true,
            color: { rgb: "000000" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }
  
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
  
    // Body styling
    for (let row = 3; row <= range.e.r; row++) {
      for (let col = 0; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "D9D9D9" } },
              bottom: { style: "thin", color: { rgb: "D9D9D9" } },
              left: { style: "thin", color: { rgb: "D9D9D9" } },
              right: { style: "thin", color: { rgb: "D9D9D9" } },
            },
          };
        }
      }
    }
  
    worksheet["!autofilter"] = {
      ref: `A3:${XLSX.utils.encode_col(headers.length - 1)}3`,
    };
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jewelry Data");
  
    const fileName =
      selectedRows.length > 0
        ? `Selected_Jewelry_${Date.now()}.xlsx`
        : `Jewelry_Data_${Date.now()}.xlsx`;
  
    try {
      if (Capacitor.isNativePlatform()) {
        const wbout = XLSX.write(workbook, {
          type: "base64",
          bookType: "xlsx",
        });
  
        const result = await Filesystem.writeFile({
          path: fileName,
          data: wbout,
          directory: Directory.Documents,
        });
  
        await Share.share({
          title: "Exported Jewelry Excel File",
          text: "Here is your exported jewelry file.",
          url: result.uri,
          dialogTitle: "Share your file",
        });
      } else {
        XLSX.writeFile(workbook, fileName);
      }
  
      setToastMessage("✅ Jewelry file exported successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error exporting jewelry file:", error);
      setToastMessage("❌ Error exporting file.");
      setShowToast(true);
    }
  };
  const basketredireck = async () => {
    console.log("Redirecting with selected options:", selectedOptionss);
    history.push({
      pathname: `/jewels`,
      state: { selectedOptionss: selectedOptionss },
    });
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

    return (
        <>
            <IonPage>
                <Header />
                <IonContent style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px', }}>
                    <div style={{ marginTop: '20px' }}>
                        <h5 class="text-center mb-5 element">Jewels Table </h5>
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

                                            <button className="sumbuttontable" onClick={handleJewelryDownload} disabled={isLoading}>{isLoading ? "Download..." : "Export to Excel"}</button>
                                            <button className="sumbuttontable" onClick={basketredireck}>Modify Search</button>
                                            <button className="sumbuttontable" onClick={handleaddwatchlist}>Add To WatchList</button>
                                            <button onClick={handleClick} className={showDropdown ? "dropdown show" : "dropdown"}>
                                                <div style={{ display: 'flex', marginTop: '10px' }}>
                                                    <span style={{ background: '#fff6ec', fontSize: '17px', color: "#4c3226" }}>Page Size:</span>
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
                                    <div className="table-responsive pt-10">
                    {data?.length > 0 ? (
                      <table
                        striped
                        bordered
                        hover
                        style={{ width: "max-content", color: "black" }}
                      >
                        <thead className="tablecss">
                          <tr>
                            <th>
                              <label className="checkbox style-a">
                                <input
                                  type="checkbox"
                                  onChange={() => {
                                    if (selectedRows.length === data.length) {
                                      setSelectedRows([]);
                                    } else {
                                      setSelectedRows(data.map((item) => item));
                                    }
                                  }}
                                  checked={selectedRows.length === data.length}
                                />
                                <div className="checkbox__checkmark"></div>
                              </label>
                            </th>
                            {/* <th>SrNo</th> */}
                            <th>Status</th>
                            <th>Location</th>
                            <th>Style Code</th>
                            <th>Item Code</th>
                            <th>Size</th>
                            <th>Quality</th>
                            <th>Gross WT</th>
                            <th>Net WT</th>
                            <th>Diamond PCS</th>
                            <th>Diamond CTS</th>
                            <th>Image</th>
                          </tr>
                        </thead>
                        <tbody className="tablecss">
                          {paginatedData?.length > 0 ? (
                            paginatedData?.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <label
                                    className="checkbox style-a"
                                    style={{ maxWidth: "30px" }}
                                  >
                                    <input
                                      style={{ maxWidth: "30px" }}
                                      type="checkbox"
                                      checked={selectedRows.some(
                                        (selected) =>
                                          selected.FL_ITEM_CODE ===
                                          item.FL_ITEM_CODE,
                                      )}
                                      onChange={() => handleRowSelect(item)}
                                    />
                                    <div className="checkbox__checkmark"></div>
                                  </label>
                                </td>

                                <td>{item.FL_STATUS}</td>
                                <td>{item.FL_BRID}</td>
                                <td>{item.FL_STYLE_CODE}</td>
                                <td>{item.FL_ITEM_CODE}</td>
                                <td>{item.FL_SIZE || "-"}</td>
                                <td>{item.FL_QUALITY}</td>
                                <td>{item.FL_GROSS_WT}</td>
                                <td>{item.FL_NET_WT}</td>
                                <td>{item.FL_DIAM_PCS}</td>
                                <td>{item.FL_DIAM_CTS}</td>
                                <td>
                                  <span
                                    style={{
                                      color: "blue",
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      fontSize: "15px",
                                    }}
                                    onClick={() =>
                                      window.open(item.FL_IMAGE_PATH, "_blank")
                                    }
                                  >
                                    Image
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="15" className="text-center">
                                No data found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <div
                        style={{
                          height: "300px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "20px",
                          color: "#4c3226",
                          border: "1px solid #ddd",
                          background: "#fafafa",
                          width: "100%",
                        }}
                      >
                        No data available for the selected filter
                      </div>
                    )}
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
export default Jeweltables; 