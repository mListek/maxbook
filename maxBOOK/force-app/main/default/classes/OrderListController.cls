public without sharing class OrderListController {
    
    @AuraEnabled(cacheable=true)
    public static List<Order__c> getUserOrders(String userId){
        
        List<Order__c> orderList = new List<Order__c>();

        try {
            orderList = [
                SELECT Id, Name, Order_Date__c, Status__c
                FROM Order__c
                WHERE User__r.Id = :userId
                WITH SECURITY_ENFORCED
                ORDER BY Name DESC
            ];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return orderList;
    }
}
