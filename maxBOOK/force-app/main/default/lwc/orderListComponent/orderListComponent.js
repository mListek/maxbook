import { LightningElement, wire } from 'lwc';
import userId from '@salesforce/user/Id';
import getUserOrders from '@salesforce/apex/OrderListController.getUserOrders';
import { NavigationMixin } from 'lightning/navigation';

const columns = [
  { label: 'Order Number', fieldName: 'Name' },
  { label: 'Order Id', fieldName: 'Id' },
  { label: 'Status', fieldName: 'Status__c' },
  { label: 'Date', fieldName: 'Order_Date__c', type: 'date' },
];

export default class OrderListComponent extends NavigationMixin(LightningElement) {
  
  columns = columns;
  currentOrders = [];
  pastOrders = [];
  errors;
  currentUserId = userId;

  @wire(getUserOrders, { userId: '$currentUserId' })
  wiredData({ error, data }) {
    if (data) {
      this.currentOrders = data.filter(order => {
        return (order.Status__c == 'New' || order.Status__c == 'In-Progress');
      });
      this.pastOrders = data.filter(order => {
        return (order.Status__c == 'Canceled' || order.Status__c == 'Completed');
      });
    } else if (error) {
      this.errors = error;
      console.error('Error:', error);
    }
  }

  handleOrderClick(event) {
    
    const orderId = event.target.value;

    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: orderId,
        objectApiName: 'Order__c',
        actionName: 'view'
      }
    });
  }

  get hasCurrentResults() {
    return (this.currentOrders.length > 0);
  }

  get hasPastResults() {
    return (this.pastOrders.length > 0);
  }
}