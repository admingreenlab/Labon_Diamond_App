import React, { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { heartOutline, heart } from "ionicons/icons";

const LikeButton = () => {
    const [liked, setLiked] = useState(false);

    const handleLikeToggle = () => {
        setLiked(!liked);
    };

    return (
        <IonButton
            color={liked ? "danger" : "medium"}
            fill="clear"
            onClick={handleLikeToggle}
        >
            <IonIcon slot="icon-only" size="large" icon={liked ? heart : heartOutline} />
        </IonButton>
//         <IonApp>
//   <IonReactRouter>
//     <SearchProvider>
//       <BasketProvider>
//         <PolishProvider>
//           <WatchlistProvider>

//             <IonRouterOutlet id="main" swipeGesture={true} animated={true}>
              
        
//               <Route exact path="/">
//                 {isAuthenticated ? <Redirect to="/home" /> : <Redirect to="/login" />}
//               </Route>
//               <Route exact path="/login">
//                 {isAuthenticated ? (
//                   <Redirect to="/home" />
//                 ) : (
//                   <Login setIsAuthenticated={setIsAuthenticated} />
//                 )}
//               </Route>
//               <Route exact path="/register" component={Register} />

//               {isAuthenticated ? (
//                 <>
//                   <Route exact path="/home" component={Home} />
//                   <Route exact path="/watchlist" component={Watchlist} />
//                   <Route exact path="/basket" component={Basket} />
//                   <Route exact path="/webhistory" component={WebHistory} />
      
//                   <Route exact path="/changepass" component={Changepass} />
//                   <Route exact path="/tableshow" component={Tablesearch} />
//                   <Route exact path="/polishtableshow" component={Polishtable} />
//                   <Route exact path="/webhistorytable" component={WebHistorytable} />
//                   <Route exact path="/polish" component={Polish} />
//                 </>
//               ) : (
//                 <Redirect to="/" />
//               )}
//             </IonRouterOutlet>
           
//           </WatchlistProvider>
//         </PolishProvider>
//       </BasketProvider>
//     </SearchProvider>
//   </IonReactRouter>
// </IonApp>
 
    );
};

export default LikeButton;
