import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class FooterComponent extends NavigationMixin(LightningElement) {

  handleHomePageClick() {
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Home'
      }
    });
  }

  handleBookListClick() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Book__c'
      }
    });
  }
}