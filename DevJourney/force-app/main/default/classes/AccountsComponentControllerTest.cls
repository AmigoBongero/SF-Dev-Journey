@IsTest
private class AccountsComponentControllerTest {
    
    @TestSetup
    static void setup() {
        TestDataFactory.createAccountsWithRelatedContacts(3, 2);
        TestDataFactory.createAccounts(5);
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
    
    @IsTest
    static void getMyAccountsTest() {
        // Execute
        Test.startTest();
        List<Account> myAccounts = AccountsComponentController.getMyAccounts();
        Test.stopTest();

        // Assert results
        Assert.areEqual(5, myAccounts.size(), 'Should have 5 accounts');
    }

    @IsTest
    static void getRecentlyViewedAccountsTest() {
        // Execute
        Test.startTest();
        List<Account> recentlyViewedAccounts = AccountsComponentController.getRecentlyViewedAccounts();
        Test.stopTest();

        // Assert results
        List<Account> expectedRecentlyViewedAccounts = [
            SELECT Id
            FROM   Account
            WHERE  LastViewedDate != NULL
        ];
        Assert.areEqual(expectedRecentlyViewedAccounts.size(), recentlyViewedAccounts.size());
    }

}