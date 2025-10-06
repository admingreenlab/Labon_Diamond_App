import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonSearchbar
} from '@ionic/react';
import Header from './head';
import Bottom from './bottomtab';

const LibraryPage = ({isAuthenticated}) => (
  <>
    <Header />
    <IonContent>
      <div >
        <IonCard style={{
          marginBottom: '100px'
        }}>
          <IonCardHeader className='maindheadider' style={{ backgraount: '#a97550' }}>
            <IonCardTitle> Search </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingLeft: '0', paddingRight: '0', height: '100vh' }}>
            <IonToolbar>
              <IonSearchbar style={{ marginTop: "20px" }}></IonSearchbar>
            </IonToolbar>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
    <Bottom isAuthenticated={isAuthenticated}/>
  </>
);

export default LibraryPage;

// import React from 'react';
// import {
//   IonCard,
//   IonCardContent,
//   IonCardHeader,
//   IonCardSubtitle,
//   IonCardTitle,
//   IonItem,
//   IonLabel,
//   IonList,
//   IonThumbnail,
// } from '@ionic/react';

// import './main.css';

// function Example() {
//   return (
//     <IonCard>
//       <IonCardHeader>
//         <IonCardTitle>Card Title</IonCardTitle>
//         <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
//       </IonCardHeader>
//       <IonCardContent>
//         <IonList>
//           <IonItem>
//             <IonThumbnail slot="start">
//               <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
//             </IonThumbnail>
//             <IonLabel>Item</IonLabel>
//           </IonItem>

//           <IonItem>
//             <IonThumbnail slot="start">
//               <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
//             </IonThumbnail>
//             <IonLabel>Item</IonLabel>
//           </IonItem>

//           <IonItem>
//             <IonThumbnail slot="start">
//               <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
//             </IonThumbnail>
//             <IonLabel>Item</IonLabel>
//           </IonItem>

//           <IonItem lines="none">
//             <IonThumbnail slot="start">
//               <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
//             </IonThumbnail>
//             <IonLabel>Item</IonLabel>
//           </IonItem>
//         </IonList>
//       </IonCardContent>
//     </IonCard>
//   );
// }
// export default Example;