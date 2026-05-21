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
  IonToast
} from "@ionic/react";
import Header from './head';
import Axios, { baseURL } from "../service/jwtAuth";
import { PolishContext } from "../context/PolishContext";
import { useHistory, useLocation } from "react-router-dom";
import Bottom from './bottomtab';

const Polish = ({isAuthenticated}) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const { setSearchpolish, searchpolish } = useContext(PolishContext);
  const [selectedOptionss, setSelectedOptionss] = useState({});
  const [carat, setCarat] = useState({ from: "", to: "" });
  const [US$CT, setUS$CT] = useState({ from: "", to: "" });
  const [stoneId, setStoneId] = useState("");
  const [data, setData] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [showVVS2, setShowVVS2] = useState(false);
  const [remark, setRemark] = useState('');
  const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = useState(false);
  const [advanceSearchFields, setAdvanceSearchFields] = useState({
    tableFrom: "",
    tableTo: "",
    depthFrom: "",
    depthTo: "",
    ratioFrom: "",
    ratioTo: "",
    memo: false,
    available: false,
    hold: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();


  const categories = {
    Shape: [
      { name: "Round", image: "/shapeimage/Round.svg" },
      { name: "Oval", image: "/shapeimage/Oval.svg" },
      { name: "Pear", image: "/shapeimage/Pear.svg" },
      { name: "Marquise", image: "/shapeimage/Marquise.svg" },
      { name: "Heart", image: "/shapeimage/Heart.svg" },
      { name: "Emerald", image: "/shapeimage/Emerald.svg" },
      { name: "Cushion", image: "/shapeimage/Cushion.svg" },
      { name: "Princess", image: "/shapeimage/Princess.svg" },
      { name: "Radiant", image: "/shapeimage/Radiant.svg" },
      { name: "Asscher", image: "/shapeimage/Asscher.svg" },
    ],
    Color: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'G+', 'F.I.BLUE'],
    Clarity: ['VS+', 'SI+', 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'],
    FL_MAIN_LOT: ['-2', '+2-6.5', '+6.5-11', '+11-14', '1/10', '1/6', '1/5', '1/4', '1/3', '3/8', '1/2', '3/4', 'None', '+7-10', '-', '+1.5-2', '1.04DABBI', '1.00-1.49', '+00-0', '+000-00', '+0-1'],
    // Cut: ['ID', 'EX', 'VG'],
    // Lab: ['IGI', 'GIA', 'GSI', 'NONC', 'GCAL', 'NO_CERT'],
    // Polish: ['ID', 'EX', 'VG', 'GD', 'FR'],
    // Symm: ['EX', 'VG', 'GD', 'FR', 'G'],
    // Flour: ["NON", "FNT", "MED", "SL", "VSL", "STG", "VST"],
    location: []
  };



  const storedData = localStorage.getItem('branches');
  const datas = JSON.parse(storedData);


  // Populate the location category with branch names
  const locations = datas?.map(branch => branch.FL_BRANCH_NAME);

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
    if (searchpolish) {
      setSelectedOptionss({
        SHAPES: searchpolish.SHAPE || [],
        Clarity: searchpolish.CLARITY || [],
        Color: searchpolish.COLOR || [],
        // Cut: searchpolish.CUT || [],
        // Lab: searchpolish.LAB || [],
        // Polish: searchpolish.POLISH || [],
        // Symm: searchpolish.SYMM || [],
        // Flour: searchpolish.FLOUR || [],
        location: searchpolish.location || [],
        FL_MAIN_LOT: searchpolish.FL_MAIN_LOT || [],
      });

      setCarat({
        from: searchpolish.FromCarate || "",
        to: searchpolish.ToCarate || "",
      });

      setUS$CT({
        from: searchpolish.FromUSCT || "",
        to: searchpolish.ToUSCT || "",
      });

      setStoneId(searchpolish.stoneCert || "");

      setAdvanceSearchFields({
        tableFrom: searchpolish.FromTable_per || "",
        tableTo: searchpolish.ToTable_per || "",
        depthFrom: searchpolish.FromDepth_per || "",
        depthTo: searchpolish.ToDepth_per || "",
        ratioFrom: searchpolish.FromRatio || "",
        ratioTo: searchpolish.ToRatio || "",
        memo: !!searchpolish.Memo,
        available: !!searchpolish.A,
        hold: !!searchpolish.Hold,
      });

      setIsAdvanceSearchOpen(
        !!(
          searchpolish.FromTable_per ||
          searchpolish.ToTable_per ||
          searchpolish.FromDepth_per ||
          searchpolish.ToDepth_per ||
          searchpolish.FromRatio ||
          searchpolish.ToRatio ||
          searchpolish.Memo ||
          searchpolish.A ||
          searchpolish.Hold
        )
      );
    }
  }, [searchpolish]);



  useEffect(() => {
    const storedOptions = localStorage.getItem('selectedOptionss');
    if (storedOptions) {
      setSelectedOptionss(JSON.parse(storedOptions));
      // console.log('Stored Options:', JSON.parse(storedOptions));
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
  // }, [selectedOptions]);

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
        newSelected[category] = newSelected[category].filter((item) => item !== option);
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
        const response = await Axios.get('search/parmas?type=single');
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


  // Handle advance search toggle
  const handleAdvanceSearchClick = () => {
    setIsAdvanceSearchOpen((prev) => !prev);
  };

  // Handle input changes for advance search fields
  const handleAdvanceSearchInputChange = (field, value) => {
    setAdvanceSearchFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = async () => {

    const payload = {
      CLARITY: selectedOptionss.Clarity || [],
      COLOR: selectedOptionss.Color || [],
      // CUT: selectedOptions.Cut || [],
      FromCarate: carat.from || "",
      ToCarate: carat.to || "",
      FromUSCT: US$CT.from || "",
      ToUSCT: US$CT.to || "",
      // LAB: selectedOptions.Lab || [],
      // POLISH: selectedOptions.Polish || [],
      SHAPE: selectedOptionss.SHAPES || [],
      // SYMM: selectedOptions.Symm || [],
      location: selectedOptionss.location || [],
      FL_MAIN_LOT: selectedOptionss.FL_MAIN_LOT || [],
      stoneCert: stoneId || "",
      // FLOUR: selectedOptions.Flour || [],
      ...(isAdvanceSearchOpen && {

        FromTable_per: advanceSearchFields.tableFrom || "",
        ToTable_per: advanceSearchFields.tableTo || "",

        FromDepth_per: advanceSearchFields.depthFrom || "",
        ToDepth_per: advanceSearchFields.depthTo || "",

        FromRatio: advanceSearchFields.ratioFrom || "",
        ToRatio: advanceSearchFields.ratioTo || "",

        ...(advanceSearchFields.available && { A: true }),
        ...(advanceSearchFields.memo && { Memo: true }),
        ...(advanceSearchFields.hold && { Hold: true }),
      }),
    };

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0))
    );

    const formData = {
      remark: remark,
      data: cleanPayload
    };

    try {
      const response = await Axios.post('mail/postdemand', JSON.stringify(formData));

      if (response.status === 200) {
        console.log('search seuccess', response.data)
        setShowModal(false);
        setRemark('');
      } else {
        console.log(data.message || 'failed');
      }
    } catch (err) {
      console.log('An error occurred. Please try again.', err);
    }

  };

  const handlesearch = async () => {

    setIsLoading(true);
    const payload = {
      CLARITY: selectedOptionss.Clarity || [],
      COLOR: selectedOptionss.Color || [],
      // CUT: selectedOptions.Cut || [],
      FromCarate: carat.from || "",
      ToCarate: carat.to || "",
      FromUSCT: US$CT.from || "",
      ToUSCT: US$CT.to || "",
      // LAB: selectedOptions.Lab || [],
      // POLISH: selectedOptions.Polish || [],
      SHAPE: selectedOptionss.SHAPES || [],
      // SYMM: selectedOptions.Symm || [],
      location: selectedOptionss.location || [],
      stoneCert: stoneId || "",
      FL_MAIN_LOT: selectedOptionss.FL_MAIN_LOT || [],
      // FLOUR: selectedOptions.Flour || [],
      ...(isAdvanceSearchOpen && {

        FromTable_per: advanceSearchFields.tableFrom || "",
        ToTable_per: advanceSearchFields.tableTo || "",

        FromDepth_per: advanceSearchFields.depthFrom || "",
        ToDepth_per: advanceSearchFields.depthTo || "",

        FromRatio: advanceSearchFields.ratioFrom || "",
        ToRatio: advanceSearchFields.ratioTo || "",

        ...(advanceSearchFields.available && { A: true }),
        ...(advanceSearchFields.memo && { Memo: true }),
        ...(advanceSearchFields.hold && { Hold: true }),
      }),
    };

    const cleanPayloads = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0))
    );

    setSearchpolish(cleanPayloads);

    try {
      const response = await Axios.post('search/bulk/stoneUser', JSON.stringify(cleanPayloads));

      if (response.status === 200) {
        // Update state here if necessary
        setSearchpolish(response.data.result);
        setToastMessage(response?.data?.status);
        setShowToast(true);
        // Navigate to the new page
        history.push({
          pathname: `/polishtableshow`,
          state: { searchResults: response.data.result, selectedOptionss: selectedOptionss }
        });
        // window.location.reload()
      } else {
        setError(data.message);
        setToastMessage(err.response.data.message)
        // setToastMessage('User not found.');
        setShowToast(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    finally {
      setIsLoading(false); // Set loading to false after search completes or fails
    }
  };


  return (
    <IonPage>
     
        <Header />
 
      <IonContent>
        <IonGrid style={{ marginBottom: "20px" }}>
          <div style={{ marginTop: '20px' }}>
            <h5 class="text-center mb-5 element">Polish Parcel</h5>
          </div>
          <div style={{ display: "flex", justifyContent: "start", alignContent: "center", gap: "15px",padding:"20px 7px"}}>
            <a href='/home'>
              <button className="sumbutton sumbutton-11">Polish Certified</button>
            </a>
            <a href='/polish'>
              <button type="button" class="sumbutton ">Polish Parcel</button>
            </a>
              <a href='/jewels'>
              <button type="button" class="sumbutton sumbutton-11 " style={{padding:'10px'}}>Jewelry</button>
            </a>
          </div>
          <IonRow>
          <IonCol size="12">
                           <div className="main-box main2">
                             <div className="checkbox-group">
                               {categories.Shape.map((option) => (
                                 <span
                                   key={option.name}
                                   className={`checkbox-label ${
                                     selectedOptionss.SHAPES?.includes(
                                       option.name.toUpperCase(),
                                     )
                                       ? "selected"
                                       : ""
                                   }`}
                                   onClick={() =>
                                     handleCheckboxChange(
                                       "SHAPES",
                                       option.name.toUpperCase(),
                                     )
                                   }
                                 >
                                   <img
                                     src={option.image}
                                     alt={option.name}
                                     width={45}
                                     height={45}
                                     className="shape-icon"
                                   />
           
                                   <small className="shape-title">{option.name}</small>
                                 </span>
                               ))}
           
                               <div className="checkbox-group">
                                 <span
                                   className="checkbox-label"
                                   onClick={handleOthersClick}
                                 >
                                   <img
                                     src="/shapeimage/Others.svg"
                                     alt="Others"
                                     width={45}
                                     height={45}
                                     className="shape-icon"
                                   />
                                   <small className="shape-title">Others</small>
                                 </span>
                               </div>
                               {showVVS2 && (
                                 <div className="checkbox-group">
                                   {data?.SHAPE?.map((option) => (
                                     <span
                                       key={option.name}
                                       className={`checkbox-label ${
                                         selectedOptionss.SHAPES?.includes(
                                           option.name.toUpperCase(),
                                         )
                                           ? "selected"
                                           : ""
                                       }`}
                                       onClick={() =>
                                         handleCheckboxChange(
                                           "SHAPES",
                                           option.name.toUpperCase(),
                                         )
                                       }
                                     >
                                       <img
                                         src={`/shapeimage/${option.name}.svg`}
                                         alt={option.name}
                                         width={45}
                                         height={45}
                                         className="shape-icon"
                                       />
           
                                       <small className="shape-title">{option.name}</small>
                                     </span>
                                   ))}
                                 </div>
                               )}
                             </div>
                           </div>
                         </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                <h5 style={{ textTransform: 'uppercase' }}>Carat</h5>
                <IonRow>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                      type="number"
                      class="form-control"
                      name="CaratFrom"
                      placeholder="Carat From"
                      value={carat.from}
                      onChange={(e) => setCarat({ ...carat, from: e.target.value })}
                    />
                  </IonCol>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                      type="number"
                      class="form-control"
                      name="CaratTo"
                      placeholder="Carat To "
                      value={carat.to}
                      onChange={(e) => setCarat({ ...carat, to: e.target.value })}
                    />
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>
          </IonRow>
          {/* Stone ID Input */}

          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Stone Id #/Cert #</h5>
                <textarea
                  style={{ width: '100%', borderRadius: '8px', background: '#fff8ef' }}
                  className="forminput"
                  placeholder="Enter Stone Id or Certificate Number"
                  value={stoneId}
                  onChange={(e) => setStoneId(e.target.value)}
                />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <div className="main-box">
                {["FL_MAIN_LOT"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Carat Range</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
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
                {["Color"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol>
            <IonCol size="12">
              <div className="main-box">
                {["Clarity"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol>
         
              <IonCol size="12">
                <div className="main-box">
                  {["location"]?.map((category) => (
                    <div className="mainbox" key={category}>
                      <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                      <div className="checkbox-group">
                        {categories[category]?.map((option) => (
                          <span key={option}
                            className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? 'selected' : ''}`}
                            onClick={() => handleCheckboxChange(category, option)}>
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </IonCol>
           
            {/* <IonCol size="12">
              <div className="main-box">
                {["Cut"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}
            {/* <IonCol size="12">
              <div className="main-box">
                {["Lab"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}
            {/* <IonCol size="12">
              <div className="main-box">
                {["Polish"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}
            {/* <IonCol size="12">
              <div className="main-box">
                <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>US$/CT</h5>
                <IonRow>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                      type="number"
                      placeholder="From"
                      value={US$CT.from}
                      onChange={(e) => setUS$CT({ ...US$CT, from: e.target.value })}
                    />
                  </IonCol>
                  <IonCol size="6" sizeMd="6">
                    <input
                      style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                      type="number"
                      placeholder="To"
                      value={US$CT.to}
                      onChange={(e) => setUS$CT({ ...US$CT, to: e.target.value })}
                    />
                  </IonCol>
                </IonRow>
              </div>
            </IonCol> */}

            {/* <IonCol size="12">
              <div className="main-box">
                {["Symm"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}

            {/* <IonCol size="12">
              <div className="main-box">
                {["Flour"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}
            {/* <IonCol size="12">
              <div className="main-box">
                {["location"].map((category) => (
                  <div className="mainbox" key={category}>
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>{category}</h5>
                    <div className="checkbox-group">
                      {categories[category].map((option) => (
                        <span key={option}
                          className={`checkbox-label ${selectedOptions[category]?.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleCheckboxChange(category, option)}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IonCol> */}
          </IonRow>

          <IonRow>
            {isAdvanceSearchOpen && (
              <>
                <IonCol size="12">
                  <div className="main-box">
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Table %</h5>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="From"
                          value={advanceSearchFields.tableFrom}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("tableFrom", e.target.value)
                          }
                        />
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="To"
                          value={advanceSearchFields.tableTo}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("tableTo", e.target.value)
                          }
                        />
                      </IonCol>
                    </IonRow>
                  </div>
                </IonCol>
                <IonCol size="12">
                  <div className="main-box">
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Depth %</h5>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="From"
                          value={advanceSearchFields.depthFrom}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("depthFrom", e.target.value)
                          }
                        />
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="To"
                          value={advanceSearchFields.depthTo}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("depthTo", e.target.value)
                          }
                        />
                      </IonCol>
                    </IonRow>
                  </div>
                </IonCol>

                <IonCol size="12">
                  <div className="main-box">
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Ratio</h5>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="From"
                          value={advanceSearchFields.ratioFrom}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("ratioFrom", e.target.value)
                          }
                        />
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <input
                          style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                          type="number"
                          placeholder="To"
                          value={advanceSearchFields.ratioTo}
                          onChange={(e) =>
                            handleAdvanceSearchInputChange("ratioTo", e.target.value)
                          }
                        />
                      </IonCol>
                    </IonRow>

                  </div>

                </IonCol>

                <IonCol size="12">
                  <div className="main-box">
                    <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Status</h5>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <div className="" style={{ display: 'flex' }} >
                          <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={advanceSearchFields.available}
                              onChange={(e) =>
                                handleAdvanceSearchInputChange(
                                  "available",
                                  e.target.checked
                                )
                              }
                              style={{ width: '23px' }}
                            />
                            Available
                          </label>
                        </div>
                        <div className=""  >
                          <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={advanceSearchFields.memo}
                              onChange={(e) =>
                                handleAdvanceSearchInputChange("memo", e.target.checked)
                              }
                              style={{ width: '23px' }}
                            />
                            Memo
                          </label>
                        </div>
                        <div className=""  >
                          <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={advanceSearchFields.hold}
                              onChange={(e) =>
                                handleAdvanceSearchInputChange("hold", e.target.checked)
                              }
                              style={{ width: '23px' }}
                            />
                            Hold
                          </label>
                        </div>
                      </IonCol>

                    </IonRow>
                  </div>
                </IonCol>
              </>
            )}
          </IonRow>
          {/* Buttons */}
          <IonRow>
            <IonCol size="12" className="ion-text-center" style={{marginTop:'10px'}}>
              <div className="mainbtn">
                <button className="sumbutton" onClick={handlesearch} disabled={isLoading} >{isLoading ? "Loading..." : "Search"}</button>
                <span onClick={handleAdvanceSearchClick}>
                  <button className="sumbutton">  {isAdvanceSearchOpen ? "Close Advance Search" : "Advance Search"}</button>
                </span>
                <button className="sumbutton" onClick={openModal}>Post Your Demand</button>
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

        {showModal && (
          <div className="modalimage1">
            <div className="modalimage2">
              <div type='button' onClick={closeModal} style={{ position: "absolute", right: "20px", top: "20px", zIndex: "999" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </div>
              <h2 >Post Your Demand</h2>
              <div >
                <label>
                  Remark
                  <input
                    style={{ background: '#ffdeb300', padding: '10px', color: '#000', width: '100%', marginBottom: '15px', borderRadius: '8px', border: '1px solid #4c3226', marginTop: '15px' }}
                    type="text"
                    placeholder="ADD Remark"
                    className="input-box"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button onClick={handleSubmit} className="submit-btn">Submit</button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
      <Bottom isAuthenticated={isAuthenticated}/>
    </IonPage>
  );
};

export default Polish;
