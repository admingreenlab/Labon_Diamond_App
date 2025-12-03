import React, { useContext, useEffect, useRef, useState } from "react";
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
  IonLoading
} from "@ionic/react";
import { IonCol, IonGrid, IonRow, IonTabButton } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "./head";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../pages/Tab1.css";
import Like from "./like";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from "swiper/modules";
import Axios, { baseURL } from "../service/jwtAuth";
// import { SearchContext } from "../context/SearchContext";
// import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Bottom from "./bottomtab";
import ExcelJS from "exceljs";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { saveAs } from "file-saver";
// import * as XLSX from 'xlsx';
import XLSX from "xlsx-js-style";
import { BasketContext } from "../context/BasketContext";
import { WatchlistContext } from "../context/Wishlistcontext";

function Polishtable() {
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
        (selected) => selected.FL_SUB_LOT === item.FL_SUB_LOT
      );
      if (isSelected) {
        return prevSelected.filter(
          (selected) => selected.FL_SUB_LOT !== item.FL_SUB_LOT
        );
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
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totals = {
    CARATS: data?.reduce((sum, row) => sum + row.CARATS, 0),
    ASK_DISC: data?.reduce((sum, row) => sum + row.ASK_DISC / data.length, 0),
    // pricects: data?.reduce((sum, row) => sum + (row.RAP_PRICE * (100 - Number(row.ASK_DISC)) / 100), 0),
    pricects:
      data?.length > 0
        ? data?.reduce(
            (sum, row) =>
              sum +
              ((row.RAP_PRICE * (100 - Number(row.ASK_DISC))) / 100) *
                row.CARATS,
            0
          ) / data?.reduce((sum, row) => sum + row.CARATS, 0)
        : 0,
    amount: data?.reduce(
      (sum, row) =>
        sum +
        ((row.RAP_PRICE * (100 - Number(row.ASK_DISC))) / 100) * row.CARATS,
      0
    ),
    // {(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100)}
    // {(item.RAP_PRICE * (100 - Number(item.ASK_DISC)) / 100) * item.CARATS}
  };

  const handleaddwatchlist = async () => {
  if (selectedRows.length === 0) {
    window.alert("Please select stone to add wishlist.");
    return;
  }
  if (selectedRows.length > 500) {
    window.alert(
      "You can add a maximum of 500 stones to the watchlist at one time."
    );
    return;
  }

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  selectedRows.forEach((item) => {
    const alreadyInWatchlist = watchlist.some(
      (watchlistItem) => watchlistItem.FL_SUB_LOT === item.FL_SUB_LOT
    );
    if (!alreadyInWatchlist) {
      watchlist.push(item);
    }
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  // 🔥 UPDATE WATCHLIST COUNT (Polish Table)
  await fetchWatchlistts(); 

  setToastMessage("Stone added to Watchlist");
  setShowToast(true);
  setSelectedRows([]);
};


  const handleaddBasket = async () => {
    if (selectedRows.length === 0) {
      window.alert("Please select stone to add Basket.");
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
        stone_id: selectedRows.map((row) => ({
          stone: row.FL_SUB_LOT,
          branch: row.FL_BRID,
        })),
        stype: "POLISH-PARCEL",
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
      setToastMessage("selected Stone Id ");
      // setToastMessage('User not found.');
      setShowToast(true);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleExportSelectedToExcel = async () => {
    if (selectedRows.length === 0) {
      window.alert("Please select stones to export.");
      return;
    }

    try {
      setIsLoading(true);
      // console.log('selectedRows', selectedRows)
      const payload = {
        stoneCert: selectedRows?.map((row) => row.STONE).join(" "), // Converts the array of STONE IDs into a space-separated string
      };

      const response = await Axios.post(
        "/search/stoneUser?type=excel",
        payload
      );

      if (response.data.status === "success") {
        window.open(`${baseURL}exports/${response.data.fileName}`);
        setToastMessage(response?.data?.status);
        setShowToast(true);
        // setSelectedRows([]);
      }
    } catch (error) {
      console.log(error);
      setToastMessage(error.response.data);
      // setToastMessage('User not found.');
      setShowToast(true);
    } finally {
      setIsLoading(false); // Set loading to false after search completes or fails
    }
  };

  const basketredireck = async () => {
    console.log("Redirecting with selected options:", selectedOptionss);
    history.push({
      pathname: `/polish`,
      state: { selectedOptionss: selectedOptionss },
    });
  };

  const transformData = (data) => {
    return data?.map((item) => ({
      "LOT NO": item.FL_SUB_LOT,
      Type: item.FL_TYPE,
      Carats: item.FL_CARATS,
      Clarity: item.FL_CLARITY,
      Color: item.FL_COLOR,
      "Co ID": item.FL_COID,
      Height: item.FL_HIGHT,
      Length: item.FL_LENGTH,
      Main_LOT: item.FL_MAIN_LOT,
      Shape: item.FL_SHAPE_NAME,
      "MM Size": item.FL_SIZE,
      Width: item.FL_WIDTH,
      Location: item.FL_BRID,
    }));
  };

  const handleDownload = async () => {
    if (selectedRows.length === 0) {
      alert("Please select stones to export.");
      return;
    }

    const exportData = selectedRows.length > 0 ? selectedRows : paginatedData;

    const totalCarats = exportData.reduce(
      (sum, item) => sum + parseFloat(item.FL_CARATS || 0),
      0
    );
    const totalLotCount = exportData.length;

    const headers = [
      "Type",
      "Location",
      "In Stock",
      "LOT NO",
      "Carats",
      "Clarity",
      "CO ID",
      "Color",
      "Height",
      "Length",
      "Main_LOT",
      "Shape",
      "MM Size",
      "Width",
      "ASK AMT",
    ];

    const totalRow = new Array(headers.length).fill("");
    totalRow[2] = {
      v: "Total LOT NO:",
      s: { font: { bold: true } },
    };
    totalRow[3] = {
      v: `${totalLotCount}`,
      s: { font: { bold: true } },
    };
    totalRow[4] = {
      v: "Total Carats:",
      s: { font: { bold: true } },
    };
    totalRow[5] = {
      v: `${totalCarats.toFixed(2)}`,
      s: { font: { bold: true } },
    };

    const headerRow = headers;

    const dataRows = exportData.map((item) => [
      item.FL_TYPE,
      item.FL_BRID,
      "A",
      item.FL_SUB_LOT,
      item.FL_CARATS,
      item.FL_CLARITY,
      item.FL_COID,
      item.FL_COLOR,
      item.FL_HIGHT,
      item.FL_LENGTH,
      item.FL_MAIN_LOT,
      item.FL_SHAPE_NAME,
      item.FL_SIZE,
      item.FL_WIDTH,
      item.FL_ASK_AMT,
    ]);

    // Add a title row above the header, merged across columns A to G (0-6)
    const titleRow = [
      {
        v: "Labon Diamonds LLC",
        s: {
          font: {
            bold: true,
            sz: 15, // Set font size to 15px
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          // Merge title across columns A to G (0-6)
        },
      },
    ];

    // Add an empty row to create space below the title row
    const emptyRow = new Array(headers.length).fill(""); // Empty row with the same number of columns as the header

    const finalData = [
      titleRow, // Add title row
      emptyRow, // Add an empty row below the title
      totalRow, // Use combined total row
      headerRow,
      ...dataRows,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // Merge cells for the title to span from A1 to G1 (columns 0 to 6)
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 }, // Start cell (A1)
        e: { r: 0, c: 6 }, // End cell (G1)
      },
    ];

    // Style header row (row 2 = index 1, because row 1 is the title row)
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 3, c: col }); // header row is now row 2 (index 1)
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
        };
      }
    }

    worksheet["!autofilter"] = {
      ref: `A4:${String.fromCharCode(64 + headers.length)}4`,
    }; // Autofilter should apply to header row

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
    const fileName = `ExportedData_${Date.now()}.xlsx`;

    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: wbout,
        directory: Directory.Documents,
        encoding: Encoding.BASE64,
      });

      console.log("File saved at:", result.uri);
      const uri = result.uri; // Use directly

      alert(`File saved as: ${fileName}`);

      if (Capacitor.getPlatform() === "android") {
        await Share.share({
          title: "Exported Excel File",
          text: "Here is your exported Excel file.",
          url: uri,
          dialogTitle: "Share your file",
        });
      }

      setToastMessage("✅ File exported successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving or sharing file:", error);

      setShowToast(true);
    }
  };

  //  const handleDownload = async () => {
  //     if (selectedRows.length === 0) {
  //         alert('Please select stones to export.');
  //         return;
  //     }

  //     const exportData = selectedRows.length > 0 ? selectedRows : paginatedData;

  //     // Create workbook and worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet('Sheet1');

  //     // Add Image
  //     let imageBase64 = '';
  //     if (Capacitor.getPlatform() === 'web') {
  //         imageBase64 = await convertImageToBase64('/public/img/logo11.png');
  //     } else {
  //         imageBase64 = await loadImageFromFilesystem();
  //     }

  //     const imageId = workbook.addImage({
  //         base64: imageBase64,
  //         extension: 'png',
  //     });

  //     worksheet.addImage(imageId, 'A1:B3');

  //     // Header row
  //     const header = [
  //         "Type", "Location", "In Stock", "LOT NO", "Carats", "Clarity", "CO ID",
  //         "Color", "Height", "Length", "Main_LOT", "Shape", "MM Size", "Width"
  //     ];

  //     const headerRow = worksheet.addRow(header);
  //     headerRow.eachCell((cell) => {
  //         cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'C29958' },
  //         };
  //         cell.font = { bold: true, color: { argb: 'FF000000' } };
  //         cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //         cell.border = {
  //             top: { style: 'thin' },
  //             left: { style: 'thin' },
  //             bottom: { style: 'thin' },
  //             right: { style: 'thin' }
  //         };
  //     });

  //     // Totals
  //     let totalCarats = 0;
  //     let uniqueLotNos = new Set();

  //     exportData.forEach(item => {
  //         worksheet.addRow([
  //             item.FL_TYPE,
  //             item.FL_BRID,
  //             "A",
  //             item.FL_SUB_LOT,
  //             item.FL_CARATS,
  //             item.FL_CLARITY,
  //             item.FL_COID,
  //             item.FL_COLOR,
  //             item.FL_HIGHT,
  //             item.FL_LENGTH,
  //             item.FL_MAIN_LOT,
  //             item.FL_SHAPE_NAME,
  //             item.FL_SIZE,
  //             item.FL_WIDTH,
  //         ]);

  //         totalCarats += parseFloat(item.FL_CARATS) || 0;
  //         uniqueLotNos.add(item.FL_SUB_LOT);
  //     });

  //     worksheet.getCell('C1').value = 'Total Carats:';
  //     worksheet.getCell('D1').value = totalCarats;

  //     worksheet.getCell('C2').value = 'Total Lot :';
  //     worksheet.getCell('D2').value = uniqueLotNos.size;

  //     worksheet.getCell('C1').font = { bold: true };
  //     worksheet.getCell('D1').font = { bold: true };
  //     worksheet.getCell('C2').font = { bold: true };
  //     worksheet.getCell('D2').font = { bold: true };

  //     worksheet.columns.forEach(column => {
  //         let maxLength = 10;
  //         column.eachCell({ includeEmpty: true }, (cell) => {
  //             const columnLength = cell.value ? cell.value.toString().length : 0;
  //             if (columnLength > maxLength) maxLength = columnLength;
  //         });
  //         column.width = maxLength + 2;
  //     });

  //     worksheet.autoFilter = {
  //         from: 'A5',
  //         to: 'N5',
  //     };

  //     const fileName = `ExportedData_${Date.now()}.xlsx`;

  //     // Handle saving or sharing
  //     if (Capacitor.getPlatform() === 'web') {
  //         const buffer = await workbook.xlsx.writeBuffer();
  //         const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  //         const link = document.createElement('a');
  //         link.href = URL.createObjectURL(blob);
  //         link.download = fileName;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);

  //     } else {
  //         // Mobile (e.g. Android/iOS)
  //         const base64 = await workbook.xlsx.writeBuffer().then(buffer => {
  //             return Buffer.from(buffer).toString('base64');
  //         });

  //         const result = await Filesystem.writeFile({
  //             path: fileName,
  //             data: base64,
  //             directory: Directory.Documents,
  //             encoding: Encoding.UTF8,
  //         });

  //         const uri = result.uri;

  //         await Share.share({
  //             title: 'Exported Excel File',
  //             text: 'Here is your exported Excel file.',
  //             url: uri,
  //             dialogTitle: 'Share your file',
  //         });

  //         alert(`File saved as: ${fileName}`);
  //     }
  // };

  // Function to convert image to Base64 (web platform)
  const convertImageToBase64 = (imagePath) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imagePath;

      image.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const base64String = canvas.toDataURL("image/png"); // Convert to base64
        resolve(base64String);
      };

      image.onerror = (error) => reject(error);
    });
  };

  // Function to load image from local filesystem (mobile platform)
  const loadImageFromFilesystem = async () => {
    const path = "assets/img/logo11.png"; // Ensure this path is correct for your mobile assets
    const file = await Filesystem.readFile({
      path: path,
      directory: Directory.Resources,
      encoding: Encoding.UTF8,
    });
    return `data:image/png;base64,${file.data}`;
  };

  const handleExportAllToExcel = async () => {
    if (data.length === 0) {
      window.alert("No data available to export.");
      return;
    }

    try {
      setIsLoadings(true);
      const payload = {
        stoneCert: "",
        ...searchState, // Pass the entire searchState object here
      };
      const response = await Axios.post(
        "/search/stoneUser?type=excel",
        payload
      );

      if (response.data.status === "success") {
        window.open(`${baseURL}exports/${response.data.fileName}`);
        setToastMessage(response?.data?.status);
        setShowToast(true);
      }
    } catch (error) {
      console.log(error);
      setToastMessage(error.response.data);
      // setToastMessage('User not found.');
      setShowToast(true);
    } finally {
      setIsLoadings(false); // Set loading to false after search completes or fails
    }
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <IonPage>
        <Header />
        <IonContent
          style={{
            paddingBottom: "80x",
            marginBottom: "100px",
            marginTop: "10px",
          }}
        >
          <div style={{ marginTop: "20px" }}>
            <h5 class="text-center mb-5 element">Polish Parcel Table </h5>
          </div>
          <div className="myquotations" style={{ marginBottom: "100px" }}>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div
                    className="mainbtn"
                    style={{
                      justifyContent: "start",
                      marginBottom: "15px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 400,
                        display: "flex",
                        gap: "7px",
                        color: "black",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="sumbuttontable"
                        onClick={handleaddBasket}
                      >
                        Add to Basket
                      </button>

                      <button
                        className="sumbuttontable"
                        onClick={handleDownload}
                        disabled={isLoading}
                      >
                        {isLoading ? "Download..." : "Export to Excel"}
                      </button>
                      <button
                        className="sumbuttontable"
                        onClick={basketredireck}
                      >
                        Modify Search
                      </button>
                      <button
                        className="sumbuttontable"
                        onClick={handleaddwatchlist}
                      >
                        Add To WatchList
                      </button>
                      <button
                        onClick={handleClick}
                        className={showDropdown ? "dropdown show" : "dropdown"}
                      >
                        <div style={{ display: "flex", marginTop: "10px" }}>
                          <span
                            style={{
                              background: "#fff6ec",
                              fontSize: "17px",
                              color: "#4c3226",
                            }}
                          >
                            Page Size:
                          </span>
                          <select
                            style={{ margin: "-5px 0px 0px 5px" }}
                            value={rowsPerPage}
                            onChange={(e) => {
                              setRowsPerPage(parseInt(e.target.value));
                              setCurrentPage(1);
                              setShowDropdown(false);
                            }}
                          >
                            {[10, 20, 50, 100].map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                      </button>
                    </div>
                    <div
                      className="suggest-nam"
                      style={{
                        margin: "auto",
                        marginTop: "25px",
                        color: "black",
                      }}
                    >
                      <label style={{ fontWeight: "300", color: "black" }}>
                        {" "}
                        Available:
                      </label>
                      <button
                        style={{
                          fontWeight: "300",
                          padding: "5px 8px",
                          border: "1px solid #b89154",
                          color: "#fff",
                          background: "#4c3226",
                          borderRadius: "3px",
                        }}
                      >
                        A
                      </button>
                      {/* <label style={{ fontWeight: '300', color: "black" }}> Memo:</label>
                                            <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px" }}> M </button>
                                            <label style={{ fontWeight: '300', color: "black" }}> ArrivingSoon:</label>
                                            <button style={{ fontWeight: '300', padding: '5px 8px', border: '1px solid #b89154', color: '#fff', background: '#4c3226', borderRadius: "3px" }}> AS </button> */}
                    </div>
                  </div>
                  <div style={{ margin: "0px 0px 10px 0px" }}>
                    <IonRow
                      style={{
                        display: "flex",
                        textAlign: "center",
                        margin: "0px 0px 0px 0px",
                      }}
                    >
                      <IonCol
                        size="12"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => currentPage > 1 && handlePageChange(1)}
                          className={`Pagination ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                          disabled={currentPage === 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-caret-left"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            currentPage > 1 && handlePageChange(currentPage - 1)
                          }
                          className={`Pagination ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                          disabled={currentPage === 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-left"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                            />
                          </svg>
                        </button>

                        {generatePaginationButtons().map((page) => (
                          <button
                            key={page}
                            className={`Pagination ${
                              page === currentPage ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            currentPage < totalPages &&
                            handlePageChange(currentPage + 1)
                          }
                          className={`Pagination ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                          disabled={currentPage === totalPages}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-right"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            currentPage < totalPages &&
                            handlePageChange(totalPages)
                          }
                          className={`Pagination ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                          disabled={currentPage === totalPages}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-caret-right"
                            viewBox="0 0 16 16"
                          >
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
                                    if (selectedRows?.length === data?.length) {
                                      setSelectedRows([]);
                                    } else {
                                      setSelectedRows(
                                        data?.map((item) => item)
                                      );
                                    }
                                  }}
                                  checked={
                                    selectedRows?.length === data?.length
                                  }
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
                                      checked={selectedRows?.some(
                                        (selected) =>
                                          selected?.FL_SUB_LOT ===
                                          item?.FL_SUB_LOT
                                      )}
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
              <IonLoading
                isOpen={isLoadingAll}
                message="Loading..."
                spinner="crescent"
                backdropDismiss={false}
              />
        </IonContent>
        <Bottom />
      </IonPage>
    </>
  );
}
export default Polishtable;
