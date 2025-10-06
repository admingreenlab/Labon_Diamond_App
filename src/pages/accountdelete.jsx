import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  useIonAlert,
  useIonRouter
} from '@ionic/react';
import Header from './head';
import { text, warningOutline } from 'ionicons/icons';
import './AccountDelete.css';
import Axios from '../service/jwtAuth';

export function AccountDelete() {
  const [confirmUnderstand, setConfirmUnderstand] = useState(false);
  const [confirmBackup, setConfirmBackup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [presentAlert] = useIonAlert();
  const router = useIonRouter();

  const canDelete = () => {
    return confirmUnderstand && confirmBackup && !isDeleting;
  };

  const showDeleteConfirm = () => {
    if (!canDelete()) return;

    presentAlert({
      header: 'Confirm Deletion',
      message: 'Are you absolutely sure you want to delete your account? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => deleteAccount()
        }
      ]
    });
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    
    try {
        const response = await Axios.delete(`/user/removeuser`);
          
          if (response.status !== 200) {
            console.log('failed')
            throw new Error('Failed to delete account');
          }
          
          // Clear local data
          localStorage.clear();
          sessionStorage.clear();
      console.log('account deleted success')
      
      window.location.href = '/login'
    } catch (error) {
      console.error('Account deletion failed:', error);
      presentAlert({
        header: 'Deletion Failed',
        message: 'There was an error deleting your account. Please try again later.',
        buttons: ['OK']
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Delete Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Header/>
      
      <IonContent className="ion-padding">
        <div className="delete-account-container">
          <IonIcon icon={warningOutline} className="warning-icon" />
          
          <h2>Delete Your Account</h2>
          
          <p className="warning-message">
            This action is permanent and cannot be undone. All your data will be erased immediately.
          </p>
          
          <IonList>
            <IonItem lines="none">
              <IonLabel className="ion-text-wrap">
                <p>By deleting your account, you will lose:</p>
                <ul>
                  <li>All your personal information</li>
                  <li>Your saved preferences</li>
                </ul>
              </IonLabel>
            </IonItem>
            
            <IonItem lines="none">
              <IonCheckbox 
                checked={confirmUnderstand}
                onIonChange={e => setConfirmUnderstand(e.detail.checked)}
                slot="start" 
              />
              <IonLabel className="ion-text-wrap">
                <p style={{color:'black'}}>I understand that this action cannot be undone</p>
              </IonLabel>
            </IonItem>
            
            <IonItem lines="none">
              <IonCheckbox 
                checked={confirmBackup}
                onIonChange={e => setConfirmBackup(e.detail.checked)}
                slot="start" 
              />
              <IonLabel className="ion-text-wrap">
              <p style={{color:'black'}}>I have backed up any important data</p>
              </IonLabel>
            </IonItem>
          </IonList>
          
          <IonButton 
            expand="block" 
            color="danger" 
            onClick={showDeleteConfirm} 
            disabled={!canDelete()}
            className="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account Permanently'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}