import React, { useState } from 'react';
import { IonContent, IonImg, IonTitle, IonToolbar, IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import '../main';
import Header from './head';
import { IonButtons, IonButton, IonModal, IonHeader, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Axios from "../service/jwtAuth";
import Bottom from './bottomtab';

const Weborder = ({isAuthenticated}) => {
    // const [formData, setFormData] = useState({
    //     oldPassword: '',
    //     newPassword: '',
    //     retypePassword: '',
    // });
    // const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [success, setSuccess] = useState('');

    // // Handle input changes
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    // // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate passwords
    //     if (formData.newPassword !== formData.retypePassword) {
    //         setError('New password and retype password do not match.');
    //         return;
    //     }

    //     try {
    //         // Send data to the backend
    //         const response = await Axios.post('user/changePassword', {
    //             old_password: formData.oldPassword,
    //             new_password: formData.newPassword,
    //         });

    //         const result = await response.data;
    //         if (response.status === 200) {
    //             // Success
    //             setSuccess(result.message);
    //             setError('');
    //             setFormData({ oldPassword: '', newPassword: '', retypePassword: '' }); // Reset form
    //         } else {
    //             // Error
    //             setError(result.message || 'An error occurred while changing the password.');
    //             setSuccess('');
    //         }
    //     } catch (err) {
    //         // if (response.data.message === "Old password is incorrect") {
    //         // setError("Old password is incorrect");
    //         // console.error(err);
    //         setError(err.response.data.message);
    //         setSuccess('');
    //     }
    // };



    return (
        <>
        <IonPage>
            <Header />
            <IonContent >
                <div className="container mt-5 mb-5">
                    <h4 className="text-center mb-5 element" style={{ marginTop: '20px', fontWeight: '600' }}>Web Order History</h4>
                    <IonGrid style={{ marginBottom: "100px", color: "#4c3226", padding: '10px' }}>

                        {/* <form id="contact-form" style={{ background: '#f3efea' }} onSubmit={handleSubmit}>
                            {error && <div className="text-danger mb-3">{error}</div>}
                            {success && <div className="text-success mb-3">{success}</div>}
                            <table className="table table-bordered table-striped w-75 mx-auto custom-table">
                                <tbody>
                                    <tr>
                                        <td><div className="left-name">Old Password:</div></td>
                                        <td><input type="password" placeholder="Type Old Password"
                                            id="pass" name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            required
                                            style={{ background: '#ffdeb300', width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px' }} /></td>
                                    </tr>
                                    <tr>
                                        <td><div className="left-name">New Password:</div></td>
                                        <td><input type="password" placeholder="Type New Password"
                                            id="pass" name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            style={{ background: '#ffdeb300', width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px' }} /></td>
                                    </tr>
                                    <tr>
                                        <td><div className="left-name">Retype Password:</div></td>
                                        <td><input type="password" placeholder="Type Retype Password" id="repass" name="retypePassword"
                                            value={formData.retypePassword}
                                            onChange={handleChange}
                                            style={{ background: '#ffdeb300', width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px' }} /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class='mainbtn mt-3'>
                                <IonButton
                                    color='secondary'
                                    type='submit'
                                    expand="full"
                                    style={{ marginTop: '10px', width: '75%', textTransform: 'uppercase', display: "flex", justifyContent: "center", margin: "20px auto" }}
                                    disabled={loading}
                                >
                                    {loading ? 'loading...' : 'Change Password'}
                                </IonButton>
                            </div>
                        </form> */}

                    </IonGrid>
                </div>
            </IonContent>
           <Bottom isAuthenticated={isAuthenticated}/>
           </IonPage>
        </>
    )
};

export default Weborder;