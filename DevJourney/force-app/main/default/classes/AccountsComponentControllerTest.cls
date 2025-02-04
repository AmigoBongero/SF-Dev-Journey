@IsTest
private class AccountsComponentControllerTest {

    @TestSetup
    static void loadTestData() {
        TestDataFactory.createAccounts(5);
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
        Assert.areEqual(0, recentlyViewedAccounts.size(), 'Should have 0 accounts');
    }

}