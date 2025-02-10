@IsTest
private class AccountsComponentControllerTest {
    
    @TestSetup
    static void setup() {
        TestDataFactory.createAccountsWithRelatedContacts(3, 2);
    }

    @IsTest
    static void getAccountListTest() {
        Test.startTest();
        List<Account> accounts = AccountsComponentController.getAccountList();
        Test.stopTest();

        System.assertNotEquals(null, accounts, 'Account list should not be null');
        System.assertEquals(3, accounts.size(), 'Should return 3 accounts');
        System.assertEquals(2, accounts[0].Contacts.size(), 'First account should have 2 contacts');
    }
    
}