import React, { useEffect, useRef, useState } from "react";
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
  IonInput,
  IonToast,
} from "@ionic/react";
import { IonInputPasswordToggle } from "@ionic/react";
import Axios, { setAuthToken } from "../service/jwtAuth";
import { useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  let newValue = value;

   if (name === "username") {
    // Prevent first space and allow single space only
    newValue = newValue.replace(/^\s/, "").replace(/\s{2,}/g, " ");
  }

  if (name === "password") {
    // Remove all spaces
    newValue = newValue.replace(/\s/g, "");
  }

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : newValue,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await Axios.post("/userauth", {
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (response.status === 200 && response.data.status === "success") {
        setAuthToken(response.data, formData.rememberMe);
        if (formData.rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username);
          localStorage.setItem("rememberedPassword", formData.password);
          localStorage.setItem("rememberMeChecked", "true");
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMeChecked");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
      setToastMessage("Login Successful");
      setShowToast(true);
      history.push("/home");
      window.location.href = "/home";
    } catch (err) {
      const toastMsg =
        err.response?.data?.message ||
        "Username or Password is Incorrect. Try again";
            setError("An error occurred. Please try again.", err);
      console.log("An error occurred. Please try again.", err);
      setToastMessage(toastMsg);
      // setToastMessage('User not found.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe =
      localStorage.getItem("rememberMeChecked") === "true";

    if (savedRememberMe) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername || "",
        password: savedPassword || "",
        rememberMe: savedRememberMe,
      }));
    }
  }, []);

  return (
    <>
      <IonPage style={{ background: "#ffffff" }}>
        <div className="main-bg" style={{ width: "100%", height: "100%" }}>
          {/* <div
            style={{
              width: "100%",
              height: "30px",
              background: "#fff",
              position: "absolute",
              left: " 0",
              top: "0",
            }}
          ></div> */}
          <img className="freemlogin1" src="img/freemlogin.png"></img>
          <div className="user-img">
            <IonImg className="freemlogin2" src="img/logoa12.png"></IonImg>
            <div class="cell smaldesignleft">
              <div class="circle fade-in-left">
                <img src="img/leftdesign.svg"></img>
              </div>
            </div>
            <div class="cell smaldesignright">
              <div class="circle fade-in-left">
                <img src="img/rightdesign.svg"></img>
              </div>
            </div>
          </div>
          <IonGrid>
            <IonRow style={{justifyContent:'center'}}>
              <IonCol size-md="6" size-sm="8" size="12">
                <div
                  className="foem-details"
                  color="secondary"
                  style={{ width: "90%" }}
                >
                  <form
                    className="form-details"
                    color="secondary"
                    onSubmit={handleSubmit}
                  >
                    <div style={{ display: "flex" }}>
                      <button
                        style={{
                          border: "1px solid #4c3226ab",
                          borderRight: "0",
                          padding: "10px",
                          marginRight: "0px",
                          marginBottom: "12px",
                        }}
                        className="btn btn-outline-secondary"
                        type="button"
                        color="#4c3226"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#4c3226cc"
                          class="bi bi-person"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                        </svg>
                      </button>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          border: "1px solid #4c3226ab",
                          marginBottom: "12px",
                          padding: "8px",
                        }}
                        type="text"
                        class="form-control"
                        name="username"
                        placeholder="Username or Email *"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div style={{ display: "flex" }}>
                      <button
                        style={{
                          border: "1px solid #4c3226ab",
                          borderRight: "0",
                          padding: "10px",
                          marginRight: "0px",
                        }}
                        className="btn btn-outline-secondary"
                        type="button"
                        color="#4c3226"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#4c3226cc"
                              class="bi bi-eye-slash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#4c3226cc"
                              class="bi bi-eye"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                          </>
                        )}
                      </button>
                      <input
                        style={{
                          background: "#ffdeb300",
                          color: "#000",
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #4c3226ab",
                        }}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your Password *"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <IonCol size="12">
                      <IonRow>
                        <IonCol size="6" style={{ display: "flex" }}>
                          <input
                            style={{ width: "16px", marginTop: "-2px" }}
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                          />
                          <span
                            style={{
                              marginLeft: "5px",
                              fontSize: "14px",
                              color: "rgb(76 50 38)",
                            }}
                          >
                            <label>Remember Me</label>
                          </span>
                        </IonCol>
                        {/* <IonCol size='6' className="col-6 " style={{ textAlign: 'end' }}>
                                                        <span onClick={() => handleItemClick()} style={{ cursor: "pointer", fontSize: '14px', color: '#bc7700' }}>
                                                            Forget Password ?
                                                        </span>
                                                    </IonCol> */}
                      </IonRow>
                    </IonCol>
                    <IonButton
                      color="secondary"
                      type="submit"
                      expand="full"
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        textTransform: "uppercase",
                      }}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </IonButton>
                  </form>
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  Don't have an account ?{" "}
                  <span
                    onClick={() => (window.location.href = "/register")}
                    style={{
                      cursor: "pointer",
                      color: "#bc7700",
                      marginLeft: "5px",
                    }}
                  >
                    Register here
                  </span>
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

export default Login;
