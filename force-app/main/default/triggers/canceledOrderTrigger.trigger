trigger canceledOrderTrigger on Order__c (after update) {

  for (Id orderId : Trigger.newMap.keySet()) {
    if (Trigger.oldMap.get(orderId).Status__c != 'Canceled' && Trigger.newMap.get(orderId).Status__c == 'Canceled') {
      CanceledOrderTriggerHandler.restoreQuantity(orderId);
    }
  }
}