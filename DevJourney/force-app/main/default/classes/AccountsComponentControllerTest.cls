@IsTest
private class AccountsComponentControllerTest {

    @IsTest
    static void testGetMyAccounts() {
        Account testAccount = new Account(Name = 'Test Account', Industry = 'Technology', Phone = '123-456-7890');
        insert testAccount;

        System.runAs(new User(Id = UserInfo.getUserId())) {
            Test.startTest();
            List<Account> myAccounts = AccountsComponentController.getMyAccounts();
            Test.stopTest();

            System.assertEquals(1, myAccounts.size(), 'Should have 1 account');
            System.assertEquals(testAccount.Id, myAccounts[0].Id, 'Did not get the right account');
        }
    }

    @IsTest
    static void testGetRecentlyViewedAccounts() {
        Account testAccount = new Account(Name = 'Test Account', Industry = 'Technology', Phone = '123-456-7890');
        insert testAccount;

        System.runAs(new User(Id = UserInfo.getUserId())) {
            Test.startTest();
            List<Account> recentlyViewedAccounts = AccountsComponentController.getRecentlyViewedAccounts();
            Test.stopTest();

            System.assertEquals(1, recentlyViewedAccounts.size(), 'Should have 1 account');
        }
    }

}