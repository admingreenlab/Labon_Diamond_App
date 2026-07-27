import React, { useContext, useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonInput,
  IonTextarea,
  IonButton,
  IonModal,
  IonToast,
} from "@ionic/react";
import Header from "./head";
import Axios, { baseURL } from "../service/jwtAuth";
import { JewelContext } from "../context/JewelContext";
import { useHistory, useLocation } from "react-router-dom";
import Bottom from "./bottomtab";

const Jewel = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const { setSearchjewel, searchjewel } = useContext(JewelContext);
  const [selectedOptionss, setSelectedOptionss] = useState({});
  const [stoneId, setStoneId] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [showVVS2, setShowVVS2] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [GRWT, setGRWT] = useState({ from: "", to: "" });
  const [NEWT, setNEWT] = useState({ from: "", to: "" });

  const categories = {
    CATEGORY: [
      {
        name: "RING",
        shapeicon: <img src="/jewelsvg/RING.svg" alt="ring" />,
      },
      {
        name: "EARRING",
        shapeicon: <img src="/jewelsvg/EARRING.svg" alt="EARRING" />,
      },
      {
        name: "NECKLACE",
        shapeicon: <img src="/jewelsvg/NECKLACE.svg" alt="NECKLACE" />,
      },
      {
        name: "BRACELET",
        shapeicon: <img src="/jewelsvg/BRACELET.svg" alt="BRACELET" />,
      },
      {
        name: "PENDANT",
        shapeicon: <img src="/jewelsvg/PENDANT.svg" alt="PENDANT" />,
      },
      {
        name: "OVAL BANGLE",
        shapeicon: <img src="/jewelsvg/OVAL BANGLE.svg" alt="OVAL BANGLE" />,
      },
      {
        name: "OTHER",
        shapeicon: <img src="/jewelsvg/OTHER.svg" alt="OTHER" />,
      },
    ],
    METALTYPE: ["GOLD", "SLIVER", "PLATINUM"],
    location: [],
  };

  const storedData = localStorage.getItem("branches");
  const datas = JSON.parse(storedData);

  // Populate the location category with branch names
  const locations = datas?.map((branch) => branch.FL_BRANCH_NAME);

  // Add the location category to categories
  categories.location = locations;

  const handleOthersClick = () => {
    setShowVVS2((prev) => !prev);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (searchjewel) {
      setSelectedOptionss({
        METALTYPE: searchjewel.METALTYPE || [],
        CATEGORY: searchjewel.CATEGORY || [],
        location: searchjewel.BRANCH || [],
      });

      setStoneId(searchjewel.ITEMNO || "");
      setGRWT({
        from: searchjewel.FR_GR_WT || "",
        to: searchjewel.TO_GR_WT || "",
      });

      setNEWT({
        from: searchjewel.FR_NE_WT || "",
        to: searchjewel.TO_NE_WT || "",
      });
    }
  }, [searchjewel]);

  useEffect(() => {
    const storedOptions = localStorage.getItem("selectedOptionss");
    if (storedOptions) {
      setSelectedOptionss(JSON.parse(storedOptions));
    }
  }, []);

  useEffect(() => {
    if (location.state?.selectedOptionss) {
      setSelectedOptionss(location.state.selectedOptionss);
    }
  }, [location.state?.selectedOptionss]);

  const handleCheckboxChange = (category, option) => {
    setSelectedOptionss((prev) => {
      const newSelected = { ...prev };
      if (!newSelected[category]) newSelected[category] = [];
      if (newSelected[category].includes(option)) {
        newSelected[category] = newSelected[category].filter(
          (item) => item !== option,
        );
      } else {
        newSelected[category] = [...newSelected[category], option];
      }
      return newSelected;
    });
  };

  useEffect(() => {
    let isMounted = true; // Track whether the component is still mounted

    const fetchData = async () => {
      try {
        const response = await Axios.get("search/parmas?type=single");
        if (isMounted) {
          setData(response.data.data); // Update state only if the component is still mounted
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch data. Please try again."); // Set error state
        }
        console.error("Error fetching data:", err);
      }
    };

    fetchData(); // Call the async function

    // Cleanup function to prevent state updates on an unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  const handlesearch = async () => {
    setIsLoading(true);
    const payload = {
      METALTYPE: selectedOptionss.METALTYPE || [],
      CATEGORY: selectedOptionss.CATEGORY || [],
      BRANCH: selectedOptionss.location || [],
      ITEMNO: stoneId || "",
      FR_GR_WT: GRWT.from || "",
      TO_GR_WT: GRWT.to || "",
      FR_NE_WT: NEWT.from || "",
      TO_NE_WT: NEWT.to || "",
    };

    const cleanPayloads = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0),
      ),
    );

    setSearchjewel(cleanPayloads);

    try {
      const response = await Axios.post(
        "search/jewel-user",
        JSON.stringify(cleanPayloads),
      );

      if (response.status === 200) {
        // Update state here if necessary
        setSearchjewel(response.data.result);
        setToastMessage(response?.data?.status);
        setShowToast(true);
        // Navigate to the new page
        history.push({
          pathname: `/jeweltable`,
          state: {
            searchResults: response.data.result,
            selectedOptionss: selectedOptionss,
          },
        });
        // window.location.reload()
      } else {
        setError(data.message);
        setToastMessage(err.response.data.message);
        // setToastMessage('User not found.');
        setShowToast(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after search completes or fails
    }
  };

  return (
    <IonPage>
      <Header />

      <IonContent>
        <IonGrid style={{ marginBottom: "20px" }}>
          <div style={{ marginTop: "20px" }}>
            <h5 class="text-center mb-5 element">Jewelry</h5>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignContent: "center",
              gap: "15px",
              padding: "20px 7px",
            }}
          >
            <a href="/home">
              <button className="sumbutton sumbutton-11">
                Polish Certified
              </button>
            </a>
            <a href="/polish">
              <button type="button" class="sumbutton sumbutton-11 ">
                Polish Parcel
              </button>
            </a>
            <a
              onClick={() =>
                window.open(
                  "https://www.labonjewels.com/",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <button type="button" class="sumbutton">
                Jewelry
              </button>
            </a>
          </div>
          <IonRow>
            <IonCol size="12">
              <div className="main-box main2">
                <div className="checkbox-group">
                  {categories.CATEGORY.map((option) => (
                    <span
                      key={option.name}
                      className={`checkbox-label ${selectedOptionss.CATEGORY?.includes(option.name.toUpperCase()) ? "selected" : ""}`}
                      onClick={() =>
                        handleCheckboxChange(
                          "CATEGORY",
                          option.name.toUpperCase(),
                        )
                      }
                    >
                      {option.shapeicon}
                      {option.name}
                    </span>
                  ))}
                </div>
              </div>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                {["METALTYPE"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5
                      style={{
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      Metal type
                    </h5>
                    <div className="checkbox-group">
                      {categories.METALTYPE.map((option) => (
                        <span
                          key={option}
                          className={`checkbox-label ${
                            selectedOptionss.METALTYPE?.includes(option)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleCheckboxChange("METALTYPE", option)
                          }
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                <h5
                  style={{ textTransform: "uppercase", marginBottom: "10px" }}
                >
                  ITEM/Style Code
                </h5>
                <textarea
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    background: "#fff8ef",
                  }}
                  className="forminput"
                  placeholder="Enter ITEM/Style Code"
                  value={stoneId}
                  onChange={(e) => setStoneId(e.target.value)}
                />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                <h5 style={{ textTransform: "uppercase" }}>GR WT</h5>
                <IonRow>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{
                        background: "#ffdeb300",
                        color: "#000",
                        width: "100%",
                        marginBottom: "5px",
                        borderRadius: "8px",
                        border: "1px solid #4c3226",
                      }}
                      type="number"
                      class="form-control"
                      name="GRWT From"
                      placeholder="GR WT From"
                      value={GRWT.from}
                      onChange={(e) =>
                        setGRWT({ ...GRWT, from: e.target.value })
                      }
                    />
                  </IonCol>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{
                        background: "#ffdeb300",
                        color: "#000",
                        width: "100%",
                        marginBottom: "5px",
                        borderRadius: "8px",
                        border: "1px solid #4c3226",
                      }}
                      type="number"
                      class="form-control"
                      name="GRWT To"
                      placeholder="GR WT To "
                      value={GRWT.to}
                      onChange={(e) => setGRWT({ ...GRWT, to: e.target.value })}
                    />
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                <h5 style={{ textTransform: "uppercase" }}>NET WT</h5>
                <IonRow>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{
                        background: "#ffdeb300",
                        color: "#000",
                        width: "100%",
                        marginBottom: "5px",
                        borderRadius: "8px",
                        border: "1px solid #4c3226",
                      }}
                      type="number"
                      class="form-control"
                      name="NEWT From"
                      placeholder="NET WT From"
                      value={NEWT.from}
                      onChange={(e) =>
                        setNEWT({ ...NEWT, from: e.target.value })
                      }
                    />
                  </IonCol>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{
                        background: "#ffdeb300",
                        color: "#000",
                        width: "100%",
                        marginBottom: "5px",
                        borderRadius: "8px",
                        border: "1px solid #4c3226",
                      }}
                      type="number"
                      class="form-control"
                      name="NEWT To"
                      placeholder="NET WT To"
                      value={NEWT.to}
                      onChange={(e) => setNEWT({ ...NEWT, to: e.target.value })}
                    />
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>
            <IonCol size="12">
              <div className="main-box">
                {["location"]?.map((category) => (
                  <div className="mainbox" key={category}>
                    <h5
                      style={{
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      {category}
                    </h5>
                    <div className="checkbox-group">
                      {categories[category]?.map((option) => (
                        <span
                          key={option}
                          className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? "selected" : ""}`}
                          onClick={() => handleCheckboxChange(category, option)}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol>
          </IonRow>
          <IonRow></IonRow>
          <IonRow>
            <IonCol
              size="12"
              className="ion-text-center"
              style={{ marginTop: "10px" }}
            >
              <div className="mainbtn">
                <button
                  className="sumbutton"
                  onClick={handlesearch}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Search"}
                </button>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
      <Bottom />
    </IonPage>
  );
};

export default Jewel;
