public with sharing class tps_PizzaOrderController {
    
    @AuraEnabled
    public static Id createPizzaOrder() {

        tps_Pizza_Order__c newOrder = new tps_Pizza_Order__c();
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