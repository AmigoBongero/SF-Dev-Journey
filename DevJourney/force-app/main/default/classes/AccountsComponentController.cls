public with sharing class AccountsComponentController {

    private static final Id USER_ID = UserInfo.getUserId();
    private static final Integer LIMIT_CONST = 1000;

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountsWithRelatedContacts() {
        return [
            SELECT      Id, Name,
                        (SELECT Id, Name
                        FROM    Contacts
                        LIMIT   :LIMIT_CONST)
            FROM        Account
            ORDER BY    Name
            LIMIT       :LIMIT_CONST
        ];
    }

    @AuraEnabled
    public static List<Account> getMyAccounts() {
        return [
            SELECT   Id, Name, Industry, Phone
            FROM     Account
            WHERE    OwnerId = :USER_ID
            ORDER BY Name
            LIMIT    :LIMIT_CONST
        ];
    }

    @AuraEnabled
    public static List<Account> getRecentlyViewedAccounts() {
        return [
            SELECT   Id, Name, Industry, Phone
            FROM     Account
            WHERE    LastViewedDate != NULL
            ORDER BY LastViewedDate DESC
            LIMIT    :LIMIT_CONST
        ];
    }

    @AuraEnabled
    public static List<Expense__c> getExpenses() {
        return [
            SELECT   Name, Status__c, Amount__c,
                     Check_Date__c, Description__c
            FROM     Expense__c
            ORDER BY Name
            LIMIT    :LIMIT_CONST
        ];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Case_Party__c> getCaseParties(String searchKey) {
        List<Case_Party__c> caseParties = new List<Case_Party__c>();
        if(searchKey != '') {
            String searchCaseParty = '%' + searchKey + '%';
            caseParties = [
                SELECT   Name, Email__c, Phone__c, Comments__c
                FROM     Case_Party__c
                WHERE    Name LIKE :searchCaseParty OR 
                         Phone__c LIKE :searchCaseParty
                ORDER BY Name
            ];
        }
        return caseParties;
    }

    @AuraEnabled
    public static void upsertExpenses(List<Expense__c> records) {
        try {
            upsert records;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}