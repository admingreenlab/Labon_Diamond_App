import React, { useRef, useState, useEffect } from "react";
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
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/react";
import { IonInput } from "@ionic/react";
import { IonInputPasswordToggle } from "@ionic/react";
import Axios from "../service/jwtAuth";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState({});

  const options = ["MR.", "MRS.", "MS."];
  const [formData, setFormData] = useState({
    cname: "",
    title: "MR",
    fname: "",
    lname: "",
    email: "",
    country: "",
    state: "",
    city: "",
    mobile: "",
    aboutUs: "",
    loginEmail: "",
    pass: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);

  // useEffect(() => {
  //     console.log('formData', formData)
  // }, [formData])

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    // Only process text inputs
    if (type === "text") {
      const trimmedValue = value.trim(); // removes both leading and trailing spaces

      // Update the form data
      setFormData((prev) => ({
        ...prev,
        [name]: trimmedValue,
      }));

      // Validate the field immediately after trimming
      validateField(name, trimmedValue);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    validateField(name, newValue);
  };

  const validateForm = () => {
    const newErrors = {};

    // Company Name
    if (!formData.cname.trim()) {
      newErrors.cname = "Company Name is required";
    } else if (formData.cname.trim().length < 2) {
      newErrors.cname = "Company Name must be at least 2 characters";
    }

    // First Name
    if (!formData.fname.trim()) {
      newErrors.fname = "First Name is required";
    } else if (formData.fname.trim().length < 2) {
      newErrors.fname = "First Name must be at least 2 characters";
    }

    // Last Name
    if (!formData.lname.trim()) {
      newErrors.lname = "Last Name is required";
    } else if (formData.lname.trim().length < 2) {
      newErrors.lname = "Last Name must be at least 2 characters";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone Number is required";
    } else if (!/^\d{5,15}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Invalid phone number (must be 5–15 digits)";
    }

    // Country
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
      newErrors.country = "Only letters allowed";
    }

    // state
    if (!formData.state.trim()) {
      newErrors.state = "state is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.state.trim())) {
      newErrors.state = "Only letters allowed";
    }

    // About Us
    if (!formData.aboutUs.trim()) {
      newErrors.aboutUs = "Please tell us how you know about us";
    } else if (formData.aboutUs.trim().length < 3) {
      newErrors.aboutUs = "Provide more details";
    }

    // Password
    if (!formData.pass) {
      newErrors.pass = "Password is required";
    } else if (formData.pass.length < 6) {
      newErrors.pass = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.pass !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms & Conditions
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Please accept the Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await Axios.post(
        "user/addnewuser",
        JSON.stringify(formData)
      );

      if (response.data.message === "user registered Sucessfully") {
        window.location.href = "/login";
        history.push("/login");
        setToastMessage(response.data.message);
        setShowToast(true);
      } else {
        if (
          response.data.error ===
          "ORA-00001: unique constraint (SALESEX.UN_FL_USERNAME) violated\nORA-06512: at line 5\nHelp: https://docs.oracle.com/error-help/db/ora-00001/"
        ) {
          setError("User already exists");
        }
      }
    } catch (err) {
      setToastMessage(err.response.data.message);
      setShowToast(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IonPage style={{ background: "rgb(255 222 179)" }}>
        <div
          className="main-bg"
          style={{ width: "100%", height: "100%", overflow: "auto" }}
        >
          {/* <div
            style={{
              width: "100%",
              height: "30px",
              background: "#fff",
              position: "absolute",
              left: " 0",
              top: "0",
              zIndex: "999",
            }}
          ></div> */}

          <IonGrid>
            <IonRow style={{ justifyContent: "center" }}>
              <IonCol size-md="6" size-sm="8" size="12">
                <div
                  color="secondary"
                  style={{ width: "100%", marginTop: "50px", padding: "9px" }}
                >
                  <h6
                    class="text-center mb-5 element"
                    style={{ marginTop: "10px", fontSize: "20px" }}
                  >
                    Register
                  </h6>

                  <form
                    className="form-details"
                    style={{ marginTop: "20px" }}
                    color="secondary"
                    onSubmit={handleSubmit}
                  >
                    <div tyle={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          marginBottom: "15px",
                          padding: "8px",
                        }}
                        type="text"
                        name="cname"
                        placeholder="Company Name of Account Applicant as appears officially *"
                        value={formData.cname}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    {errors.cname && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.cname}
                      </span>
                    )}

                    <div style={{ display: "flex" }}>
                      {/* <select
                          style={{
                            background: "#ffdeb300",
                            color: "#000",
                            padding: "8px",
                            margin: "0px 0px 14px 0px",
                            border: "1px solid rgb(76 50 38 / 67%)",
                          }}
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                        >
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select> */}
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="text"
                        name="fname"
                        value={formData.fname}
                        onChange={handleInputChange}
                        placeholder="First Name *"
                        onBlur={handleBlur}
                        required
                        className="w-full rounded-md shadow-sm"
                      />
                    </div>
                    {errors.fname && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.fname}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="text"
                        name="lname"
                        value={formData.lname}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Last Name *"
                        required
                      />
                    </div>
                    {errors.lname && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.lname}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value.toLowerCase(),
                          })
                        }
                        onBlur={handleBlur}
                        placeholder="Enter Email *"
                        required
                      />
                    </div>
                    {errors.email && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.email}
                      </span>
                    )}

                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Phone Number *"
                        required
                      />
                    </div>
                    {errors.mobile && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.mobile}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country *"
                        value={formData.country}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        required
                      />
                    </div>
                    {errors.country && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.country}
                      </span>
                    )}

                    <div style={{ display: "flex" }}>
                      <input
                        type="text"
                        name="state"
                        placeholder="state *"
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        required
                      />
                    </div>
                    {errors.state && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.state}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="text"
                        name="aboutUs"
                        value={formData.aboutUs}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="How did you know about us? *"
                        required
                      />
                    </div>
                    {errors.aboutUs && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.aboutUs}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Password *"
                        required
                      />
                    </div>
                    {errors.pass && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.pass}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid rgb(76 50 38 / 67%)",
                          padding: "8px",
                          marginBottom: "15px",
                        }}
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Password *"
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "-10px 0px 5px 0px",
                        }}
                      >
                        {errors.confirmPassword}
                      </span>
                    )}
                    <div style={{ display: "flex" }}>
                      <input
                        style={{
                          padding: "8px",
                          display: "flex",
                          width: "17px",
                        }}
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />

                      <span
                        class="checkmark"
                        style={{ margin: "0px 0px 0px 10px" }}
                      >
                        I agree to the Terms and Conditions
                      </span>
                    </div>
                    {errors.agreeToTerms && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          margin: "5px 0px 5px 0px",
                        }}
                      >
                        {errors.agreeToTerms}
                      </span>
                    )}
                    {error && (
                      <div className="alert alert-danger text-center" style={{color:'red', textAlign:'center', margin:'5px 0px'}}>
                        {error}
                      </div>
                    )}
                    <IonButton
                      color="secondary"
                      type="submit"
                      expand="full"
                      style={{
                        marginTop: "20px",
                        width: "100%",
                        textTransform: "uppercase",
                      }}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </IonButton>
                  </form>
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginTop: "10px",
                    }}
                  >
                    Already have an account?{" "}
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#bc7700",
                        marginLeft: "5px",
                      }}
                      onClick={() => (window.location.href = "/login")}
                    >
                      Login here
                    </span>
                  </div>
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
      </IonPage>
    </>
  );
}

export default Register;
