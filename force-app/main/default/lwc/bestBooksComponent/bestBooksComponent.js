import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getTopBooks from '@salesforce/apex/BookListController.getTopBooks';

export default class BookListComponent extends NavigationMixin(LightningElement) {

  books = [];
  error;
  currentBooks = [];
  currentStartIndex = 0;
  interval;

  connectedCallback() {
    this.getBooks();
  }

  getBooks() {
    getTopBooks()
    .then((result) => {
      this.books = result;
      this.currentBooks = this.books.slice(this.currentStartIndex, this.currentStartIndex + 3);
      
      this.interval = setInterval(() => {
        this.handleForward();
      }, 4000);

    }).catch((err) => {
      this.error = err.body.message;
    });
  }

  handleMouseEnter() {
    clearInterval(this.interval);
  }

  handleMouseLeave() {
    this.interval = setInterval(() => {
      this.handleForward();
    }, 4000);
  }

  handleBack() {
    this.currentBooks = [];
    this.currentStartIndex--;

    if (this.currentStartIndex < 0) {
      this.currentStartIndex = this.books.length - 1;
    }

    for (let i = 0; i < 3; i++) {
      let index = (this.currentStartIndex + i) % this.books.length;
      this.currentBooks.push(this.books[index]);
    }
  }

  handleForward() {
    this.currentBooks = [];
    this.currentStartIndex++;

    if (this.currentStartIndex > this.books.length - 1) {
      this.currentStartIndex = 0;
    }

    for (let i = 0; i < 3; i++) {
      let index = (this.currentStartIndex + i) % this.books.length;
      this.currentBooks.push(this.books[index]);
    }
  }

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