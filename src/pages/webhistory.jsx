import React, { useRef, useState, useEffect } from 'react';
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
    IonDatetime,
    IonToast
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import '../pages/Tab1.css';
import Like from './like';
import { text } from 'ionicons/icons';
import moment from 'moment';
import Axios, { baseURL } from "../service/jwtAuth";
import { useHistory } from "react-router-dom";
import Bottom from './bottomtab';


function WebHistory({isAuthenticated}) {
    const history = useHistory();
    const isMountedRef = useRef(true);
    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(moment().add(5, 'days').format("YYYY-MM-DD"));
    const [clientName, setClientName] = useState('');
    const [status, setStatus] = useState([]);
    const isFetching = { current: false };
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            // console.log('user.FL_USER_NAME',JSON.parse(user)?.FL_USER_NAME)
            setClientName(JSON.parse(user)?.FL_USER_NAME)
        }
    }, [])

    useEffect(() => {
        if (isFetching.current) return;
        isFetching.current = true;
        const fetchData = async () => {
            try {
                const response = await Axios.get('/master/helper?trtype=INWARD');
                if (isMountedRef.current) {
                    console.log(response.data); // Update state only if the component is still mounted
                }
            } catch (err) {
                if (isMountedRef.current) {
                    console.log("Failed to fetch data. Please try again."); // Set error state
                }
                console.error("Error fetching data:", err);
            }
            finally {
                isFetching.current = false;
              }
        };
    
        fetchData();
    
        return () => {
            isMountedRef.current = false;
        };
    }, []);


    const handleSubmit = async () => {
        const formattedStartDate = formatDate(fromDate);
        const formattedEndDate = formatDate(toDate);
      
        const payload = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          transactionType: status.join(","),
        };
        setToastMessage('success');
        setShowToast(true);
        const queryString = new URLSearchParams(payload).toString();
        history.push(`/webhistorytable?${queryString}`);
      };
      
      function formatDate(dateString) {
        const dateParts = dateString.split('-');
       return `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;
      }
      
    

    const handleCheckboxChange = (value) => (e) => {
        if (e.target.checked) {
            setStatus((prevState) => [...prevState, value]);
        } else {
            setStatus((prevState) => prevState.filter((item) => item !== value));
        }
    };


    return (
        <>
        <IonPage>
            <Header />
            <IonContent  style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px' }}>
                <div style={{ marginTop: '20px' }}>
                    <h5 class="text-center mb-5 element">Web History</h5>
                </div>
                <div className='myquotations'>
                    <IonGrid>
                        <IonRow style={{ justifyContent: "center" }}>
                            <IonCol sizeMd='8' size='12'>
                                <div className='main-web'>
                                    <ul>
                                        <li className='left-text'>
                                            <div>
                                                <h6>From:</h6>
                                            </div>
                                        </li>
                                        <li>
                                            <input type='date'  value={fromDate}
                                               onChange={handleDateChange(setFromDate)} />
                                        </li>
                                    </ul>
                                    <ul>
                                        <li className='left-text'>
                                            <div>
                                                <h6>To:</h6>
                                            </div>
                                        </li>
                                        <li>
                                            <input type='date'  value={toDate}
                                               onChange={handleDateChange(setToDate)}  />
                                        </li>
                                    </ul>
                                    <ul>
                                        <li className='left-text'>
                                            <h6>Client Name:</h6>
                                        </li>
                                        <li style={{ textAlign: "center", fontFamily: "Prompt", color: "#4c3226" }}>
                                            <span>{clientName}</span>
                                        </li>
                                    </ul>
                                    <ul>
                                        <li className='left-text'>
                                            <h6>Status:</h6>
                                        </li>
                                        <li>
                                            <div className="flex items-center gap-2 p-2">
                                                <input
                                                    type="checkbox"
                                                    id="sold"
                                                    checked={status.includes(35)}
                                                    onChange={handleCheckboxChange(35)}
                                                    className="w-4 h-4"
                                                />
                                                <span htmlFor="myCheckbox" className="text-lg cursor-pointer">
                                                    Sold
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 p-2">
                                                <input
                                                    type="checkbox"
                                                    id="memo"
                                                    checked={status.includes(33)}
                                                    onChange={handleCheckboxChange(33)}
                                                    className="w-4 h-4"
                                                />
                                                <span htmlFor="myCheckboxx" className="text-lg cursor-pointer">
                                                    Memo
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 p-2">
                                                <input
                                                    type="checkbox"
                                                    id="InterestedSlip"
                                                    checked={status.includes(47)}
                                                    onChange={handleCheckboxChange(47)}
                                                    className="w-4 h-4"
                                                />
                                                <span htmlFor="myCheckboxxx" className="text-lg cursor-pointer">
                                                    Hold
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                    <button type='submit' className="sumbutton" style={{ display: "flex", margin: "18px auto" }} onClick={handleSubmit}>Show Open Cart</button>
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
export default WebHistory; 