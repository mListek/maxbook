public with sharing class CanceledOrderTriggerHandler {
    
    public static void restoreQuantity(String orderId) {

        List<BookOrderAssociation__c> boList = new List<BookOrderAssociation__c>();
        List<Book__c> bookList = new List<Book__c>();
        List<Id> bookIds = new List<Id>();

        boList = [SELECT Quantity__c, Book__c, Book__r.Id FROM BookOrderAssociation__c WHERE Order__c = :orderId];
        
        for (BookOrderAssociation__c bo : boList) {
            bookIds.add(bo.Book__r.Id);
        }

        bookList = [SELECT Id, Quantity__c, Sales_Record__c FROM Book__c WHERE Id IN :bookIds];

        for (Integer i = 0; i < bookList.size(); i++) {
            bookList[i].Quantity__c += boList[i].Quantity__c;
            bookList[i].Sales_Record__c -= boList[i].Quantity__c;
        }

        update bookList;
    }
}
