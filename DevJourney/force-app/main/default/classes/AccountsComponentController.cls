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

    @AuraEnabled
    public static List<Expense__c> searchExpenses(String name, String status, String createdDate, String amount, String dueDate, String description) {
        String query = 'SELECT Name, Status__c, Amount__c, Check_Date__c, Description__c FROM Expense__c WHERE ';
        List<String> conditions = new List<String>();

        if (String.isNotBlank(name)) {
            conditions.add('Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'');
        }
        if (String.isNotBlank(status)) {
            conditions.add('Status__c LIKE \'%' + String.escapeSingleQuotes(status) + '%\'');
        }
        if (String.isNotBlank(createdDate)) {
            Datetime startOfDay = Datetime.newInstance(Date.valueOf(createdDate), Time.newInstance(0, 0, 0, 0));
            Datetime endOfDay = startOfDay.addDays(1).addSeconds(-1);
            conditions.add('CreatedDate >= ' + startOfDay.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\''));
            conditions.add('CreatedDate <= ' + endOfDay.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\''));
        }
        if (String.isNotBlank(amount)) {
            conditions.add('Amount__c = ' + amount);
        }
        if (String.isNotBlank(dueDate)) {
            conditions.add('Check_Date__c = ' + dueDate);
        }
        if (String.isNotBlank(description)) {
            conditions.add('Description__c LIKE \'%' + String.escapeSingleQuotes(description) + '%\'');
        }

        if (conditions.size() > 0) {
            query += String.join(conditions, ' AND ');
        } else {
            query += 'Name != NULL';
        }
        query += ' ORDER BY Name LIMIT :LIMIT_CONST';

        return Database.query(query);
    }

}