declare module "@salesforce/apex/CustomAuthController.userAlreadyExists" {
  export default function userAlreadyExists(param: {email: any}): Promise<any>;
}
declare module "@salesforce/apex/CustomAuthController.registerUser" {
  export default function registerUser(param: {firstName: any, lastName: any, email: any, password: any, confirmPassword: any, startUrl: any}): Promise<any>;
}
declare module "@salesforce/apex/CustomAuthController.doLogin" {
  export default function doLogin(param: {username: any, password: any, startUrl: any}): Promise<any>;
}
