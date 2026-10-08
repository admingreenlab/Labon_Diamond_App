import React, { useEffect, useState, useRef, useContext } from "react";
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
  IonLoading,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardContent,
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
import Bottom from "./bottomtab";
import {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from "swiper/modules";
import Axios, { baseURL } from "../service/jwtAuth";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import XLSX from "xlsx-js-style";
import { BasketContext } from "../context/BasketContext";
import { chevronDown, chevronUp } from "ionicons/icons";

function Basket() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [data, setData] = useState([]);
  const [count, setcount] = useState([]);
  const [selectedtotals, setSelectedTotals] = useState({});
  const isFetching = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setSearchState, fetchDatas } = useContext(BasketContext);
  const [showLoading, setShowLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShippingText, setShowShippingText] = useState(false);
  const [shippingText, setShippingText] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingAmount, setShippingAmount] = useState(0);
  const [orderType, setOrderType] = useState("");

  const [tabselect, settabselect] = useState({
    single: true,
    parcel: false,
    jewel: false,
  });
  // useEffect(() => {
  //     console.log('selectedRows', selectedRows)
  // }, [selectedRows])

  const handleShippingChange = (e) => {
    const value = e.target.value;

    setShippingMethod(value);

    switch (value) {
      case "overnight":
        setShippingAmount(45);
        break;

      case "2ndday":
        setShippingAmount(30);
        break;

      case "saturday":
        setShippingAmount(80);
        break;

      default:
        setShippingAmount(0);
    }
  };

  const handleOrderNow = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one item");
      return;
    }

    if (!shippingMethod) {
      alert("Please select shipping method");
      return;
    }

    if (!orderType) {
      alert("Please select Memo or Purchase");
      return;
    }

    const trtype = orderType === "memo" ? "33" : "35";

    // ORDER TYPE
    let orderApiType = "";

    if (tabselect.single) {
      orderApiType = "POLISH-SINGLE";
    } else if (tabselect.parcel) {
      orderApiType = "POLISH-PARCEL";
    } else {
      alert("Invalid order type");
      return;
    }

    // STONE DETAILS
    let StoneDetails = [];

    // SINGLE
    if (tabselect.single) {
      StoneDetails = selectedRows.map((row) => {
        const carats = Number(row.CARATS || 0);
        const rapPrice = Number(row.RAP_PRICE || 0);
        const discount = Number(row.ASK_DISC || 0);

        const pricePerCts = (rapPrice * (100 - discount)) / 100;

        const amount = pricePerCts * carats;

        return {
          STONE: row.STONE || "",
          LAB: row.LAB || "",
          REPORTNO: row.REPORTNO || "",
          SHAPE: row.SHAPE || "",
          CARATS: carats,
          COLOR: row.COLOR || "",
          CLARITY: row.CLARITY || "",
          PRICE_PER_CTS: Number(pricePerCts.toFixed(2)),
          AMOUNT: Number(amount.toFixed(2)),
        };
      });
    }

    // PARCEL
    else if (tabselect.parcel) {
      StoneDetails = selectedRows.map((row) => {
        const carats = Number(row.FL_CARATS || 0);
        const amount = Number(row.FL_ASK_AMT || 0);

        const pricePerCts = carats > 0 ? amount / carats : 0;

        return {
          STONE: row.STONE || "",
          LAB: row.LAB || "",
          REPORTNO: row.REPORTNO || "",
          SHAPE: row.FL_SHAPE_GROUP || "",
          CARATS: carats,
          COLOR: row.FL_COLOR || "",
          CLARITY: row.FL_CLARITY || "",
          PRICE_PER_CTS: Number(pricePerCts.toFixed(2)),
          AMOUNT: Number(amount.toFixed(2)),
        };
      });
    }

    // PAYLOAD
    const payload = {
      shippingOption: shippingMethod,
      trtype,
      type: orderApiType,
      comments: shippingText || "",
      StoneDetails,
    };

    try {
      setOrderLoading(true);

      const response = await Axios.post("/user/order", payload);

      if (response.status === 200 || response.status === 201) {
        alert("Order placed successfully");

        // Basket update event
        const eventBus = getEventBus();
        eventBus.emit("basketUpdated");

        // Clear selected rows
        setSelectedRows([]);

        // Clear shipping/comment/order selection
        setShippingMethod("");
        setShippingAmount(0);
        setShippingText("");
        setShowShippingText(false);
        setOrderType("");

        // Refresh current basket
        if (tabselect.single) {
          fetchData("single");
        } else if (tabselect.parcel) {
          fetchData("parcel");
        }
      }
    } catch (error) {
      console.error("Order API Error:", error);

      alert(
        error?.response?.data?.message ||
          "Something went wrong while placing order",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const totalOrderAmount =
    Number(selectedtotals?.amount || 0) + Number(shippingAmount || 0);

  const handleRowSelect = (item) => {
    // SINGLE
    if (tabselect.single) {
      setSelectedRows((prevSelected) => {
        const isSelected = prevSelected.some(
          (selected) => selected.STONE === item.STONE,
        );

        if (isSelected) {
          return prevSelected.filter(
            (selected) => selected.STONE !== item.STONE,
          );
        } else {
          return [...prevSelected, item];
        }
      });
    }

    // PARCEL
    else if (tabselect.parcel) {
      setSelectedRows((prevSelected) => {
        const isSelected = prevSelected.some(
          (selected) => selected.FL_SUB_LOT === item.FL_SUB_LOT,
        );

        if (isSelected) {
          return prevSelected.filter(
            (selected) => selected.FL_SUB_LOT !== item.FL_SUB_LOT,
          );
        } else {
          return [...prevSelected, item];
        }
      });
    }

    // JEWEL
    else if (tabselect.jewel) {
      setSelectedRows((prevSelected) => {
        const isSelected = prevSelected.some(
          (selected) => selected.FL_ITEM_CODE === item.FL_ITEM_CODE,
        );

        if (isSelected) {
          return prevSelected.filter(
            (selected) => selected.FL_ITEM_CODE !== item.FL_ITEM_CODE,
          );
        } else {
          return [...prevSelected, item];
        }
      });
    }
  };

  const transformData = (data) => {
    return data?.map((item) => ({
      "LOT NO": item.FL_SUB_LOT,
      Type: item.FL_INVENTORY_TYPE,
      Carats: item.FL_CARATS,
      Clarity: item.FL_CLARITY,
      Color: item.FL_COLOR,
      "Co ID": item.FL_COID,
      // Height: item.FL_HIGHT,
      // Length: item.FL_LENGTH,
      Main_LOT: item.FL_MAIN_LOT,
      Shape: item.FL_SHAPE_GROUP,
      // 'MM Size': item.FL_SIZE,
      // Width: item.FL_WIDTH,
      Location: item.FL_BRID,
    }));
  };

  const handleDownload = async () => {
    if (selectedRows.length === 0) {
      alert("Please select stones to export.");
      return;
    }

    const exportData = selectedRows;

    const totalCarats = exportData.reduce(
      (sum, item) => sum + parseFloat(item.FL_CARATS || 0),
      0,
    );
    const totalLotCount = exportData.length;

    const headers = [
      "Location",
      "In Stock",
      "LOT NO",
      "Shape",
      "Carats",
      "Color",
      "Clarity",
      "Length",
      "Width",
      "Height",
      "Main_LOT",
      "ASK AMT",
      "Type",
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
      item.FL_BRID,
      "A",
      item.FL_SUB_LOT,
      item.FL_SHAPE_GROUP,
      item.FL_CARATS,
      item.FL_COLOR,
      item.FL_CLARITY,
      item.FL_LENGTH,
      item.FL_WIDTH,
      item.FL_HIGHT,
      item.FL_MAIN_LOT,
      item.FL_ASK_AMT,
      item.FL_INVENTORY_TYPE,
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

    const emptyRow = new Array(headers.length).fill("");

    const finalData = [titleRow, emptyRow, totalRow, headerRow, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

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

      if (Capacitor.getPlatform() === "web") {
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
      } else {
        const wbout = XLSX.write(workbook, {
          type: "base64",
          bookType: "xlsx",
        });

        const result = await Filesystem.writeFile({
          path: fileName,
          data: wbout,
          directory: Directory.Documents,
          encoding: Encoding.BASE64,
        });

        await Share.share({
          title: "Exported Excel File",
          text: "Here is your exported Excel file.",
          url: result.uri,
        });
      }
      setToastMessage("File exported successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving or sharing file:", error);
      setShowToast(true);
    }
  };

  const handleJewelDownload = async () => {
    if (selectedRows.length === 0) {
      alert("Please select jewel items to export.");
      return;
    }

    const exportData = selectedRows;

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
    ];

    const dataRows = exportData.map((item) => [
      item.FL_STATUS,
      item.FL_BRID,
      item.FL_STYLE_CODE,
      item.FL_ITEM_CODE,
      item.FL_SIZE || "-",
      item.FL_QUALITY,
      item.FL_GROSS_WT,
      item.FL_NET_WT,
      item.FL_DIAM_PCS,
      item.FL_DIAM_CTS,
    ]);

    // Totals
    const totalGrossWt = exportData.reduce(
      (sum, item) => sum + Number(item.FL_GROSS_WT || 0),
      0,
    );

    const totalNetWt = exportData.reduce(
      (sum, item) => sum + Number(item.FL_NET_WT || 0),
      0,
    );

    const totalDiamondPcs = exportData.reduce(
      (sum, item) => sum + Number(item.FL_DIAM_PCS || 0),
      0,
    );

    const totalDiamondCts = exportData.reduce(
      (sum, item) => sum + Number(item.FL_DIAM_CTS || 0),
      0,
    );

    const totalRow = [
      "",
      "",
      "",
      "TOTAL",
      "",
      "",
      totalGrossWt.toFixed(2),
      totalNetWt.toFixed(2),
      totalDiamondPcs,
      totalDiamondCts.toFixed(2),
    ];

    const titleRow = ["Labon Diamonds LLC"];
    const emptyRow = new Array(headers.length).fill("");
    const finalData = [titleRow, emptyRow, headers, ...dataRows, totalRow];
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // Merge Title
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headers.length - 1 },
      },
    ];

    // Header Style
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: 2,
        c: col,
      });

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

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Jewel Export");

    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileName = `Jewel_Export_${Date.now()}.xlsx`;

    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: wbout,
        directory: Directory.Documents,
        encoding: Encoding.BASE64,
      });

      const uri = result.uri;

      // ALERT AFTER SAVE
      alert(`File saved as: ${fileName}`);

      if (Capacitor.getPlatform() === "android") {
        await Share.share({
          title: "Jewel Export File",
          text: "Here is your exported jewel file.",
          url: uri,
          dialogTitle: "Share your file",
        });
      }

      setToastMessage("Jewel file exported successfully!");
      setShowToast(true);
    } catch (error) {
      console.log("Jewel Export Error:", error);

      setToastMessage("Failed to export jewel file");
      setShowToast(true);
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

  useEffect(() => {
    const user = localStorage.getItem("user") || localStorage.getItem("user");
    const branchescode =
      localStorage.getItem("branches") || localStorage.getItem("branches");
    if (user) {
      setCompany(JSON.parse(branchescode)[0].FL_COMPANY_CODE);
      // console.log('user.FL_USER_NAME',JSON.parse(user)?.FL_USER_NAME)
      setClientName(JSON.parse(user)?.FL_USER_NAME);
    }
  }, []);

  const fetchData = async (type) => {
    setLoading(true);

    try {
      let stype = "single";

      if (type === "parcel") {
        stype = "parcel";
      } else if (type === "jewel") {
        stype = "JEWEL";
      }

      const response = await Axios.post("user/userbasket", {
        type: "S",
        stype,
      });

      if (response.status === 200) {
        setcount(response.data.count);
        setData(response?.data?.data || []);
      }
    } catch (err) {
      console.log("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("single");
  }, []);

  useEffect(() => {
    if (selectedRows.length === 0) {
      setSelectedTotals({
        pcs: 0,
        CARATS: 0,
        RAP: 0,
        ASK_DISC: 0,
        pricects: 0,
        amount: 0,
      });
      return;
    }

    // =========================
    // PARCEL
    // =========================
    if (tabselect.parcel) {
      const totalCarats = selectedRows.reduce(
        (sum, row) => sum + Number(row.FL_CARATS || 0),
        0,
      );

      const totalAmount = selectedRows.reduce(
        (sum, row) => sum + Number(row.FL_ASK_AMT || 0),
        0,
      );

      setSelectedTotals({
        pcs: selectedRows.length,
        CARATS: totalCarats,
        RAP: 0,
        ASK_DISC: 0,
        pricects: totalCarats > 0 ? totalAmount / totalCarats : 0,
        amount: totalAmount,
      });

      return;
    }

    // =========================
    // SINGLE
    // =========================
    if (tabselect.single) {
      const totalCarats = selectedRows.reduce(
        (sum, row) => sum + Number(row.CARATS || 0),
        0,
      );

      const totalRap = selectedRows.reduce(
        (sum, row) => sum + Number(row.RAP_PRICE || 0),
        0,
      );

      const totalDiscount = selectedRows.reduce(
        (sum, row) => sum + Number(row.ASK_DISC || 0),
        0,
      );

      const totalAmount = selectedRows.reduce(
        (sum, row) =>
          sum +
          ((Number(row.RAP_PRICE || 0) * (100 - Number(row.ASK_DISC || 0))) /
            100) *
            Number(row.CARATS || 0),
        0,
      );

      setSelectedTotals({
        pcs: selectedRows.length,
        CARATS: totalCarats,
        RAP: totalRap,
        ASK_DISC:
          selectedRows.length > 0 ? totalDiscount / selectedRows.length : 0,
        pricects: totalCarats > 0 ? totalAmount / totalCarats : 0,
        amount: totalAmount,
      });

      return;
    }
  }, [selectedRows, tabselect]);

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
            0,
          ) / data?.reduce((sum, row) => sum + row.CARATS, 0)
        : 0,
    amount: data?.reduce(
      (sum, row) =>
        sum +
        ((row.RAP_PRICE * (100 - Number(row.ASK_DISC))) / 100) * row.CARATS,
      0,
    ),
  };

  const handleremovebasket = async () => {
    if (selectedRows.length === 0) {
      setToastMessage("Please select at least one item");
      setShowToast(true);
      return;
    }

    // LIMIT CHECK
    if (selectedRows.length > 500) {
      setToastMessage("Maximum 500 items can be removed at a time");
      setShowToast(true);
      return;
    }

    let stype = "single";
    let stone_id = [];

    // SINGLE
    if (tabselect.single) {
      stype = "single";
      stone_id = selectedRows.map((row) => row.STONE);
    }

    // PARCEL
    else if (tabselect.parcel) {
      stype = "parcel";
      stone_id = selectedRows.map((row) => row.STONE);
    }

    // JEWEL
    else if (tabselect.jewel) {
      stype = "jewel";
      stone_id = selectedRows.map((row) => row.FL_ITEM_CODE);
    }

    try {
      const response = await Axios.post("user/userbasket", {
        type: "D",
        stype,
        stone_id,
      });

      if (response.status === 200) {
        setToastMessage("Removed from basket successfully");

        setShowToast(true);

        setSelectedRows([]);

        // Refresh table
        if (tabselect.single) {
          await fetchData("single");
        } else if (tabselect.parcel) {
          await fetchData("parcel");
        } else if (tabselect.jewel) {
          await fetchData("jewel");
        }

        // Refresh basket count
        await fetchDatas();
      }
    } catch (error) {
      console.log("error while removing basket", error);

      setToastMessage(error?.response?.data?.message || "Something went wrong");

      setShowToast(true);
    }
  };
  const handleExportSelectedToExcel = async () => {
    setIsLoading(true);

    try {
      // Validation
      if (selectedRows.length === 0) {
        window.alert("Please select items to export.");
        return;
      }

      // SINGLE EXPORT
      if (tabselect.single) {
        const payload = {
          stoneCert: selectedRows?.map((row) => row.STONE).join(" "),
        };

        const response = await Axios.post(
          "/search/stoneUser?type=excel",
          payload,
        );

        if (response?.data?.status === "success") {
          window.open(`${baseURL}/exports/${response.data.fileName}`, "_blank");
        }
      }

      // PARCEL EXPORT
      else if (tabselect.parcel) {
        await handleDownload();
      }

      // JEWEL EXPORT
      else if (tabselect.jewel) {
        await handleJewelDownload();
      }
    } catch (error) {
      console.log("Export Error:", error);

      setToastMessage("Export failed");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
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
            <h5 class="text-center mb-5 element">Basket</h5>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              margin: "10px 0px 15px 15px",
            }}
          >
            <button
              className={
                tabselect.single ? "sumbutton" : "sumbutton sumbutton-11"
              }
              onClick={() => {
                settabselect((prev) => ({
                  ...prev,
                  single: true,
                  parcel: false,
                  jewel: false,
                }));
                fetchData("single");
                setSelectedRows([]);
              }}
            >
              SINGLE
            </button>
            <button
              className={
                tabselect.parcel ? "sumbutton" : "sumbutton sumbutton-11"
              }
              onClick={() => {
                settabselect((prev) => ({
                  ...prev,
                  single: false,
                  parcel: true,
                  jewel: false,
                }));
                fetchData("parcel");
                setSelectedRows([]);
              }}
            >
              PARCEL
            </button>
            {/* <button
              className={
                tabselect.jewel ? "sumbutton" : "sumbutton sumbutton-11"
              }
              onClick={() => {
                settabselect((prev) => ({
                  ...prev,
                  single: false,
                  parcel: false,
                  jewel: true,
                }));
                fetchData("jewel");
                setSelectedRows([]);
              }}
            >
              JEWEL
            </button> */}
          </div>
          <div className="myquotations">
            <IonGrid style={{ marginBottom: "90px" }}>
              <IonRow>
                <IonCol>
                  <div
                    className="mainbtn"
                    style={{ justifyContent: "start", marginBottom: "15px" }}
                  >
                    <button
                      className="sumbutton"
                      onClick={handleExportSelectedToExcel}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Export To Excel"}
                    </button>
                    <button className="sumbutton" onClick={handleremovebasket}>
                      Remove to Basket
                    </button>
                    {/* <button className="sumbutton">INTEREST SLIP</button> */}
                  </div>
                  <div
                    style={{
                      marginBottom: "10px",
                      fontWeight: 400,
                      marginRight: "auto",
                      display: "flex",
                      gap: "6px",
                      color: "black",
                    }}
                  >
                    <span>Client Name:</span>
                    <div
                      style={{
                        marginLeft: "8px",
                        display: "block",
                        color: "#4c3226",
                      }}
                    >
                      {clientName}
                    </div>
                  </div>
                  {tabselect.single && (
                    <ul className="tabletopcss">
                      <li>
                        Total Pcs = <span>{selectedtotals?.pcs}</span>
                      </li>
                      <li>
                        Cts = <span>{selectedtotals?.CARATS?.toFixed(2)}</span>
                      </li>
                      <li>
                        Price ={" "}
                        <span>{selectedtotals?.pricects?.toFixed(2)}</span>
                      </li>
                      <li>
                        Amt $ ={" "}
                        <span>{selectedtotals?.amount?.toFixed(2)}</span>
                      </li>
                    </ul>
                  )}
                  {tabselect?.single && (
                    <>
                      {data?.length === 0 ? (
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
                          No items in Basket
                        </div>
                      ) : (
                        <div className="table-responsive pt-10">
                          <table
                            striped
                            bordered
                            hover
                            style={{ width: "max-content", color: "black" }}
                          >
                            <thead className="tablecss">
                              <tr>
                                <th>
                                  <label class="checkbox style-a">
                                    <input
                                      type="checkbox"
                                      onChange={() => {
                                        if (
                                          selectedRows.length === data.length
                                        ) {
                                          setSelectedRows([]);
                                        } else {
                                          setSelectedRows(
                                            data?.map((item) => item),
                                          );
                                        }
                                      }}
                                      checked={
                                        selectedRows.length === data.length
                                      }
                                    />
                                    <div class="checkbox__checkmark"></div>
                                  </label>
                                </th>
                                <th>Location</th>
                                <th>StoneId</th>
                                <th onClick={() => handleSort("LAB")}>
                                  {" "}
                                  Lab{" "}
                                  {sortBy === "LAB"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th>ReportNo</th>
                                <th onClick={() => handleSort("SHAPE")}>
                                  Shape{" "}
                                  {sortBy === "SHAPE"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("CARATS")}>
                                  Carats{" "}
                                  {sortBy === "CARATS"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("COLOR")}>
                                  Color{" "}
                                  {sortBy === "COLOR"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("CLARITY")}>
                                  Clarity{" "}
                                  {sortBy === "CLARITY"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("CUT")}>
                                  Cut
                                  {sortBy === "CUT"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("POLISH")}>
                                  Polish
                                  {sortBy === "POLISH"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th onClick={() => handleSort("SYMM")}>
                                  Symm
                                  {sortBy === "SYMM"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                                <th>Measurements</th>
                                <th>Table %</th>
                                <th>Depth %</th>
                                <th>Price/Cts</th>
                                <th onClick={() => handleSort("AMOUNT")}>
                                  Amount
                                  {sortBy === "AMOUNT"
                                    ? sortOrder === "asc"
                                      ? " ▲"
                                      : " ▼"
                                    : "▼"}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="tablecss">
                              {data?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    {/* <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item.srNo)}
                                            onChange={() => handleRowSelect(item.srNo)}
                                        /> */}
                                    <label className="checkbox style-a">
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.some(
                                          (selected) =>
                                            selected.STONE === item.STONE,
                                        )}
                                        onChange={() => handleRowSelect(item)}
                                      />
                                      <div className="checkbox__checkmark"></div>
                                    </label>
                                  </td>
                                  <td>{item.FL_BRID}</td>
                                  <td>{item.STONE}</td>
                                  <td>
                                    <a
                                      style={{ color: "blue" }}
                                      href={`https://www.igi.org/reports/verify-your-report?r=${item.REPORTNO}`}
                                      target="_blank"
                                    >
                                      {item.LAB}
                                    </a>
                                  </td>
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
                                  <td>
                                    {(
                                      (item.RAP_PRICE *
                                        (100 - Number(item.ASK_DISC))) /
                                      100
                                    )?.toFixed(2)}
                                  </td>
                                  <td>
                                    {(
                                      ((item.RAP_PRICE *
                                        (100 - Number(item.ASK_DISC))) /
                                        100) *
                                      item.CARATS
                                    )?.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                  {tabselect.parcel && (
                    <>
                      {data?.length === 0 ? (
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
                          No items in Basket
                        </div>
                      ) : (
                        <div className="table-responsive pt-10">
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
                                        if (
                                          selectedRows?.length === data?.length
                                        ) {
                                          setSelectedRows([]);
                                        } else {
                                          setSelectedRows(
                                            data?.map((item) => item),
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
                                <th>Location</th>
                                <th>In Stock</th>
                                <th>LOT NO</th>
                                <th>Shape</th>
                                <th>Carats</th>
                                <th>Color</th>
                                <th>Clarity</th>
                                <th>Length</th>
                                <th>Width</th>
                                <th>Height</th>
                                <th>ASK AMT</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody className="tablecss">
                              {data?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <label className="checkbox style-a">
                                      <input
                                        type="checkbox"
                                        checked={selectedRows?.some(
                                          (selected) =>
                                            selected.FL_SUB_LOT ===
                                            item.FL_SUB_LOT,
                                        )}
                                        onChange={() => handleRowSelect(item)}
                                      />
                                      <div className="checkbox__checkmark"></div>
                                    </label>
                                  </td>
                                  <td>{item.FL_BRID}</td>
                                  <td>A</td>
                                  <td>{item.FL_SUB_LOT}</td>
                                  <td>{item.FL_SHAPE_GROUP}</td>
                                  <td>{item.FL_CARATS}</td>
                                  <td>{item.FL_COLOR}</td>
                                  <td>{item.FL_CLARITY}</td>
                                  <td>{item.FL_LENGTH}</td>
                                  <td>{item.FL_WIDTH}</td>
                                  <td>{item.FL_HIGHT}</td>
                                  <td>{item.FL_ASK_AMT}</td>
                                  <td>{item.FL_INVENTORY_TYPE}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                  {tabselect.jewel && (
                    <>
                      {data?.length === 0 ? (
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
                          No items in Basket
                        </div>
                      ) : (
                        <div className="table-responsive pt-10">
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
                                        if (
                                          selectedRows.length === data.length
                                        ) {
                                          setSelectedRows([]);
                                        } else {
                                          setSelectedRows(
                                            data.map((item) => item),
                                          );
                                        }
                                      }}
                                      checked={
                                        selectedRows.length === data.length &&
                                        data.length > 0
                                      }
                                    />

                                    <div className="checkbox__checkmark"></div>
                                  </label>
                                </th>

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
                              {data?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <label className="checkbox style-a">
                                      <input
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
                                      }}
                                      onClick={() =>
                                        window.open(
                                          item.FL_IMAGE_PATH,
                                          "_blank",
                                        )
                                      }
                                    >
                                      Image
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </IonCol>
                {tabselect.single && (
                  <section className="checkout-section">
                    <div className="shipping-card">
                      <h5 className="shipping-title">Shipping Options</h5>

                      <select
                        className="shipping-select"
                        value={shippingMethod}
                        onChange={handleShippingChange}
                      >
                        <option value="">Select Shipping Method</option>

                        <option value="overnight">1. Overnight - ($45)</option>

                        <option value="2ndday">2. 2nd Day - ($30)</option>

                        <option value="saturday">3. Saturday - ($80)</option>
                      </select>
                    </div>

                    <div className="order-summary-box">
                      <div className="summary-row">
                        <span>
                          Total Order ({selectedtotals?.pcs || 0} pcs /{" "}
                          {Number(selectedtotals?.CARATS || 0).toFixed(2)} cts)
                        </span>

                        <strong>
                          ${Number(selectedtotals?.amount || 0).toFixed(2)}
                        </strong>
                      </div>

                      <div className="shipping-summary-wrapper">
                        <div
                          className="summary-row shipping-summary"
                          onClick={() => setShowShippingText((prev) => !prev)}
                        >
                          <span className="shipping-label">
                            Shipping
                            <span className="shipping-arrow">
                              {showShippingText ? "▲" : "▼"}
                            </span>
                          </span>

                          <strong>
                            ${Number(shippingAmount || 0).toFixed(2)}
                          </strong>
                        </div>
                        {showShippingText && (
                          <div className="shipping-comment">
                            <textarea
                              value={shippingText}
                              onChange={(e) => setShippingText(e.target.value)}
                              placeholder="Write your comments here..."
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                      <div className="summary-divider" />
                      <div className="summary-row final-total">
                        <span>Total Order</span>

                        <strong>${totalOrderAmount.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="order-type-buttons">
                      <button
                        type="button"
                        className={
                          orderType === "memo"
                            ? "order-type-btn active"
                            : "order-type-btn"
                        }
                        onClick={() => setOrderType("memo")}
                      >
                        Memo
                      </button>
                      <button
                        type="button"
                        className={
                          orderType === "purchase"
                            ? "order-type-btn active"
                            : "order-type-btn"
                        }
                        onClick={() => setOrderType("purchase")}
                      >
                        Purchase
                      </button>
                    </div>
                    <button
                      type="button"
                      className="order-now-btn"
                      onClick={handleOrderNow}
                      disabled={orderLoading}
                    >
                      {orderLoading ? "Processing..." : "Order Now"}
                    </button>
                  </section>
                )}
              </IonRow>
            </IonGrid>
            <IonLoading
              isOpen={showLoading}
              message={"Loading..."}
              spinner="crescent"
              duration={0}
            />
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
          </div>
        </IonContent>
        <Bottom />
      </IonPage>
    </>
  );
}
export default Basket;
