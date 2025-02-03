public with sharing class AccountController {

    //Return Map, where key is AccountId, value is related Contacts list
    public static Map<Id, List<ContactWrapper>> getContactsMap() {
        List<Contact> contacts = [
            SELECT Id, Name, Phone, Email, AccountId 
            FROM Contact
            ORDER BY Name
            LIMIT 10
        ];
        
        Map<Id, List<ContactWrapper>> contactsMap = new Map<Id, List<ContactWrapper>>();
        
        for (Contact con : contacts) {
            if (con.AccountId != null) {
                if (!contactsMap.containsKey(con.AccountId)) {
                    contactsMap.put(con.AccountId, new List<ContactWrapper>());
                }
                contactsMap.get(con.AccountId).add(new ContactWrapper(con.Id, con.Name, con.Phone, con.Email));
            }
        }
        return contactsMap;
    }

    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccountList() {
        List<Account> accounts = [
            SELECT Id, Name, Type, Phone, Website 
            FROM Account
            ORDER BY Name
            LIMIT 50
        ];
        
        Map<Id, List<ContactWrapper>> contactsMap = getContactsMap();
        List<AccountWrapper> result = new List<AccountWrapper>();

        for (Account acc : accounts) {
            List<ContactWrapper> contactsList = contactsMap.containsKey(acc.Id)
                ? contactsMap.get(acc.Id)
                : new List<ContactWrapper>();
            
            result.add(new AccountWrapper(acc.Id, acc.Name, acc.Type, acc.Phone, acc.Website, contactsList));
        }
        
        return result;
    }
    
    public class AccountWrapper {
        @AuraEnabled public String Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Type;
        @AuraEnabled public String Phone;
        @AuraEnabled public String Website;
        @AuraEnabled public List<ContactWrapper> Contacts;
        
        public AccountWrapper(String id, String name, String type, String phone, String website, List<ContactWrapper> contacts) {
            this.Id = id;
            this.Name = name;
            this.Type = type;
            this.Phone = phone;
            this.Website = website;
            this.Contacts = contacts;
        }
    }
    
    public class ContactWrapper {
        @AuraEnabled public String Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Phone;
        @AuraEnabled public String Email;
        
        public ContactWrapper(String id, String name, String phone, String email) {
            this.Id = id;
            this.Name = name;
            this.Phone = phone;
            this.Email = email;
        }
    }
}