import { LightningElement, api, wire } from 'lwc';
import getOrderBooks from '@salesforce/apex/OrderDetailController.getOrderBooks';
import { CurrentPageReference } from 'lightning/navigation'


export default class OrderDetailsComponent extends LightningElement {

  @api orderId;
  orderBooks;
  totalPrice = 0;
  currentPageReference;

  @wire(CurrentPageReference)
  getCurrentPageReference(pageReference) {
    this.currentPageReference = pageReference;
    this.orderId = this.currentPageReference.attributes.recordId;

    this.getOrderBooksJS();
  }
  
  getOrderBooksJS() {
    getOrderBooks({
      recordId: this.orderId
    })
    .then(result => {
      this.orderBooks = result;

      this.orderBooks.forEach(book => {
        this.totalPrice += (book.Book__r.Price__c * book.Quantity__c);
      });
      this.totalPrice = this.totalPrice.toFixed(2);
    })
    .catch(error => {
      window.console.log(error);
    });
  }
}