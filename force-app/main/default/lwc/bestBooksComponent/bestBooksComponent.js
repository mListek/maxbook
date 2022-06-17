import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getTopBooks from '@salesforce/apex/BookListController.getTopBooks';

export default class BookListComponent extends NavigationMixin(LightningElement) {

  @wire(getTopBooks)
  books;

  handleBookView(event) {
    const bookId = event.detail;

    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: bookId,
        objectApiName: 'Book__c',
        actionName: 'view'
      }
    });
  }
}