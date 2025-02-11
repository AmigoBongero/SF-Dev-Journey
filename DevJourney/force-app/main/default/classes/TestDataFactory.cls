@IsTest
public class TestDataFactory {
    
    public static List<Account> createAccounts(Integer numAccounts, Boolean isInserted) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < numAccounts; i++) {
            Account a = new Account(Name = 'TestAccount' + i);
            accounts.add(a);
        }
        if (isInserted) {
            insert accounts;
        }
        return accounts;
    }
    
    public static List<Contact> createAccountsWithRelatedContacts(Integer numAccounts, Integer numContacts, Boolean isInserted) {
        List<Contact> contacts = new List<Contact>();
        List<Account> accounts = createAccounts(numAccounts, true);
        
        for (Account account : accounts) {
            for(Integer i = 0; i < numContacts; i++) {
                contacts.add(new Contact(
                        LastName = 'Contact' + i,	
                        AccountId = account.Id
                ));
            }
        }  
        if (isInserted) {
            insert contacts;
        }
        return contacts;
    }
}