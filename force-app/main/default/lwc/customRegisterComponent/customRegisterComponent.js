import { LightningElement } from 'lwc';
import userAlreadyExists from '@salesforce/apex/CustomAuthController.userAlreadyExists';
import registerUser from '@salesforce/apex/CustomAuthController.registerUser';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomRegisterComponent extends NavigationMixin(LightningElement) {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showSpinner = false;
  userError;

  handleRegister(event) {
    if (this.firstName && this.lastName && this.email && this.password && this.confirmPassword) {

      this.showSpinner = true;

      event.preventDefault();

      userAlreadyExists({ email: this.email })
        .then((result) => {
          if (result) {
            this.userError = 'User with this email already exists';
          } else {
            registerUser({
              firstName: this.firstName, lastName: this.lastName, email: this.email,
              password: this.password, confirmPassword: this.confirmPassword
            })
              .then((result) => {
                console.log('result: ', result);
                if (result) {
                  window.open(result, "_self");
                }
              })
              .catch((error) => {
                this.userError = error.body.message;
              });
          }
        })
        .catch((error) => {
          console.log('outer error: ', error.body.message);
        })
        .finally(() => {
          this.showSpinner = false;
        });
    }
  }

  handleFirstNameChange(event) {

    this.firstName = event.target.value;
  }

  handleLastNameChange(event) {

    this.lastName = event.target.value;
  }

  handleEmailChange(event) {

    this.email = event.target.value;
  }

  handlePasswordChange(event) {

    this.password = event.target.value;
  }

  handleConfirmPasswordChange(event) {

    this.confirmPassword = event.target.value;
  }
}