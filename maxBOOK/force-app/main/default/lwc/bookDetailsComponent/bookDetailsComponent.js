import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation'
import getBookDetails from '@salesforce/apex/BookDetailController.getBookDetails';
import { NavigationMixin } from 'lightning/navigation';

export default class BookDetailsComponent extends NavigationMixin(LightningElement) {

  @api bookId;
  formattedPrice = 0;
  bookDetails = {};
  currentPageReference = {};
  bookInStock = true;
  isDataLoaded = false;

  @wire(CurrentPageReference)
  getCurrentPageReference(pageReference) {
    this.currentPageReference = pageReference;
    this.bookId = this.currentPageReference.attributes.recordId;

    this.getBookDetailsJS();
  }
  
  getBookDetailsJS() {
    getBookDetails({
      recordId: this.bookId
    })
    .then(result => {
      this.bookDetails = result;
      this.formattedPrice = this.bookDetails.Price__c.toFixed(2);
      this.bookInStock = this.bookDetails.Quantity__c > 0 ? true : false;
      this.currentPrice = this.formattedPrice;
      this.isDataLoaded = true;
    })
    .catch(error => {
      window.console.log(error);
    });
  }
}