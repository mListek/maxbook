import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {
  currentPage = 1;
  books;
  @api recordSize = 10;
  totalPages = 0;

  @api get records(){
    return this.visibleRecords;
  }
  
  set records(data){
    if(data){ 
      this.books = data;
      this.totalPages = Math.ceil(data.length/this.recordSize);
      this.updateRecords();
    }
  }

  get disablePrevious(){ 
    return this.currentPage <= 1;
  }
  get disableNext(){ 
    return this.currentPage >= this.totalPages;
  }

  previousHandler(){ 
    if(this.currentPage > 1){
      this.currentPage -= 1;
      this.updateRecords();
    }
  }

  nextHandler(){
    if(this.currentPage < this.totalPages){
      this.currentPage = this.currentPage + 1;
      this.updateRecords();
    }
  }

  updateRecords(){
    const start = (this.currentPage - 1) * this.recordSize;
    const end = this.recordSize * this.currentPage;
    this.visibleRecords = this.books.slice(start, end);
    this.dispatchEvent(new CustomEvent('update',{ 
      detail:{ 
        records: this.visibleRecords
      }
    }));
  }
}