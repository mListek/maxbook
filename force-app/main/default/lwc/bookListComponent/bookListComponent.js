import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchBooks from '@salesforce/apex/BookListController.searchBooks';

const categories = ['Adventure', 'Art', 'Children\'s',
                    'Cooking', 'Fantasy', 'Health',
                    'History', 'Other', 'Romance',
                    'Science Fiction', 'Thriller', 'Travel'];

const sortOptions = [
  { label: 'Title', value: 'Name DESC' },
  { label: 'Popularity', value: 'Sales_Record__c DESC' },
  { label: 'Lowest Price', value: 'Price__c ASC' },
  { label: 'Highest Price', value: 'Price__c DESC' }
];


export default class BookListComponent extends NavigationMixin(LightningElement) {

  searchTerm = '';
  chosenCategory = '';
  categories = categories;
  visibleBooks;
  orderBy = 'Name DESC';
  sortOptions = sortOptions;

  @wire(searchBooks, {searchTerm: '$searchTerm', category: '$chosenCategory', orderBy: '$orderBy'})
  books;

  handleSearchTermChange(event) {
    window.clearTimeout(this.delayTimeout);
    const searchTerm = event.target.value;

    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
    }, 300);
  }

  get hasResults() {
    return (this.books.data.length > 0);
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

  handleCategoryClick(event) {
    if (this.chosenCategory == event.target.value) {
      this.chosenCategory = '';
    } else {
      this.chosenCategory = event.target.value;
    }
  }

  handleClearCategory() {
    this.chosenCategory = '';
  }

  updateBookHandler(event) {
    this.visibleBooks = [...event.detail.records];
  }

  handleSortingChange(event) {
    this.orderBy = event.detail.value;
  }
}