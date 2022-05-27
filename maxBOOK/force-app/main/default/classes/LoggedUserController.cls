public with sharing class LoggedUserController {

    @AuraEnabled
    public static User getUserDetails(){
        User u = [
            SELECT Id, Name, City__c, Phone, Postal_Code__c,
            Email, Street__c
            FROM User WHERE id =: UserInfo.getUserId()];

        return u;
    }
}
