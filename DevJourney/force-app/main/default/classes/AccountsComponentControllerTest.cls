@IsTest
private class AccountsComponentControllerTest {
    
    @TestSetup
    static void setup() {
        TestDataFactory.createAccounts(5, true);
    }

    @IsTest
    static void getAccountsWithRelatedContactsTest() {
        // Prepare test data
        TestDataFactory.createAccountsWithRelatedContacts(3, 2, true);

        // Execute
        Test.startTest();
        List<Account> accounts = AccountsComponentController.getAccountsWithRelatedContacts();
        Test.stopTest();

        // Assert results
        Boolean containsContacts = false;
        for (Account acc : accounts) {
            if (acc.Contacts.size() != 0) {
                containsContacts = true;
                break;
            }
        }
        Assert.isTrue(containsContacts, 'At least one account should have contacts');
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
        Assert.areEqual(expectedRecentlyViewedAccounts.size(), recentlyViewedAccounts.size(), 'Should have 5 recently viewed accounts');
    }

    @IsTest
    static void testGetExpenses() {
        // Prepare test data
        List<Id> accountIds = TestDataFactory.createAccountsIds(1);
        List<Id> casePartyIds = TestDataFactory.createCasePartiesIds(accountIds);
        TestDataFactory.createExpensesWithCasePartyAndAccount(casePartyIds.get(0), 5, true);

        // Execute
        Test.startTest();
        List<Expense__c> expenses = AccountsComponentController.getExpenses();
        Test.stopTest();

        // Assert results
        Assert.areEqual(5, expenses.size(), 'Should have 5 expenses');
    }

}