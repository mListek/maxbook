import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import getUserDetails from '@salesforce/apex/LoggedUserController.getUserDetails';

export default class LoggedUserComponent extends NavigationMixin(LightningElement) {

  username = '';
  isGuestUser = isGuest;

  connectedCallback() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    getUserDetails()
      .then((result) => {
        this.username = result.Name;
      }).catch((error) => {
        this.errors = error;
        window.console.log("ERROR: " + JSON.stringify(error));
      });
  }
  
  handleLoginClick() {

    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Login'
      }
    });
  }

  handleDetailsClick() {
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Details__c'
      }
    });
  }
}