import { LightningElement } from 'lwc';
import doLogin from '@salesforce/apex/CustomAuthController.doLogin';

export default class CutomLoginComponent extends LightningElement {

  email;
  password;
  userError;

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  handlePasswordChange(event) {
    this.password = event.target.value;
  }

  handleLogin(event) {
    if (this.email && this.password) {
      event.preventDefault();

      doLogin({username: this.email, password: this.password})
        .then((result) => {
          if(result){
            window.open(result, "_self");
          }
        })
        .catch((error) => {
          this.userError = error;
        });
    }
  }
}