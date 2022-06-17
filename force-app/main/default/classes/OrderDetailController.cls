public with sharing class OrderDetailController {
    
    @AuraEnabled
    public static List<BookOrderAssociation__c> getOrderBooks(String recordId){
        
        List<BookOrderAssociation__c> books = new List<BookOrderAssociation__c>();

        books = [
            SELECT Id, Name, Book__c, Book__r.Name, Book__r.Cover_Image__c, Book__r.Price__c, Quantity__c
            FROM BookOrderAssociation__c
            WHERE Order__c = :recordId
            WITH SECURITY_ENFORCED
        ];

        return books;
    }
}
