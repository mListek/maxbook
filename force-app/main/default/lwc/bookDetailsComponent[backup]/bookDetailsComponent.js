import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation'
import getBookDetails from '@salesforce/apex/BookDetailController.getBookDetails';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';


export default class BookDetailsComponent extends NavigationMixin(LightningElement) {

  @api bookId;
  __formattedPrice = 0;
  __bookDetails = {};
  __currentPageReference = {};
  bookInStock = true;
  quantity = 1;
  isMinusDisabled = true;
  isPlusDisabled = false;
  currentPrice;

  @wire(CurrentPageReference)
  getCurrentPageReference(pageReference) {
    this.__currentPageReference = pageReference;
    this.bookId = this.__currentPageReference.attributes.recordId;

    this.getBookDetailsJS();
  }
  
  getBookDetailsJS() {
    getBookDetails({
      recordId: this.bookId
    })
    .then(result => {
      this.__bookDetails = result;
      this.__formattedPrice = this.__bookDetails.Price__c.toFixed(2);
      this.bookInStock = this.__bookDetails.Quantity__c > 0 ? true: false;
      this.currentPrice = this.__formattedPrice;
    })
    .catch(error => {
      window.console.log(error);
    });
  }

  handleInputChange(event) {
    
    if (event.target.value < 1) {
      this.quantity = 1;
      this.checkQuantity();
    } else if (event.target.value > this.__bookDetails.Quantity__c) {
      this.quantity = this.__bookDetails.Quantity__c;
      this.checkQuantity();
    } else {
      this.quantity = event.target.value;
      this.checkQuantity();
    }
    this.currentPrice = this.__bookDetails.Price__c * this.quantity;
  }

  handleMinusClick() {
    this.quantity--;
    this.checkQuantity();
    this.currentPrice = this.__bookDetails.Price__c * this.quantity;
  }

  handlePlusClick() {
    this.quantity++;
    this.checkQuantity();
    this.currentPrice = this.__bookDetails.Price__c * this.quantity;
  }

  checkQuantity() {
    this.quantity >= this.__bookDetails.Quantity__c ? this.isPlusDisabled = true : this.isPlusDisabled = false;
    this.quantity <= 1 ? this.isMinusDisabled = true : this.isMinusDisabled = false;
  }

  handleAddToCartClick() {

    let booksInCart = [];
    let detailsLink = basePath + '/book/' + this.bookId;
    let existingEntries = JSON.parse(localStorage.getItem("booksInCart"));

    let book = {
      id: this.bookId,
      title: this.__bookDetails.Name,
      quantity: this.quantity,
      sumPrice: this.currentPrice,
      cover: this.__bookDetails.Cover_Image__c,
      link: detailsLink
    };

    booksInCart.push(book);

    if(existingEntries != null) {
      booksInCart = booksInCart.concat(existingEntries);
    }

    localStorage.setItem("booksInCart", JSON.stringify(booksInCart));
    
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Shopping_Cart__c'
      }
    });
  }
}