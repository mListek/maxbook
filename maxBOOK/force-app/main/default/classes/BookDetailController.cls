public without sharing class BookDetailController {

    @AuraEnabled(cacheable=true)
    public static Book__c getBookDetails(String recordId){

        Book__c[] bookRecords = [
            SELECT Id, Name, ISBN__c, Price__c, Author__c,
            Category__c, Cover_Image__c, Description__c,
            isAvailable__c, Quantity__c, Release_Date__c, Publisher__c
            FROM Book__c
            WHERE Id = :recordId
            WITH SECURITY_ENFORCED
        ];

        if (bookRecords.size() > 0) {
            return bookRecords[0];
        }
        
        return null;
    }
}
