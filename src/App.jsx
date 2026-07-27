import React, { useState, useContext, useEffect, useRef } from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonImg,
  IonMenuButton,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonApp,
} from "@ionic/react";
import { IonMenuToggle } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";
import Login from "./pages/login";
import "./pages/Tab1.css";
import Register from "./pages/registerhere";
import Changepass from "./pages/changepassword";
import Weborder from "./pages/Showcarthistory";
import Watchlist from "./pages/watchlist";
import Basket from "./pages/basket";
import { BasketProvider } from "./context/BasketContext";
import { SearchProvider } from "./context/SearchContext";
import { JewelProvider } from "./context/JewelContext";
import { WatchlistProvider } from "./context/Wishlistcontext";
import Home from "./pages/home";
import Tablesearch from "./pages/tablesearch";
import WebHistory from "./pages/webhistory";
import WebHistorytable from "./pages/webhistorytable";
import Polish from "./pages/polish";
import { PolishProvider } from "./context/PolishContext";
import Polishtable from "./pages/polishtable";
import { App as CapacitorApp } from "@capacitor/app";
import Jewel from "./pages/jewel";
import Jeweltable from "./pages/jeweltable";

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchState, setSearchState] = useState({});

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const hideTabBarRoutes = ["/login", "/register", "/forget", "/resetpassword"];

  const isAuthenticatedR = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  function checkAuth() {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const lastBackPress = useRef(0);

  useEffect(() => {
    let backListener;

    const setupBackButtonListener = async () => {
      backListener = await CapacitorApp.addListener("backButton", () => {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          CapacitorApp.exitApp();
        } else {
          lastBackPress.current = now;
          console.log("Press back again to exit");
        }
      });
    };

    setupBackButtonListener();

    return () => {
      if (backListener && typeof backListener.remove === "function") {
        backListener.remove(); // ✅ safely remove
      }
    };
  }, []);

  return (
    <>
      <IonApp>
        <IonReactRouter>
          <SearchProvider>
            <BasketProvider>
              <PolishProvider>
                <JewelProvider>
                  <WatchlistProvider>
                    <IonTabs id="main-content">
                      <IonRouterOutlet>
                        <Route exact path="/">
                          {isAuthenticated ? (
                            <Redirect to="/home" />
                          ) : (
                            <Redirect to="/login" />
                          )}
                        </Route>
                        <Route
                          path="/register"
                          component={Register}
                          exact={true}
                        />
                        {/* <Route path="/webhistory" render={() => <WebHistory></WebHistory>} exact={true} /> */}
                        <Route
                          path="/login"
                          render={() =>
                            isAuthenticated ? (
                              <Redirect to="/home" />
                            ) : (
                              <Login setIsAuthenticated={setIsAuthenticated} />
                            )
                          }
                          exact
                        />

                        {isAuthenticated ? (
                          <>
                            <Route
                              path="/home"
                              render={() => <Home></Home>}
                              exact={true}
                            />
                            <Route
                              path="/login"
                              render={() => <Login />}
                              exact={true}
                            />
                            <Route
                              path="/register"
                              render={() => <Register />}
                              exact={true}
                            />
                            <Route
                              path="/changepass"
                              render={() => <Changepass></Changepass>}
                              exact={true}
                            />
                            <Route
                              path="/webhistory"
                              render={() => <WebHistory></WebHistory>}
                              exact={true}
                            />
                            <Route
                              path="/watchlist"
                              render={() => <Watchlist></Watchlist>}
                              exact={true}
                            />
                            <Route
                              path="/basket"
                              render={() => <Basket></Basket>}
                              exact={true}
                            />
                            <Route
                              path="/tableshow"
                              render={() => <Tablesearch />}
                              exact={true}
                            />
                            <Route
                              path="/polishtableshow"
                              render={() => <Polishtable />}
                              exact={true}
                            />
                            <Route
                              path="/jeweltable"
                              render={() => <Jeweltable />}
                              exact={true}
                            />
                            <Route
                              path="/jewel"
                              render={() => <Jewel />}
                              exact={true}
                            />

                            <Route
                              path="/webhistorytable"
                              render={() => <WebHistorytable></WebHistorytable>}
                              exact={true}
                            />
                            <Route
                              path="/polish"
                              render={() => <Polish></Polish>}
                              exact={true}
                            />
                          </>
                        ) : (
                          <Redirect to="/" />
                        )}
                      </IonRouterOutlet>
                    </IonTabs>
                  </WatchlistProvider>
                </JewelProvider>
              </PolishProvider>
            </BasketProvider>
          </SearchProvider>
        </IonReactRouter>

        {!hideTabBarRoutes.includes(window.location.pathname) && (
          <IonMenu contentId="main-content" side="end">
            <IonHeader>
              <IonToolbar color="#4c3226" style={{ background: "#4c3226" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <IonImg
                      slot="start"
                      src="img/min-logo.svg"
                      style={{
                        height: "35px",
                        margin: "0",
                        marginLeft: "20px",
                      }}
                    ></IonImg>
                  </div>
                  <div>
                    <IonMenuToggle>
                      <IonButton fill="clear">
                        <ion-icon
                          name="close-outline"
                          size="large"
                          style={{ color: "white" }}
                        ></ion-icon>
                      </IonButton>
                    </IonMenuToggle>
                  </div>
                </div>
              </IonToolbar>
            </IonHeader>
            <IonContent class="main-saidebar">
              <IonGrid style={{ marginTop: "6px" }}>
                <IonRow>
                  <IonCol>
                    <div
                      style={{ marginBottom: "10px", marginTop: "7px" }}
                      className="bottom-footer-menu "
                    >
                      <div style={{ marginBottom: "10px", fontSize: "18px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>
                          - Parcel Login{" "}
                        </span>
                      </div>
                      <ion-router-link href="/home">
                        <div
                          className="d-flex"
                          style={{
                            gap: "10px",
                            marginBottom: "10px",
                            marginLeft: "15px",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "1px solid #4c32266b",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#4c3226"
                            class="bi bi-gem"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z" />
                          </svg>
                          <span>Search Stone</span>
                        </div>
                      </ion-router-link>

                      <ion-router-link href="/basket">
                        <div
                          className="d-flex"
                          style={{
                            gap: "10px",
                            marginBottom: "10px",
                            marginLeft: "15px",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "1px solid #4c32266b",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#4c3226"
                            class="bi bi-cart"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                          </svg>
                          <span>Basket</span>
                        </div>
                      </ion-router-link>
                      <ion-router-link href="/watchlist">
                        <div
                          className="d-flex"
                          style={{
                            gap: "10px",
                            marginBottom: "10px",
                            marginLeft: "15px",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "1px solid #4c32266b",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#4c3226"
                            class="bi bi-view-list"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14" />
                          </svg>
                          <span>Watch List</span>
                        </div>
                      </ion-router-link>
                      <ion-router-link href="/changepass">
                        <div
                          className="d-flex"
                          style={{
                            gap: "10px",
                            marginBottom: "10px",
                            marginLeft: "15px",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "1px solid #4c32266b",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#4c3226"
                            class="bi bi-unlock"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
                          </svg>
                          <span>Change Password</span>
                        </div>
                      </ion-router-link>
                    </div>

                    <div
                      style={{ marginBottom: "10px" }}
                      className="bottom-footer-menu "
                    >
                      <div style={{ marginBottom: "10px", fontSize: "18px" }}>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            marginTop: "25px",
                          }}
                        >
                          - Address
                        </span>
                      </div>
                      <div
                        className="d-flex"
                        style={{ gap: "10px", marginBottom: "10px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="#4c3226"
                          class="bi bi-geo-alt"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        <span>
                          22 West 48th St. Suite #1101, New York, NY 10036, USA{" "}
                          <br />
                          <b>(213) 688-8704</b>
                        </span>
                      </div>
                      <div
                        className="d-flex"
                        style={{ gap: "10px", marginBottom: "10px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="#4c3226"
                          class="bi bi-geo-alt"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        <span>
                          550 S. Hill St. Suite #1123, Los Angeles, CA 90013,
                          USA
                          <br />
                          <b>(315) 207-7066</b>
                        </span>
                      </div>
                      <div
                        className="d-flex"
                        style={{ gap: "10px", marginBottom: "10px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="#4c3226"
                          class="bi bi-envelope"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                        </svg>
                        <span>sales@labondiamonds.com</span>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonMenu>
        )}
      </IonApp>
    </>
  );
}

export default App;
