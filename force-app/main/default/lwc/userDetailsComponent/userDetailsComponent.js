import userId from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import PHONE_FIELD from '@salesforce/schema/User.Phone';
import STREET_FIELD from '@salesforce/schema/User.Street__c';
import POSTAL_FIELD from '@salesforce/schema/User.Postal_Code__c';
import CITY_FIELD from '@salesforce/schema/User.City__c';
import { LightningElement } from 'lwc';


const fields = [
  NAME_FIELD,
  PHONE_FIELD, STREET_FIELD,
  POSTAL_FIELD, CITY_FIELD
];

export default class UserDetailsComponent extends LightningElement {

  currentUserId = userId;
  fields = fields;

}