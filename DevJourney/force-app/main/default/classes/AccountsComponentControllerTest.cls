@IsTest
private class AccountsComponentControllerTest {
    
    @TestSetup
    static void setup() {
        TestDataFactory.createAccounts(5, true);
    }

    @IsTest
    static void getAccountListTest() {
        // Execute
        Test.startTest();
        List<Contact> contacts = TestDataFactory.createAccountsWithRelatedContacts(3, 2, true);
        List<Account> accounts = AccountsComponentController.getAccountsWithRelatedContacts();
        Test.stopTest();

        // Assert results
        Assert.areEqual(2, accounts[0].Contacts.size(), 'For fist account contacts size should be 2');
        Assert.areEqual(2, accounts[1].Contacts.size(), 'For seconds account contacts size should be 2');
        Assert.areEqual(2, accounts[2].Contacts.size(), 'For third account contacts size should be 2');
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