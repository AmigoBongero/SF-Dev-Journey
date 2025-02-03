@IsTest
private class AccountsComponentControllerTest {

    @IsTest
    static void testGetMyAccounts() {
        // Prepare test data
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            Account testAccount = new Account(
                    Name = 'Test Account' + i
            );
            testAccounts.add(testAccount);
        }
        insert testAccounts;

        // Execute
        Test.startTest();
        List<Account> myAccounts = AccountsComponentController.getMyAccounts();
        Test.stopTest();

        // Assert results
        Assert.areEqual(5, myAccounts.size(), 'Should have 5 account');
    }

    @IsTest
    static void testGetRecentlyViewedAccounts() {
        // Prepare test data
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            Account testAccount = new Account(
                    Name = 'Test Account' + i
            );
            testAccounts.add(testAccount);
        }
        insert testAccounts;

        // Execute
        Test.startTest();
        List<Account> recentlyViewedAccounts = AccountsComponentController.getRecentlyViewedAccounts();
        Test.stopTest();

        // Assert results
        Assert.areEqual(5, recentlyViewedAccounts.size(), 'Should have 5 account');
    }

}