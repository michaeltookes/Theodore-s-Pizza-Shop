public with sharing class tps_CustomerFinder {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> lookupByEmail(String email) {
        List<Contact> customer = [SELECT Id, Name, Phone, Email, MailingStreet, MailingCity, MailingState, MailingPostalCode, AccountId
                                  FROM Contact
                                  WHERE Email =: email LIMIT 1];
        return customer;
    } 
    
}