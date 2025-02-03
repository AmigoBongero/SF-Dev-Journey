@IsTest
private class AccountControllerTest {
    
    @TestSetup
    static void setupData(){
        List<Account> accounts = new List<Account>{
            new Account(Name = 'Account 1', Type = 'Customer', Phone = '1234567890', Website = 'https://test1.com'),
            new Account(Name = 'Account 2', Type = 'Partner', Phone = '9876543210', Website = 'https://test2.com')
        };
        insert accounts;
        
        List<Contact> contacts = new List<Contact>{
            new Contact(FirstName = 'John', LastName = 'Doe', Phone = '1111111111', Email = 'john.doe@test.com', AccountId = accounts[0].Id),
            new Contact(FirstName = 'Jane', LastName = 'Smith', Phone = '2222222222', Email = 'jane.smith@test.com', AccountId = accounts[0].Id),
            new Contact(FirstName = 'Alice', LastName = 'Johnson', Phone = '3333333333', Email = 'alice.johnson@test.com', AccountId = accounts[1].Id)
        };
        insert contacts;
    }
    
    @IsTest
    static void testGetContactsMap() {
        Test.startTest();
        Map<Id, List<AccountController.ContactWrapper>> contacts = AccountController.getContactsMap();
        Test.stopTest();
        
        System.assert(contacts.size() > 0, 'Contacts must be related with Accounts');
        
        for (List<AccountController.ContactWrapper> contactList : contacts.values()) {
            System.assert(contactList.size() > 0, 'Contacts must not be empty');
        }
    }
    
    @IsTest
    static void testGetAccountList() {
        Test.startTest();
        List<AccountController.AccountWrapper> accounts = AccountController.getAccountList();
        Test.stopTest();
        
        System.assert(accounts.size() > 0, 'Accounts must not be empty');
        
        for (AccountController.AccountWrapper acc : accounts) {
            System.assertNotEquals(acc.Id, null, 'ID must not be null');
            System.assertNotEquals(acc.Name, null, 'Name must not be null');
        }
    }
}