import { LightningElement, api } from 'lwc';

export default class BookTile extends LightningElement {

  @api book;
  formattedPrice;

  connectedCallback() {
    this.formattedPrice = this.book.Price__c.toFixed(2);
  }

  handleOpenDetailsClick() {
    const selectEvent = new CustomEvent('bookview', {
      detail: this.book.Id
    });
    this.dispatchEvent(selectEvent);
  }
}