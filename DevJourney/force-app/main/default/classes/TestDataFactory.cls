@IsTest
public class TestDataFactory {
    
    public static List<Account> createAccounts(Integer numAccounts, Boolean isInserted) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < numAccounts; i++) {
            Account account = new Account(Name = 'TestAccount' + i);
            accounts.add(account);
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

    public static List<Expense__c> createExpensesWithCasePartyAndAccount(Id casePartyId, Integer numExpenses, Boolean isInserted) {
        List<Expense__c> expensesList = new List<Expense__c>();
        for (Integer i = 0; i < numExpenses; i++) {
            Expense__c expense = new Expense__c(
                Name = 'Test Expense ' + i,
                Status__c = 'Pending',
                Amount__c = 100,
                Check_Date__c = Date.today(),
                Description__c = 'COPY SERVICE',
                Payee__c = casePartyId
            );
            expensesList.add(expense);
        }

        if (isInserted) {
            insert expensesList;
        }
        return expensesList;
    }

    public static List<Id> createAccountsIds(Integer numAccounts) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < numAccounts; i++) {
            accounts.add(new Account(Name = 'Test Account ' + i));
        }
        insert accounts;
        List<Id> accountIds = new List<Id>();
        for (Account account : accounts) {
            accountIds.add(account.Id);
        }
        return accountIds;
    }

    public static List<Id> createCasePartiesIds(List<Id> accountIds) {
        List<Case_Party__c> caseParties = new List<Case_Party__c>();
        for (Id accountId : accountIds) {
            caseParties.add(new Case_Party__c(
                Name = 'Test Case ' + accountId,
                Parent_Account__c = accountId
            ));
        }
        insert caseParties;
        List<Id> casePartyIds = new List<Id>();
        for (Case_Party__c caseParty : caseParties) {
            casePartyIds.add(caseParty.Id);
        }
        return casePartyIds;
    }

}