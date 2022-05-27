import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import createOrder from '@salesforce/apex/OrderController.createOrder';

export default class ShoppingCartComponent extends NavigationMixin(LightningElement) {

  booksInCart = [];
  totalCost = 0;
  isGuestUser = isGuest;

  connectedCallback() {
    if (localStorage.getItem('booksInCart')) {
      this.booksInCart = JSON.parse(localStorage.getItem('booksInCart'));
      this.calculateTotalCost();
    } else {
      this.booksInCart = null;
    }
  }

  calculateTotalCost() {
    this.booksInCart.forEach(book => {
      this.totalCost += parseFloat(book.sumPrice);
    });
    this.totalCost = this.totalCost.toFixed(2);
  }

  handleClearClick() {
    this.booksInCart = null;
    localStorage.removeItem("booksInCart");
  }

  handleOrderClick() {

    this.setNewOrder();

    // Empty the cart
    this.booksInCart = null;
    localStorage.removeItem("booksInCart");

    // Navigate to Order Page
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Order__c',
      }
    });
  }

  setNewOrder() {
    createOrder({bookString: JSON.stringify(this.booksInCart)})
    .then((result) => {
      window.console.log('Success! Order Id:', result);
    }).catch((err) => {
      window.console.log('Error while placing order:', err);
    });
  }
}