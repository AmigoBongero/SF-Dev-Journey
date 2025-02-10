@IsTest
public class TestDataFactory {
    
    public static List<Account> createAccounts(Integer numAccounts) {
        List<Account> accts = new List<Account>();
        for(Integer i = 0; i < numAccounts; i++) {
            Account a = new Account(Name='TestAccount' + i);
            accts.add(a);
        }
        insert accts;
        return accts;
    }
    
    public static List<Contact> createAccountsWithRelatedContacts(Integer numAccounts, Integer numContacts) {
        List<Contact> cont = new List<Contact>();
        List<Account> accts = createAccounts(numAccounts);
        
        for(Integer j = 0; j < numAccounts; j++) {
            for(Integer k = 0; k < numContacts; k++) {
                cont.add(new Contact(LastName='Contact' + k,	
                AccountId=accts[j].Id));
            }
        }  
        insert cont;
        return cont;
    }
}