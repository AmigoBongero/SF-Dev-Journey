public with sharing class AccountsComponentController {  

    private static final Id USER_ID = UserInfo.getUserId();

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [
            SELECT Id, Name,
                (SELECT Id, Name
                FROM Contacts)
            FROM Account
            ORDER BY Name
        ];
    }
    
    @AuraEnabled
    public static List<Account> getMyAccounts() {
        return [
            SELECT   Id, Name, Industry, Phone
            FROM     Account
            WHERE    OwnerId = :USER_ID
            ORDER BY Name
            LIMIT    1000
        ];
    }

    @AuraEnabled
    public static List<Account> getRecentlyViewedAccounts() {
        return [
            SELECT   Id, Name, Industry, Phone
            FROM     Account
            WHERE    LastViewedDate != NULL
            ORDER BY LastViewedDate DESC
            LIMIT    1000
        ];
    }

}