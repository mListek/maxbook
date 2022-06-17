import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class QuantityChangeComponent extends NavigationMixin(LightningElement) {

  @api book;
  booksPreviouslyInCart = {};
  currentPrice = 0.0;
  quantity = 1;
  isBookAlreadyInCart = false;
  isMinusDisabled = true;
  isPlusDisabled = false;

  connectedCallback() {
    if (localStorage.getItem('booksInCart')) {
      this.booksPreviouslyInCart = JSON.parse(localStorage.getItem('booksInCart'));

      if (this.booksPreviouslyInCart.some(bookDetails => bookDetails.id === this.book.Id)) {
        this.isBookAlreadyInCart = true;
      }

    } else {
      this.booksPreviouslyInCart = null;
    }
  }

  renderedCallback() {
    this.currentPrice = (this.book.Price__c * this.quantity).toFixed(2);
    this.checkQuantity();
  }

  handleMinusClick() {
    this.quantity--;
  }

  handlePlusClick() {
    this.quantity++;
  }

  checkQuantity() {
    this.quantity >= this.book.Quantity__c ? this.isPlusDisabled = true : this.isPlusDisabled = false;
    this.quantity <= 1 ? this.isMinusDisabled = true : this.isMinusDisabled = false;
  }

  handleAddToCartClick() {

    let booksToCart = [];
    let detailsLink = basePath + '/book/' + this.book.Id;

    let tempBook = {
      id: this.book.Id,
      title: this.book.Name,
      quantity: this.quantity,
      price: this.book.Price__c,
      sumPrice: this.currentPrice,
      coverImage: this.book.Cover_Image__c,
      detailsLink: detailsLink
    };

    booksToCart.push(tempBook);

    if(this.booksPreviouslyInCart != null) {
      booksToCart = booksToCart.concat(this.booksPreviouslyInCart);
    }

    localStorage.setItem("booksInCart", JSON.stringify(booksToCart));
    
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Shopping_Cart__c'
      }
    });
  }
}