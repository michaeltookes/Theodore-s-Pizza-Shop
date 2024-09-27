public with sharing class tps_PizzaOrderController {
    
    @AuraEnabled
    public static Id createPizzaOrder(Id contactId) {

        System.debug('ContactId: ' + contactId);
        
        tps_Pizza_Order__c newOrder = new tps_Pizza_Order__c();
        newOrder.tps_Contact__c = contactId;
        insert newOrder;
        return newOrder.Id;

    }

    @AuraEnabled
    public static void submitPizzas(Id pizzaOrderId, List<tps_Pizza__c> pizzaList) {
        
        for (tps_Pizza__c pizza : pizzaList) {
            pizza.tps_Pizza_Order__c = pizzaOrderId;
        }
        insert pizzaList;

    }

}